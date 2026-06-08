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
    <section className="no-print py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="section-label">Inspection Findings</p>
          <h2 className="section-title mt-4">Assessment Results</h2>
          <p className="section-subtitle">
            Point-in-time evaluation for{' '}
            <span className="font-medium text-serene-700">{result.businessName}</span>
            {' · '}
            {result.inspectedAt}
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <GradeCard result={result} className="w-full" />
          </div>

          <div className="lg:col-span-3">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-wider text-serene-400">
              Detailed Score Indices
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SCORE_CONFIG.map(({ key, label, description }) => {
                const score = Math.round(scores[key]);
                return (
                  <div
                    key={key}
                    className="border border-serene-100 bg-white px-5 py-6 sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-serene-900">{label}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-serene-400">
                          {description}
                        </p>
                      </div>
                      <span className="shrink-0 font-serif text-2xl font-medium tabular-nums text-serene-900">
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
