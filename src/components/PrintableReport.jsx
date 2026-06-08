import { getGradeColors, getGradeLetter } from '../lib/gradeColors';

function GradeBadge({ grade, className = '' }) {
  const letter = getGradeLetter(grade);
  const colors = getGradeColors(grade);

  return (
    <span
      className={`report-card-grade-badge ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {grade}
    </span>
  );
}

function StatusChip({ grade }) {
  const colors = getGradeColors(grade);
  return (
    <span
      className="report-card-status-chip"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {colors.label}
    </span>
  );
}

export default function PrintableReport({ result, onPrint, onNewReport }) {
  if (!result) return null;

  const { canPrintReport, reportMessage, reportCard } = result;

  return (
    <section id="report-card" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="no-print max-w-2xl">
          <p className="section-label">Active Report</p>
          <h2 className="section-title mt-4">Digital Presence Report Card</h2>
          <p className="section-subtitle">
            Review and print the current inspection report card.
          </p>

          {!canPrintReport ? (
            <div className="mt-10 rounded-md border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
              {reportMessage}
            </div>
          ) : (
            <div className="mt-10 flex flex-wrap gap-3">
              <button onClick={onPrint} className="btn-primary">
                Print Report Card
              </button>
              <button onClick={onNewReport} className="btn-secondary">
                New Report
              </button>
            </div>
          )}
        </div>

        {canPrintReport && reportCard && (
          <div className="printable-report report-card-document mx-auto mt-14 max-w-[8.5in] sm:mt-16">
            <header className="report-card-section report-card-header text-center">
              <p className="report-card-brand">{reportCard.header.brand}</p>
              <h1 className="report-card-title">{reportCard.header.title}</h1>
              <div className="report-card-accent-line" />
            </header>

            <div className="report-card-section report-card-meta-grid">
              <div className="report-card-meta-item">
                <span className="report-card-field-label">Business Name</span>
                <span className="report-card-field-value">{reportCard.fields.businessName}</span>
              </div>
              <div className="report-card-meta-item">
                <span className="report-card-field-label">Business Type</span>
                <span className="report-card-field-value">{reportCard.fields.businessType}</span>
              </div>
              <div className="report-card-meta-item">
                <span className="report-card-field-label">Inspection Date</span>
                <span className="report-card-field-value">{reportCard.fields.inspectionDate}</span>
              </div>
              <div className="report-card-meta-item">
                <span className="report-card-field-label">Inspection ID</span>
                <span className="report-card-field-value">{reportCard.fields.inspectionId}</span>
              </div>
            </div>

            <div
              className="report-card-section report-card-final-grade report-card-final-grade-panel"
              style={{
                backgroundColor: getGradeColors(reportCard.finalGrade.grade).bg,
                borderColor: getGradeColors(reportCard.finalGrade.grade).border,
              }}
            >
              <p className="report-card-final-label">{reportCard.finalGrade.label}</p>
              <p
                className="report-card-final-letter"
                style={{ color: getGradeColors(reportCard.finalGrade.grade).text }}
              >
                {reportCard.finalGrade.grade}
              </p>
              <p className="report-card-final-score">
                {reportCard.finalGrade.status} · Score {reportCard.finalGrade.score} / 100
              </p>
            </div>

            <div className="report-card-section report-card-tables-grid">
              <div>
                <h2 className="report-card-table-heading">Score Summary</h2>
                <table className="report-card-table report-card-table-compact">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportCard.gradingTable.map((row) => (
                      <tr key={row.category}>
                        <td>{row.category}</td>
                        <td className="report-card-num">{row.score}</td>
                        <td>
                          <GradeBadge grade={row.grade} />
                        </td>
                        <td>
                          <StatusChip grade={row.grade} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reportCard.platformTable.length > 0 && (
                <div>
                  <h2 className="report-card-table-heading">Platform Inspection</h2>
                  <table className="report-card-table report-card-table-compact">
                    <thead>
                      <tr>
                        <th>Platform</th>
                        <th>Grade</th>
                        <th>Priority</th>
                        <th>Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportCard.platformTable.map((row) => (
                        <tr key={row.platform}>
                          <td>{row.platform}</td>
                          <td>
                            <GradeBadge grade={row.grade} />
                          </td>
                          <td>{row.priority}</td>
                          <td className="report-card-rec-cell">{row.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="report-card-section report-card-bottom-compact">
              <div className="report-card-scale-box">
                <h3 className="report-card-box-heading">Grading Scale</h3>
                <ul className="report-card-scale-list">
                  {reportCard.gradingScale.map(({ letter, label }) => {
                    const colors = getGradeColors(letter);
                    return (
                      <li key={letter}>
                        <span
                          className="report-card-scale-letter report-card-scale-badge"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            borderColor: colors.border,
                          }}
                        >
                          {letter}
                        </span>
                        <span>= {label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="report-card-notes-box">
                <h3 className="report-card-box-heading">Inspector Notes</h3>
                <div className="report-card-notes-content">
                  {reportCard.inspectorNotes.map((note, i) => (
                    <p key={i}>{note}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="report-card-section report-card-steps-section">
              <h2 className="report-card-table-heading">Recommended Next Steps</h2>
              <ul className="report-card-steps-list">
                {reportCard.recommendedNextSteps.map((step, i) => (
                  <li key={i}>
                    <span className="report-card-step-type">{step.type}</span>
                    {step.text}
                  </li>
                ))}
              </ul>
            </div>

            <footer className="report-card-footer">
              <p>Prepared by Serene One · Confidential · For client use only</p>
            </footer>
          </div>
        )}
      </div>
    </section>
  );
}
