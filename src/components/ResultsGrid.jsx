const SCORE_CONFIG = [
  { key: 'visibility', label: 'Visibility', description: 'How discoverable you are online' },
  { key: 'trust', label: 'Trust', description: 'Signals that build customer confidence' },
  { key: 'seo', label: 'SEO', description: 'Search engine optimization health' },
  { key: 'content', label: 'Content', description: 'Quality and consistency of messaging' },
  { key: 'conversion', label: 'Conversion', description: 'Clarity of calls-to-action' },
  {
    key: 'brandConsistency',
    label: 'Brand Consistency',
    description: 'Visual and voice alignment across platforms',
  },
];

function getScoreColor(score) {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function getBarColor(score) {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function ResultsGrid({ result }) {
  if (!result) return null;

  const { overallGrade, overallScore, scores } = result;

  return (
    <section className="no-print py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-serene-accent">
            Inspection Results
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-serene-900">
            Platform Health Report
          </h2>
          <p className="mt-4 text-serene-600">
            Point-in-time assessment for {result.businessName}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-2xl border border-serene-200 bg-white p-10 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-widest text-serene-400">
              Overall Grade
            </p>
            <p className="mt-2 text-7xl font-semibold tracking-tight text-serene-900">
              {overallGrade}
            </p>
            <p className="mt-2 text-sm text-serene-500">Score: {overallScore} / 100</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCORE_CONFIG.map(({ key, label, description }) => {
              const score = Math.round(scores[key]);
              return (
                <div
                  key={key}
                  className="rounded-xl border border-serene-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-serene-900">{label}</p>
                      <p className="mt-1 text-xs text-serene-500">{description}</p>
                    </div>
                    <span className={`text-2xl font-semibold ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-serene-100">
                    <div
                      className={`h-full rounded-full transition-all ${getBarColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
