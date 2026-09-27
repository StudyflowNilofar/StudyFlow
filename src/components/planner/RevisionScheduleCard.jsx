import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  Bell,
  BellOff,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react'

function RevisionScheduleCard({
  topic,
  topicData,
  isSessionCompleted,
  onToggleSessionComplete,
  onNotice
}) {
  const currentTopic = topic || topicData || {}
  const initialSchedule = currentTopic.revisionSchedule || []
  const [schedule, setSchedule] = useState(initialSchedule)

  const handleToggleReminder = (itemId) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = !item.reminderActive
          if (onNotice) {
            onNotice(
              nextState
                ? `Revision reminder enabled for ${item.day} (${item.targetDate}).`
                : `Revision reminder disabled for ${item.day}.`
            )
          }
          return { ...item, reminderActive: nextState }
        }
        return item
      })
    )
  }

  const handleToggleCompleted = (itemId) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = !item.completed
          if (onNotice) {
            onNotice(
              nextState
                ? `Checkpoint "${item.title}" marked as completed!`
                : `Checkpoint "${item.title}" marked as pending.`
            )
          }
          return { ...item, completed: nextState }
        }
        return item
      })
    )
  }

  return (
    <div className="planner-tab-view revision-schedule-view">
      {/* 1. Spaced Repetition Science Info Card */}
      <div className="planner-card revision-intro-card">
        <div className="card-top-header">
          <div className="card-badge-title">
            <TrendingUp size={16} className="title-icon" />
            <span>Spaced Repetition Science (Ebbinghaus Forgetting Curve)</span>
          </div>
          <span className="card-status-tag positive">
            <span>Optimal Retention</span>
          </span>
        </div>

        <p className="revision-intro-text">
          Revising material across increasing intervals (24 hours, 3 days, and 7 days) transforms short-term lecture memory into high-retention long-term recall for semester examinations.
        </p>
      </div>

      {/* 2. Spaced Revision Timeline List */}
      <div className="planner-card revision-timeline-card">
        <div className="timeline-header-row">
          <h4 className="timeline-title">Automated Spaced Revision Timeline</h4>
          <span className="timeline-subtitle">Semester 6 Exam Preparation Schedule</span>
        </div>

        <div className="revision-milestones-list">
          {schedule.map((milestone, idx) => (
            <div
              key={milestone.id}
              className={`revision-milestone-item ${milestone.completed ? 'milestone-done' : ''}`}
            >
              {/* Timeline Connector Line & Step Circle */}
              <div className="milestone-indicator-column">
                <button
                  type="button"
                  className={`milestone-check-btn ${milestone.completed ? 'checked' : ''}`}
                  onClick={() => handleToggleCompleted(milestone.id)}
                  title="Click to toggle completion"
                  aria-label="Toggle milestone completion"
                >
                  <CheckCircle2 size={20} />
                </button>
                {idx < schedule.length - 1 && <div className="milestone-line" />}
              </div>

              {/* Milestone Content Details */}
              <div className="milestone-content-block">
                <div className="milestone-header">
                  <span className="milestone-day-pill">{milestone.day}</span>
                  <div className="milestone-date">
                    <Calendar size={13} />
                    <span>{milestone.targetDate}</span>
                  </div>
                  <div className="milestone-duration">
                    <Clock size={13} />
                    <span>{milestone.duration}</span>
                  </div>
                </div>

                <h5 className="milestone-title-text">{milestone.title}</h5>
                <p className="milestone-desc-text">{milestone.description}</p>
              </div>

              {/* Reminder Action Toggle */}
              <div className="milestone-reminder-column">
                <button
                  type="button"
                  className={`reminder-toggle-btn ${milestone.reminderActive ? 'active' : ''}`}
                  onClick={() => handleToggleReminder(milestone.id)}
                  title={milestone.reminderActive ? 'Disable reminder' : 'Enable reminder notification'}
                >
                  {milestone.reminderActive ? (
                    <>
                      <Bell size={14} className="bell-icon active" />
                      <span>Reminder On</span>
                    </>
                  ) : (
                    <>
                      <BellOff size={14} className="bell-icon" />
                      <span>Reminder Off</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Session Completion Card */}
      <div className="planner-card session-completion-cta-card">
        <div className="completion-cta-left">
          <div className="completion-icon-wrapper">
            <CalendarCheck size={24} />
          </div>
          <div>
            <h4 className="completion-title">Finished today's planned study session?</h4>
            <p className="completion-subtext">
              Log this session to update your daily study streak, syllabus progress, and weekly analytics.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`btn ${isSessionCompleted ? 'btn-secondary' : 'btn-primary'} complete-cta-btn`}
          onClick={onToggleSessionComplete}
        >
          {isSessionCompleted ? (
            <>
              <CheckCircle2 size={16} />
              <span>Session Logged (Completed)</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Log Study Session Completed</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default RevisionScheduleCard
