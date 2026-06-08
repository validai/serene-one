/**
 * Saved report archive integrity — fingerprints, duplicate detection, validation.
 */

import { sortPlatformsByCanonical } from './stableHash.js';

export function normalizeBusinessName(name = '') {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getScoringEngineVersion(result) {
  return (
    result.pipeline?.scoring?.engine ??
    result.pipeline?.scoring?.gradeExplanation?.engineVersion ??
    'unknown'
  );
}

/**
 * Stable fingerprint for deduplicating saved reports.
 *
 * @param {Object} reportOrEntry - Display result or history entry
 * @returns {string}
 */
export function getReportFingerprint(reportOrEntry) {
  const result = reportOrEntry.result ?? reportOrEntry;
  const normalizedName = normalizeBusinessName(result.businessName);
  const platforms = sortPlatformsByCanonical(result.inspectedPlatforms || []).join('|');
  const engineVersion = getScoringEngineVersion(result);

  return [
    normalizedName,
    result.businessType,
    platforms,
    result.overallScore,
    result.overallGrade,
    engineVersion,
  ].join('|');
}

/** @deprecated Use getReportFingerprint */
export function getInspectionFingerprint(result) {
  return getReportFingerprint(result);
}

function entryTimestamp(entry) {
  return new Date(entry.updatedAt ?? entry.savedAt ?? 0).getTime();
}

/**
 * @param {import('./inspectionHistory.js').InspectionHistoryEntry[]} reports
 * @returns {{ fingerprint: string, entries: import('./inspectionHistory.js').InspectionHistoryEntry[] }[]}
 */
export function findDuplicateReports(reports) {
  const groups = new Map();

  for (const entry of reports) {
    const fingerprint = getReportFingerprint(entry);
    if (!groups.has(fingerprint)) {
      groups.set(fingerprint, []);
    }
    groups.get(fingerprint).push(entry);
  }

  return [...groups.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([fingerprint, entries]) => ({
      fingerprint,
      entries: [...entries].sort((a, b) => entryTimestamp(b) - entryTimestamp(a)),
    }));
}

/**
 * Remove duplicate fingerprints, keeping the newest copy of each report.
 *
 * @param {import('./inspectionHistory.js').InspectionHistoryEntry[]} reports
 * @returns {{ reports: import('./inspectionHistory.js').InspectionHistoryEntry[], removedCount: number, removed: import('./inspectionHistory.js').InspectionHistoryEntry[] }}
 */
export function removeDuplicateReports(reports) {
  const sorted = [...reports].sort((a, b) => entryTimestamp(b) - entryTimestamp(a));
  const kept = new Map();
  const removed = [];

  for (const entry of sorted) {
    const fingerprint = getReportFingerprint(entry);
    if (kept.has(fingerprint)) {
      removed.push(entry);
      continue;
    }
    kept.set(fingerprint, entry);
  }

  const deduped = [...kept.values()].sort((a, b) => entryTimestamp(b) - entryTimestamp(a));

  return {
    reports: deduped,
    removedCount: removed.length,
    removed,
  };
}

/**
 * Validate archive health and report duplicate groups.
 *
 * @param {import('./inspectionHistory.js').InspectionHistoryEntry[]} reports
 */
export function validateReportArchive(reports) {
  const duplicateGroups = findDuplicateReports(reports);
  const duplicateCount = duplicateGroups.reduce(
    (sum, group) => sum + group.entries.length - 1,
    0
  );
  const issues = [];

  for (const group of duplicateGroups) {
    issues.push(
      `Duplicate fingerprint detected (${group.entries.length} copies): ${group.fingerprint}`
    );
  }

  for (const entry of reports) {
    if (!entry.result) {
      issues.push(`Report ${entry.id} is missing stored result payload.`);
    } else if (entry.fingerprint && entry.fingerprint !== getReportFingerprint(entry)) {
      issues.push(`Report ${entry.id} has a stale fingerprint value.`);
    }
  }

  return {
    valid: issues.length === 0,
    totalReports: reports.length,
    duplicateGroups: duplicateGroups.length,
    duplicateCount,
    issues,
  };
}
