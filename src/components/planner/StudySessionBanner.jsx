import React from 'react'
import {
  Calendar,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ChevronDown
} from 'lucide-react'

function StudySessionBanner({
  topics,
  topicsList,
  selectedTopic,
  activeTopic,
  onSelectTopic,
  isSessionCompleted,
  isCompleted,
  onToggleComplete
}) {
  const currentTopic = selectedTopic || activeTopic || {}
  const allTopics = topics || topicsList || []
  const sessionCompleted = isSessionCompleted !== undefined ? isSessionCompleted : Boolean(isCompleted)
  const objectives = currentTopic.objectives || []

  return (
    <div className="planner-session-banner-card">
      <div className="banner-top-row">
        {/* Left: Academic Topic Selector */}
        <div className="banner-topic-section">
          <div className="banner-badge-row">
            <span className="banner-subject-tag">{currentTopic.code || ''} • {currentTopic.subject || ''}</span>
            <span className="banner-semester-tag">{currentTopic.semester || ''}</span>
          </div>

          <div className="topic-selector-wrapper">
            <label htmlFor="planner-topic-select" className="topic-select-label">
              Active Topic:
            </label>
            <div className="custom-select-container">
              <select
                id="planner-topic-select"
                className="planner-topic-select"
                value={currentTopic.id || ''}
                onChange={(e) => onSelectTopic && onSelectTopic(e.target.value)}
              >
                {allTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="select-dropdown-icon" />
            </div>
          </div>
        </div>

        {/* Right: Session Metrics & Status Button */}
        <div className="banner-status-section">
          <div className="banner-pills-row">
            <div className="banner-meta-pill">
              <Clock size={14} className="meta-icon" />
              <span><strong>{currentTopic.durationMinutes || 45}</strong> mins goal</span>
            </div>

            <div className="banner-meta-pill">
              <Award size={14} className="meta-icon" />
              <span><strong>{currentTopic.targetMarks || '10 Marks'}</strong> weightage</span>
            </div>

            <div className="banner-meta-pill">
              <Calendar size={14} className="meta-icon" />
              <span>{currentTopic.date || 'Today'}</span>
            </div>
          </div>

          <button
            type="button"
            className={`session-status-toggle-btn ${sessionCompleted ? 'completed' : 'in-progress'}`}
            onClick={onToggleComplete}
            title="Click to toggle session completion status"
          >
            {sessionCompleted ? (
              <>
                <CheckCircle2 size={16} />
                <span>Session Completed (100%)</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Mark Session Complete</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Learning Objectives List */}
      <div className="banner-objectives-block">
        <div className="objectives-title">
          <BookOpen size={14} />
          <span>Core Syllabus Learning Goals for this Session:</span>
        </div>
        <ul className="objectives-list">
          {objectives.map((obj, idx) => (
            <li key={idx} className="objective-item">
              <span className="objective-bullet">✓</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default StudySessionBanner
