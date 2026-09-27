import React from 'react'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

function TaskSummaryCard({ task, onToggleTask }) {
  const { id, title, subject, timeSlot, priority, completed } = task

  const getPriorityClass = (pri) => {
    switch (pri.toLowerCase()) {
      case 'high':
        return 'priority-high'
      case 'medium':
        return 'priority-medium'
      case 'low':
        return 'priority-low'
      default:
        return 'priority-medium'
    }
  }

  return (
    <div className={`dashboard-task-item ${completed ? 'task-completed' : ''}`}>
      <button
        type="button"
        className="task-toggle-btn"
        onClick={() => onToggleTask && onToggleTask(id)}
        aria-label={completed ? 'Mark task as incomplete' : 'Mark task as complete'}
      >
        {completed ? (
          <CheckCircle2 size={18} className="task-check-icon checked" />
        ) : (
          <Circle size={18} className="task-check-icon unchecked" />
        )}
      </button>

      <div className="task-details">
        <div className={`task-main-title ${completed ? 'strike-through' : ''}`}>
          {title}
        </div>
        <div className="task-meta">
          <span className="task-subject-tag">{subject}</span>
          {timeSlot && (
            <span className="task-time-slot">
              <Clock size={12} />
              <span>{timeSlot}</span>
            </span>
          )}
        </div>
      </div>

      <div className="task-badges">
        <span className={`task-priority-pill ${getPriorityClass(priority)}`}>
          {priority}
        </span>
      </div>
    </div>
  )
}

export default TaskSummaryCard
