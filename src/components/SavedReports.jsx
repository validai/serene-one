import { useEffect, useMemo, useState } from 'react';
import {
  cleanUpDuplicateReports,
  deleteAllInspections,
  deleteInspectionById,
  getInspectionHistory,
} from '../lib/inspectionHistory';
import { getGradeColors } from '../lib/gradeColors';

function GradeChip({ grade }) {
  const colors = getGradeColors(grade);

  return (
    <span
      className="grade-chip"
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
  const [archiveMessage, setArchiveMessage] = useState('');

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
    setArchiveMessage('');
  };

  const handleCleanUpDuplicates = () => {
    const { removedCount } = cleanUpDuplicateReports();
    loadHistory();
    if (removedCount > 0) {
      setArchiveMessage('Duplicate reports cleaned up.');
    } else {
      setArchiveMessage('No duplicate reports found.');
    }
  };

  return (
    <section id="saved-reports" className="no-print page-section border-t border-serene-border">
      <div className="section-container">
        <div className="max-w-3xl">
          <p className="section-label">Report Archive</p>
          <h2 className="section-title mt-3">Saved Reports</h2>
          <p className="section-subtitle">
            Previously completed report cards saved on this device.
          </p>
          <p className="helper-text mt-3">Saved reports are stored locally on this device.</p>
          <p className="helper-text mt-1 text-xs">
            These reports are saved in this browser only.
          </p>
        </div>

        {history.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-md">
              <label
                htmlFor="savedReportsSearch"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-serene-slate"
              >
                Search Reports
              </label>
              <input
                id="savedReportsSearch"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by business, type, grade, or ID"
                className="admin-search"
              />
            </div>
            <div className="flex flex-wrap gap-2 self-start">
              <button type="button" onClick={handleCleanUpDuplicates} className="btn-secondary">
                Clean Up Duplicates
              </button>
              <button type="button" onClick={handleClearAll} className="btn-ghost-danger">
                Clear All Reports
              </button>
            </div>
          </div>
        )}

        {archiveMessage && (
          <p className="helper-text mt-4 rounded-lg border border-serene-border bg-serene-50 px-4 py-3 text-sm text-serene-navy">
            {archiveMessage}
          </p>
        )}

        {history.length === 0 ? (
          <div className="empty-state mt-10">
            <p className="text-sm font-medium text-serene-navy">
              No saved reports yet.
            </p>
            <p className="helper-text mt-2">
              Completed report cards will appear here.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-state mt-10">
            <p className="text-sm font-medium text-serene-navy">No matching reports.</p>
            <p className="helper-text mt-2">Try a different search term.</p>
          </div>
        ) : (
          <div className="admin-card mt-8">
            <ul className="divide-y divide-serene-border">
              {filteredHistory.map((entry) => (
                <li key={entry.id} className="archive-row">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="truncate text-base font-semibold text-serene-navy">
                        {entry.businessName}
                      </h3>
                      <GradeChip grade={entry.overallGrade} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-serene-slate">
                      <span>{entry.businessType}</span>
                      <span>{entry.inspectedAt}</span>
                      <span className="font-mono text-xs text-serene-muted">
                        {entry.referenceId ?? entry.id.slice(0, 12)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                    <button type="button" onClick={() => onViewReport(entry.result)} className="btn-link">
                      View Report
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOne(entry)}
                      className="btn-ghost-danger"
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
