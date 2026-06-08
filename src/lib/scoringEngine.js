/**
 * Scoring engine — deterministic matrix-based grading.
 */

import { SCORE_DIMENSIONS as MATRIX_SCORE_DIMENSIONS } from './scoringMatrix.js';
import {
  ENGINE_VERSION,
  applyBusinessTypeDimensionModifiers,
  computeEvidenceConfidence,
  computePlatformDimensionContributions,
  getPlatformDimensionWeights,
} from './scoringMatrix.js';
import { sortPlatformsByCanonical, sortPlatformInspections } from './stableHash.js';
import { logScoringDebug } from './scoringDebug.js';

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
 * @typedef {Object} GradeExplanation
 * @property {string} engineVersion
 * @property {string} businessType
 * @property {string[]} submittedPlatforms
 * @property {ScoreMap} dimensionScores
 * @property {Object[]} platformContributions
 * @property {string} gradeReason
 * @property {string} scoreReason
 */

/**
 * @typedef {Object} ScoringResult
 * @property {ScoreMap} scores
 * @property {number} overallScore
 * @property {string} overallGrade
 * @property {GradeExplanation} gradeExplanation
 * @property {{ level: string, score: number, reason: string }} confidence
 * @property {string} engine
 * @property {string} scoredAt
 */

export function scoreToGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function createEmptyScores() {
  return Object.fromEntries(MATRIX_SCORE_DIMENSIONS.map((dimension) => [dimension, 0]));
}

function aggregateDimensionScores(platformInspections) {
  const totals = createEmptyScores();
  const weightTotals = createEmptyScores();

  for (const inspection of sortPlatformInspections(platformInspections)) {
    const platformWeights = getPlatformDimensionWeights(inspection.platform);
    const { qualityScore } = inspection;

    for (const dimension of MATRIX_SCORE_DIMENSIONS) {
      const weight = platformWeights[dimension] ?? 0;
      if (weight <= 0) continue;
      totals[dimension] += qualityScore * (weight / 100);
      weightTotals[dimension] += weight / 100;
    }
  }

  const scores = createEmptyScores();
  for (const dimension of MATRIX_SCORE_DIMENSIONS) {
    scores[dimension] =
      weightTotals[dimension] > 0
        ? Math.round(totals[dimension] / weightTotals[dimension])
        : 0;
  }

  return scores;
}

function computeOverallScore(scores) {
  const values = MATRIX_SCORE_DIMENSIONS.map((dimension) => scores[dimension]);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function buildGradeReason(overallScore, overallGrade) {
  return `Overall score of ${overallScore} maps to grade ${overallGrade} using scoring-matrix-v1 bands (A: 90+, B: 80-89, C: 70-79, D: 60-69, F: below 60).`;
}

function buildScoreReason(scores) {
  const ranked = MATRIX_SCORE_DIMENSIONS.map((dimension) => ({
    dimension,
    score: scores[dimension],
  })).sort((a, b) => a.score - b.score);

  const weakest = ranked.slice(0, 2).map((item) => `${item.dimension} (${item.score})`);
  const strongest = ranked[ranked.length - 1];

  return `Strongest dimension: ${strongest.dimension} (${strongest.score}). Weakest dimensions: ${weakest.join(', ')}.`;
}

function buildPlatformContributions(platformInspections) {
  return sortPlatformInspections(platformInspections).map((inspection) => ({
    platform: inspection.platform,
    qualityScore: inspection.qualityScore,
    grade: inspection.grade,
    weights: getPlatformDimensionWeights(inspection.platform),
    dimensionContributions: computePlatformDimensionContributions(
      inspection.platform,
      inspection.qualityScore
    ),
  }));
}

/**
 * @param {import('../models/inspection.js').Inspection} inspection
 * @param {import('./platformAnalysisEngine.js').PlatformInspection[]} platformInspections
 * @returns {ScoringResult}
 */
export function scoreInspection(inspection, platformInspections = []) {
  const { businessType, evidence } = inspection;
  const submittedPlatforms = sortPlatformsByCanonical([
    ...new Set(evidence.map((item) => item.platform)),
  ]);

  let scores = createEmptyScores();

  if (platformInspections.length > 0) {
    scores = aggregateDimensionScores(platformInspections);
    scores = applyBusinessTypeDimensionModifiers(scores, businessType);
  }

  const overallScore = platformInspections.length > 0 ? computeOverallScore(scores) : 0;
  const overallGrade = platformInspections.length > 0 ? scoreToGrade(overallScore) : 'F';
  const confidence = computeEvidenceConfidence(submittedPlatforms.length);
  const platformContributions = buildPlatformContributions(platformInspections);

  const gradeExplanation = {
    engineVersion: ENGINE_VERSION,
    businessType,
    submittedPlatforms,
    dimensionScores: { ...scores },
    platformContributions,
    gradeReason: buildGradeReason(overallScore, overallGrade),
    scoreReason: buildScoreReason(scores),
  };

  logScoringDebug({
    engineVersion: ENGINE_VERSION,
    businessType,
    submittedPlatforms,
    platformScores: platformContributions.map((item) => ({
      platform: item.platform,
      qualityScore: item.qualityScore,
      grade: item.grade,
    })),
    dimensionScores: scores,
    finalScore: overallScore,
    grade: overallGrade,
    confidence,
  });

  return {
    scores,
    overallScore,
    overallGrade,
    gradeExplanation,
    confidence,
    engine: ENGINE_VERSION,
    scoredAt: new Date().toISOString(),
  };
}
