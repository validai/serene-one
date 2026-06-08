export default function PrintableReport({ result, onPrint }) {
  if (!result) return null;

  const { canPrintReport, reportMessage, reportCard } = result;

  return (
    <section id="report-card" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="no-print max-w-2xl">
          <p className="section-label">Final Deliverable</p>
          <h2 className="section-title mt-4">Digital Presence Report Card</h2>
          <p className="section-subtitle">
            Print a polished, client-ready report card summarizing your inspection results.
          </p>

          {!canPrintReport ? (
            <div className="mt-10 rounded-md border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
              {reportMessage}
            </div>
          ) : (
            <button onClick={onPrint} className="btn-primary mt-10">
              Print Report Card
            </button>
          )}
        </div>

        {canPrintReport && reportCard && (
          <div className="printable-report report-card-document mx-auto mt-14 max-w-[8.5in] sm:mt-16">
            {/* Header */}
            <header className="report-card-section report-card-header text-center">
              <p className="report-card-brand">{reportCard.header.brand}</p>
              <h1 className="report-card-title">{reportCard.header.title}</h1>
              <div className="report-card-accent-line" />
            </header>

            {/* Top fields */}
            <div className="report-card-section report-card-fields">
              <div className="report-card-field-row">
                <span className="report-card-field-label">Business Name</span>
                <span className="report-card-field-value">{reportCard.fields.businessName}</span>
              </div>
              <div className="report-card-field-row">
                <span className="report-card-field-label">Business Type</span>
                <span className="report-card-field-value">{reportCard.fields.businessType}</span>
              </div>
              <div className="report-card-field-row">
                <span className="report-card-field-label">Inspection Date</span>
                <span className="report-card-field-value">{reportCard.fields.inspectionDate}</span>
              </div>
              <div className="report-card-field-row">
                <span className="report-card-field-label">Inspection ID</span>
                <span className="report-card-field-value">{reportCard.fields.inspectionId}</span>
              </div>
              <div className="report-card-field-row">
                <span className="report-card-field-label">Prepared By</span>
                <span className="report-card-field-value">{reportCard.fields.preparedBy}</span>
              </div>
            </div>

            {/* Grading table */}
            <div className="report-card-section">
              <h2 className="report-card-table-heading">Digital Presence Grading</h2>
              <table className="report-card-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {reportCard.gradingTable.map((row) => (
                    <tr key={row.category}>
                      <td>{row.category}</td>
                      <td className="report-card-num">{row.score}</td>
                      <td className="report-card-grade-cell">{row.grade}</td>
                      <td>{row.status}</td>
                      <td>{row.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Platform inspection table */}
            {reportCard.platformTable.length > 0 && (
              <div className="report-card-section">
                <h2 className="report-card-table-heading">Platform Inspection</h2>
                <table className="report-card-table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Grade</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportCard.platformTable.map((row) => (
                      <tr key={row.platform}>
                        <td>{row.platform}</td>
                        <td className="report-card-grade-cell">{row.grade}</td>
                        <td>{row.status}</td>
                        <td>{row.priority}</td>
                        <td>{row.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grading scale + final grade */}
            <div className="report-card-section report-card-bottom-grid">
              <div className="report-card-scale-box">
                <h3 className="report-card-box-heading">Grading Scale</h3>
                <ul className="report-card-scale-list">
                  {reportCard.gradingScale.map(({ letter, label }) => (
                    <li key={letter}>
                      <span className="report-card-scale-letter">{letter}</span>
                      <span>= {label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="report-card-final-grade">
                <p className="report-card-final-label">{reportCard.finalGrade.label}</p>
                <p className="report-card-final-letter">{reportCard.finalGrade.grade}</p>
                <p className="report-card-final-score">
                  Composite Score: {reportCard.finalGrade.score} / 100
                </p>
              </div>
            </div>

            {/* Inspector notes */}
            <div className="report-card-section report-card-notes-box">
              <h3 className="report-card-box-heading">Inspector Notes</h3>
              <div className="report-card-notes-content">
                {reportCard.inspectorNotes.map((note, i) => (
                  <p key={i}>{note}</p>
                ))}
              </div>
            </div>

            {/* Recommended next steps */}
            <div className="report-card-section">
              <h2 className="report-card-table-heading">Recommended Next Steps</h2>
              <ol className="report-card-steps-list">
                {reportCard.recommendedNextSteps.map((step, i) => (
                  <li key={i}>
                    <span className="report-card-step-type">{step.type}</span>
                    <strong>{step.title}</strong>
                    <span> — {step.description}</span>
                  </li>
                ))}
              </ol>
            </div>

            <footer className="report-card-footer">
              <p>
                Prepared by Serene One · Point-in-time digital presence assessment ·
                Confidential · For client use only
              </p>
            </footer>
          </div>
        )}
      </div>
    </section>
  );
}
