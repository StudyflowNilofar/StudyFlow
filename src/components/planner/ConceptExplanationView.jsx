import React from 'react'
import {
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Lightbulb
} from 'lucide-react'

function ConceptExplanationView({ topic, topicData }) {
  const currentTopic = topic || topicData || {}
  const concept = currentTopic.concept || {}
  const textbook = currentTopic.textbook || {}

  return (
    <div className="planner-tab-view concept-explanation-view">
      {/* 1. Prescribed Textbook & Syllabus Reference Card */}
      <div className="planner-card textbook-reference-card">
        <div className="card-top-header">
          <div className="card-badge-title">
            <BookOpen size={16} className="title-icon" />
            <span>Prescribed Curriculum Textbook &amp; Readings</span>
          </div>
          <span className="textbook-verified-tag">
            <BookmarkCheck size={13} />
            <span>Sem 6 Recommended</span>
          </span>
        </div>

        <div className="textbook-details-grid">
          <div className="textbook-main-info">
            <h4 className="textbook-title">{textbook.title}</h4>
            <div className="textbook-author">By {textbook.author} • {textbook.edition}</div>
            <div className="textbook-publisher">{textbook.publisher}</div>
          </div>

          <div className="textbook-chapter-box">
            <div className="chapter-label">Assigned Reading:</div>
            <div className="chapter-name">{textbook.chapter}</div>
            <div className="chapter-pages">{textbook.pages}</div>
          </div>
        </div>

        {textbook.referenceBook && (
          <div className="textbook-secondary-ref">
            <span className="ref-label">Supplementary Reference:</span>
            <span className="ref-value">{textbook.referenceBook}</span>
          </div>
        )}
      </div>

      {/* 2. Core Concept Summary */}
      <div className="planner-card concept-summary-card">
        <div className="card-top-header">
          <div className="card-badge-title">
            <Sparkles size={16} className="title-icon" />
            <span>Conceptual Overview</span>
          </div>
        </div>
        <p className="concept-summary-paragraph">{concept.summary}</p>

        {/* 2 Column Comparison of QA vs QC Pillars */}
        <div className="concept-pillars-grid">
          {/* Pillar 1: QA */}
          <div className="concept-pillar-box qa-pillar">
            <div className="pillar-header">
              <span className="pillar-tag qa">Process Quality</span>
              <h4 className="pillar-title">Quality Assurance (QA)</h4>
              <span className="pillar-nature">{concept.qaOverview.nature}</span>
            </div>
            <p className="pillar-def">{concept.qaOverview.definition}</p>
            <div className="pillar-activities-label">Key Engineering Activities:</div>
            <ul className="pillar-activities-list">
              {concept.qaOverview.activities.map((act, i) => (
                <li key={i}>
                  <CheckCircle2 size={13} className="bullet-icon qa" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 2: QC */}
          <div className="concept-pillar-box qc-pillar">
            <div className="pillar-header">
              <span className="pillar-tag qc">Product Quality</span>
              <h4 className="pillar-title">Quality Control (QC)</h4>
              <span className="pillar-nature">{concept.qcOverview.nature}</span>
            </div>
            <p className="pillar-def">{concept.qcOverview.definition}</p>
            <div className="pillar-activities-label">Key Engineering Activities:</div>
            <ul className="pillar-activities-list">
              {concept.qcOverview.activities.map((act, i) => (
                <li key={i}>
                  <CheckCircle2 size={13} className="bullet-icon qc" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Comparison Matrix Table */}
      <div className="planner-card comparison-table-card">
        <div className="card-top-header">
          <div className="card-badge-title">
            <Layers size={16} className="title-icon" />
            <span>Comprehensive Comparison Matrix (Quick Revision)</span>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="comparison-data-table">
            <thead>
              <tr>
                <th className="th-param">Evaluation Parameter</th>
                <th className="th-qa">Quality Assurance (QA)</th>
                <th className="th-qc">Quality Control (QC)</th>
              </tr>
            </thead>
            <tbody>
              {concept.comparisonTable.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="td-param"><strong>{row.parameter}</strong></td>
                  <td className="td-qa">{row.qa}</td>
                  <td className="td-qc">{row.qc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Faculty Exam Pro-Tip Box */}
      {concept.examTip && (
        <div className="planner-tip-box">
          <Lightbulb size={20} className="tip-icon" />
          <div className="tip-content">
            <div className="tip-heading">Faculty Exam Pro-Tip:</div>
            <div className="tip-text">{concept.examTip}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConceptExplanationView
