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

const VISIBILITY_DIMENSIONS = new Set(['visibility', 'seo']);
const TRUST_DIMENSIONS = new Set(['trust', 'brandConsistency']);
const GROWTH_DIMENSIONS = new Set(['conversion', 'content']);

const OPPORTUNITY_FALLBACKS = {
  visibility: [
    'Strengthen local visibility signals',
    'Improve profile completeness',
    'Expand discoverability across search channels',
  ],
  trust: [
    'Address trust signal gaps',
    'Request recent customer reviews',
    'Align credentials and contact details',
  ],
  growth: [
    'Strengthen call-to-action clarity',
    'Establish content publishing cadence',
    'Build cross-platform conversion paths',
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

function getScoreExtremes(scores) {
  const ranked = GRADING_CATEGORIES.map(({ key, label }) => ({
    label,
    score: scores[key],
  })).sort((a, b) => a.score - b.score);

  return {
    strongest: ranked[ranked.length - 1],
    weakest: ranked[0],
  };
}

function buildExecutiveSummary(inspection, scoring, platformInspections, findings) {
  const { businessName, businessType } = inspection;
  const status = getGradeStatusLabel(scoring.overallGrade);
  const count = platformInspections.length;
  const platforms = platformInspections.map((pi) => pi.platform).join(', ');
  const { strongest, weakest } = getScoreExtremes(scoring.scores);
  const businessContext = businessType.toLowerCase();

  const priorityClause =
    findings.critical.length > 0
      ? `Near-term priority should be ${findings.critical[0].title.toLowerCase()}, which carries the highest impact on discovery and buyer confidence.`
      : 'Current evidence indicates a stable foundation with room to sharpen consistency and engagement across channels.';

  return [
    `This assessment evaluates ${businessName}'s digital presence across ${count} active platform${count !== 1 ? 's' : ''} (${platforms}). The business earns an overall ${status} rating (${scoring.overallScore}/100), reflecting how discoverable, credible, and conversion-ready the brand appears to prospective clients in a ${businessContext} market.`,
    `${strongest.label} is the strongest performance area in this review; ${weakest.label} represents the most immediate lever for measurable improvement. ${priorityClause}`,
    `The opportunities outlined below are sequenced by strategic impact—visibility, trust, and growth—aligned with how customers evaluate and select ${businessContext} providers online.`,
  ];
}

function buildInspectorNotes(inspection, scoring, findings) {
  const { businessName } = inspection;
  const status = getGradeStatusLabel(scoring.overallGrade).toLowerCase();
  const lowScoreAreas = GRADING_CATEGORIES.filter(
    ({ key }) => scoring.scores[key] < 75
  ).map(({ label }) => label.toLowerCase());

  const notes = [
    `Serene One's review positions ${businessName}'s digital footprint as ${status} relative to category benchmarks. Profiles were assessed for completeness, messaging consistency, and the trust signals that influence purchase decisions before first contact.`,
  ];

  if (lowScoreAreas.length > 0) {
    notes.push(
      `Material gaps were observed in ${lowScoreAreas.slice(0, 3).join(', ')}—dimensions that shape discovery, credibility, and conversion. These can be addressed through focused profile updates, review generation, and clearer calls-to-action rather than a full-channel rebuild.`
    );
  } else {
    notes.push(
      'Core profiles demonstrate solid alignment across inspected channels. Continued investment in fresh content, review velocity, and cross-linking will help sustain momentum against competitors active in the same local market.',
    );
  }

  if (findings.critical.length > 0) {
    notes.push(
      `We recommend prioritizing ${findings.critical
        .slice(0, 2)
        .map((f) => f.title.toLowerCase())
        .join(' and ')} in the next planning cycle before expanding into secondary channels or paid acquisition.`,
    );
  } else {
    notes.push(
      'No urgent remediation items were flagged in this cycle. The next phase should emphasize incremental gains—bio refreshes, imagery alignment, and a steady publishing rhythm—to compound visibility over the next 90 days.',
    );
  }

  return notes.slice(0, 3);
}

function assignFindingToBucket(finding) {
  const { dimension, category } = finding;

  if (dimension && VISIBILITY_DIMENSIONS.has(dimension)) return 'visibility';
  if (dimension && TRUST_DIMENSIONS.has(dimension)) return 'trust';
  if (dimension && GROWTH_DIMENSIONS.has(dimension)) return 'growth';

  if (category === 'critical') return 'visibility';
  if (category === 'easy_win') return 'trust';
  return 'growth';
}

function buildOpportunitiesSection(findings) {
  const buckets = {
    visibility: [],
    trust: [],
    growth: [],
  };
  const seen = new Set();

  for (const finding of [
    ...findings.critical,
    ...findings.easyWins,
    ...findings.opportunities,
  ]) {
    if (seen.has(finding.title)) continue;
    seen.add(finding.title);

    const bucket = assignFindingToBucket(finding);
    buckets[bucket].push({ text: finding.title });
  }

  for (const [bucket, fallbacks] of Object.entries(OPPORTUNITY_FALLBACKS)) {
    let index = 0;
    while (buckets[bucket].length < 2 && index < fallbacks.length) {
      const fallback = fallbacks[index++];
      if (!buckets[bucket].some((item) => item.text === fallback)) {
        buckets[bucket].push({ text: fallback });
      }
    }
  }

  return {
    visibilityOpportunities: buckets.visibility.slice(0, 3),
    trustOpportunities: buckets.trust.slice(0, 3),
    growthOpportunities: buckets.growth.slice(0, 3),
  };
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
    executiveSummary: buildExecutiveSummary(
      inspection,
      scoring,
      platformInspections,
      findings
    ),
    inspectorNotes: buildInspectorNotes(inspection, scoring, findings),
    opportunities: buildOpportunitiesSection(findings),
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
