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
    <section className="no-print border-t border-serene-border bg-serene-blue-soft/20 py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="section-label">Inspector Notes</p>
          <h2 className="section-title mt-4">Detailed Findings</h2>
          <p className="section-subtitle">
            Observations and recommendations based on submitted evidence and platform
            presence indicators.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-3 lg:gap-10">
          {SECTIONS.map(({ key, title, subtitle, border }) => (
            <div key={key} className={`border-t-2 bg-white ${border}`}>
              <div className="px-6 py-6 sm:px-7 sm:py-7">
                <h3 className="font-serif text-lg font-medium text-serene-900">{title}</h3>
                <p className="mt-2 text-sm text-serene-muted">{subtitle}</p>
              </div>
              <ul className="space-y-px border-t border-serene-100">
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
                {(findings[key] || []).length === 0 && (
                  <li className="px-6 py-5 text-sm text-serene-muted sm:px-7">
                    No findings in this category.
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
