const SECTIONS = [
  {
    key: 'critical',
    title: 'Critical Findings',
    subtitle: 'Issues requiring immediate attention',
    border: 'border-t-serene-900',
  },
  {
    key: 'easyWins',
    title: 'Recommended Actions',
    subtitle: 'High-impact improvements with minimal effort',
    border: 'border-t-serene-600',
  },
  {
    key: 'opportunities',
    title: 'Strategic Opportunities',
    subtitle: 'Long-term enhancements for sustained growth',
    border: 'border-t-serene-400',
  },
];

export default function FindingsPanel({ result }) {
  if (!result) return null;

  const { findings } = result;

  return (
    <section className="no-print page-section surface-muted border-t border-serene-border">
      <div className="section-container">
        <div className="max-w-3xl">
          <p className="section-label">Inspector Notes</p>
          <h2 className="section-title mt-3">Detailed Findings</h2>
          <p className="section-subtitle">
            Observations and recommendations based on submitted evidence and platform
            presence indicators.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-8">
          {SECTIONS.map(({ key, title, subtitle, border }) => (
            <div key={key} className={`admin-card overflow-hidden border-t-4 ${border}`}>
              <div className="border-b border-serene-border bg-serene-50/60 px-6 py-5 sm:px-7">
                <h3 className="font-serif text-lg font-medium text-serene-900">{title}</h3>
                <p className="mt-2 text-sm text-serene-muted">{subtitle}</p>
              </div>
              <ul className="divide-y divide-serene-100">
                {(findings[key] || []).map((item, i) => (
                  <li
                    key={i}
                    className="border-b border-serene-50 px-6 py-5 last:border-b-0 sm:px-7"
                  >
                    <p className="text-sm font-medium text-serene-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-serene-slate">
                      {item.description}
                    </p>
                  </li>
                ))}
                {(findings[key] || []).length === 0 && key !== 'critical' && (
                  <li className="px-6 py-5 text-sm text-serene-muted sm:px-7">
                    No findings in this category.
                  </li>
                )}
                {key === 'critical' && (findings[key] || []).length === 0 && (
                  <li className="px-6 py-5 text-sm text-serene-muted sm:px-7">
                    No critical issues flagged.
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
