export default function Navbar({ onViewReports }) {
  return (
    <nav className="no-print sticky top-0 z-50 border-b border-serene-border bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md">
      <div className="section-container flex h-[4.25rem] items-center justify-between sm:h-[4.75rem]">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-3 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-serene-navy font-serif text-sm font-semibold text-white shadow-sm">
            S1
          </span>
          <span>
            <span className="block font-serif text-2xl font-medium tracking-tight text-serene-navy transition-colors group-hover:text-serene-blue sm:text-[1.65rem]">
              Serene One
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-serene-muted sm:block">
              Admin Workspace
            </span>
          </span>
        </button>
        <button type="button" onClick={onViewReports} className="nav-link">
          Reports
        </button>
      </div>
    </nav>
  );
}
