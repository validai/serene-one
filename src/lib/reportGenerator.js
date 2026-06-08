/**
 * Report generator — assembles a client-ready inspection report from pipeline stages.
 */

import { scoreToGrade } from './scoringEngine.js';
import { getGradeLetter, getGradeStatusLabel, GRADE_SCALE } from './gradeColors.js';

const GRADING_CATEGORIES = [
  { key: 'visibility', label: 'Visibility' },
  { key: 'trust', label: 'Trust' },
  { key: 'seo', label: 'SEO' },
  { key: 'content', label: 'Content' },
  { key: 'conversion', label: 'Conversion' },
  { key: 'brandConsistency', label: 'Brand Consistency' },
];

const GRADE_PRIORITY = {
  A: 'Low',
  B: 'Low',
  C: 'Medium',
  D: 'High',
  F: 'High',
};

const NO_EVIDENCE_MESSAGE = 'Add at least one screenshot to generate a report card.';

const SHORT_PLATFORM_RECOMMENDATIONS = {
  'Google Business Profile': 'Improve profile completeness',
  Website: 'Strengthen call-to-action',
  Facebook: 'Increase recent content activity',
  Instagram: 'Add location/service keywords',
  YouTube: 'Refresh outdated visuals',
  TikTok: 'Align bio with conversion goals',
  LinkedIn: 'Update company credentials',
  Zillow: 'Improve listing photography',
  'Realtor.com': 'Complete agent profile details',
  'Homes.com': 'Refresh agent credentials',
};

const SHORT_STEP_PHRASES = {
  critical: [
    'Improve profile completeness',
    'Strengthen local visibility signals',
    'Address trust signal gaps',
    'Fix SEO foundation issues',
  ],
  easyWins: [
    'Refresh outdated visuals',
    'Add location/service keywords',
    'Request recent customer reviews',
    'Unify profile imagery',
  ],
  opportunities: [
    'Increase recent content activity',
    'Strengthen call-to-action',
    'Build cross-platform links',
    'Establish content publishing cadence',
  ],
};

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

function gradeToPriority(grade) {
  return GRADE_PRIORITY[getGradeLetter(grade)] ?? 'Medium';
}

function shortenRecommendation(text, platform) {
  if (SHORT_PLATFORM_RECOMMENDATIONS[platform]) {
    return SHORT_PLATFORM_RECOMMENDATIONS[platform];
  }
  if (!text) return 'Maintain consistent platform presence';
  const firstSentence = text.split('.')[0];
  return firstSentence.length > 42 ? `${firstSentence.slice(0, 40)}…` : firstSentence;
}

function buildGradingRows(scores) {
  return GRADING_CATEGORIES.map(({ key, label }) => {
    const score = Math.round(scores[key]);
    const grade = scoreToGrade(score);
    return {
      category: label,
      score,
      grade,
      gradeLetter: getGradeLetter(grade),
      status: getGradeStatusLabel(grade),
      priority: gradeToPriority(grade),
    };
  });
}

function buildPlatformRows(platformInspections) {
  return platformInspections.map((inspection) => ({
    platform: inspection.platform,
    grade: inspection.grade,
    gradeLetter: getGradeLetter(inspection.grade),
    status: inspection.status,
    priority: inspection.priority,
    recommendation: shortenRecommendation(
      inspection.recommendations[0],
      inspection.platform
    ),
  }));
}

function buildInspectorNotes(inspection, scoring, platformInspections, findings) {
  const count = platformInspections.length;
  const platformList = platformInspections.map((pi) => pi.platform).join(', ');

  const notes = [
    `${inspection.businessName} received an overall grade of ${scoring.overallGrade} (${scoring.overallScore}/100) from ${count} submitted platform screenshot${count !== 1 ? 's' : ''}: ${platformList}.`,
  ];

  if (findings.critical.length > 0) {
    notes.push(
      `Priority focus: ${findings.critical
        .slice(0, 2)
        .map((f) => f.title)
        .join('; ')}.`
    );
  } else {
    notes.push(
      'Submitted evidence supports a point-in-time review of visibility, trust, and brand consistency signals.'
    );
  }

  return notes.slice(0, 3);
}

function buildRecommendedNextSteps(findings) {
  const steps = [];

  findings.critical.slice(0, 2).forEach((finding, i) => {
    steps.push({
      text: SHORT_STEP_PHRASES.critical[i] ?? finding.title,
      type: 'Priority',
    });
  });

  findings.easyWins.slice(0, 2).forEach((finding, i) => {
    steps.push({
      text: SHORT_STEP_PHRASES.easyWins[i] ?? finding.title,
      type: 'Quick Win',
    });
  });

  findings.opportunities.slice(0, 1).forEach((finding, i) => {
    steps.push({
      text: SHORT_STEP_PHRASES.opportunities[i] ?? finding.title,
      type: 'Strategic',
    });
  });

  return steps.slice(0, 5);
}

function hasSubmittedEvidence(platformInspections) {
  return platformInspections.length > 0;
}

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

  const overallGradeLetter = getGradeLetter(scoring.overallGrade);

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
    },
    gradingTable: buildGradingRows(scoring.scores),
    platformTable: buildPlatformRows(platformInspections),
    gradingScale: GRADE_SCALE.map(({ letter, label }) => ({ letter, label })),
    finalGrade: {
      grade: scoring.overallGrade,
      gradeLetter: overallGradeLetter,
      score: scoring.overallScore,
      label: 'Overall Digital Presence Grade',
      status: getGradeStatusLabel(scoring.overallGrade),
    },
    inspectorNotes: buildInspectorNotes(
      inspection,
      scoring,
      platformInspections,
      findings
    ),
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
      'Prepared by Serene One · Point-in-time assessment · Confidential',
    engine: 'mock-v1',
  };
}

export { NO_EVIDENCE_MESSAGE };

export function simplifyFindingsForDisplay(findings) {
  return findings.map(({ title, description }) => ({ title, description }));
}
