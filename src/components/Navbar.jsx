export default function Navbar({ onViewReports }) {
  return (
    <nav className="no-print sticky top-0 z-50 border-b border-serene-border bg-white/95 backdrop-blur-sm">
      <div className="section-container flex h-16 items-center justify-between sm:h-[4.5rem]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-serif text-2xl font-medium tracking-tight text-serene-navy sm:text-3xl"
        >
          Serene One
        </button>
        <button onClick={onViewReports} className="nav-link text-sm sm:text-base">
          Reports
        </button>
      </div>
    </nav>
  );
}
