/**
 * Platform analysis engine — produces platformInspection objects from evidence.
 *
 * Current implementation: placeholder analysis per platform type.
 * Future: replace analyzeEvidenceForPlatform() with AI/API vision analysis.
 */

import { scoreToGrade } from './scoringEngine.js';

const ENGINE = 'placeholder-v1';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} PlatformInspection
 * @property {string} id
 * @property {string} platform
 * @property {boolean} evidencePresent
 * @property {string} evidenceSource
 * @property {number} qualityScore
 * @property {string} grade
 * @property {string} status
 * @property {string} priority
 * @property {string[]} observations
 * @property {string[]} strengths
 * @property {string[]} weaknesses
 * @property {string[]} recommendations
 * @property {number} confidence
 * @property {string} engine
 */

// ---------------------------------------------------------------------------
// Platform placeholder templates
// ---------------------------------------------------------------------------

const PLATFORM_TEMPLATES = {
  'Google Business Profile': {
    observations: [
      'Business profile screenshot submitted',
      'Review and visibility signals can be inspected',
      'Photos and category signals should be reviewed',
    ],
    strengths: ['Profile evidence available for local presence review'],
    weaknesses: [
      'Category accuracy requires verification',
      'Review volume and rating signals require review',
    ],
    recommendations: [
      'Confirm business categories are accurate',
      'Confirm hours, services, and photos are complete',
      'Review rating, review count, and local keywords',
    ],
    scoreProfile: { visibility: 8, trust: 10, seo: 6 },
  },
  Website: {
    observations: [
      'Website screenshot submitted',
      'Layout, messaging, and conversion paths can be inspected',
      'Mobile and SEO signals should be reviewed',
    ],
    strengths: ['Primary owned channel evidence available'],
    weaknesses: [
      'Page speed and mobile experience require review',
      'Meta tags and structured data require review',
    ],
    recommendations: [
      'Confirm clear contact and call-to-action above the fold',
      'Verify title tags and meta descriptions are optimized',
      'Ensure mobile layout supports conversion',
    ],
    scoreProfile: { seo: 10, conversion: 8, trust: 6 },
  },
  Facebook: {
    observations: [
      'Facebook profile screenshot submitted',
      'Page completeness and activity signals can be inspected',
      'Messaging and review visibility should be reviewed',
    ],
    strengths: ['Social proof channel evidence available'],
    weaknesses: [
      'Posting consistency requires review',
      'Response time and engagement require review',
    ],
    recommendations: [
      'Confirm about section and contact details are complete',
      'Review recent post activity and engagement',
      'Ensure profile and cover images reflect current branding',
    ],
    scoreProfile: { trust: 7, content: 8, brandConsistency: 7 },
  },
  Instagram: {
    observations: [
      'Profile screenshot submitted',
      'Visual branding can be reviewed',
      'Bio and link placement should be inspected',
    ],
    strengths: ['Visual brand presence evidence available'],
    weaknesses: [
      'Content consistency requires review',
      'Search visibility signals require review',
    ],
    recommendations: [
      'Confirm bio includes location/service keywords',
      'Confirm profile link supports conversion',
      'Review recent content activity',
    ],
    scoreProfile: { content: 10, brandConsistency: 8, conversion: 6 },
  },
  YouTube: {
    observations: [
      'YouTube channel screenshot submitted',
      'Channel branding and content library can be inspected',
      'Description and link signals should be reviewed',
    ],
    strengths: ['Video content channel evidence available'],
    weaknesses: [
      'Upload cadence requires review',
      'Title and description optimization require review',
    ],
    recommendations: [
      'Confirm channel description includes business keywords',
      'Review thumbnail and title consistency',
      'Ensure channel links drive conversion',
    ],
    scoreProfile: { content: 10, seo: 6, brandConsistency: 6 },
  },
  TikTok: {
    observations: [
      'TikTok profile screenshot submitted',
      'Profile branding and bio can be inspected',
      'Content activity signals should be reviewed',
    ],
    strengths: ['Short-form content channel evidence available'],
    weaknesses: [
      'Posting frequency requires review',
      'Bio clarity and link strategy require review',
    ],
    recommendations: [
      'Confirm bio clearly states business offering',
      'Review recent content for brand consistency',
      'Ensure profile link supports lead capture',
    ],
    scoreProfile: { content: 9, brandConsistency: 7, visibility: 6 },
  },
  LinkedIn: {
    observations: [
      'LinkedIn profile screenshot submitted',
      'Professional credentials and company details can be inspected',
      'Activity and authority signals should be reviewed',
    ],
    strengths: ['Professional credibility channel evidence available'],
    weaknesses: [
      'Company page completeness requires review',
      'Content authority signals require review',
    ],
    recommendations: [
      'Confirm company description and services are current',
      'Review employee and leadership profile completeness',
      'Maintain consistent professional content activity',
    ],
    scoreProfile: { trust: 9, brandConsistency: 7, content: 6 },
  },
  Zillow: {
    observations: [
      'Zillow profile screenshot submitted',
      'Agent listing presence can be inspected',
      'Review and credential signals should be reviewed',
    ],
    strengths: ['Real estate listing channel evidence available'],
    weaknesses: [
      'Listing photo quality requires review',
      'Agent review signals require review',
    ],
    recommendations: [
      'Confirm agent bio and credentials are complete',
      'Review listing photography and descriptions',
      'Ensure contact and service area details are accurate',
    ],
    scoreProfile: { visibility: 8, trust: 9, conversion: 7 },
  },
  'Realtor.com': {
    observations: [
      'Realtor.com profile screenshot submitted',
      'Agent profile and listing signals can be inspected',
      'Review and contact details should be reviewed',
    ],
    strengths: ['Real estate marketplace evidence available'],
    weaknesses: [
      'Profile completeness requires review',
      'Listing accuracy signals require review',
    ],
    recommendations: [
      'Confirm agent profile includes specialties and service areas',
      'Review client testimonials and ratings',
      'Ensure listings reflect current inventory',
    ],
    scoreProfile: { visibility: 7, trust: 8, conversion: 7 },
  },
  'Homes.com': {
    observations: [
      'Homes.com profile screenshot submitted',
      'Agent presence and listing signals can be inspected',
      'Contact and credential details should be reviewed',
    ],
    strengths: ['Real estate platform evidence available'],
    weaknesses: [
      'Agent credentials visibility requires review',
      'Listing presentation requires review',
    ],
    recommendations: [
      'Confirm agent credentials and contact info are complete',
      'Review listing photos and descriptions',
      'Ensure service area coverage is clearly stated',
    ],
    scoreProfile: { visibility: 7, trust: 8, conversion: 6 },
  },
};

