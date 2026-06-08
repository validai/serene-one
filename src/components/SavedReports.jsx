import { useEffect, useMemo, useState } from 'react';
import {
  deleteAllInspections,
  deleteInspectionById,
  getInspectionHistory,
} from '../lib/inspectionHistory';
import { getGradeColors } from '../lib/gradeColors';

function GradeChip({ grade }) {
  const colors = getGradeColors(grade);

  return (
    <span
      className="inline-flex min-w-[2.75rem] items-center justify-center rounded-md px-2.5 py-1 font-serif text-sm font-semibold"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {grade}
    </span>
  );
}

export default function SavedReports({ onViewReport, refreshKey = 0 }) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = () => {
    setHistory(getInspectionHistory());
  };

  useEffect(() => {
    loadHistory();
  }, [refreshKey]);

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return history;

    return history.filter((entry) => {
      const haystack = [
        entry.businessName,
        entry.businessType,
        entry.referenceId,
        entry.id,
        entry.inspectedAt,
        entry.overallGrade,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [history, searchQuery]);

  const handleDeleteOne = (entry) => {
    if (!window.confirm('Delete this saved report?')) return;
    deleteInspectionById(entry.id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all saved reports from this device?')) return;
    deleteAllInspections();
    loadHistory();
  };

  return (
    <section id="saved-reports" className="no-print border-t border-serene-border py-16 sm:py-20">
      <div className="section-container">
        <div className="max-w-3xl">
          <p className="section-label">Report Archive</p>
          <h2 className="section-title mt-4">Saved Reports</h2>
          <p className="section-subtitle">
            Previously completed report cards saved on this device.
          </p>
          <p className="helper-text mt-3">Saved reports are stored locally on this device.</p>
        </div>

        {history.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-md">
              <label htmlFor="savedReportsSearch" className="sr-only">
                Search reports
              </label>
              <input
                id="savedReportsSearch"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search reports"
                className="w-full rounded-md border border-serene-border bg-white px-4 py-2.5 text-sm text-serene-navy outline-none transition focus:border-serene-blue focus:ring-2 focus:ring-serene-blue/20"
              />
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="btn-secondary self-start sm:self-auto"
            >
              Clear All Reports
            </button>
          </div>
        )}

        {history.length === 0 ? (
          <p className="helper-text mt-10 rounded-md border border-dashed border-serene-border bg-serene-blue-soft/20 px-5 py-6">
            No saved reports yet. Completed report cards will appear here.
          </p>
        ) : filteredHistory.length === 0 ? (
          <p className="helper-text mt-10 rounded-md border border-serene-border bg-white px-5 py-6">
            No saved reports match your search.
          </p>
        ) : (
          <div className="mt-8 overflow-hidden rounded-lg border border-serene-border bg-white">
            <ul className="divide-y divide-serene-border">
              {filteredHistory.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-serene-blue-soft/20 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="truncate font-medium text-serene-navy">
                        {entry.businessName}
                      </h3>
                      <GradeChip grade={entry.overallGrade} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-serene-slate">
                      <span>{entry.businessType}</span>
                      <span>{entry.inspectedAt}</span>
                      <span className="font-mono text-xs">
                        {entry.referenceId ?? entry.id.slice(0, 12)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => onViewReport(entry.result)}
                      className="btn-link"
                    >
                      View Report
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOne(entry)}
                      className="text-sm font-medium text-serene-slate transition hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
