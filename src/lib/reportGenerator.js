/**
 * Report generator — assembles a client-ready inspection report from pipeline stages.
 *
 * Current implementation: formats mock pipeline output into a structured report card.
 * Future: extend with PDF export, API persistence, or AI-written executive summaries.
 */

import { scoreToGrade } from './scoringEngine.js';

// ---------------------------------------------------------------------------
// Report card constants
// ---------------------------------------------------------------------------

const GRADING_CATEGORIES = [
  { key: 'visibility', label: 'Visibility' },
  { key: 'trust', label: 'Trust' },
  { key: 'seo', label: 'SEO' },
  { key: 'content', label: 'Content' },
  { key: 'conversion', label: 'Conversion' },
  { key: 'brandConsistency', label: 'Brand Consistency' },
];

const GRADING_SCALE = [
  { letter: 'A', label: 'Excellent' },
  { letter: 'B', label: 'Strong' },
  { letter: 'C', label: 'Needs Improvement' },
  { letter: 'D', label: 'Weak' },
  { letter: 'F', label: 'Urgent Attention' },
];

const GRADE_STATUS = {
  A: 'Excellent',
  B: 'Strong',
  C: 'Needs Improvement',
  D: 'Weak',
  F: 'Urgent Attention',
};

const GRADE_PRIORITY = {
  A: 'Low',
  B: 'Low',
  C: 'Medium',
  D: 'High',
  F: 'High',
};

const NO_EVIDENCE_MESSAGE = 'Add at least one screenshot to generate a report card.';

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

function gradeLetter(grade) {
  return grade.charAt(0);
}

function gradeToStatus(grade) {
  return GRADE_STATUS[gradeLetter(grade)] ?? 'Needs Review';
}

function gradeToPriority(grade) {
  return GRADE_PRIORITY[gradeLetter(grade)] ?? 'Medium';
}

function buildGradingRows(scores) {
  return GRADING_CATEGORIES.map(({ key, label }) => {
    const score = Math.round(scores[key]);
    const grade = scoreToGrade(score);
    return {
      category: label,
      score,
      grade,
      status: gradeToStatus(grade),
      priority: gradeToPriority(grade),
    };
  });
}

function buildPlatformRows(platformInspections) {
  return platformInspections.map((inspection) => ({
    platform: inspection.platform,
    grade: inspection.grade,
    status: inspection.status,
    priority: inspection.priority,
    recommendation: inspection.recommendations[0] ?? 'Continue monitoring platform presence.',
  }));
}

function buildInspectorNotes(inspection, scoring, findings, platformInspections) {
  const platformCount = platformInspections.length;
  const notes = [];

  notes.push(
    `${inspection.businessName} was evaluated as a ${inspection.businessType} based on ${platformCount} submitted platform screenshot${platformCount !== 1 ? 's' : ''}. The composite digital presence score is ${scoring.overallScore} out of 100, earning an overall grade of ${scoring.overallGrade}.`
  );

  if (platformInspections.length > 0) {
    const platformSummary = platformInspections
      .map((pi) => `${pi.platform} (${pi.grade})`)
      .join(', ');
    notes.push(`Platform-level inspections: ${platformSummary}.`);
  }

  if (findings.critical.length > 0) {
    notes.push(
      `Priority concerns identified: ${findings.critical.map((f) => f.title.toLowerCase()).join('; ')}. These areas may significantly affect how customers discover and trust this business online.`
    );
  }

  if (findings.easyWins.length > 0) {
    notes.push(
      `Recommended quick improvements include ${findings.easyWins.map((f) => f.title.toLowerCase()).join('; ')}. These changes typically require minimal effort with meaningful impact.`
    );
  }

  if (findings.opportunities.length > 0) {
    notes.push(
      `Strategic opportunities for growth: ${findings.opportunities.map((f) => f.title.toLowerCase()).join('; ')}.`
    );
  }

  notes.push(
    'This assessment reflects a point-in-time review of submitted platform evidence and should be used to guide digital presence improvement planning.'
  );

  return notes;
}

function buildRecommendedNextSteps(findings) {
  const steps = [];

  for (const finding of findings.critical) {
    steps.push({
      title: finding.title,
      description: finding.description,
      type: 'Critical',
    });
  }

  for (const finding of findings.easyWins) {
    steps.push({
      title: finding.title,
      description: finding.description,
      type: 'Quick Win',
    });
  }

  for (const finding of findings.opportunities) {
    steps.push({
      title: finding.title,
      description: finding.description,
      type: 'Strategic',
    });
  }

  return steps.slice(0, 8);
}

function hasSubmittedEvidence(platformInspections) {
  return platformInspections.length > 0;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a structured inspection report from pipeline stage outputs.
 *
 * @param {import('../models/inspection.js').Inspection} inspection
 * @param {import('./scoringEngine.js').ScoringResult} scoring
 * @param {import('./findingsEngine.js').FindingsResult} findings
 * @param {import('./platformAnalysisEngine.js').PlatformInspection[]} platformInspections
 * @returns {import('../models/inspection.js').InspectionReport}
 */
export function generateReport(inspection, scoring, findings, platformInspections = []) {
  const evidenceSubmitted = hasSubmittedEvidence(platformInspections);

  if (!evidenceSubmitted) {
    return {
      isValid: false,
      message: NO_EVIDENCE_MESSAGE,
      referenceId: null,
      title: 'Digital Presence Report Card',
      inspectedAt: formatInspectionDate(),
      generatedAt: new Date().toISOString(),
      engine: 'mock-v1',
    };
  }

  const reportCard = {
    header: {
      brand: 'SERENE ONE',
      title: 'DIGITAL PRESENCE REPORT CARD',
    },
    fields: {
      businessName: inspection.businessName,
      businessType: inspection.businessType,
      inspectionDate: formatInspectionDate(
        new Date(inspection.completedAt ?? Date.now())
      ),
      inspectionId: generateReferenceId(),
      preparedBy: 'Serene One',
    },
    gradingTable: buildGradingRows(scoring.scores),
    platformTable: buildPlatformRows(platformInspections),
    gradingScale: GRADING_SCALE,
    finalGrade: {
      grade: scoring.overallGrade,
      score: scoring.overallScore,
      label: 'Overall Digital Presence Grade',
    },
    inspectorNotes: buildInspectorNotes(inspection, scoring, findings, platformInspections),
    recommendedNextSteps: buildRecommendedNextSteps(findings),
  };

  return {
    isValid: true,
    message: null,
    referenceId: reportCard.fields.inspectionId,
    title: 'Digital Presence Report Card',
    inspectedAt: reportCard.fields.inspectionDate,
    generatedAt: new Date().toISOString(),
    reportCard,
    subject: {
      businessName: inspection.businessName,
      businessType: inspection.businessType,
      platformsReviewed: platformInspections.map((pi) => pi.platform),
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
    disclaimer:
      'Prepared by Serene One Inspection Services · Point-in-time digital presence assessment · Confidential',
    engine: 'mock-v1',
  };
}

export { NO_EVIDENCE_MESSAGE };

/**
 * Strip finding metadata for legacy UI components that expect title/description only.
 *
 * @param {import('./findingsEngine.js').Finding[]} findings
 * @returns {Array<{title: string, description: string}>}
 */
export function simplifyFindingsForDisplay(findings) {
  return findings.map(({ title, description }) => ({ title, description }));
}
