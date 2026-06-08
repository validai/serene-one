/**
 * Scoring engine — evaluates inspection evidence and produces dimension scores.
 *
 * Current implementation: deterministic mock scoring.
 * Future: replace scoreInspection() body with API/AI calls without changing the interface.
 */

import { SCORE_DIMENSIONS } from '../models/inspection.js';

function getInspectedPlatforms(inspection) {
  return [...new Set(inspection.evidence.map((e) => e.platform))];
}

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
 * @property {string} engine - Identifier for the scoring provider
 * @property {string} scoredAt - ISO timestamp
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
// Mock scoring internals (replaceable)
// ---------------------------------------------------------------------------

const BUSINESS_TYPE_MODIFIERS = {
  'Local Business': { visibility: 5, trust: 3, seo: 2 },
  Restaurant: { visibility: 8, trust: 5, content: 4 },
  Realtor: { visibility: 6, trust: 7, conversion: 5, brandConsistency: 4 },
  'Service Business': { visibility: 4, trust: 4, conversion: 3 },
  'Creator / Artist': { content: 8, brandConsistency: 6, visibility: 3 },
};

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateBaseScores(businessName, businessType) {
  const seed = hashString(`${businessName}-${businessType}`);
  const rand = (offset) => 55 + ((seed + offset * 17) % 35);

  return {
    visibility: rand(1),
    trust: rand(2),
    seo: rand(3),
    content: rand(4),
    conversion: rand(5),
    brandConsistency: rand(6),
  };
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

function applyEvidenceBonus(scores, evidenceCount) {
  const bonus = Math.min(evidenceCount * 3, 18);
  const adjusted = { ...scores };

  for (const key of SCORE_DIMENSIONS) {
    adjusted[key] = clamp(adjusted[key] + bonus * 0.4);
  }

  return adjusted;
}

function computeOverallScore(scores) {
  const values = SCORE_DIMENSIONS.map((dim) => scores[dim]);
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Score an inspection based on business profile and submitted evidence.
 *
 * @param {import('../models/inspection.js').Inspection} inspection
 * @returns {ScoringResult}
 */
export function scoreInspection(inspection) {
  const { businessName, businessType, evidence } = inspection;
  const inspectedPlatforms = getInspectedPlatforms(inspection);

  let scores = generateBaseScores(businessName, businessType);
  scores = applyBusinessTypeModifiers(scores, businessType);
  scores = applyEvidenceBonus(scores, evidence.length || inspectedPlatforms.length);

  const overallScore = computeOverallScore(scores);

  return {
    scores,
    overallScore,
    overallGrade: scoreToGrade(overallScore),
    engine: 'mock-v1',
    scoredAt: new Date().toISOString(),
  };
}
