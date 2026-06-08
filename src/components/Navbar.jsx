export default function Navbar({ onStartInspection }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="no-print sticky top-0 z-50 border-b border-serene-200 bg-white/95 backdrop-blur-sm">
      <div className="section-container flex h-14 items-center justify-between sm:h-16">
        <div className="flex items-center gap-6 sm:gap-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-left"
          >
            <span className="block font-serif text-base font-medium tracking-tight text-serene-900 sm:text-lg">
              Serene One
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest text-serene-400 sm:block">
              Inspection Services
            </span>
          </button>
          <div className="hidden items-center gap-7 md:flex">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-serene-500 transition-colors hover:text-serene-900"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('why-this-matters')}
              className="text-sm text-serene-500 transition-colors hover:text-serene-900"
            >
              Why It Matters
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-sm text-serene-500 transition-colors hover:text-serene-900"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('report-card')}
              className="text-sm text-serene-500 transition-colors hover:text-serene-900"
            >
              Reports
            </button>
          </div>
        </div>
        <button
          onClick={onStartInspection}
          className="rounded-md bg-serene-900 px-4 py-2 text-xs font-medium tracking-wide text-white transition-colors hover:bg-serene-800 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Request Inspection
        </button>
      </div>
    </nav>
  );
}
