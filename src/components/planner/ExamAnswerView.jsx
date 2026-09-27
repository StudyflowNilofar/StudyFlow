import React from 'react'
import {
  Award,
  Clock,
  Copy,
  Bookmark
} from 'lucide-react'

function ExamAnswerView({ topic, topicData, onCopyNotice }) {
  const currentTopic = topic || topicData || {}
  const examAnswer = currentTopic.examAnswer || { question: '', marks: 10, targetTimeMinutes: 15, sections: [] }

  const handleCopy = () => {
    // Copy summary text to clipboard if supported, and trigger notice
    const textToCopy = `${examAnswer.question}\n\n` +
      examAnswer.sections
        .map((s) => `${s.heading}\n${s.content || ''}`)
        .join('\n\n')

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {})
    }
    if (onCopyNotice) {
      onCopyNotice('Exam-ready answer points copied to clipboard!')
    }
  }

  const handleBookmark = () => {
    if (onCopyNotice) {
      onCopyNotice('Answer saved to your "Important Exam Questions" repository.')
    }
  }

  return (
    <div className="planner-tab-view exam-answer-view">
      {/* 1. Exam Question Header Card */}
      <div className="planner-card exam-header-card">
        <div className="exam-header-top">
          <div className="exam-format-badge">
            <Award size={14} />
            <span>{examAnswer.format}</span>
          </div>
          <div className="exam-time-pill">
            <Clock size={13} />
            <span>{examAnswer.timeAllocation}</span>
          </div>
        </div>

        <h3 className="exam-question-title">Q: {examAnswer.question}</h3>

        <div className="exam-actions-toolbar">
          <button
            type="button"
            className="exam-action-btn primary"
            onClick={handleCopy}
            title="Copy answer notes"
          >
            <Copy size={14} />
            <span>Copy Exam Points</span>
          </button>

          <button
            type="button"
            className="exam-action-btn"
            onClick={handleBookmark}
            title="Save for quick revision"
          >
            <Bookmark size={14} />
            <span>Save to Revision List</span>
          </button>
        </div>
      </div>

      {/* 2. Structured Answer Breakdown Sections */}
      <div className="exam-sections-container">
        {examAnswer.sections.map((section, idx) => (
          <div key={idx} className="planner-card exam-section-card">
            <div className="section-card-header">
              <span className="section-number-pill">{idx + 1}</span>
              <h4 className="section-heading">{section.heading}</h4>
            </div>

            {section.content && (
              <div className="section-body-text">
                {section.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            )}

            {section.isTable && section.tableRows && (
              <div className="exam-table-wrapper">
                <table className="exam-summary-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Quality Assurance (QA)</th>
                      <th>Quality Control (QC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.tableRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="row-param"><strong>{row.param}</strong></td>
                        <td className="row-qa">{row.qa}</td>
                        <td className="row-qc">{row.qc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExamAnswerView
