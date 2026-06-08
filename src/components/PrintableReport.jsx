const SCORE_LABELS = {
  visibility: 'Visibility Index',
  trust: 'Trust Index',
  seo: 'SEO Index',
  content: 'Content Index',
  conversion: 'Conversion Index',
  brandConsistency: 'Brand Consistency Index',
};

export default function PrintableReport({ result, onPrint }) {
  if (!result) return null;

  const {
    businessName,
    businessType,
    overallGrade,
    overallScore,
    scores,
    recommendations,
    inspectedAt,
    inspectedPlatforms,
  } = result;

  return (
    <section id="report-card" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="no-print max-w-2xl">
          <p className="section-label">Final Deliverable</p>
          <h2 className="section-title mt-4">Professional Report Card</h2>
          <p className="section-subtitle">
            Print or save this executive inspection report to share with stakeholders,
            clients, or internal teams.
          </p>
          <button onClick={onPrint} className="btn-primary mt-10">
            Print Professional Report Card
          </button>
        </div>

        <div className="printable-report mx-auto mt-14 max-w-3xl border border-serene-200 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:mt-16 sm:p-12 print:mt-0 print:border-0 print:p-0 print:shadow-none">
          <div className="border-b border-serene-200 pb-8 sm:pb-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-serene-400">
                  Serene One Inspection Services
                </p>
                <h1 className="mt-2 font-serif text-2xl font-medium tracking-tight text-serene-900 sm:text-3xl">
                  Platform Health Inspection Report
                </h1>
                <p className="mt-2 text-sm text-serene-500">
                  Executive Assessment · Point-in-Time Review
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] uppercase tracking-wider text-serene-400">
                  Inspection Date
                </p>
                <p className="mt-1 text-sm font-medium text-serene-700">{inspectedAt}</p>
                <p className="mt-3 text-[10px] uppercase tracking-wider text-serene-400">
                  Reference
                </p>
                <p className="mt-1 text-[11px] font-medium tabular-nums text-serene-600">
                  S1-2026-0847
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-serene-200 py-8 sm:py-10">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-serene-400">
                  Subject Business
                </p>
                <p className="mt-2 font-serif text-xl font-medium text-serene-900">
                  {businessName}
                </p>
                <p className="mt-1 text-sm text-serene-500">{businessType}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-serene-400">
                  Platforms Reviewed
                </p>
                <p className="mt-2 text-sm leading-relaxed text-serene-700">
                  {inspectedPlatforms.length > 0
                    ? inspectedPlatforms.join(', ')
                    : 'General web presence assessment'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-serene-200 py-10 text-center sm:py-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-serene-400">
              Overall Platform Health Grade
            </p>
            <p className="mt-4 font-serif text-8xl font-medium tracking-tight text-serene-900 sm:text-9xl">
              {overallGrade}
            </p>
            <p className="mt-4 text-sm text-serene-500">
              Composite Score: {overallScore} / 100
            </p>
          </div>

          <div className="border-b border-serene-200 py-8 sm:py-10">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-wider text-serene-400">
              Score Breakdown
            </p>
            <div className="grid gap-x-12 sm:grid-cols-2">
              {Object.entries(scores).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between border-b border-serene-100 py-3"
                >
                  <span className="text-sm text-serene-600">{SCORE_LABELS[key]}</span>
                  <span className="text-sm font-semibold tabular-nums text-serene-900">
                    {Math.round(value)}
                    <span className="font-normal text-serene-400"> / 100</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-8 sm:py-10">
            <p className="mb-8 text-[10px] font-semibold uppercase tracking-wider text-serene-400">
              Inspector Recommendations
            </p>
            <div className="space-y-7">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-serene-200 text-xs font-semibold text-serene-600">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-sm font-semibold text-serene-900">{rec.title}</p>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-serene-400">
                        {rec.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-serene-600">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-serene-200 pt-8">
            <p className="text-[11px] leading-relaxed text-serene-400">
              This report was prepared by Serene One Inspection Services as a point-in-time
              assessment of publicly visible platform presence. Findings are intended to
              support strategic improvement planning. Confidential · For client use only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
