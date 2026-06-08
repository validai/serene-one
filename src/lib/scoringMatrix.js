/**
 * Formal scoring matrix — single source of truth for deterministic grading.
 */

export const SCORE_DIMENSIONS = [
  'visibility',
  'trust',
  'seo',
  'content',
  'conversion',
  'brandConsistency',
];

export const ENGINE_VERSION = 'scoring-matrix-v1';

/**
 * Fixed dimension contribution weights per platform (must total 100).
 * @type {Record<string, Record<string, number>>}
 */
export const PLATFORM_DIMENSION_WEIGHTS = {
  'Google Business Profile': {
    visibility: 30,
    trust: 25,
    seo: 25,
    content: 5,
    conversion: 10,
    brandConsistency: 5,
  },
  Website: {
    visibility: 15,
    trust: 15,
    seo: 30,
    content: 10,
    conversion: 20,
    brandConsistency: 10,
  },
  Facebook: {
    visibility: 15,
    trust: 25,
    seo: 10,
    content: 25,
    conversion: 10,
    brandConsistency: 15,
  },
  Instagram: {
    visibility: 10,
    trust: 15,
    seo: 5,
    content: 35,
    conversion: 15,
    brandConsistency: 20,
  },
  YouTube: {
    visibility: 10,
    trust: 10,
    seo: 20,
    content: 40,
    conversion: 10,
    brandConsistency: 10,
  },
  TikTok: {
    visibility: 15,
    trust: 10,
    seo: 5,
    content: 40,
    conversion: 15,
    brandConsistency: 15,
  },
  LinkedIn: {
    visibility: 10,
    trust: 30,
    seo: 10,
    content: 25,
    conversion: 10,
    brandConsistency: 15,
  },
  Zillow: {
    visibility: 30,
    trust: 25,
    seo: 10,
    content: 5,
    conversion: 20,
    brandConsistency: 10,
  },
  'Realtor.com': {
    visibility: 25,
    trust: 25,
    seo: 10,
    content: 5,
    conversion: 25,
    brandConsistency: 10,
  },
  'Homes.com': {
    visibility: 25,
    trust: 25,
    seo: 10,
    content: 5,
    conversion: 20,
    brandConsistency: 15,
  },
};

/**
 * Fixed base quality score per platform when evidence is submitted.
 * @type {Record<string, number>}
 */
export const PLATFORM_QUALITY_BASE = {
  'Google Business Profile': 70,
  Website: 76,
  Facebook: 72,
  Instagram: 71,
  YouTube: 73,
  TikTok: 69,
  LinkedIn: 74,
  Zillow: 72,
  'Realtor.com': 71,
  'Homes.com': 70,
};

/**
 * Intentional business-type adjustments applied to platform quality scores.
 * @type {Record<string, Record<string, number>>}
 */
export const BUSINESS_TYPE_PLATFORM_ADJUSTMENTS = {
  'Local Business': {
    'Google Business Profile': 2,
    Website: 1,
  },
  Restaurant: {
    'Google Business Profile': 3,
    Instagram: 2,
    Facebook: 1,
  },
  Realtor: {
    Zillow: 4,
    'Realtor.com': 3,
    'Homes.com': 2,
  },
  'Service Business': {
    Website: 2,
    LinkedIn: 2,
  },
  'Creator / Artist': {
    Instagram: 3,
    YouTube: 3,
    TikTok: 2,
  },
};

/**
 * Intentional business-type adjustments applied to aggregated dimension scores.
 * @type {Record<string, Partial<Record<string, number>>>}
 */
export const BUSINESS_TYPE_DIMENSION_MODIFIERS = {
  'Local Business': { visibility: 2, trust: 1 },
  Restaurant: { visibility: 3, trust: 2, content: 1 },
  Realtor: { visibility: 2, trust: 3, conversion: 1 },
  'Service Business': { trust: 2, conversion: 1 },
  'Creator / Artist': { content: 3, brandConsistency: 2 },
};

const DEFAULT_PLATFORM_WEIGHTS = {
  visibility: 20,
  trust: 20,
  seo: 15,
  content: 15,
  conversion: 15,
  brandConsistency: 15,
};

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function getPlatformDimensionWeights(platform) {
  return PLATFORM_DIMENSION_WEIGHTS[platform] ?? DEFAULT_PLATFORM_WEIGHTS;
}

export function getPlatformQualityScore(platform, businessType) {
  const base = PLATFORM_QUALITY_BASE[platform] ?? 68;
  const adjustment = BUSINESS_TYPE_PLATFORM_ADJUSTMENTS[businessType]?.[platform] ?? 0;
  return clamp(base + adjustment);
}

export function applyBusinessTypeDimensionModifiers(scores, businessType) {
  const modifiers = BUSINESS_TYPE_DIMENSION_MODIFIERS[businessType] ?? {};
  const adjusted = { ...scores };

  for (const dimension of SCORE_DIMENSIONS) {
    adjusted[dimension] = clamp((adjusted[dimension] ?? 0) + (modifiers[dimension] ?? 0));
  }

  return adjusted;
}

export function computePlatformDimensionContributions(platform, qualityScore) {
  const weights = getPlatformDimensionWeights(platform);
  return Object.fromEntries(
    SCORE_DIMENSIONS.map((dimension) => [
      dimension,
      Math.round(qualityScore * ((weights[dimension] ?? 0) / 100)),
    ])
  );
}

export function computeEvidenceConfidence(platformCount) {
  if (platformCount >= 5) {
    return {
      level: 'Strong',
      score: 90,
      reason: `${platformCount} platforms submitted — broad evidence coverage supports a reliable assessment.`,
    };
  }

  if (platformCount >= 3) {
    return {
      level: 'Good',
      score: 75,
      reason: `${platformCount} platforms submitted — evidence coverage supports a credible assessment.`,
    };
  }

  if (platformCount === 2) {
    return {
      level: 'Medium',
      score: 55,
      reason: 'Two platforms submitted — assessment reflects partial channel coverage.',
    };
  }

  if (platformCount === 1) {
    return {
      level: 'Low',
      score: 35,
      reason: 'One platform submitted — assessment is based on limited submitted evidence.',
    };
  }

  return {
    level: 'Low',
    score: 0,
    reason: 'No platform evidence submitted.',
  };
}

export function validatePlatformWeights() {
  for (const [platform, weights] of Object.entries(PLATFORM_DIMENSION_WEIGHTS)) {
    const total = SCORE_DIMENSIONS.reduce((sum, dimension) => sum + (weights[dimension] ?? 0), 0);
    if (total !== 100) {
      throw new Error(`Platform weights for ${platform} must total 100 (got ${total})`);
    }
  }
}

validatePlatformWeights();
