import React, { useState, useEffect } from 'react'
import { X, BookPlus, AlertCircle } from 'lucide-react'

function AddSubjectModal({ isOpen, onClose, onAddSubject }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    totalTopics: '',
    description: '',
    status: 'In Progress'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        code: '',
        teacher: '',
        totalTopics: '',
        description: '',
        status: 'In Progress'
      })
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Handle ESC key to close modal
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

    // Clear error for field
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

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Subject code is required (e.g. CS605)'
    }

    if (!formData.teacher.trim()) {
      newErrors.teacher = 'Faculty / teacher name is required'
    }

    if (!formData.totalTopics) {
      newErrors.totalTopics = 'Total topics is required'
    } else {
      const numTopics = Number(formData.totalTopics)
      if (isNaN(numTopics) || numTopics <= 0 || !Number.isInteger(numTopics)) {
        newErrors.totalTopics = 'Please enter a valid positive integer greater than 0'
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Short subject description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    const totalTopicsNum = parseInt(formData.totalTopics, 10)
    const newSubject = {
      id: `subj-${Date.now()}`,
      code: formData.code.trim().toUpperCase(),
      title: formData.name.trim(),
      description: formData.description.trim(),
      teacher: formData.teacher.trim(),
      topicsCovered: 0,
      totalTopics: totalTopicsNum,
      hoursSpent: 0,
      progress: 0,
      status: formData.status || 'In Progress',
      badgeColor: '#0284c7'
    }

    onAddSubject(newSubject)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container add-subject-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-badge">
              <BookPlus size={20} />
            </div>
            <div>
              <h2 className="modal-title">Add New Subject</h2>
              <p className="modal-subtitle">Add a semester course to your study workspace</p>
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
            {/* Subject Name */}
            <div className="form-group span-full">
              <label htmlFor="subject-name" className="form-label">
                Subject Name <span className="required-star">*</span>
              </label>
              <input
                id="subject-name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Cloud Computing & Distributed Systems"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Subject Code */}
            <div className="form-group">
              <label htmlFor="subject-code" className="form-label">
                Subject Code <span className="required-star">*</span>
              </label>
              <input
                id="subject-code"
                name="code"
                type="text"
                className={`form-input ${errors.code ? 'input-error' : ''}`}
                placeholder="e.g. CS605"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.code}</span>
                </div>
              )}
            </div>

            {/* Total Topics */}
            <div className="form-group">
              <label htmlFor="subject-total-topics" className="form-label">
                Total Topics / Units <span className="required-star">*</span>
              </label>
              <input
                id="subject-total-topics"
                name="totalTopics"
                type="number"
                min="1"
                step="1"
                className={`form-input ${errors.totalTopics ? 'input-error' : ''}`}
                placeholder="e.g. 18"
                value={formData.totalTopics}
                onChange={handleChange}
              />
              {errors.totalTopics && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.totalTopics}</span>
                </div>
              )}
            </div>

            {/* Teacher / Faculty Name */}
            <div className="form-group span-full">
              <label htmlFor="subject-teacher" className="form-label">
                Faculty / Teacher Name <span className="required-star">*</span>
              </label>
              <input
                id="subject-teacher"
                name="teacher"
                type="text"
                className={`form-input ${errors.teacher ? 'input-error' : ''}`}
                placeholder="e.g. Prof. S. K. Roy"
                value={formData.teacher}
                onChange={handleChange}
              />
              {errors.teacher && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.teacher}</span>
                </div>
              )}
            </div>

            {/* Initial Progress Status */}
            <div className="form-group span-full">
              <label htmlFor="subject-status" className="form-label">
                Initial Progress Status
              </label>
              <select
                id="subject-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="In Progress">In Progress</option>
                <option value="On Track">On Track</option>
                <option value="Needs Focus">Needs Focus</option>
              </select>
            </div>

            {/* Subject Description */}
            <div className="form-group span-full">
              <label htmlFor="subject-desc" className="form-label">
                Course Description &amp; Scope <span className="required-star">*</span>
              </label>
              <textarea
                id="subject-desc"
                name="description"
                rows="3"
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="Brief summary of syllabus units, core concepts, or textbook reference..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
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
              <BookPlus size={16} />
              <span>Add Subject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSubjectModal
