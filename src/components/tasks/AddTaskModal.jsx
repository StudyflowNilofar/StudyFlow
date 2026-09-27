import React, { useState, useEffect } from 'react'
import { X, CheckSquare, AlertCircle, PlusCircle } from 'lucide-react'
import { mockEnrolledSubjects } from '../../utils/mockTasksData'

function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [formData, setFormData] = useState({
    title: '',
    subject: mockEnrolledSubjects[0],
    dueDate: 'Today, Aug 16',
    priority: 'High',
    description: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when opened or closed
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        subject: mockEnrolledSubjects[0],
        dueDate: 'Today, Aug 16',
        priority: 'High',
        description: ''
      })
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

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
      newErrors.title = 'Task title / topic name is required'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select an academic subject'
    }

    if (!formData.dueDate.trim()) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    // Extract subject code from string e.g. "Software Testing & QA (CS605)" -> "CS605"
    const codeMatch = formData.subject.match(/\(([^)]+)\)/)
    const subjectCode = codeMatch ? codeMatch[1] : 'CORE'

    const isToday = formData.dueDate.toLowerCase().includes('today')
    const isTomorrow = formData.dueDate.toLowerCase().includes('tomorrow')

    const newTask = {
      id: `task-${Date.now()}`,
      title: formData.title.trim(),
      subject: formData.subject,
      subjectCode: subjectCode,
      dueDate: formData.dueDate.trim(),
      dueCategory: isToday ? 'today' : isTomorrow ? 'tomorrow' : 'upcoming',
      priority: formData.priority,
      completed: false,
      description: formData.description.trim()
    }

    onAddTask(newTask)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container add-task-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-badge">
              <CheckSquare size={20} />
            </div>
            <div>
              <h2 className="modal-title">Add Study Task</h2>
              <p className="modal-subtitle">Create a new academic to-do or revision task</p>
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
            {/* Task Title */}
            <div className="form-group span-full">
              <label htmlFor="task-title" className="form-label">
                Task Name / Topic <span className="required-star">*</span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g. Revise QA vs QC differences & comparative table"
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

            {/* Subject Dropdown */}
            <div className="form-group span-full">
              <label htmlFor="task-subject" className="form-label">
                Academic Subject <span className="required-star">*</span>
              </label>
              <select
                id="task-subject"
                name="subject"
                className="form-select"
                value={formData.subject}
                onChange={handleChange}
              >
                {mockEnrolledSubjects.map((subj) => (
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

            {/* Due Date Presets / Input */}
            <div className="form-group">
              <label htmlFor="task-due-date" className="form-label">
                Due Date / Target <span className="required-star">*</span>
              </label>
              <input
                id="task-due-date"
                name="dueDate"
                type="text"
                className={`form-input ${errors.dueDate ? 'input-error' : ''}`}
                placeholder="e.g. Today, Aug 16 or Tomorrow, Aug 17"
                value={formData.dueDate}
                onChange={handleChange}
              />
              {errors.dueDate && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.dueDate}</span>
                </div>
              )}
            </div>

            {/* Priority Selector */}
            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">
                Priority Level <span className="required-star">*</span>
              </label>
              <select
                id="task-priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Optional Task Description / Notes */}
            <div className="form-group span-full">
              <label htmlFor="task-desc" className="form-label">
                Study Notes / Instructions (Optional)
              </label>
              <textarea
                id="task-desc"
                name="description"
                rows="3"
                className="form-textarea"
                placeholder="e.g. Focus on textbook Chapter 19 exercise questions and V-Model diagram..."
                value={formData.description}
                onChange={handleChange}
              />
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
              <PlusCircle size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTaskModal
