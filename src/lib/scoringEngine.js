/**
 * Scoring engine — evaluates platform inspections and produces dimension scores.
 *
 * Current implementation: aggregates placeholder platform quality scores.
 * Future: replace scoreInspection() body with API/AI calls without changing the interface.
 */

import { SCORE_DIMENSIONS } from '../models/inspection.js';
import { sortPlatforms, stableHash } from './stableHash.js';
import { logScoringDebug } from './scoringDebug.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} ScoreMap
 * @property {number} visibility
 * @property {number} trust
 * @property {number} seo
 * @property {number} content
 * @property {number} conversion
 * @property {number} brandConsistency
 */

/**
 * @typedef {Object} ScoringResult
 * @property {ScoreMap} scores
 * @property {number} overallScore
 * @property {string} overallGrade
 * @property {string} engine
 * @property {string} scoredAt
 */

// ---------------------------------------------------------------------------
// Grade conversion
// ---------------------------------------------------------------------------

export function scoreToGrade(score) {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

// ---------------------------------------------------------------------------
// Platform → dimension weight maps (replaceable with AI output)
// ---------------------------------------------------------------------------

const PLATFORM_DIMENSION_WEIGHTS = {
  'Google Business Profile': { visibility: 0.35, trust: 0.35, seo: 0.3 },
  Website: { seo: 0.35, conversion: 0.35, trust: 0.3 },
  Facebook: { trust: 0.3, content: 0.35, brandConsistency: 0.35 },
  Instagram: { content: 0.4, brandConsistency: 0.35, conversion: 0.25 },
  YouTube: { content: 0.45, seo: 0.3, brandConsistency: 0.25 },
  TikTok: { content: 0.4, brandConsistency: 0.3, visibility: 0.3 },
  LinkedIn: { trust: 0.4, brandConsistency: 0.3, content: 0.3 },
  Zillow: { visibility: 0.35, trust: 0.35, conversion: 0.3 },
  'Realtor.com': { visibility: 0.3, trust: 0.35, conversion: 0.35 },
  'Homes.com': { visibility: 0.3, trust: 0.35, conversion: 0.35 },
};

const DEFAULT_WEIGHTS = {
  visibility: 0.2,
  trust: 0.2,
  seo: 0.15,
  content: 0.15,
  conversion: 0.15,
  brandConsistency: 0.15,
};

const BUSINESS_TYPE_MODIFIERS = {
  'Local Business': { visibility: 3, trust: 2, seo: 1 },
  Restaurant: { visibility: 4, trust: 3, content: 2 },
  Realtor: { visibility: 3, trust: 4, conversion: 2 },
  'Service Business': { visibility: 2, trust: 2, conversion: 2 },
  'Creator / Artist': { content: 4, brandConsistency: 3, visibility: 1 },
};

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function generateBaselineScores(businessType, platforms) {
  const platformKey = sortPlatforms(platforms).join('|') || 'none';
  const seed = stableHash(`${businessType}|${platformKey}`);

  const rand = (offset) => 50 + ((seed + offset * 13) % 20);

  return {
    visibility: rand(1),
    trust: rand(2),
    seo: rand(3),
    content: rand(4),
    conversion: rand(5),
    brandConsistency: rand(6),
  };
}

function createEmptyScores() {
  return Object.fromEntries(SCORE_DIMENSIONS.map((dim) => [dim, 0]));
}

function createScoreCounts() {
  return Object.fromEntries(SCORE_DIMENSIONS.map((dim) => [dim, 0]));
}

function getPlatformWeights(platform) {
  return PLATFORM_DIMENSION_WEIGHTS[platform] ?? DEFAULT_WEIGHTS;
}

function sortPlatformInspections(platformInspections) {
  return [...platformInspections].sort((a, b) => a.platform.localeCompare(b.platform));
}

function applyBusinessTypeModifiers(scores, businessType) {
  const modifiers = BUSINESS_TYPE_MODIFIERS[businessType] || {};
  const adjusted = { ...scores };

  for (const [key, bonus] of Object.entries(modifiers)) {
    if (adjusted[key] !== undefined) {
      adjusted[key] = clamp(adjusted[key] + bonus);
    }
  }

  return adjusted;
}

function aggregateScoresFromPlatformInspections(platformInspections) {
  const totals = createEmptyScores();
  const counts = createScoreCounts();

  for (const inspection of sortPlatformInspections(platformInspections)) {
    const weights = getPlatformWeights(inspection.platform);
    const { qualityScore } = inspection;

    for (const [dimension, weight] of Object.entries(weights)) {
      if (totals[dimension] !== undefined) {
        totals[dimension] += qualityScore * weight;
        counts[dimension] += weight;
      }
    }
  }

  const scores = createEmptyScores();
  for (const dim of SCORE_DIMENSIONS) {
    scores[dim] = counts[dim] > 0 ? Math.round(totals[dim] / counts[dim]) : 0;
  }

  return scores;
}

function mergeWithBaseline(platformScores, baseline) {
  const merged = createEmptyScores();

  for (const dim of SCORE_DIMENSIONS) {
    if (platformScores[dim] > 0) {
      merged[dim] = clamp(Math.round(platformScores[dim] * 0.75 + baseline[dim] * 0.25));
    } else {
      merged[dim] = baseline[dim];
    }
  }

  return merged;
}

function computeOverallScore(scores) {
  const values = SCORE_DIMENSIONS.map((dim) => scores[dim]);
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Score an inspection using platform inspection analysis results.
 *
 * @param {import('../models/inspection.js').Inspection} inspection
 * @param {import('./platformAnalysisEngine.js').PlatformInspection[]} platformInspections
 * @returns {ScoringResult}
 */
export function scoreInspection(inspection, platformInspections = []) {
  const { businessType, evidence } = inspection;
  const inspectedPlatforms = [...new Set(evidence.map((item) => item.platform))];
  const baseline = applyBusinessTypeModifiers(
    generateBaselineScores(businessType, inspectedPlatforms),
    businessType
  );

  let scores;

  if (platformInspections.length === 0) {
    scores = baseline;
  } else {
    const platformScores = aggregateScoresFromPlatformInspections(platformInspections);
    scores = mergeWithBaseline(platformScores, baseline);
  }

  const overallScore = computeOverallScore(scores);
  const overallGrade = scoreToGrade(overallScore);

  logScoringDebug('final', {
    businessType,
    platforms: sortPlatforms(inspectedPlatforms),
    dimensionScores: scores,
    overallScore,
    overallGrade,
    platformGrades: sortPlatformInspections(platformInspections).map((item) => ({
      platform: item.platform,
      qualityScore: item.qualityScore,
      grade: item.grade,
    })),
  });

  return {
    scores,
    overallScore,
    overallGrade,
    engine: platformInspections.length > 0 ? 'platform-analysis-v1' : 'baseline-v1',
    scoredAt: new Date().toISOString(),
  };
}
