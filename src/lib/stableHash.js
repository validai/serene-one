/**
 * Deterministic string hash for stable scoring seeds.
 * Must not use timestamps, random values, or inspection IDs.
 */
export function stableHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function sortPlatforms(platforms) {
  return [...platforms].sort((a, b) => a.localeCompare(b));
}

export function sortEvidence(evidence) {
  return [...evidence].sort((a, b) => {
    const platformCompare = a.platform.localeCompare(b.platform);
    if (platformCompare !== 0) return platformCompare;
    const sourceCompare = (a.source || '').localeCompare(b.source || '');
    if (sourceCompare !== 0) return sourceCompare;
    return (a.type || '').localeCompare(b.type || '');
  });
}
