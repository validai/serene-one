const SCORE_LABELS = {
  visibility: 'Visibility',
  trust: 'Trust',
  seo: 'SEO',
  content: 'Content',
  conversion: 'Conversion',
  brandConsistency: 'Brand Consistency',
};

function getGradeColor(grade) {
  if (grade.startsWith('A')) return 'text-emerald-700';
  if (grade.startsWith('B')) return 'text-blue-700';
  if (grade.startsWith('C')) return 'text-amber-700';
  if (grade.startsWith('D')) return 'text-orange-700';
  return 'text-red-700';
}

function getPriorityStyle(priority) {
  if (priority === 'High') return 'bg-red-100 text-red-800';
  if (priority === 'Quick Win') return 'bg-emerald-100 text-emerald-800';
  return 'bg-blue-100 text-blue-800';
}

export default function PrintableReport({ result, onPrint }) {
  if (!result) return null;

  const { businessName, businessType, overallGrade, overallScore, scores, recommendations, inspectedAt, inspectedPlatforms } = result;

  return (
    <section id="report-card" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="no-print mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-serene-accent">
            Professional Report
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-serene-900">
            Report Card
          </h2>
          <p className="mt-4 text-serene-600">
            Generate a premium inspection deliverable ready to share with clients.
          </p>
          <button
            onClick={onPrint}
            className="mt-8 rounded-lg bg-serene-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-serene-800"
          >
            Print Professional Report Card
          </button>
        </div>

        <div className="printable-report mx-auto mt-12 max-w-3xl rounded-2xl border border-serene-200 bg-white p-12 shadow-sm print:mt-0 print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <div className="border-b border-serene-200 pb-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-serene-400">
                  Serene One
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-serene-900">
                  Platform Health Inspection Report
                </h1>
                <p className="mt-1 text-sm text-serene-500">Executive Audit · Point-in-Time Assessment</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-serene-400">Inspection Date</p>
                <p className="text-sm font-medium text-serene-700">{inspectedAt}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-serene-200 py-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-serene-400">
                  Business
                </p>
                <p className="mt-1 text-lg font-semibold text-serene-900">{businessName}</p>
                <p className="text-sm text-serene-500">{businessType}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-serene-400">
                  Platforms Inspected
                </p>
                <p className="mt-1 text-sm text-serene-700">
                  {inspectedPlatforms.length > 0
                    ? inspectedPlatforms.join(', ')
                    : 'General web presence assessment'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-serene-200 py-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-serene-400">
              Overall Platform Health Grade
            </p>
            <p className={`mt-3 text-8xl font-semibold tracking-tight ${getGradeColor(overallGrade)}`}>
              {overallGrade}
            </p>
            <p className="mt-2 text-sm text-serene-500">Composite Score: {overallScore} / 100</p>
          </div>

          <div className="border-b border-serene-200 py-8">
            <p className="mb-6 text-xs font-medium uppercase tracking-widest text-serene-400">
              Score Breakdown
            </p>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between border-b border-serene-100 pb-2">
                  <span className="text-sm text-serene-600">{SCORE_LABELS[key]}</span>
                  <span className="text-sm font-semibold text-serene-900">{Math.round(value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-8">
            <p className="mb-6 text-xs font-medium uppercase tracking-widest text-serene-400">
              Professional Recommendations
            </p>
            <div className="space-y-5">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-serene-100 text-xs font-semibold text-serene-600">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-serene-900">{rec.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getPriorityStyle(rec.priority)}`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-serene-600">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-serene-200 pt-8">
            <p className="text-xs leading-relaxed text-serene-400">
              This report was generated by Serene One as a point-in-time inspection of publicly
              visible platform presence. Findings are intended to support strategic marketing and
              brand improvement conversations. Serene One · serene.one
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
