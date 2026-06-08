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

  const history = readStorage().filter((item) => item.id !== entry.id);
  history.unshift(entry);

  writeStorage(history.slice(0, MAX_HISTORY));
  return entry;
}

/**
 * @returns {InspectionHistoryEntry[]}
 */
export function getInspectionHistory() {
  return readStorage();
}

/**
 * @param {string} id
 * @returns {InspectionHistoryEntry|null}
 */
export function getInspectionById(id) {
  return readStorage().find((entry) => entry.id === id) ?? null;
}

export function clearInspectionHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
