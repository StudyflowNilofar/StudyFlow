import React from 'react'
import {
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  Trash2,
  BookOpen
} from 'lucide-react'

function TaskItem({ task, onToggleComplete, onDelete }) {
  const { id, title, subject, dueDate, dueCategory, priority, completed, description } = task

  const getPriorityClass = (pri) => {
    switch (pri) {
      case 'High':
        return 'priority-high'
      case 'Medium':
        return 'priority-medium'
      case 'Low':
        return 'priority-low'
      default:
        return 'priority-medium'
    }
  }

  const isDueToday = dueCategory === 'today' || (dueDate && dueDate.toLowerCase().includes('today'))

  return (
    <div className={`task-item-card ${completed ? 'is-completed' : ''}`}>
      {/* Checkbox Button */}
      <button
        type="button"
        className={`task-checkbox-btn ${completed ? 'checked' : ''}`}
        onClick={() => onToggleComplete(id)}
        aria-label={completed ? 'Mark task as pending' : 'Mark task as completed'}
        title={completed ? 'Mark as pending' : 'Mark as completed'}
      >
        {completed ? (
          <CheckCircle2 size={22} className="check-icon checked" />
        ) : (
          <Circle size={22} className="check-icon unchecked" />
        )}
      </button>

      {/* Task Info Body */}
      <div className="task-item-body">
        <div className="task-item-header">
          <h4 className={`task-item-title ${completed ? 'completed-text' : ''}`}>
            {title}
          </h4>
        </div>

        {description && (
          <p className={`task-item-description ${completed ? 'completed-text' : ''}`}>
            {description}
          </p>
        )}

        {/* Task Badges & Meta Row */}
        <div className="task-item-meta-row">
          {/* Subject Badge */}
          <span className="task-meta-subject">
            <BookOpen size={12} />
            <span>{subject}</span>
          </span>

          {/* Due Date Badge */}
          <span className={`task-meta-date ${isDueToday && !completed ? 'due-today-badge' : ''}`}>
            <Calendar size={12} />
            <span>{dueDate}</span>
          </span>

          {/* Priority Pill */}
          <span className={`task-priority-tag ${getPriorityClass(priority)}`}>
            {priority === 'High' && <AlertCircle size={11} />}
            <span>{priority} Priority</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="task-item-actions">
        <button
          type="button"
          className="task-delete-btn"
          onClick={() => onDelete(id)}
          title="Delete task"
          aria-label={`Delete task: ${title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default TaskItem
