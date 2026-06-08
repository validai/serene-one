const SCORE_LABELS = {
  visibility: 'Visibility',
  trust: 'Trust',
  seo: 'SEO',
  content: 'Content',
  conversion: 'Conversion',
  brandConsistency: 'Brand Consistency',
};

function getGradeColor(grade) {
  if (grade.startsWith('A')) return 'text-emerald-600';
  if (grade.startsWith('B')) return 'text-blue-600';
  if (grade.startsWith('C')) return 'text-amber-600';
  if (grade.startsWith('D')) return 'text-orange-600';
  return 'text-red-600';
}

export default function GradeCard({ result, compact = false, className = '' }) {
  if (!result) {
    return (
      <div
        className={`rounded-2xl border border-serene-200 bg-white p-8 shadow-sm ${className}`}
      >
        <p className="text-xs font-medium uppercase tracking-widest text-serene-400">
          Overall Grade
        </p>
        <p className="mt-2 text-6xl font-semibold tracking-tight text-serene-300">—</p>
        <div className="mt-8 space-y-4">
          {['Visibility', 'Trust', 'SEO'].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-serene-500">{label} Score</span>
              <span className="text-sm font-medium text-serene-300">—</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { overallGrade, scores } = result;
  const displayScores = compact
    ? { visibility: scores.visibility, trust: scores.trust, seo: scores.seo }
    : scores;

  return (
    <div
      className={`rounded-2xl border border-serene-200 bg-white p-8 shadow-sm ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-widest text-serene-400">
        Overall Grade
      </p>
      <p
        className={`mt-2 text-6xl font-semibold tracking-tight ${getGradeColor(overallGrade)}`}
      >
        {overallGrade}
      </p>
      <div className={`mt-8 space-y-4 ${compact ? '' : 'grid grid-cols-1 gap-4'}`}>
        {Object.entries(displayScores).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-serene-500">
              {SCORE_LABELS[key] || key} Score
            </span>
            <span className="text-sm font-semibold text-serene-900">{Math.round(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
