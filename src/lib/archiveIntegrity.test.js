import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runInspection } from '../models/inspection.js';
import {
  findDuplicateReports,
  getReportFingerprint,
  removeDuplicateReports,
  validateReportArchive,
} from './archiveIntegrity.js';
import {
  cleanUpDuplicateReports,
  saveInspectionResult,
} from './inspectionHistory.js';

const TWO_PLATFORM_INPUT = {
  businessName: 'Acme Coffee',
  businessType: 'Local Business',
  uploadedPlatforms: ['Google Business Profile', 'Website'],
};

function mockLocalStorage() {
  const store = {};

  vi.stubGlobal('localStorage', {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
  });

  return store;
}

function buildEntry(result, overrides = {}) {
  const fingerprint = getReportFingerprint(result);
  const now = '2026-01-01T12:00:00.000Z';

  return {
    id: result.inspectionId,
    referenceId: result.referenceId,
    businessName: result.businessName,
    businessType: result.businessType,
    inspectedAt: result.inspectedAt,
    overallGrade: result.overallGrade,
    savedAt: now,
    updatedAt: now,
    fingerprint,
    result,
    ...overrides,
  };
}

describe('archive integrity', () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  it('builds a stable fingerprint from normalized report metadata', () => {
    const result = runInspection(TWO_PLATFORM_INPUT);
    const fingerprint = getReportFingerprint(result);

    expect(fingerprint).toContain('acme coffee');
    expect(fingerprint).toContain('Local Business');
    expect(fingerprint).toContain(String(result.overallScore));
    expect(fingerprint).toContain(result.overallGrade);
    expect(fingerprint).toContain('scoring-matrix-v1');
  });

  it('saves a report only once for identical fingerprints', () => {
    const firstResult = runInspection(TWO_PLATFORM_INPUT);
    const secondResult = runInspection(TWO_PLATFORM_INPUT);

    const firstSave = saveInspectionResult(firstResult);
    const secondSave = saveInspectionResult(secondResult);

    expect(firstSave.status).toBe('saved');
    expect(secondSave.status).toBe('duplicate_skipped');

    const stored = JSON.parse(localStorage.getItem('serene-one-inspection-history'));
    expect(stored).toHaveLength(1);
  });

  it('returns duplicate_skipped without creating a new archive entry', () => {
    const result = runInspection(TWO_PLATFORM_INPUT);

    saveInspectionResult(result);
    const duplicateSave = saveInspectionResult(runInspection(TWO_PLATFORM_INPUT));

    expect(duplicateSave.status).toBe('duplicate_skipped');
    expect(duplicateSave.entry.fingerprint).toBe(getReportFingerprint(result));
    expect(new Date(duplicateSave.entry.updatedAt).getTime()).toBeGreaterThan(0);
  });

  it('finds and removes duplicate fingerprints while keeping the newest copy', () => {
    const result = runInspection(TWO_PLATFORM_INPUT);
    const fingerprint = getReportFingerprint(result);

    const older = buildEntry(result, {
      id: 'older-report',
      savedAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
    });
    const newer = buildEntry(result, {
      id: 'newer-report',
      savedAt: '2026-01-02T10:00:00.000Z',
      updatedAt: '2026-01-02T10:00:00.000Z',
    });

    const duplicates = findDuplicateReports([older, newer]);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].fingerprint).toBe(fingerprint);

    const cleaned = removeDuplicateReports([older, newer]);
    expect(cleaned.removedCount).toBe(1);
    expect(cleaned.reports).toHaveLength(1);
    expect(cleaned.reports[0].id).toBe('newer-report');
  });

  it('cleans duplicate reports from localStorage', () => {
    const result = runInspection(TWO_PLATFORM_INPUT);

    localStorage.setItem(
      'serene-one-inspection-history',
      JSON.stringify([
        buildEntry(result, {
          id: 'older-report',
          savedAt: '2026-01-01T10:00:00.000Z',
          updatedAt: '2026-01-01T10:00:00.000Z',
        }),
        buildEntry(result, {
          id: 'newer-report',
          savedAt: '2026-01-02T10:00:00.000Z',
          updatedAt: '2026-01-02T10:00:00.000Z',
        }),
      ])
    );

    const { removedCount } = cleanUpDuplicateReports();
    const stored = JSON.parse(localStorage.getItem('serene-one-inspection-history'));

    expect(removedCount).toBe(1);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('newer-report');
  });

  it('validates archive health and flags duplicate groups', () => {
    const result = runInspection(TWO_PLATFORM_INPUT);
    const reports = [
      buildEntry(result, { id: 'copy-a' }),
      buildEntry(result, { id: 'copy-b', savedAt: '2026-01-03T10:00:00.000Z' }),
    ];

    const validation = validateReportArchive(reports);

    expect(validation.valid).toBe(false);
    expect(validation.duplicateGroups).toBe(1);
    expect(validation.duplicateCount).toBe(1);
    expect(validation.issues[0]).toContain('Duplicate fingerprint detected');
  });

  it('does not recalculate score when viewing a saved report payload', () => {
    const generated = runInspection(TWO_PLATFORM_INPUT);
    const { entry } = saveInspectionResult(generated);
    const viewed = entry.result;

    expect(viewed.overallScore).toBe(generated.overallScore);
    expect(viewed.overallGrade).toBe(generated.overallGrade);
    expect(viewed.pipeline.scoring.overallScore).toBe(generated.overallScore);
    expect(viewed.referenceId).toBe(generated.referenceId);
  });
});
