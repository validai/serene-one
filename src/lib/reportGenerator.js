/**
 * Report generator — assembles a client-ready inspection report from pipeline stages.
 *
 * Current implementation: formats mock pipeline output into a structured report.
 * Future: extend with PDF export, API persistence, or AI-written executive summaries.
 */

function getInspectedPlatforms(inspection) {
  return [...new Set(inspection.evidence.map((e) => e.platform))];
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} InspectionReport
 * @property {string} referenceId
 * @property {string} title
 * @property {string} inspectedAt - Human-readable date
 * @property {string} generatedAt - ISO timestamp
 * @property {Object} subject
 * @property {string} subject.businessName
 * @property {string} subject.businessType
 * @property {string[]} subject.platformsReviewed
 * @property {Object} summary
 * @property {string} summary.overallGrade
 * @property {number} summary.overallScore
 * @property {import('./scoringEngine.js').ScoreMap} summary.scores
 * @property {import('./findingsEngine.js').Recommendation[]} recommendations
 * @property {Object} findings
 * @property {import('./findingsEngine.js').Finding[]} findings.critical
 * @property {import('./findingsEngine.js').Finding[]} findings.easyWins
 * @property {import('./findingsEngine.js').Finding[]} findings.opportunities
 * @property {string} disclaimer
 * @property {string} engine
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateReferenceId() {
  const year = new Date().getFullYear();
  const sequence = String(Math.floor(Math.random() * 9000) + 1000);
  return `S1-${year}-${sequence}`;
}

function formatInspectionDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const REPORT_DISCLAIMER =
  'This report was prepared by Serene One Inspection Services as a point-in-time assessment of publicly visible platform presence. Findings are intended to support strategic improvement planning. Confidential · For client use only.';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a structured inspection report from pipeline stage outputs.
 *
 * @param {import('../models/inspection.js').Inspection} inspection
 * @param {import('./scoringEngine.js').ScoringResult} scoring
 * @param {import('./findingsEngine.js').FindingsResult} findings
 * @returns {InspectionReport}
 */
export function generateReport(inspection, scoring, findings) {
  const platformsReviewed = getInspectedPlatforms(inspection);

  return {
    referenceId: generateReferenceId(),
    title: 'Platform Health Inspection Report',
    inspectedAt: formatInspectionDate(new Date(inspection.completedAt ?? Date.now())),
    generatedAt: new Date().toISOString(),

    subject: {
      businessName: inspection.businessName,
      businessType: inspection.businessType,
      platformsReviewed:
        platformsReviewed.length > 0
          ? platformsReviewed
          : ['General web presence assessment'],
    },

    summary: {
      overallGrade: scoring.overallGrade,
      overallScore: scoring.overallScore,
      scores: { ...scoring.scores },
    },

    findings: {
      critical: findings.critical,
      easyWins: findings.easyWins,
      opportunities: findings.opportunities,
    },

    recommendations: findings.recommendations,
    disclaimer: REPORT_DISCLAIMER,
    engine: 'mock-v1',
  };
}

/**
 * Strip finding metadata for legacy UI components that expect title/description only.
 *
 * @param {import('./findingsEngine.js').Finding[]} findings
 * @returns {Array<{title: string, description: string}>}
 */
export function simplifyFindingsForDisplay(findings) {
  return findings.map(({ title, description }) => ({ title, description }));
}
