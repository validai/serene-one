export function logScoringDebug(payload) {
  if (import.meta.env?.DEV) {
    console.debug('[Serene One Scoring]', payload);
  }
}
