import React, { useEffect } from 'react'
import {
  X,
  Clock,
  Tag,
  Copy,
  Edit2,
  Calendar,
  Layers
} from 'lucide-react'

function NoteDetailModal({ note, isOpen, onClose, onEditNote, onCopyNotice }) {
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

  if (!isOpen || !note) return null

  const { title, subject, subjectCode, topic, content, tags, updatedAt, readTimeMinutes } = note

  const handleCopy = () => {
    const textToCopy = `${title}\nSubject: ${subject} | Topic: ${topic}\n\n${content}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {})
    }
    if (onCopyNotice) {
      onCopyNotice('Note content copied to clipboard!')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container note-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Detail Header */}
        <div className="modal-header note-detail-header">
          <div className="note-detail-badges-row">
            <span className="note-subject-tag large">{subjectCode || subject}</span>
            <span className="note-topic-badge large">{topic}</span>
          </div>

          <div className="note-detail-header-actions">
            <button
              type="button"
              className="note-header-action-btn"
              onClick={handleCopy}
              title="Copy note text"
              aria-label="Copy note text"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
            <button
              type="button"
              className="note-header-action-btn primary"
              onClick={() => {
                onClose()
                onEditNote(note)
              }}
              title="Edit note"
              aria-label="Edit note"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Detail Content Body */}
        <div className="note-detail-body">
          <h1 className="note-detail-title">{title}</h1>

          <div className="note-detail-meta-bar">
            <div className="meta-item">
              <Layers size={14} className="meta-icon" />
              <span>{subject}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} className="meta-icon" />
              <span>Updated {updatedAt}</span>
            </div>
            <div className="meta-item">
              <Clock size={14} className="meta-icon" />
              <span>{readTimeMinutes || 3} min read</span>
            </div>
          </div>

          <div className="note-detail-text-content">
            {content.split('\n\n').map((block, idx) => (
              <p key={idx}>{block}</p>
            ))}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="note-detail-tags-section">
              <span className="tags-label">Tags:</span>
              <div className="tags-list">
                {tags.map((tag, i) => (
                  <span key={i} className="note-tag-chip">
                    <Tag size={11} />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail Footer */}
        <div className="modal-footer note-detail-footer">
          <span className="note-footer-subject-info">{subject} • Semester 5 Core Study Resource</span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close Note
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailModal
