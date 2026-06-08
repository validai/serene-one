import GradeCard from './GradeCard';

const MOCK_HERO_RESULT = {
  overallGrade: 'B+',
  scores: {
    visibility: 82,
    trust: 88,
    seo: 76,
  },
};

export default function Hero({ onStartInspection, onViewSample }) {
  return (
    <section className="no-print border-b border-serene-100 py-20 lg:py-28">
      <div className="section-container">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-serene-accent">
              Platform Health Inspection
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-serene-900 sm:text-5xl">
              Know Exactly How Your Business Appears Online
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-serene-600">
              Generate a professional platform health inspection and discover opportunities
              to improve visibility, trust, and customer reach.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={onStartInspection}
                className="rounded-lg bg-serene-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-serene-800"
              >
                Start Inspection
              </button>
              <button
                onClick={onViewSample}
                className="rounded-lg border border-serene-200 bg-white px-6 py-3 text-sm font-medium text-serene-700 transition-colors hover:border-serene-300 hover:bg-serene-50"
              >
                View Sample Report
              </button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <GradeCard result={MOCK_HERO_RESULT} compact className="w-full max-w-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
