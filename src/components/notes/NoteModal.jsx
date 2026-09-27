import React, { useState, useEffect } from 'react'
import { X, BookPlus, Edit3, AlertCircle } from 'lucide-react'
import { mockNoteSubjects } from '../../utils/mockNotesData'

function NoteModal({ isOpen, onClose, onSaveNote, editingNote = null, subjects = mockNoteSubjects }) {
  const isEditMode = Boolean(editingNote)

  const [formData, setFormData] = useState({
    title: '',
    subject: subjects[0] || '',
    topic: '',
    content: '',
    tags: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize or reset form when modal state changes
  useEffect(() => {
    if (isOpen) {
      if (editingNote) {
        setFormData({
          title: editingNote.title || '',
          subject: editingNote.subject || subjects[0] || '',
          topic: editingNote.topic || '',
          content: editingNote.content || '',
          tags: Array.isArray(editingNote.tags) ? editingNote.tags.join(', ') : (editingNote.tags || '')
        })
      } else {
        setFormData({
          title: '',
          subject: subjects[0] || '',
          topic: '',
          content: '',
          tags: ''
        })
      }
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen, editingNote, subjects])

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

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Note title is required'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic / concept name is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Note content / explanation is required'
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Note content must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    // Extract subject code e.g. "Software Testing & QA (CS605)" -> "CS605"
    const codeMatch = formData.subject.match(/\(([^)]+)\)/)
    const subjectCode = codeMatch ? codeMatch[1] : 'CORE'

    // Parse comma separated tags
    const parsedTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Revision']

    // Rough read time calculation
    const words = formData.content.trim().split(/\s+/).length
    const readTimeMinutes = Math.max(1, Math.round(words / 50))

    const notePayload = {
      id: editingNote ? editingNote.id : `note-${Date.now()}`,
      title: formData.title.trim(),
      subject: formData.subject,
      subjectCode: subjectCode,
      topic: formData.topic.trim(),
      content: formData.content.trim(),
      tags: parsedTags,
      updatedAt: editingNote ? (editingNote.updatedAt || 'Sep 25, 2026') : 'Sep 25, 2026',
      readTimeMinutes: readTimeMinutes,
      isBookmarked: editingNote ? editingNote.isBookmarked : false
    }

    onSaveNote(notePayload, isEditMode)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container note-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-badge">
              {isEditMode ? <Edit3 size={20} /> : <BookPlus size={20} />}
            </div>
            <div>
              <h2 className="modal-title">{isEditMode ? 'Edit Study Note' : 'Create New Note'}</h2>
              <p className="modal-subtitle">
                {isEditMode ? 'Update your revision notes and concepts' : 'Save structured lecture notes, formulas, or key definitions'}
              </p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="modal-form-grid">
            {/* Note Title */}
            <div className="form-group span-full">
              <label htmlFor="note-title" className="form-label">
                Note Title <span className="required-star">*</span>
              </label>
              <input
                id="note-title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g. Newton-Raphson Method for Root Finding & Convergence"
                value={formData.title}
                onChange={handleChange}
                autoFocus
              />
              {errors.title && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Subject Select */}
            <div className="form-group">
              <label htmlFor="note-subject" className="form-label">
                Academic Subject <span className="required-star">*</span>
              </label>
              <select
                id="note-subject"
                name="subject"
                className="form-select"
                value={formData.subject}
                onChange={handleChange}
              >
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.subject}</span>
                </div>
              )}
            </div>

            {/* Topic Name */}
            <div className="form-group">
              <label htmlFor="note-topic" className="form-label">
                Topic / Unit Name <span className="required-star">*</span>
              </label>
              <input
                id="note-topic"
                name="topic"
                type="text"
                className={`form-input ${errors.topic ? 'input-error' : ''}`}
                placeholder="e.g. Iterative Numerical Methods"
                value={formData.topic}
                onChange={handleChange}
              />
              {errors.topic && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.topic}</span>
                </div>
              )}
            </div>

            {/* Optional Tags */}
            <div className="form-group span-full">
              <label htmlFor="note-tags" className="form-label">
                Tags (Comma separated)
              </label>
              <input
                id="note-tags"
                name="tags"
                type="text"
                className="form-input"
                placeholder="e.g. Exam Focus, Formula, Unit 2, Definitions"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            {/* Note Content */}
            <div className="form-group span-full">
              <label htmlFor="note-content" className="form-label">
                Note Content / Explanation <span className="required-star">*</span>
              </label>
              <textarea
                id="note-content"
                name="content"
                rows="8"
                className={`form-textarea note-content-textarea ${errors.content ? 'input-error' : ''}`}
                placeholder="Write your detailed explanation, formulas, key bullet points, or step-by-step algorithms..."
                value={formData.content}
                onChange={handleChange}
              />
              {errors.content && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.content}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary modal-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary modal-submit-btn"
              disabled={isSubmitting}
            >
              {isEditMode ? <Edit3 size={16} /> : <BookPlus size={16} />}
              <span>{isEditMode ? 'Save Changes' : 'Create Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteModal
