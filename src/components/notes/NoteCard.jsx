import React from 'react'
import {
  Clock,
  Edit2,
  Trash2,
  Eye,
  Tag,
  FileText
} from 'lucide-react'

function NoteCard({ note, onView, onEdit, onDelete, viewMode = 'grid' }) {
  const { id, title, subject, subjectCode, topic, content, tags, updatedAt, readTimeMinutes } = note

  // Short snippet preview for the card
  const snippet = content
    ? content.replace(/^[0-9]\.\s/gm, '').split('\n').filter(Boolean).slice(0, 3).join(' ')
    : ''

  if (viewMode === 'list') {
    return (
      <div className="note-list-row-card">
        <div className="note-list-left">
          <div className="note-list-icon">
            <FileText size={18} />
          </div>
          <div className="note-list-info">
            <h4 className="note-list-title" onClick={() => onView(note)}>
              {title}
            </h4>
            <div className="note-list-meta">
              <span className="note-subject-pill">{subject}</span>
              <span className="note-topic-text">• {topic}</span>
              <span className="note-date-text">• Updated {updatedAt}</span>
            </div>
          </div>
        </div>

        <div className="note-list-actions">
          <button
            type="button"
            className="note-action-btn view-btn"
            onClick={() => onView(note)}
            title="Read Note"
          >
            <Eye size={15} />
            <span>Read</span>
          </button>
          <button
            type="button"
            className="note-action-btn edit-btn"
            onClick={() => onEdit(note)}
            title="Edit Note"
            aria-label="Edit Note"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            className="note-action-btn delete-btn"
            onClick={() => onDelete(id)}
            title="Delete Note"
            aria-label="Delete Note"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="note-grid-card">
      {/* Top Header: Subject & Topic Badges */}
      <div className="note-card-header">
        <div className="note-header-badges">
          <span className="note-subject-tag">{subjectCode || subject}</span>
          <span className="note-topic-badge" title={topic}>{topic}</span>
        </div>
        <div className="note-read-time">
          <Clock size={12} />
          <span>{readTimeMinutes || 3} min</span>
        </div>
      </div>

      {/* Title & Preview Content */}
      <div className="note-card-body" onClick={() => onView(note)}>
        <h3 className="note-card-title">{title}</h3>
        <p className="note-card-snippet">{snippet}</p>
      </div>

      {/* Tags Chips */}
      {tags && tags.length > 0 && (
        <div className="note-tags-row">
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="note-tag-chip">
              <Tag size={10} />
              <span>{tag}</span>
            </span>
          ))}
          {tags.length > 3 && (
            <span className="note-tag-chip more">+{tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer: Date & Actions */}
      <div className="note-card-footer">
        <span className="note-updated-date">Updated {updatedAt}</span>

        <div className="note-card-actions-group">
          <button
            type="button"
            className="note-btn-primary"
            onClick={() => onView(note)}
            title="Read Full Note"
          >
            <Eye size={14} />
            <span>Read Note</span>
          </button>
          <button
            type="button"
            className="note-icon-btn"
            onClick={() => onEdit(note)}
            title="Edit Note"
            aria-label="Edit Note"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="note-icon-btn delete"
            onClick={() => onDelete(id)}
            title="Delete Note"
            aria-label="Delete Note"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
