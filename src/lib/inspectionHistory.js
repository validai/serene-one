const STORAGE_KEY = 'serene-one-inspection-history';
const MAX_HISTORY = 50;

/**
 * @typedef {Object} InspectionHistoryEntry
 * @property {string} id
 * @property {string|null} referenceId
 * @property {string} businessName
 * @property {string} businessType
 * @property {string} inspectedAt
 * @property {string} overallGrade
 * @property {string} savedAt
 * @property {Object} result
 */

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function sortPlatforms(platforms) {
  return [...platforms].sort((a, b) => a.localeCompare(b));
}

/**
 * Stable fingerprint for deduplicating saved reports.
 */
export function getInspectionFingerprint(result) {
  const platforms = sortPlatforms(result.inspectedPlatforms || []).join('|');
  return `${result.businessType}|${platforms}|${result.overallGrade}|${result.overallScore}`;
}

/**
 * Save a completed inspection result to local history.
 *
 * @param {Object} result - Display result from formatPipelineResultForDisplay
 * @returns {InspectionHistoryEntry}
 */
export function saveInspectionResult(result) {
  const inspectionId = result.inspectionId ?? result.pipeline?.inspection?.id;

  if (!inspectionId) {
    throw new Error('Inspection result missing id');
  }

  const fingerprint = getInspectionFingerprint(result);

  const entry = {
    id: inspectionId,
    referenceId: result.referenceId ?? null,
    businessName: result.businessName,
    businessType: result.businessType,
    inspectedAt: result.inspectedAt,
    overallGrade: result.overallGrade,
    savedAt: new Date().toISOString(),
    result,
  };

  const history = readStorage().filter(
    (item) => getInspectionFingerprint(item.result) !== fingerprint
  );
  history.unshift(entry);

  writeStorage(history.slice(0, MAX_HISTORY));
  return entry;
}

/**
 * @returns {InspectionHistoryEntry[]}
 */
export function getInspectionHistory() {
  return readStorage().sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

/**
 * @param {string} id
 * @returns {InspectionHistoryEntry|null}
 */
export function getInspectionById(id) {
  return readStorage().find((entry) => entry.id === id) ?? null;
}

/**
 * @param {string} id
 */
export function deleteInspectionById(id) {
  writeStorage(readStorage().filter((entry) => entry.id !== id));
}

export function clearInspectionHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteAllInspections() {
  clearInspectionHistory();
}
