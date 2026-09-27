import React from 'react'
import {
  Clock,
  CheckCircle2,
  User,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

function SubjectDetailCard({ subject, onViewDetails }) {
  const {
    code,
    title,
    description,
    teacher,
    topicsCovered,
    totalTopics,
    hoursSpent,
    progress,
    status
  } = subject

  // Status badge styling helper
  const getStatusBadge = (statusName) => {
    switch (statusName) {
      case 'On Track':
        return {
          className: 'status-on-track',
          icon: CheckCircle2,
          text: 'On Track'
        }
      case 'In Progress':
        return {
          className: 'status-in-progress',
          icon: TrendingUp,
          text: 'In Progress'
        }
      case 'Needs Focus':
        return {
          className: 'status-needs-focus',
          icon: AlertCircle,
          text: 'Needs Focus'
        }
      default:
        return {
          className: 'status-on-track',
          icon: CheckCircle2,
          text: statusName || 'Active'
        }
    }
  }

  const statusInfo = getStatusBadge(status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="subject-detail-card">
      {/* Top Row: Subject Code Badge + Status Pill */}
      <div className="subject-detail-card-top">
        <span className="subject-code-tag">{code}</span>
        <span className={`subject-status-pill ${statusInfo.className}`}>
          <StatusIcon size={13} />
          <span>{statusInfo.text}</span>
        </span>
      </div>

      {/* Subject Title & Description */}
      <div className="subject-detail-card-body">
        <h3 className="subject-detail-title">{title}</h3>
        {description && (
          <p className="subject-detail-desc">{description}</p>
        )}

        {/* Teacher / Faculty Row */}
        {teacher && (
          <div className="subject-faculty-row">
            <User size={14} className="faculty-icon" />
            <span className="faculty-name">{teacher}</span>
          </div>
        )}
      </div>

      {/* Progress & Topic Stats */}
      <div className="subject-detail-progress-section">
        <div className="subject-progress-labels">
          <span className="progress-topics-count">
            <strong>{topicsCovered}</strong> / {totalTopics} Topics
          </span>
          <span className="progress-percentage">{progress}%</span>
        </div>

        <div className="subject-progress-track">
          <div
            className="subject-progress-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>

      {/* Footer: Hours Logged & Action Button */}
      <div className="subject-detail-card-footer">
        <div className="subject-hours-stat">
          <Clock size={15} className="hours-icon" />
          <span><strong>{hoursSpent}</strong> hrs logged</span>
        </div>

        <button
          type="button"
          className="subject-view-btn"
          onClick={() => onViewDetails && onViewDetails(subject)}
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default SubjectDetailCard
