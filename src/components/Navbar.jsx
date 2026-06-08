export default function Navbar({ onStartInspection, onViewReports }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="no-print sticky top-0 z-50 border-b border-serene-border bg-white/95 backdrop-blur-sm">
      <div className="section-container flex h-14 items-center justify-between sm:h-16">
        <div className="flex items-center gap-6 sm:gap-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-left"
          >
            <span className="block font-serif text-base font-medium tracking-tight text-serene-navy sm:text-lg">
              Serene One
            </span>
            <span className="hidden text-xs uppercase tracking-widest text-serene-muted sm:block">
              Inspection Services
            </span>
          </button>
          <div className="hidden items-center gap-7 md:flex">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="nav-link"
            >
              Home
            </button>
            <button onClick={() => scrollTo('why-this-matters')} className="nav-link">
              Why It Matters
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="nav-link">
              How It Works
            </button>
            <button onClick={onViewReports} className="nav-link">
              Reports
            </button>
          </div>
        </div>
        <button
          onClick={onStartInspection}
          title="Go to the inspection intake form"
          className="rounded-md bg-serene-blue px-4 py-2 text-xs font-medium tracking-wide text-white transition-colors hover:bg-serene-accent-hover sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Request Inspection
        </button>
      </div>
    </nav>
  );
}
