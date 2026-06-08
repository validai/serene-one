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
    <section id="intake" className="no-print page-section">
      <div className="section-container">
        <div className="max-w-3xl">
          <p className="section-label">Report Builder</p>
          <h1 className="section-title mt-3">Create Report Card</h1>
          <p className="section-subtitle">
            Attach client platform evidence and generate a polished Digital Presence Report Card.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 sm:mt-12">
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-serene-blue">
                    Client Intake
                  </p>
                  <p className="mt-1.5 text-sm text-serene-slate">
                    All fields required before creating a report card.
                  </p>
                </div>
                {evidenceCount > 0 && (
                  <span className="count-badge">
                    {evidenceCount} file{evidenceCount !== 1 ? 's' : ''} attached
                  </span>
                )}
              </div>
            </div>

            <div className="admin-card-body space-y-10 sm:space-y-12">
              <div className="grid gap-8 sm:grid-cols-2">
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
                    className="admin-input"
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
                    className="admin-input"
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-serene-slate">
                      Platform Evidence
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-serene-slate">
                      Upload screenshots for each platform to include in the client report card.
                      Serene One grades only submitted evidence.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {PLATFORMS.map((platform) => {
                    const isUploaded = Boolean(uploads[platform]);
                    const isDragging = dragOver === platform;

                    return (
                      <div
                        key={platform}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(platform);
                        }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => handleDrop(platform, e)}
                        className={`upload-tile ${
                          isDragging
                            ? 'upload-tile-drag'
                            : isUploaded
                              ? 'upload-tile-active'
                              : 'upload-tile-empty'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-serene-navy">{platform}</p>
                          {isUploaded && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                              Ready
                            </span>
                          )}
                        </div>
                        {isUploaded ? (
                          <div className="mt-4 flex items-center gap-3 rounded-lg border border-serene-border bg-serene-50/80 p-2.5">
                            <img
                              src={uploads[platform].preview}
                              alt={platform}
                              className="h-12 w-12 rounded-md border border-serene-200 object-cover shadow-sm"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-serene-navy">
                                {uploads[platform].file.name}
                              </p>
                              <p className="text-xs text-serene-muted">Evidence attached</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeUpload(platform)}
                              className="btn-ghost-danger shrink-0 px-2 py-1 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="mt-4 block cursor-pointer rounded-lg border border-dashed border-serene-border bg-white px-3 py-4 text-center transition hover:border-serene-blue/40 hover:bg-serene-50/60">
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
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="admin-card-footer">
              <button type="submit" disabled={isRunning} className="btn-primary w-full sm:w-auto">
                {isRunning ? 'Creating Report Card…' : 'Create Report Card'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
