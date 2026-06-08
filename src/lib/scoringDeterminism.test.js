import { describe, expect, it } from 'vitest';
import { runInspection } from '../models/inspection.js';

const SAMPLE_INPUT = {
  businessName: 'Acme Coffee',
  businessType: 'Local Business',
  uploadedPlatforms: ['Google Business Profile', 'Website'],
};

function pickScoringSnapshot(result) {
  return {
    overallScore: result.overallScore,
    overallGrade: result.overallGrade,
    scores: result.scores,
    platformInspections: result.platformInspections.map((item) => ({
      platform: item.platform,
      qualityScore: item.qualityScore,
      grade: item.grade,
    })),
  };
}

describe('scoring determinism', () => {
  it('returns identical scores and grades for the same inspection input', () => {
    const first = pickScoringSnapshot(runInspection(SAMPLE_INPUT));
    const second = pickScoringSnapshot(runInspection(SAMPLE_INPUT));

    expect(second).toEqual(first);
  });

  it('returns identical scores when business name changes but evidence is the same', () => {
    const baseline = pickScoringSnapshot(runInspection(SAMPLE_INPUT));
    const renamed = pickScoringSnapshot(
      runInspection({
        ...SAMPLE_INPUT,
        businessName: 'Different Name LLC',
      })
    );

    expect(renamed).toEqual(baseline);
  });

  it('sorts platform evidence consistently before scoring', () => {
    const ordered = pickScoringSnapshot(
      runInspection({
        businessName: 'Acme Coffee',
        businessType: 'Local Business',
        uploadedPlatforms: ['Website', 'Google Business Profile'],
      })
    );
    const reversed = pickScoringSnapshot(
      runInspection({
        businessName: 'Acme Coffee',
        businessType: 'Local Business',
        uploadedPlatforms: ['Google Business Profile', 'Website'],
      })
    );

    expect(reversed).toEqual(ordered);
  });
});
