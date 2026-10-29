import React, { useEffect } from 'react'
import {
  X,
  BookOpen,
  User,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Layers,
  GraduationCap
} from 'lucide-react'

function SubjectDetailModal({ subject, isOpen, onClose }) {
  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !subject) return null

  const {
    code = '',
    title = '',
    description = '',
    teacher = '',
    topicsCovered = 0,
    totalTopics = 0,
    hoursSpent = 0,
    progress = 0,
    status = 'In Progress'
  } = subject

  const remainingTopics = Math.max(0, totalTopics - topicsCovered)

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
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container subject-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-badge">
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="subject-code-tag">{code}</span>
                <span className={`subject-status-pill ${statusInfo.className}`}>
                  <StatusIcon size={12} />
                  <span>{statusInfo.text}</span>
                </span>
              </div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>{title}</h2>
              {teacher && (
                <p className="modal-subtitle">Instructor: {teacher}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="subject-detail-modal-body"
          style={{
            padding: '1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {/* Course Description */}
          {description && (
            <div
              className="subject-detail-desc-box"
              style={{
                background: 'var(--bg-app, #f8fafc)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light, #e2e8f0)'
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary, #64748b)',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Course Overview &amp; Curriculum Scope
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: 'var(--text-primary, #1e293b)',
                  lineHeight: 1.55
                }}
              >
                {description}
              </p>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                background: 'var(--bg-app, #f8fafc)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light, #e2e8f0)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', marginBottom: '0.25rem' }}>
                Topics Covered
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                {topicsCovered}{' '}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted, #94a3b8)' }}>
                  / {totalTopics}
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-app, #f8fafc)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light, #e2e8f0)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', marginBottom: '0.25rem' }}>
                Remaining
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>
                {remainingTopics}{' '}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted, #94a3b8)' }}>
                  Topics
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-app, #f8fafc)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light, #e2e8f0)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', marginBottom: '0.25rem' }}>
                Hours Logged
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary, #0284c7)' }}>
                {hoursSpent}{' '}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted, #94a3b8)' }}>
                  hrs
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-app, #f8fafc)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light, #e2e8f0)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', marginBottom: '0.25rem' }}>
                Completion
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                {progress}%
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="subject-detail-progress-section">
            <div className="subject-progress-labels">
              <span className="progress-topics-count">
                <strong>{topicsCovered}</strong> of {totalTopics} Topics Completed
              </span>
              <span className="progress-percentage">{progress}% Mastered</span>
            </div>
            <div className="subject-progress-track">
              <div
                className="subject-progress-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          {/* Faculty & Academic Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#ffffff',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-light, #e2e8f0)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary, #64748b)'
              }}
            >
              <User size={15} style={{ color: 'var(--primary, #0284c7)', flexShrink: 0 }} />
              <span>
                <strong>Course Faculty:</strong> {teacher || 'Department Instructor'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary, #64748b)'
              }}
            >
              <Layers size={15} style={{ color: 'var(--primary, #0284c7)', flexShrink: 0 }} />
              <span>
                <strong>Curriculum:</strong> Semester 6 Core University Syllabus
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary, #64748b)'
              }}
            >
              <GraduationCap size={15} style={{ color: 'var(--primary, #0284c7)', flexShrink: 0 }} />
              <span>
                <strong>Status:</strong> {status} • Active Study Module
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="modal-footer"
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--border-light, #e2e8f0)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubjectDetailModal
