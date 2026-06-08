import { getGradeColors } from '../lib/gradeColors';
import SereneLogo from './SereneLogo';

function GradeBadge({ grade, className = '' }) {
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

function OpportunityGroup({ title, items, accentLetter }) {
  const colors = getGradeColors(accentLetter);

  if (items.length === 0) return null;

  return (
    <div
      className="report-card-opportunity-group"
      style={{ borderColor: colors.border, backgroundColor: `${colors.bg}88` }}
    >
      <h4 className="report-card-opportunity-group-title" style={{ color: colors.text }}>
        {title}
      </h4>
      <ul className="report-card-opportunity-list">
        {items.map((item, i) => (
          <li key={i}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PrintableReport({ result, onPrint, onNewReport, saveNotice = '' }) {
  if (!result) return null;

  const { canPrintReport, reportMessage, reportCard, businessName, overallGrade } = result;
  const gradeColors = overallGrade ? getGradeColors(overallGrade) : null;

  return (
    <section id="report-card" className="page-section surface-muted">
      <div className="section-container">
        <div className="no-print">
          <p className="section-label">Active Report</p>
          <h2 className="section-title mt-3">Digital Presence Report Card</h2>
          <p className="section-subtitle">
            Review and print the current inspection report card.
          </p>

          <div className="admin-card mt-10 max-w-3xl">
            <div className="admin-card-body">
              {canPrintReport && businessName && gradeColors && (
                <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-serene-border pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-serene-muted">
                      Client
                    </p>
                    <p className="mt-1 text-lg font-medium text-serene-navy">{businessName}</p>
                  </div>
                  <span
                    className="grade-chip"
                    style={{
                      backgroundColor: gradeColors.bg,
                      color: gradeColors.text,
                      border: `1px solid ${gradeColors.border}`,
                    }}
                  >
                    {overallGrade}
                  </span>
                </div>
              )}

              {!canPrintReport ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                  {reportMessage}
                </div>
              ) : (
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={onPrint} className="btn-primary">
                      Print Report Card
                    </button>
                    <button type="button" onClick={onNewReport} className="btn-secondary">
                      New Report
                    </button>
                  </div>
                  {saveNotice && (
                    <span
                      className={
                        saveNotice === 'Matching report already saved.'
                          ? 'inline-flex items-center gap-2 rounded-full border border-serene-border bg-serene-50 px-3.5 py-1.5 text-sm font-medium text-serene-slate shadow-sm'
                          : 'success-badge'
                      }
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          saveNotice === 'Matching report already saved.'
                            ? 'bg-serene-blue'
                            : 'bg-emerald-500'
                        }`}
                      />
                      {saveNotice}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {canPrintReport && reportCard && (
          <div className="printable-report report-card-document mx-auto mt-12 max-w-[8.5in] shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:mt-14">
            <header className="report-card-section report-card-header text-center">
              <div className="report-card-logo-wrap">
                <SereneLogo
                  size={42}
                  showText
                  variant="report"
                  align="center"
                  sublabel="Digital Presence Inspection"
                  className="mx-auto justify-center"
                />
              </div>
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

            {reportCard.executiveSummary && (
              <div className="report-card-section report-card-executive-summary">
                <h2 className="report-card-section-heading">Executive Summary</h2>
                <div className="report-card-executive-content">
                  {reportCard.executiveSummary.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="report-card-section report-card-tables-grid">
              <div>
                <h2 className="report-card-section-heading">Score Summary</h2>
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
                  <h2 className="report-card-section-heading">Platform Inspection</h2>
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

            {reportCard.opportunities && (
              <div className="report-card-section report-card-opportunities">
                <h2 className="report-card-section-heading report-card-opportunities-title">
                  Digital Presence Opportunities
                </h2>
                <div className="report-card-opportunities-grid">
                  <OpportunityGroup
                    title="Visibility Opportunities"
                    items={reportCard.opportunities.visibilityOpportunities}
                    accentLetter="B"
                  />
                  <OpportunityGroup
                    title="Trust Opportunities"
                    items={reportCard.opportunities.trustOpportunities}
                    accentLetter="A"
                  />
                  <OpportunityGroup
                    title="Growth Opportunities"
                    items={reportCard.opportunities.growthOpportunities}
                    accentLetter="C"
                  />
                </div>
              </div>
            )}

            <div className="report-card-section report-card-bottom-compact">
              <div className="report-card-notes-box">
                <h3 className="report-card-section-heading report-card-section-heading-sm">
                  Inspector Notes
                </h3>
                <div className="report-card-notes-content">
                  {reportCard.inspectorNotes.map((note, i) => (
                    <p key={i}>{note}</p>
                  ))}
                </div>
              </div>
              <div className="report-card-scale-box">
                <h3 className="report-card-section-heading report-card-section-heading-sm">
                  Grading Scale
                </h3>
                <ul className="report-card-scale-list">
                  {reportCard.gradingScale.map(({ letter, label }) => {
                    const colors = getGradeColors(letter);
                    return (
                      <li
                        key={letter}
                        style={{
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                        }}
                      >
                        <span
                          className="report-card-scale-badge"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            borderColor: colors.border,
                          }}
                        >
                          {letter}
                        </span>
                        <span className="report-card-scale-label" style={{ color: colors.text }}>
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
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
