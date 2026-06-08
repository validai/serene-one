import GradeCard from './GradeCard';

const MOCK_HERO_RESULT = {
  businessName: 'Sample Business Co.',
  overallGrade: 'B+',
  scores: {
    visibility: 82,
    trust: 88,
    seo: 76,
  },
};

const CREDIBILITY_ITEMS = [
  'Point-in-time methodology',
  'Executive-grade deliverables',
  'Client-ready report cards',
];

export default function Hero({ onStartInspection, onViewSample }) {
  return (
    <section className="no-print border-b border-serene-border py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          <div className="max-w-xl lg:pt-4">
            <p className="section-label">Independent Platform Inspection</p>
            <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.15] tracking-tight text-serene-900 sm:text-5xl lg:text-[3.25rem]">
              A Clear Picture of How Your Business Is Perceived Online
            </h1>
            <p className="section-subtitle">
              Serene One conducts structured platform health inspections — the same kind of
              assessment agencies and consultants deliver to clients — so you understand exactly
              where your digital presence stands today.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="flex flex-col gap-2">
                <button onClick={onStartInspection} className="btn-primary">
                  Request Inspection
                </button>
                <p className="helper-text">
                  Request Inspection takes you to the intake form.
                </p>
              </div>
              <button onClick={onViewSample} className="btn-secondary self-start">
                View Sample Report
              </button>
            </div>

            <div className="mt-10 border-t border-serene-100 pt-8">
              <div className="credibility-strip">
                {CREDIBILITY_ITEMS.map((item) => (
                  <span key={item} className="credibility-item">
                    <span className="credibility-dot" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end lg:pt-2">
            <div className="w-full max-w-md">
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-serene-blue lg:text-right">
                Sample Inspection Report
              </p>
              <GradeCard result={MOCK_HERO_RESULT} compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
