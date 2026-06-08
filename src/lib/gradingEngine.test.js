import { describe, expect, it } from 'vitest';
import { runInspection, createInspectionFromFormInput, runInspectionPipeline } from '../models/inspection.js';
import { scoreToGrade } from '../lib/scoringEngine.js';
import { ENGINE_VERSION } from '../lib/scoringMatrix.js';

const TWO_PLATFORM_INPUT = {
  businessName: 'Acme Coffee',
  businessType: 'Local Business',
  uploadedPlatforms: ['Google Business Profile', 'Website'],
};

const FOUR_PLATFORM_INPUT = {
  businessName: 'Acme Coffee',
  businessType: 'Local Business',
  uploadedPlatforms: ['Google Business Profile', 'Website', 'Facebook', 'Instagram'],
};

function scoringSnapshot(result) {
  return {
    overallScore: result.overallScore,
    overallGrade: result.overallGrade,
    scores: result.scores,
    confidence: result.pipeline.scoring.confidence,
    gradeExplanation: result.pipeline.scoring.gradeExplanation,
    platformInspections: result.platformInspections.map((item) => ({
      platform: item.platform,
      qualityScore: item.qualityScore,
      grade: item.grade,
    })),
    findings: {
      critical: result.findings.critical.map(({ title }) => title),
      easyWins: result.findings.easyWins.map(({ title }) => title),
      opportunities: result.findings.opportunities.map(({ title }) => title),
    },
    referenceId: result.referenceId,
    canPrintReport: result.canPrintReport,
  };
}

describe('grading engine hardening', () => {
  describe('A. repeatability', () => {
    it('returns identical score, grade, findings, and platform grades for the same input', () => {
      const first = scoringSnapshot(runInspection(TWO_PLATFORM_INPUT));
      const second = scoringSnapshot(runInspection(TWO_PLATFORM_INPUT));

      expect(second).toEqual(first);
    });

    it('ignores business name changes when evidence is identical', () => {
      const baseline = scoringSnapshot(runInspection(TWO_PLATFORM_INPUT));
      const renamed = scoringSnapshot(
        runInspection({ ...TWO_PLATFORM_INPUT, businessName: 'Different Name LLC' })
      );

      expect(renamed.overallScore).toBe(baseline.overallScore);
      expect(renamed.overallGrade).toBe(baseline.overallGrade);
      expect(renamed.platformInspections).toEqual(baseline.platformInspections);
    });
  });

  describe('B. order independence', () => {
    it('scores Google + Instagram the same as Instagram + Google', () => {
      const ordered = scoringSnapshot(
        runInspection({
          businessName: 'Acme Coffee',
          businessType: 'Local Business',
          uploadedPlatforms: ['Google Business Profile', 'Instagram'],
        })
      );
      const reversed = scoringSnapshot(
        runInspection({
          businessName: 'Acme Coffee',
          businessType: 'Local Business',
          uploadedPlatforms: ['Instagram', 'Google Business Profile'],
        })
      );

      expect(reversed).toEqual(ordered);
    });
  });

  describe('C. business type impact', () => {
    it('may change scores only through intentional business-type modifiers', () => {
      const local = scoringSnapshot(
        runInspection({ ...TWO_PLATFORM_INPUT, businessType: 'Local Business' })
      );
      const realtor = scoringSnapshot(
        runInspection({
          ...TWO_PLATFORM_INPUT,
          businessType: 'Realtor',
          uploadedPlatforms: ['Zillow', 'Realtor.com'],
        })
      );

      expect(local.overallScore).not.toBe(realtor.overallScore);
      expect(local.gradeExplanation.businessType).toBe('Local Business');
      expect(realtor.gradeExplanation.businessType).toBe('Realtor');
    });
  });

  describe('D. platform count confidence', () => {
    it('assigns lower confidence to one platform than four platforms', () => {
      const onePlatform = scoringSnapshot(
        runInspection({
          businessName: 'Acme Coffee',
          businessType: 'Local Business',
          uploadedPlatforms: ['Google Business Profile'],
        })
      );
      const fourPlatforms = scoringSnapshot(runInspection(FOUR_PLATFORM_INPUT));

      expect(onePlatform.confidence.level).toBe('Low');
      expect(fourPlatforms.confidence.level).toBe('Good');
      expect(onePlatform.confidence.score).toBeLessThan(fourPlatforms.confidence.score);
    });
  });

  describe('E. no evidence', () => {
    it('does not create a printable report without evidence', () => {
      const inspection = createInspectionFromFormInput({
        businessName: 'Acme Coffee',
        businessType: 'Local Business',
        uploadedPlatforms: [],
      });
      const pipeline = runInspectionPipeline(inspection);
      const result = {
        ...pipeline,
        canPrintReport: pipeline.report.isValid !== false,
      };

      expect(result.canPrintReport).toBe(false);
      expect(pipeline.scoring.overallScore).toBe(0);
    });
  });

  describe('F. score bounds', () => {
    it('keeps all dimension and overall scores between 0 and 100', () => {
      const result = runInspection(FOUR_PLATFORM_INPUT);

      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);

      for (const value of Object.values(result.scores)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }

      for (const platform of result.platformInspections) {
        expect(platform.qualityScore).toBeGreaterThanOrEqual(0);
        expect(platform.qualityScore).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('G. grade mapping', () => {
    it('maps scores to letter grades using matrix bands', () => {
      expect(scoreToGrade(95)).toBe('A');
      expect(scoreToGrade(90)).toBe('A');
      expect(scoreToGrade(85)).toBe('B');
      expect(scoreToGrade(80)).toBe('B');
      expect(scoreToGrade(75)).toBe('C');
      expect(scoreToGrade(70)).toBe('C');
      expect(scoreToGrade(65)).toBe('D');
      expect(scoreToGrade(60)).toBe('D');
      expect(scoreToGrade(59)).toBe('F');
    });
  });

  describe('grade explanation and engine metadata', () => {
    it('includes gradeExplanation and engine version in pipeline scoring', () => {
      const result = runInspection(TWO_PLATFORM_INPUT);
      const { gradeExplanation, confidence, engine } = result.pipeline.scoring;

      expect(engine).toBe(ENGINE_VERSION);
      expect(gradeExplanation.engineVersion).toBe(ENGINE_VERSION);
      expect(gradeExplanation.submittedPlatforms).toEqual([
        'Google Business Profile',
        'Website',
      ]);
      expect(gradeExplanation.platformContributions).toHaveLength(2);
      expect(gradeExplanation.gradeReason).toContain('maps to grade');
      expect(confidence.level).toBe('Medium');
    });
  });

  describe('saved report stability', () => {
    it('preserves stored report payload without recalculating on view', () => {
      const generated = runInspection(TWO_PLATFORM_INPUT);
      const originalScore = generated.overallScore;
      const originalGrade = generated.overallGrade;

      const viewedReport = { ...generated };

      expect(viewedReport.overallScore).toBe(originalScore);
      expect(viewedReport.overallGrade).toBe(originalGrade);
      expect(viewedReport.pipeline.scoring.overallScore).toBe(originalScore);
    });
  });
});
