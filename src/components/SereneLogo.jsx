const COLORS = {
  navy: '#0f172a',
  blue: '#2563eb',
  softBlue: '#dbeafe',
};

function LogoMark({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="24" cy="24" r="23" fill={COLORS.softBlue} />
      <circle
        cx="24"
        cy="24"
        r="23"
        stroke={COLORS.blue}
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <circle
        cx="24"
        cy="24"
        r="16.5"
        stroke={COLORS.navy}
        strokeOpacity="0.08"
        strokeWidth="1"
      />
      <path
        d="M31.5 14.5C25.5 14.5 20.5 17.5 20.5 22C20.5 24.5 22.5 26.5 25.5 26.5C29.5 26.5 32 29.5 32 33.5C32 38 27.5 41.5 21.5 41.5"
        stroke={COLORS.blue}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 22.5C22 22.5 26 22.5 29.5 22.5"
        stroke={COLORS.navy}
        strokeOpacity="0.18"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M27.5 33.5L30 36.25L35.25 29.75"
        stroke={COLORS.navy}
        strokeOpacity="0.62"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SereneLogo({
  size = 36,
  showText = true,
  className = '',
  textClassName = '',
  sublabel = '',
  sublabelClassName = '',
  variant = 'default',
  align = 'left',
}) {
  const isReport = variant === 'report';
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-center text-left';

  const titleClass = isReport
    ? `font-serif text-[1.05rem] font-semibold tracking-[0.08em] sm:text-lg ${textClassName}`
    : `font-serif text-xl font-medium tracking-tight sm:text-[1.65rem] ${textClassName}`;

  const defaultSublabelClass = isReport
    ? 'text-[10px] font-semibold uppercase tracking-[0.18em] text-serene-blue'
    : 'text-[11px] font-medium uppercase tracking-[0.14em] text-serene-muted';

  return (
    <div className={`inline-flex gap-3 ${alignment} ${className}`}>
      <LogoMark
        size={size}
        className="shrink-0 drop-shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
      />
      {showText && (
        <div className={align === 'center' ? 'text-center' : 'min-w-0'}>
          <span
            className={`block text-serene-navy ${titleClass}`}
            style={{ color: COLORS.navy }}
          >
            Serene One
          </span>
          {sublabel ? (
            <span className={`mt-0.5 block ${defaultSublabelClass} ${sublabelClassName}`}>
              {sublabel}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export { LogoMark };
