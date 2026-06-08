const SCORE_LABELS = {
  visibility: 'Visibility Index',
  trust: 'Trust Index',
  seo: 'SEO Index',
  content: 'Content Index',
  conversion: 'Conversion Index',
  brandConsistency: 'Brand Consistency Index',
};

function getGradeColor(grade) {
  if (grade.startsWith('A')) return 'text-serene-900';
  if (grade.startsWith('B')) return 'text-serene-900';
  if (grade.startsWith('C')) return 'text-serene-800';
  if (grade.startsWith('D')) return 'text-serene-700';
  return 'text-serene-700';
}

function ScoreRow({ label, value }) {
  const score = Math.round(value);
  return (
    <div className="border-b border-serene-100 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-serene-500">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums text-serene-900">
          {score}
          <span className="font-normal text-serene-400"> / 100</span>
        </span>
      </div>
      <div className="mt-2 h-px w-full bg-serene-100">
        <div
          className="h-px bg-serene-700 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function GradeCard({ result, compact = false, className = '' }) {
  const reportRef = result?.referenceId ?? 'S1-PREVIEW';
  const assessmentDate =
    result?.inspectedAt ??
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (!result) {
    return (
      <div
        className={`border border-serene-200 bg-white ${className}`}
      >
        <div className="border-b border-serene-200 bg-serene-50 px-6 py-4 sm:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-serene-400">
            Serene One Inspection Services
          </p>
          <p className="mt-1 font-serif text-sm text-serene-700">
            Platform Health Assessment
          </p>
        </div>
        <div className="px-6 py-10 text-center sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-widest text-serene-400">
            Overall Grade
          </p>
          <p className="mt-3 font-serif text-6xl font-medium text-serene-300">—</p>
        </div>
      </div>
    );
  }

  const { overallGrade, scores, businessName } = result;
  const displayScores = compact
    ? { visibility: scores.visibility, trust: scores.trust, seo: scores.seo }
    : scores;

  return (
    <div className={`border border-serene-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ${className}`}>
      {/* Report header */}
      <div className="border-b border-serene-200 bg-serene-50 px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-serene-400">
              Serene One Inspection Services
            </p>
            <p className="mt-1 font-serif text-sm font-medium text-serene-800 sm:text-base">
              Platform Health Assessment
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wider text-serene-400">Ref</p>
            <p className="text-[11px] font-medium tabular-nums text-serene-600">{reportRef}</p>
          </div>
        </div>
      </div>

      {/* Subject & date */}
      <div className="border-b border-serene-100 px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {businessName && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-serene-400">Subject</p>
              <p className="mt-0.5 text-sm font-medium text-serene-800">{businessName}</p>
            </div>
          )}
          <div className={businessName ? 'sm:text-right' : ''}>
            <p className="text-[10px] uppercase tracking-wider text-serene-400">
              Assessment Date
            </p>
            <p className="mt-0.5 text-sm text-serene-600">{assessmentDate}</p>
          </div>
        </div>
      </div>

      {/* Grade */}
      <div className="border-b border-serene-100 px-5 py-8 text-center sm:px-7 sm:py-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-serene-400">
          Overall Platform Health Grade
        </p>
        <p
          className={`mt-3 font-serif text-7xl font-medium tracking-tight sm:text-8xl ${getGradeColor(overallGrade)}`}
        >
          {overallGrade}
        </p>
        <p className="mt-3 text-xs text-serene-400">
          Based on visibility, trust, and digital presence indicators
        </p>
      </div>

      {/* Score breakdown */}
      <div className="px-5 py-2 sm:px-7 sm:py-3">
        {Object.entries(displayScores).map(([key, value]) => (
          <ScoreRow
            key={key}
            label={SCORE_LABELS[key] || key}
            value={value}
          />
        ))}
      </div>

      {/* Footer stamp */}
      <div className="border-t border-serene-200 bg-serene-50 px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wider text-serene-500">
            Status: Assessment Complete
          </p>
          <p className="text-[10px] text-serene-400">
            Confidential · Point-in-Time Inspection
          </p>
        </div>
      </div>
    </div>
  );
}
