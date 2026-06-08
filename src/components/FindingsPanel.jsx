const SECTIONS = [
  {
    key: 'critical',
    title: 'Critical Findings',
    subtitle: 'Issues that may significantly impact performance',
    accent: 'border-red-200 bg-red-50/50',
    dot: 'bg-red-500',
    titleColor: 'text-red-800',
  },
  {
    key: 'easyWins',
    title: 'Easy Wins',
    subtitle: 'Quick improvements with high return on effort',
    accent: 'border-emerald-200 bg-emerald-50/50',
    dot: 'bg-emerald-500',
    titleColor: 'text-emerald-800',
  },
  {
    key: 'opportunities',
    title: 'Improvement Opportunities',
    subtitle: 'Strategic enhancements for long-term growth',
    accent: 'border-blue-200 bg-blue-50/50',
    dot: 'bg-blue-500',
    titleColor: 'text-blue-800',
  },
];

export default function FindingsPanel({ result }) {
  if (!result) return null;

  const { findings } = result;

  return (
    <section className="no-print border-t border-serene-100 py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-serene-accent">
            Detailed Findings
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-serene-900">
            Actionable Insights
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {SECTIONS.map(({ key, title, subtitle, accent, dot, titleColor }) => (
            <div
              key={key}
              className={`rounded-2xl border p-6 ${accent}`}
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <h3 className={`text-sm font-semibold ${titleColor}`}>{title}</h3>
                </div>
                <p className="mt-1 text-xs text-serene-500">{subtitle}</p>
              </div>
              <ul className="space-y-4">
                {(findings[key] || []).map((item, i) => (
                  <li key={i} className="rounded-lg border border-white/60 bg-white p-4">
                    <p className="text-sm font-medium text-serene-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-serene-600">
                      {item.description}
                    </p>
                  </li>
                ))}
                {(findings[key] || []).length === 0 && (
                  <li className="text-xs text-serene-500">No items in this category.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
