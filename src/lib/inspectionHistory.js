import {
  getReportFingerprint,
  removeDuplicateReports,
  validateReportArchive,
} from './archiveIntegrity.js';

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
 * @property {string} [updatedAt]
 * @property {string} fingerprint
 * @property {Object} result
 */

/**
 * @typedef {'saved'|'duplicate_skipped'} SaveInspectionStatus
 */

/**
 * @typedef {Object} SaveInspectionResult
 * @property {SaveInspectionStatus} status
 * @property {InspectionHistoryEntry} entry
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

export { getReportFingerprint, getReportFingerprint as getInspectionFingerprint };

/**
 * Save a completed inspection result to local history.
 *
 * @param {Object} result - Display result from formatPipelineResultForDisplay
 * @returns {SaveInspectionResult}
 */
export function saveInspectionResult(result) {
  const inspectionId = result.inspectionId ?? result.pipeline?.inspection?.id;

  if (!inspectionId) {
    throw new Error('Inspection result missing id');
  }

  const fingerprint = getReportFingerprint(result);
  const history = readStorage();
  const existingIndex = history.findIndex((item) => getReportFingerprint(item) === fingerprint);

  if (existingIndex !== -1) {
    const existing = history[existingIndex];
    const updatedEntry = {
      ...existing,
      updatedAt: new Date().toISOString(),
    };
    history[existingIndex] = updatedEntry;
    writeStorage(history);

    return {
      status: 'duplicate_skipped',
      entry: updatedEntry,
    };
  }

  const now = new Date().toISOString();
  const entry = {
    id: inspectionId,
    referenceId: result.referenceId ?? null,
    businessName: result.businessName,
    businessType: result.businessType,
    inspectedAt: result.inspectedAt,
    overallGrade: result.overallGrade,
    savedAt: now,
    updatedAt: now,
    fingerprint,
    result,
  };

  history.unshift(entry);
  writeStorage(history.slice(0, MAX_HISTORY));

  return {
    status: 'saved',
    entry,
  };
}

/**
 * @returns {InspectionHistoryEntry[]}
 */
export function getInspectionHistory() {
  return readStorage().sort(
    (a, b) =>
      new Date(b.updatedAt ?? b.savedAt).getTime() -
      new Date(a.updatedAt ?? a.savedAt).getTime()
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

/**
 * Remove duplicate fingerprints from storage, keeping the newest copy of each.
 *
 * @returns {{ removedCount: number, reports: InspectionHistoryEntry[] }}
 */
export function cleanUpDuplicateReports() {
  const history = readStorage();
  const { reports, removedCount } = removeDuplicateReports(history);
  writeStorage(reports);
  return { removedCount, reports };
}

export { validateReportArchive };
