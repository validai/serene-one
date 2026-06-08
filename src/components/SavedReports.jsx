import { useEffect, useState } from 'react';
import { getInspectionHistory } from '../lib/inspectionHistory';
import { getGradeColors } from '../lib/gradeColors';

export default function SavedReports({ onViewReport, refreshKey = 0 }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getInspectionHistory());
  }, [refreshKey]);

  return (
    <section id="saved-reports" className="no-print border-t border-serene-border py-16 sm:py-20">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="section-label">Report Archive</p>
          <h2 className="section-title mt-4">Saved Reports</h2>
          <p className="section-subtitle">
            Previously completed inspection reports saved on this device.
          </p>
        </div>

        {history.length === 0 ? (
          <p className="helper-text mt-10">
            No saved reports yet. Complete an inspection with uploaded evidence to save a
            report here.
          </p>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-serene-border text-left">
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-serene-slate">
                    Inspection ID
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-serene-slate">
                    Business
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-serene-slate">
                    Type
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-serene-slate">
                    Date
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-serene-slate">
                    Grade
                  </th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-serene-slate">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => {
                  const colors = getGradeColors(entry.overallGrade);
                  return (
                    <tr key={entry.id} className="border-b border-serene-border">
                      <td className="py-4 pr-4 font-mono text-xs text-serene-slate">
                        {entry.referenceId ?? entry.id.slice(0, 12)}
                      </td>
                      <td className="py-4 pr-4 font-medium text-serene-navy">
                        {entry.businessName}
                      </td>
                      <td className="py-4 pr-4 text-serene-slate">{entry.businessType}</td>
                      <td className="py-4 pr-4 text-serene-slate">{entry.inspectedAt}</td>
                      <td className="py-4 pr-4">
                        <span
                          className="inline-flex min-w-[2.5rem] items-center justify-center rounded px-2 py-0.5 font-serif text-sm font-medium"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {entry.overallGrade}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => onViewReport(entry.result)}
                          className="btn-link"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
