export function logScoringDebug(label, payload) {
  if (import.meta.env?.DEV) {
    console.debug(`[Serene One Scoring] ${label}`, payload);
  }
}
