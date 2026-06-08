import { useEffect, useState } from 'react';
import { getInspectionHistory } from '../lib/inspectionHistory';

export default function InspectionHistory({ onLoadReport, refreshKey = 0 }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getInspectionHistory());
  }, [refreshKey]);

  if (history.length === 0) return null;

  return (
    <section className="no-print border-t border-serene-border py-16 sm:py-20">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="section-label">Inspection Archive</p>
          <h2 className="section-title mt-4">Saved Inspection Reports</h2>
          <p className="section-subtitle">
            Previously completed inspections saved on this device.
          </p>
        </div>

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
              {history.map((entry) => (
                <tr key={entry.id} className="border-b border-serene-border">
                  <td className="py-4 pr-4 font-mono text-xs text-serene-slate">
                    {entry.referenceId ?? entry.id.slice(0, 12)}
                  </td>
                  <td className="py-4 pr-4 font-medium text-serene-navy">{entry.businessName}</td>
                  <td className="py-4 pr-4 text-serene-slate">{entry.businessType}</td>
                  <td className="py-4 pr-4 text-serene-slate">{entry.inspectedAt}</td>
                  <td className="py-4 pr-4 font-serif text-lg text-serene-navy">
                    {entry.overallGrade}
                  </td>
                  <td className="py-4">
                    <button
                      type="button"
                      onClick={() => onLoadReport(entry.result)}
                      className="btn-link"
                    >
                      View Saved Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
