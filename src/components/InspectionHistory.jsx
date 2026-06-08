import { useEffect, useState } from 'react';
import { getInspectionHistory } from '../lib/inspectionHistory';

export default function InspectionHistory({ onLoadReport, refreshKey = 0 }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getInspectionHistory());
  }, [refreshKey]);

  if (history.length === 0) return null;

  return (
    <section className="no-print border-t border-serene-100 py-16 sm:py-20">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="section-label">Inspection Archive</p>
          <h2 className="section-title mt-4">Previous Inspections</h2>
          <p className="section-subtitle">
            Recently completed inspections saved on this device.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-serene-200 text-left">
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-serene-400">
                  Inspection ID
                </th>
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-serene-400">
                  Business Name
                </th>
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-serene-400">
                  Business Type
                </th>
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-serene-400">
                  Date
                </th>
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-serene-400">
                  Grade
                </th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-serene-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id} className="border-b border-serene-100">
                  <td className="py-4 pr-4 font-mono text-xs text-serene-600">
                    {entry.referenceId ?? entry.id.slice(0, 12)}
                  </td>
                  <td className="py-4 pr-4 text-serene-900">{entry.businessName}</td>
                  <td className="py-4 pr-4 text-serene-600">{entry.businessType}</td>
                  <td className="py-4 pr-4 text-serene-600">{entry.inspectedAt}</td>
                  <td className="py-4 pr-4 font-serif text-lg text-serene-900">
                    {entry.overallGrade}
                  </td>
                  <td className="py-4">
                    <button
                      type="button"
                      onClick={() => onLoadReport(entry.result)}
                      className="text-xs font-medium text-serene-700 underline-offset-2 hover:text-serene-900 hover:underline"
                    >
                      Load Report
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
