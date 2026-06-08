import SereneLogo from './SereneLogo';

export default function Navbar({ onViewReports }) {
  return (
    <nav className="no-print sticky top-0 z-50 border-b border-serene-border bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md">
      <div className="section-container flex h-[4.25rem] items-center justify-between sm:h-[4.75rem]">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group min-w-0 text-left"
        >
          <SereneLogo
            size={36}
            showText
            sublabel="Admin Workspace"
            sublabelClassName="hidden sm:block"
            textClassName="transition-colors group-hover:text-serene-blue"
          />
        </button>
        <button type="button" onClick={onViewReports} className="nav-link shrink-0">
          Reports
        </button>
      </div>
    </nav>
  );
}
