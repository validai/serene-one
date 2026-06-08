/**
 * Inspection domain models and pipeline orchestration.
 *
 * Pipeline stages (each swappable for API/AI integrations):
 *   1. Inspection intake       → createInspection / createEvidence
 *   2. Platform analysis       → platformAnalysisEngine.analyzeAllPlatformEvidence
 *   3. Scoring                 → scoringEngine.scoreInspection
 *   4. Findings                → findingsEngine.generateFindings
 *   5. Report                  → reportGenerator.generateReport
 */

import { analyzeAllPlatformEvidence } from '../lib/platformAnalysisEngine.js';
import { scoreInspection } from '../lib/scoringEngine.js';
import { generateFindings } from '../lib/findingsEngine.js';
import { generateReport } from '../lib/reportGenerator.js';
import { sortEvidence, normalizePlatformSource, sortPlatformsByCanonical, stableHash } from '../lib/stableHash.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const INSPECTION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  FAILED: 'failed',
};

export const EVIDENCE_TYPE = {
  SCREENSHOT: 'screenshot',
  URL: 'url',
  API_SNAPSHOT: 'api_snapshot',
};

export const BUSINESS_TYPES = [
  'Local Business',
  'Restaurant',
  'Realtor',
  'Service Business',
  'Creator / Artist',
];

export const PLATFORMS = [
  'Google Business Profile',
  'Website',
  'Facebook',
  'Instagram',
  'YouTube',
  'TikTok',
  'LinkedIn',
  'Zillow',
  'Realtor.com',
  'Homes.com',
];

export const SCORE_DIMENSIONS = [
  'visibility',
  'trust',
  'seo',
  'content',
  'conversion',
  'brandConsistency',
];

// ---------------------------------------------------------------------------
// ID helpers
// ---------------------------------------------------------------------------

function generateId(prefix, seed) {
  return `${prefix}_${stableHash(seed).toString(36)}`;
}

// ---------------------------------------------------------------------------
// Evidence model
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Evidence
 * @property {string} id
 * @property {string} platform
 * @property {'screenshot'|'url'|'api_snapshot'} type
 * @property {string} source - File name, URL, or external reference ID
 * @property {string} capturedAt - ISO timestamp
 * @property {Record<string, unknown>} metadata
 */

/**
 * Create a normalized evidence record.
 * Future API integrations can populate `source` with remote URLs or snapshot IDs.
 *
 * @param {Object} params
 * @param {string} params.platform
 * @param {string} [params.type='screenshot']
 * @param {string} params.source
 * @param {Record<string, unknown>} [params.metadata]
 * @returns {Evidence}
 */
export function createEvidence({
  platform,
  type = EVIDENCE_TYPE.SCREENSHOT,
  source,
  metadata = {},
}) {
  if (!platform) throw new Error('Evidence requires a platform');
  if (!source) throw new Error('Evidence requires a source');

  return {
    id: generateId('ev', `${platform}|${type}|${source}`),
    platform,
    type,
    source,
    capturedAt: new Date().toISOString(),
    metadata,
  };
}

/**
 * Create evidence from a UI file upload.
 *
 * @param {string} platform
 * @param {File} file
 * @returns {Evidence}
 */
export function createEvidenceFromUpload(platform, file) {
  return createEvidence({
    platform,
    type: EVIDENCE_TYPE.SCREENSHOT,
    source: normalizePlatformSource(platform),
    metadata: { mimeType: file.type, size: file.size, originalName: file.name },
  });
}

// ---------------------------------------------------------------------------
// Inspection model
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Inspection
 * @property {string} id
 * @property {string} businessName
 * @property {string} businessType
 * @property {Evidence[]} evidence
 * @property {string} status
 * @property {string} createdAt
 * @property {string|null} submittedAt
 * @property {string|null} completedAt
 */

/**
 * Create a new inspection record.
 *
 * @param {Object} params
 * @param {string} params.businessName
 * @param {string} [params.businessType='Local Business']
 * @param {Evidence[]} [params.evidence=[]]
 * @returns {Inspection}
 */
export function createInspection({
  businessName,
  businessType = 'Local Business',
  evidence = [],
}) {
  const name = businessName?.trim() || 'Your Business';

  return {
    id: generateId('insp', `${name}|${businessType}|${evidence.map((e) => e.platform).join('|')}`),
    businessName: name,
    businessType: businessType || 'Local Business',
    evidence,
    status: INSPECTION_STATUS.DRAFT,
    createdAt: new Date().toISOString(),
    submittedAt: null,
    completedAt: null,
  };
}

/**
 * Attach evidence to an inspection (immutable update).
 *
 * @param {Inspection} inspection
 * @param {Evidence} evidence
 * @returns {Inspection}
 */
