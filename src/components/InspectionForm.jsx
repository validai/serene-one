import { useCallback, useState } from 'react';
import { PLATFORMS, BUSINESS_TYPES, createEvidenceFromUpload } from '../models/inspection';

export default function InspectionForm({ onRunInspection, isRunning }) {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Local Business');
  const [uploads, setUploads] = useState({});
  const [dragOver, setDragOver] = useState(null);

  const handleFile = useCallback((platform, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    setUploads((prev) => ({
      ...prev,
      [platform]: { file, preview },
    }));
  }, []);

  const handleDrop = useCallback(
    (platform, e) => {
      e.preventDefault();
      setDragOver(null);
      const file = e.dataTransfer.files[0];
      handleFile(platform, file);
    },
    [handleFile]
  );

  const removeUpload = (platform) => {
    setUploads((prev) => {
      const next = { ...prev };
      if (next[platform]?.preview) URL.revokeObjectURL(next[platform].preview);
      delete next[platform];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunInspection({
      businessName,
      businessType,
      evidence: Object.entries(uploads).map(([platform, { file }]) =>
        createEvidenceFromUpload(platform, file)
      ),
    });
  };

  const evidenceCount = Object.keys(uploads).length;

  return (
    <section id="intake" className="no-print py-10 sm:py-14">
      <div className="section-container">
        <div className="max-w-2xl">
          <h1 className="section-title">Create Report Card</h1>
          <p className="section-subtitle">
            Enter client details, attach platform evidence, and generate a point-in-time
            Digital Presence Report Card.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 sm:mt-12">
          <div className="border border-serene-border bg-white">
            <div className="border-b border-serene-border bg-serene-blue-soft/40 px-6 py-4 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-serene-blue">
                Client Intake
              </p>
              <p className="mt-1 text-sm text-serene-slate">
                All fields required before running a grade inspection
              </p>
            </div>

            <div className="space-y-10 px-6 py-8 sm:space-y-12 sm:px-8 sm:py-10">
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-3 block text-xs font-semibold uppercase tracking-wider text-serene-slate"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Legal or trade name of the client business"
                  className="w-full border border-serene-border px-4 py-3.5 text-sm text-serene-navy placeholder:text-serene-muted focus:border-serene-blue focus:outline-none focus:ring-2 focus:ring-serene-blue/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="businessType"
                  className="mb-3 block text-xs font-semibold uppercase tracking-wider text-serene-slate"
                >
                  Business Classification
                </label>
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full border border-serene-border bg-white px-4 py-3.5 text-sm text-serene-navy focus:border-serene-blue focus:outline-none focus:ring-2 focus:ring-serene-blue/20"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-serene-slate">
                      Platform Evidence
                    </p>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-serene-slate">
                      Upload screenshots for each platform to include in the client report
                      card. Serene One grades only submitted evidence.
                    </p>
                  </div>
                  {evidenceCount > 0 && (
                    <p className="shrink-0 text-sm font-medium text-serene-slate">
                      {evidenceCount} file{evidenceCount !== 1 ? 's' : ''} attached
                    </p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {PLATFORMS.map((platform) => (
                    <div
                      key={platform}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(platform);
                      }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => handleDrop(platform, e)}
                      className={`border p-4 transition-colors sm:p-5 ${
                        dragOver === platform
                          ? 'border-serene-blue bg-serene-blue-soft'
                          : uploads[platform]
                            ? 'border-serene-blue/40 bg-serene-blue-soft/50'
                            : 'border-dashed border-serene-border bg-white hover:border-serene-blue/50'
                      }`}
                    >
                      <p className="text-sm font-medium text-serene-navy">{platform}</p>
                      {uploads[platform] ? (
                        <div className="mt-3 flex items-center gap-3">
                          <img
                            src={uploads[platform].preview}
                            alt={platform}
                            className="h-11 w-11 border border-serene-200 object-cover"
                          />
                          <span className="flex-1 truncate text-sm text-serene-slate">
                            Evidence on file
                          </span>
                          <button
                            type="button"
                            onClick={() => removeUpload(platform)}
                            className="text-sm text-serene-muted underline-offset-2 hover:text-serene-blue hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="mt-3 block cursor-pointer">
                          <span className="text-sm text-serene-muted">
                            Drop screenshot or click to attach
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(platform, e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-serene-border px-6 py-6 sm:px-8 sm:py-8">
              <button
                type="submit"
                disabled={isRunning}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRunning ? 'Running Grade Inspection…' : 'Run Grade Inspection'}
              </button>
              <p className="helper-text mt-4 text-center">
                Run Grade Inspection generates a point-in-time report from the evidence
                submitted above.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
