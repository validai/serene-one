/**
 * Deterministic helpers for stable ordering and IDs.
 * Must not use timestamps, random values, or inspection IDs in scoring paths.
 */

import { PLATFORMS } from '../models/inspection.js';

export function stableHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function sortPlatformsByCanonical(platforms) {
  const platformSet = new Set(platforms);
  return PLATFORMS.filter((platform) => platformSet.has(platform));
}

/** @deprecated Use sortPlatformsByCanonical */
export function sortPlatforms(platforms) {
  return sortPlatformsByCanonical(platforms);
}

export function normalizePlatformSource(platform) {
  return `${platform.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-evidence`;
}

export function sortEvidence(evidence) {
  const order = new Map(PLATFORMS.map((platform, index) => [platform, index]));

  return [...evidence].sort((a, b) => {
    const platformCompare = (order.get(a.platform) ?? 999) - (order.get(b.platform) ?? 999);
    if (platformCompare !== 0) return platformCompare;
    return (a.type || '').localeCompare(b.type || '');
  });
}

export function sortPlatformInspections(platformInspections) {
  const order = new Map(PLATFORMS.map((platform, index) => [platform, index]));

  return [...platformInspections].sort(
    (a, b) => (order.get(a.platform) ?? 999) - (order.get(b.platform) ?? 999)
  );
}
