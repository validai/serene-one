import { useCallback, useState } from 'react';
import { PLATFORMS } from '../lib/gradingEngine';

const BUSINESS_TYPES = [
  'Local Business',
  'Restaurant',
  'Realtor',
  'Service Business',
  'Creator / Artist',
];

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

  return (
    <section id="how-it-works" className="no-print py-20 lg:py-28">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-serene-accent">
            Run Inspection
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-serene-900">
            Inspect Your Online Presence
          </h2>
          <p className="mt-4 text-serene-600">
            Enter your business details and upload platform screenshots for a point-in-time
            health inspection.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-14 max-w-3xl">
          <div className="rounded-2xl border border-serene-200 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2 block text-sm font-medium text-serene-700"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Serene Realty Group"
                  className="w-full rounded-lg border border-serene-200 px-4 py-3 text-sm text-serene-900 placeholder:text-serene-400 focus:border-serene-accent focus:outline-none focus:ring-2 focus:ring-serene-accent/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="businessType"
                  className="mb-2 block text-sm font-medium text-serene-700"
                >
                  Business Type
                </label>
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full rounded-lg border border-serene-200 bg-white px-4 py-3 text-sm text-serene-900 focus:border-serene-accent focus:outline-none focus:ring-2 focus:ring-serene-accent/20"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-serene-700">
                  Screenshot Upload
                </p>
                <p className="mb-4 text-xs text-serene-500">
                  Drag and drop screenshots for each platform you want inspected.
                </p>
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
                      className={`relative rounded-lg border-2 border-dashed p-4 transition-colors ${
                        dragOver === platform
                          ? 'border-serene-accent bg-serene-50'
                          : uploads[platform]
                            ? 'border-emerald-300 bg-emerald-50/50'
                            : 'border-serene-200 bg-serene-50/50 hover:border-serene-300'
                      }`}
                    >
                      <p className="text-xs font-medium text-serene-700">{platform}</p>
                      {uploads[platform] ? (
                        <div className="mt-2 flex items-center gap-2">
                          <img
                            src={uploads[platform].preview}
                            alt={platform}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <span className="flex-1 truncate text-xs text-emerald-700">
                            Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => removeUpload(platform)}
                            className="text-xs text-serene-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="mt-2 block cursor-pointer">
                          <span className="text-xs text-serene-500">
                            Drop image or click to upload
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

            <button
              type="submit"
              disabled={isRunning}
              className="mt-8 w-full rounded-lg bg-serene-900 py-3.5 text-sm font-medium text-white transition-colors hover:bg-serene-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRunning ? 'Running Inspection…' : 'Run Grade Inspection'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
