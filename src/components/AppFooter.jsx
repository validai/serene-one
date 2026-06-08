export default function AppFooter() {
  return (
    <footer className="app-footer no-print">
      <div className="section-container py-10 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-lg font-medium text-serene-navy">Made by Valid</p>
            <p className="helper-text mt-2 max-w-md">
              Digital Presence Report Card Builder · Local reports saved on this device · Version
              1.0
            </p>
          </div>
          <p className="text-sm font-medium text-serene-slate sm:text-right">
            Serene One · Report Builder · v1.0
          </p>
        </div>
        <p className="helper-text mt-6 border-t border-serene-border pt-6 text-xs">
          Client-side report archive. No connected platform data is stored on a server in this MVP.
        </p>
      </div>
    </footer>
  );
}
