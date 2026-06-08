/**
 * Findings engine — analyzes scores and evidence to produce actionable findings.
 *
 * Current implementation: rule-based mock findings.
 * Future: replace generateFindings() body with AI analysis without changing the interface.
 */

import { sortPlatformsByCanonical, stableHash } from './stableHash.js';

function getInspectedPlatforms(inspection) {
  return sortPlatformsByCanonical([...new Set(inspection.evidence.map((e) => e.platform))]);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Finding
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'critical'|'easy_win'|'opportunity'} category
 * @property {string} [dimension] - Related score dimension
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'High'|'Quick Win'|'Strategic'} priority
 */

/**
 * @typedef {Object} FindingsResult
 * @property {Finding[]} critical
 * @property {Finding[]} easyWins
 * @property {Finding[]} opportunities
 * @property {Recommendation[]} recommendations
 * @property {string} engine
 * @property {string} generatedAt
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix, seed = '') {
  const suffix = seed
    ? stableHash(`${prefix}|${seed}`).toString(36)
    : stableHash(prefix).toString(36);
  return `${prefix}_${suffix}`;
}

function createFinding({ title, description, category, dimension }) {
  return {
    id: generateId('find', `${category}|${title}`),
    title,
    description,
    category,
    ...(dimension ? { dimension } : {}),
  };
}

function buildRecommendations(findings) {
  const priorityMap = {
    critical: 'High',
    easyWins: 'Quick Win',
    opportunities: 'Strategic',
  };

  const recommendations = [];

  for (const [group, priority] of Object.entries(priorityMap)) {
    for (const finding of findings[group] || []) {
      recommendations.push({
        id: generateId('rec', `${priority}|${finding.title}`),
        title: finding.title,
        description: finding.description,
        priority,
      });
    }
  }

  return recommendations.slice(0, 8);
}

// ---------------------------------------------------------------------------
// Mock findings rules (replaceable)
// ---------------------------------------------------------------------------

function evaluateCriticalFindings({ businessName, businessType, inspectedPlatforms, scores }) {
  const findings = [];

  if (scores.visibility < 75) {
    findings.push(
      createFinding({
        title: 'Limited Local Visibility',
        description: `${businessName} appears inconsistently across search and map results, reducing discovery by nearby customers.`,
        category: 'critical',
        dimension: 'visibility',
      })
    );
  }

  if (scores.trust < 70) {
    findings.push(
      createFinding({
        title: 'Trust Signals Need Attention',
        description:
          'Missing or outdated reviews, credentials, and contact information may reduce customer confidence.',
        category: 'critical',
        dimension: 'trust',
      })
    );
  }

  if (scores.seo < 72) {
    findings.push(
      createFinding({
        title: 'SEO Foundation Gaps',
        description:
          'Page titles, meta descriptions, and structured data are not fully optimized for search engines.',
        category: 'critical',
        dimension: 'seo',
      })
    );
  }

  if (!inspectedPlatforms.includes('Google Business Profile')) {
    findings.push(
      createFinding({
        title: 'Google Business Profile Not Verified',
        description:
          'No Google Business Profile evidence was submitted. This is often the highest-impact local visibility channel.',
        category: 'critical',
        dimension: 'visibility',
      })
    );
  }

  return findings.slice(0, 4);
}

const PLATFORM_PRIMARY_DIMENSION = {
  'Google Business Profile': 'visibility',
  Website: 'seo',
  Facebook: 'trust',
  Instagram: 'content',
  YouTube: 'content',
  TikTok: 'visibility',
  LinkedIn: 'trust',
  Zillow: 'visibility',
  'Realtor.com': 'visibility',
  'Homes.com': 'visibility',
};

const CRITICAL_FALLBACK_TITLES = {
  visibility: 'Limited local visibility signals',
  seo: 'Incomplete profile optimization',
  trust: 'Trust signals require attention',
  content: 'Incomplete profile optimization',
  conversion: 'Incomplete profile optimization',
  brandConsistency: 'Platform consistency needs review',
};

function mapPlatformWeaknessToCriticalFinding(platformInspection) {
  const dimension =
    PLATFORM_PRIMARY_DIMENSION[platformInspection.platform] ?? 'brandConsistency';
  const weakness = platformInspection.weaknesses[0] ?? platformInspection.recommendations[0];
  const title = CRITICAL_FALLBACK_TITLES[dimension] ?? 'Platform consistency needs review';

  return createFinding({
    title,
    description: `${platformInspection.platform}: ${weakness}`,
    category: 'critical',
    dimension,
  });
}

function ensureCriticalFindings(critical, platformInspections) {
  if (critical.length > 0) return critical;
  if (platformInspections.length === 0) return critical;

  const weakestPlatforms = [...platformInspections].sort(
    (a, b) => a.qualityScore - b.qualityScore
  );

  const fallbackFindings = weakestPlatforms
    .slice(0, 2)
    .map((inspection) => mapPlatformWeaknessToCriticalFinding(inspection));

  if (fallbackFindings.length === 0) {
    fallbackFindings.push(
      createFinding({
        title: 'Platform consistency needs review',
        description:
          'Submitted platform profiles should be reviewed for alignment across messaging, imagery, and contact details.',
        category: 'critical',
        dimension: 'brandConsistency',
      })
    );
  }

  return fallbackFindings;
}

function evaluateEasyWins({ businessType, inspectedPlatforms, scores }) {
  const findings = [];

  if (scores.content >= 65 && scores.content < 85) {
    findings.push(
      createFinding({
        title: 'Refresh Platform Bios',
        description:
          'Update short descriptions on social profiles to align messaging with your current services and offers.',
        category: 'easy_win',
        dimension: 'content',
      })
    );
  }

  if (scores.brandConsistency >= 60 && scores.brandConsistency < 80) {
    findings.push(
      createFinding({
        title: 'Unify Profile Imagery',
        description:
          'Use consistent logo, cover photo, and brand colors across all active platforms.',
        category: 'easy_win',
        dimension: 'brandConsistency',
      })
    );
  }

  if (inspectedPlatforms.length < 4) {
    findings.push(
      createFinding({
        title: 'Expand Platform Presence',
        description: `Only ${inspectedPlatforms.length} platform(s) were inspected. Adding key channels for ${businessType} can improve reach.`,
        category: 'easy_win',
        dimension: 'visibility',
      })
    );
  }

  findings.push(
    createFinding({
      title: 'Add Recent Customer Reviews',
      description:
        'Request reviews from satisfied clients and respond to existing feedback within 48 hours.',
      category: 'easy_win',
      dimension: 'trust',
    })
  );

  return findings.slice(0, 4);
}

function evaluateOpportunities({ businessType, inspectedPlatforms, scores }) {
  const findings = [];

  if (scores.conversion < 80) {
    findings.push(
      createFinding({
        title: 'Improve Call-to-Action Clarity',
        description:
          'Ensure every platform profile includes a clear next step: call, book, or contact.',
        category: 'opportunity',
        dimension: 'conversion',
      })
    );
  }

  if (businessType === 'Realtor' && !inspectedPlatforms.includes('Zillow')) {
    findings.push(
      createFinding({
        title: 'Strengthen Real Estate Listings',
        description:
          'Optimize Zillow and Realtor.com profiles with professional photography and complete agent credentials.',
        category: 'opportunity',
        dimension: 'visibility',
      })
    );
  }

  if (businessType === 'Restaurant') {
    findings.push(
      createFinding({
        title: 'Showcase Menu & Hours Prominently',
        description:
          'Ensure hours, menu links, and reservation options are visible on Google and social profiles.',
        category: 'opportunity',
        dimension: 'conversion',
      })
    );
  }

  findings.push(
    createFinding({
      title: 'Content Publishing Cadence',
      description:
        'Establish a monthly content rhythm to stay top-of-mind and signal an active, trustworthy business.',
      category: 'opportunity',
      dimension: 'content',
    })
  );

  findings.push(
    createFinding({
      title: 'Cross-Platform Link Strategy',
      description:
        'Link website, social profiles, and listing pages to each other for stronger authority and discoverability.',
      category: 'opportunity',
      dimension: 'seo',
    })
  );

  return findings.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate findings from inspection context and scoring output.
 *
 * @param {import('../models/inspection.js').Inspection} inspection
 * @param {import('./scoringEngine.js').ScoringResult} scoring
 * @param {import('./platformAnalysisEngine.js').PlatformInspection[]} [platformInspections=[]]
 * @returns {FindingsResult}
 */
export function generateFindings(inspection, scoring, platformInspections = []) {
  const { businessName, businessType } = inspection;
  const inspectedPlatforms = getInspectedPlatforms(inspection);
  const { scores } = scoring;

  const context = { businessName, businessType, inspectedPlatforms, scores };

  const critical = ensureCriticalFindings(
    evaluateCriticalFindings(context),
    platformInspections
  );
  const easyWins = evaluateEasyWins(context);
  const opportunities = evaluateOpportunities(context);

  const grouped = { critical, easyWins, opportunities };

  return {
    ...grouped,
    recommendations: buildRecommendations(grouped),
    engine: 'mock-v1',
    generatedAt: new Date().toISOString(),
  };
}