const DEFAULT_TEMPLATE = {
  observations: ['Platform screenshot submitted', 'Profile signals can be inspected'],
  strengths: ['Evidence available for platform review'],
  weaknesses: ['Platform-specific signals require review'],
  recommendations: ['Continue monitoring and maintain consistent platform presence'],
  scoreProfile: { visibility: 5, trust: 5, content: 5 },
};

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
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

function computeQualityScore(evidence, businessType, template) {
  const seed = hashString(`${evidence.id}-${evidence.platform}-${businessType}`);
  const profileBoost = Object.values(template.scoreProfile).reduce((sum, v) => sum + v, 0);
  const base = 58 + (seed % 28);
  return Math.min(96, Math.round(base + profileBoost * 0.15));
}

function getTemplate(platform) {
  return PLATFORM_TEMPLATES[platform] ?? DEFAULT_TEMPLATE;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyze a single evidence item and produce a platformInspection object.
 *
 * @param {import('../models/inspection.js').Evidence} evidence
 * @param {string} businessType
 * @returns {PlatformInspection}
 */
export function analyzeEvidenceForPlatform(evidence, businessType) {
  const template = getTemplate(evidence.platform);
  const qualityScore = computeQualityScore(evidence, businessType, template);
  const grade = scoreToGrade(qualityScore);

  return {
    id: generateId('plat'),
    platform: evidence.platform,
    evidencePresent: true,
    evidenceSource: evidence.source,
    qualityScore,
    grade,
    status: gradeToStatus(grade),
    priority: gradeToPriority(grade),
    observations: [...template.observations],
    strengths: [...template.strengths],
    weaknesses: [...template.weaknesses],
    recommendations: [...template.recommendations],
    confidence: 0.65,
    engine: ENGINE,
  };
}

/**
 * Analyze all evidence on an inspection — one platformInspection per screenshot.
 *
 * @param {import('../models/inspection.js').Inspection} inspection
 * @returns {PlatformInspection[]}
 */
export function analyzeAllPlatformEvidence(inspection) {
  return inspection.evidence.map((evidence) =>
    analyzeEvidenceForPlatform(evidence, inspection.businessType)
  );
}

export { PLATFORM_TEMPLATES };