export function addEvidence(inspection, evidence) {
  return {
    ...inspection,
    evidence: sortEvidence([...inspection.evidence, evidence]),
  };
}

/**
 * Return platform names that have evidence attached.
 *
 * @param {Inspection} inspection
 * @returns {string[]}
 */
export function getInspectedPlatforms(inspection) {
  return sortPlatformsByCanonical([...new Set(inspection.evidence.map((e) => e.platform))]);
}

/**
 * Build an inspection from legacy UI form input.
 * Keeps the form decoupled from pipeline internals.
 *
 * @param {Object} input
 * @param {string} input.businessName
 * @param {string} input.businessType
 * @param {string[]} [input.uploadedPlatforms=[]]
 * @param {Evidence[]} [input.evidence=[]]
 * @returns {Inspection}
 */
export function createInspectionFromFormInput({
  businessName,
  businessType,
  uploadedPlatforms = [],
  evidence = [],
}) {
  const resolvedEvidence =
    evidence.length > 0
      ? evidence
      : uploadedPlatforms.map((platform) =>
          createEvidence({
            platform,
            type: EVIDENCE_TYPE.SCREENSHOT,
            source: normalizePlatformSource(platform),
          })
        );

  return createInspection({
    businessName,
    businessType,
    evidence: sortEvidence(resolvedEvidence),
  });
}

/**
 * Mock sample inspection for demo / preview flows.
 *
 * @returns {Inspection}
 */
export function createSampleInspection() {
  return createInspectionFromFormInput({
    businessName: 'Sample Business Co.',
    businessType: 'Local Business',
    uploadedPlatforms: [
      'Google Business Profile',
      'Website',
      'Facebook',
      'Instagram',
    ],
  });
}

// ---------------------------------------------------------------------------
// Pipeline orchestration
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} InspectionPipelineResult
 * @property {Inspection} inspection
 * @property {import('../lib/platformAnalysisEngine.js').PlatformInspection[]} platformInspections
 * @property {import('../lib/scoringEngine.js').ScoringResult} scoring
 * @property {import('../lib/findingsEngine.js').FindingsResult} findings
 * @property {import('../lib/reportGenerator.js').InspectionReport} report
 */

/**
 * Run the full inspection pipeline.
 * Each stage is a separate module — swap implementations without touching UI.
 *
 * @param {Inspection} inspection
 * @returns {InspectionPipelineResult}
 */
export function runInspectionPipeline(inspection) {
  const submitted = {
    ...inspection,
    status: INSPECTION_STATUS.PROCESSING,
    submittedAt: inspection.submittedAt ?? new Date().toISOString(),
  };

  const platformInspections = analyzeAllPlatformEvidence(submitted);
  const scoring = scoreInspection(submitted, platformInspections);
  const findings = generateFindings(submitted, scoring, platformInspections);
  const report = generateReport(submitted, scoring, findings, platformInspections);

  const completed = {
    ...submitted,
    status: INSPECTION_STATUS.COMPLETE,
    completedAt: new Date().toISOString(),
  };

  return {
    inspection: completed,
    platformInspections,
    scoring,
    findings,
    report,
  };
}

/**
 * Flatten pipeline output for UI components.
 * Preserves backward-compatible shape while exposing structured data.
 *
 * @param {InspectionPipelineResult} pipelineResult
 * @returns {Object}
 */
export function formatPipelineResultForDisplay(pipelineResult) {
  const { inspection, platformInspections, scoring, findings, report } = pipelineResult;

  return {
    // Legacy flat fields consumed by existing UI components
    inspectionId: inspection.id,
    businessName: inspection.businessName,
    businessType: inspection.businessType,
    inspectedPlatforms: getInspectedPlatforms(inspection),
    platformInspections,
    overallGrade: scoring.overallGrade,
    overallScore: scoring.overallScore,
    scores: scoring.scores,
    findings: {
      critical: findings.critical,
      easyWins: findings.easyWins,
      opportunities: findings.opportunities,
    },
    recommendations: findings.recommendations,
    inspectedAt: report.inspectedAt,
    referenceId: report.referenceId,
    canPrintReport: report.isValid !== false,
    reportMessage: report.message,
    reportCard: report.reportCard ?? null,

    // Structured pipeline output for future integrations
    pipeline: pipelineResult,
  };
}

/**
 * Convenience entry point: form input → pipeline → display result.
 *
 * @param {Object} formInput
 * @returns {Object}
 */
export function runInspection(formInput) {
  const inspection = createInspectionFromFormInput(formInput);
  const pipelineResult = runInspectionPipeline(inspection);
  return formatPipelineResultForDisplay(pipelineResult);
}
