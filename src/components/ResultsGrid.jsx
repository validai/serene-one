import GradeCard from './GradeCard';

const SCORE_CONFIG = [
  { key: 'visibility', label: 'Visibility', description: 'Discoverability across search and maps' },
  { key: 'trust', label: 'Trust', description: 'Signals that establish customer confidence' },
  { key: 'seo', label: 'SEO', description: 'Search engine optimization foundation' },
  { key: 'content', label: 'Content', description: 'Messaging quality and relevance' },
  { key: 'conversion', label: 'Conversion', description: 'Clarity of calls-to-action' },
  {
    key: 'brandConsistency',
    label: 'Brand Consistency',
    description: 'Alignment across all inspected platforms',
  },
];

export default function ResultsGrid({ result }) {
  if (!result) return null;

  const { scores } = result;

  return (
    <section className="no-print page-section border-t border-serene-border">
      <div className="section-container">
        <div className="max-w-3xl">
          <p className="section-label">Inspection Findings</p>
          <h2 className="section-title mt-3">Assessment Results</h2>
          <p className="section-subtitle">
            Point-in-time evaluation for{' '}
            <span className="font-semibold text-serene-navy">{result.businessName}</span>
            {' · '}
            {result.inspectedAt}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <GradeCard result={result} className="w-full rounded-xl" />
          </div>

          <div className="lg:col-span-3">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-serene-blue">
              Detailed Score Indices
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SCORE_CONFIG.map(({ key, label, description }) => {
                const score = Math.round(scores[key]);
                return (
                  <div
                    key={key}
                    className="admin-card rounded-xl px-5 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-serene-navy">{label}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-serene-muted">
                          {description}
                        </p>
                      </div>
                      <span className="shrink-0 font-serif text-2xl font-medium tabular-nums text-serene-navy">
                        {score}
                      </span>
                    </div>
                    <div className="mt-5 h-px w-full bg-serene-100">
                      <div
                        className="h-px bg-serene-700 transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
