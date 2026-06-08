export default function Navbar({ onStartInspection }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="no-print sticky top-0 z-50 border-b border-serene-200 bg-white/90 backdrop-blur-md">
      <div className="section-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lg font-semibold tracking-tight text-serene-900"
          >
            Serene One
          </button>
          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-serene-600 transition-colors hover:text-serene-900"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-sm text-serene-600 transition-colors hover:text-serene-900"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('report-card')}
              className="text-sm text-serene-600 transition-colors hover:text-serene-900"
            >
              Reports
            </button>
          </div>
        </div>
        <button
          onClick={onStartInspection}
          className="rounded-lg bg-serene-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-serene-800"
        >
          Start Inspection
        </button>
      </div>
    </nav>
  );
}
