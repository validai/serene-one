import { useCallback, useState } from 'react';
import { PLATFORMS, BUSINESS_TYPES } from '../models/inspection';

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
      uploadedPlatforms: Object.keys(uploads),
    });
  };

  const evidenceCount = Object.keys(uploads).length;

  return (
    <section id="how-it-works" className="no-print py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="section-label">Begin Your Inspection</p>
          <h2 className="section-title mt-4">Submit Business Details & Evidence</h2>
          <p className="section-subtitle">
            Provide the subject business information and platform evidence for review. Our
            inspection team will assess each submitted channel against established presence
            standards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-14 sm:mt-16 lg:mt-20">
          <div className="border border-serene-200 bg-white">
            <div className="border-b border-serene-100 bg-serene-50 px-6 py-4 sm:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-serene-400">
                Inspection Intake Form
              </p>
              <p className="mt-1 text-xs text-serene-500">
                All fields required for a complete assessment
              </p>
            </div>

            <div className="space-y-10 px-6 py-8 sm:space-y-12 sm:px-8 sm:py-10">
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-serene-500"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Legal or trade name of the subject business"
                  className="w-full border border-serene-200 px-4 py-3.5 text-sm text-serene-900 placeholder:text-serene-400 focus:border-serene-700 focus:outline-none focus:ring-1 focus:ring-serene-700/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="businessType"
                  className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-serene-500"
                >
                  Business Classification
                </label>
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full border border-serene-200 bg-white px-4 py-3.5 text-sm text-serene-900 focus:border-serene-700 focus:outline-none focus:ring-1 focus:ring-serene-700/20"
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
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-serene-500">
                      Inspection Evidence
                    </p>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-serene-500">
                      Upload screenshots of each platform profile to be reviewed. Evidence
                      supports accurate grading across visibility, trust, and consistency
                      indicators.
                    </p>
                  </div>
                  {evidenceCount > 0 && (
                    <p className="shrink-0 text-xs font-medium text-serene-600">
                      {evidenceCount} file{evidenceCount !== 1 ? 's' : ''} submitted
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
                          ? 'border-serene-700 bg-serene-50'
                          : uploads[platform]
                            ? 'border-serene-300 bg-serene-50/60'
                            : 'border-dashed border-serene-200 bg-white hover:border-serene-300'
                      }`}
                    >
                      <p className="text-xs font-medium text-serene-800">{platform}</p>
                      {uploads[platform] ? (
                        <div className="mt-3 flex items-center gap-3">
                          <img
                            src={uploads[platform].preview}
                            alt={platform}
                            className="h-11 w-11 border border-serene-200 object-cover"
                          />
                          <span className="flex-1 truncate text-xs text-serene-600">
                            Evidence on file
                          </span>
                          <button
                            type="button"
                            onClick={() => removeUpload(platform)}
                            className="text-xs text-serene-400 underline-offset-2 hover:text-serene-700 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="mt-3 block cursor-pointer">
                          <span className="text-xs text-serene-400">
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

            <div className="border-t border-serene-100 px-6 py-6 sm:px-8 sm:py-8">
              <button
                type="submit"
                disabled={isRunning}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRunning ? 'Conducting Inspection…' : 'Run Grade Inspection'}
              </button>
              <p className="mt-4 text-center text-[11px] text-serene-400">
                Results generated via Serene One inspection methodology · Not a live audit
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
