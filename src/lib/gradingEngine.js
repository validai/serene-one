const BUSINESS_TYPE_MODIFIERS = {
  'Local Business': { visibility: 5, trust: 3, seo: 2 },
  Restaurant: { visibility: 8, trust: 5, content: 4 },
  Realtor: { visibility: 6, trust: 7, conversion: 5, brandConsistency: 4 },
  'Service Business': { visibility: 4, trust: 4, conversion: 3 },
  'Creator / Artist': { content: 8, brandConsistency: 6, visibility: 3 },
};

const PLATFORMS = [
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

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function scoreToGrade(score) {
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

function applyModifiers(scores, businessType) {
  const modifiers = BUSINESS_TYPE_MODIFIERS[businessType] || {};
  const adjusted = { ...scores };

  for (const [key, bonus] of Object.entries(modifiers)) {
    if (adjusted[key] !== undefined) {
      adjusted[key] = clamp(adjusted[key] + bonus);
    }
  }

  return adjusted;
}

function applyUploadBonus(scores, uploadedPlatforms) {
  const count = uploadedPlatforms.length;
  const bonus = Math.min(count * 3, 18);
  const adjusted = { ...scores };

  for (const key of Object.keys(adjusted)) {
    adjusted[key] = clamp(adjusted[key] + bonus * 0.4);
  }

  return adjusted;
}

function generateFindings(scores, businessName, businessType, uploadedPlatforms) {
  const critical = [];
  const easyWins = [];
  const opportunities = [];

  if (scores.visibility < 75) {
    critical.push({
      title: 'Limited Local Visibility',
      description: `${businessName} appears inconsistently across search and map results, reducing discovery by nearby customers.`,
    });
  }

  if (scores.trust < 70) {
    critical.push({
      title: 'Trust Signals Need Attention',
      description: 'Missing or outdated reviews, credentials, and contact information may reduce customer confidence.',
    });
  }

  if (scores.seo < 72) {
    critical.push({
      title: 'SEO Foundation Gaps',
      description: 'Page titles, meta descriptions, and structured data are not fully optimized for search engines.',
    });
  }

  if (!uploadedPlatforms.includes('Google Business Profile')) {
    critical.push({
      title: 'Google Business Profile Not Verified',
      description: 'No Google Business Profile screenshot was provided. This is often the highest-impact local visibility channel.',
    });
  }

  if (scores.content >= 65 && scores.content < 85) {
    easyWins.push({
      title: 'Refresh Platform Bios',
      description: 'Update short descriptions on social profiles to align messaging with your current services and offers.',
    });
  }

  if (scores.brandConsistency >= 60 && scores.brandConsistency < 80) {
    easyWins.push({
      title: 'Unify Profile Imagery',
      description: 'Use consistent logo, cover photo, and brand colors across all active platforms.',
    });
  }

  if (uploadedPlatforms.length < 4) {
    easyWins.push({
      title: 'Expand Platform Presence',
      description: `Only ${uploadedPlatforms.length} platform(s) were inspected. Adding key channels for ${businessType} can improve reach.`,
    });
  }

  easyWins.push({
    title: 'Add Recent Customer Reviews',
    description: 'Request reviews from satisfied clients and respond to existing feedback within 48 hours.',
  });

  if (scores.conversion < 80) {
    opportunities.push({
      title: 'Improve Call-to-Action Clarity',
      description: 'Ensure every platform profile includes a clear next step: call, book, or contact.',
    });
  }

  if (businessType === 'Realtor' && !uploadedPlatforms.includes('Zillow')) {
    opportunities.push({
      title: 'Strengthen Real Estate Listings',
      description: 'Optimize Zillow and Realtor.com profiles with professional photography and complete agent credentials.',
    });
  }

  if (businessType === 'Restaurant') {
    opportunities.push({
      title: 'Showcase Menu & Hours Prominently',
      description: 'Ensure hours, menu links, and reservation options are visible on Google and social profiles.',
    });
  }

  opportunities.push({
    title: 'Content Publishing Cadence',
    description: 'Establish a monthly content rhythm to stay top-of-mind and signal an active, trustworthy business.',
  });

  opportunities.push({
    title: 'Cross-Platform Link Strategy',
    description: 'Link website, social profiles, and listing pages to each other for stronger authority and discoverability.',
  });

  return {
    critical: critical.slice(0, 4),
    easyWins: easyWins.slice(0, 4),
    opportunities: opportunities.slice(0, 4),
  };
}

function generateRecommendations(findings) {
  return [
    ...findings.critical.map((f) => ({ ...f, priority: 'High' })),
    ...findings.easyWins.map((f) => ({ ...f, priority: 'Quick Win' })),
    ...findings.opportunities.map((f) => ({ ...f, priority: 'Strategic' })),
  ].slice(0, 8);
}

export function runInspection({ businessName, businessType, uploadedPlatforms = [] }) {
  const name = businessName.trim() || 'Your Business';
  const type = businessType || 'Local Business';

  let scores = generateBaseScores(name, type);
  scores = applyModifiers(scores, type);
  scores = applyUploadBonus(scores, uploadedPlatforms);

  const overallScore = Math.round(
    Object.values(scores).reduce((sum, val) => sum + val, 0) / Object.values(scores).length
  );

  const findings = generateFindings(scores, name, type, uploadedPlatforms);

  return {
    businessName: name,
    businessType: type,
    inspectedPlatforms: uploadedPlatforms,
    overallGrade: scoreToGrade(overallScore),
    overallScore,
    scores,
    findings,
    recommendations: generateRecommendations(findings),
    inspectedAt: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

export { PLATFORMS, scoreToGrade };
