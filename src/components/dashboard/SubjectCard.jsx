import React from 'react'
import { BookOpen, Clock } from 'lucide-react'

function SubjectCard({ subject }) {
  const { code, title, topicsCovered, totalTopics, hoursSpent, progress } = subject

  return (
    <div className="dashboard-subject-card">
      <div className="subject-card-header">
        <span className="subject-code-badge">{code}</span>
        <span className="subject-progress-pct">{progress}%</span>
      </div>

      <h3 className="subject-card-title">{title}</h3>

      {/* Progress Bar */}
      <div className="subject-progress-container">
        <div className="subject-progress-bar">
          <div
            className="subject-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Subject Metrics */}
      <div className="subject-card-footer">
        <div className="subject-stat">
          <BookOpen size={14} className="subject-stat-icon" />
          <span>
            <strong>{topicsCovered}</strong>/{totalTopics} Topics
          </span>
        </div>
        <div className="subject-stat">
          <Clock size={14} className="subject-stat-icon" />
          <span>
            <strong>{hoursSpent}</strong> hrs logged
          </span>
        </div>
      </div>
    </div>
  )
}

export default SubjectCard
