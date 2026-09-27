import React from 'react'
import { Sparkles, ArrowRight, CheckCircle2, Clock3, BookOpen, Flame, Calendar } from 'lucide-react'

function Hero({ onNavigate }) {
  const scrollToFeatures = (e) => {
    e.preventDefault()
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleGetStarted = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('register')
    }
  }

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        {/* Left Column: Text & CTA Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="badge-icon" />
            <span>Smart Study Management for College Students</span>
          </div>

          <h1 className="hero-heading">
            Study Smarter. <br />
            <span className="heading-highlight">Stay Organized.</span>
          </h1>

          <p className="hero-subheading">
            Manage your subjects, study tasks, notes and syllabus progress in one place.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleGetStarted}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="#features"
              onClick={scrollToFeatures}
              className="btn btn-outline btn-lg"
            >
              Explore Features
            </a>
          </div>

          {/* Quick Trust Highlights */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Structured Study Routines</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={16} className="highlight-icon" />
              <span>Exam-Ready Syllabus Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual UI Mockup (Static preview for display only) */}
        <div className="hero-visual">
          <div className="mockup-card">
            {/* Mockup Top Bar */}
            <div className="mockup-header">
              <div className="mockup-date-info">
                <Calendar size={18} className="mockup-icon" />
                <div>
                  <div className="mockup-title">Today's Study Plan</div>
                  <div className="mockup-date">Semester 6 • CS Curriculum</div>
                </div>
              </div>
              <div className="mockup-streak-pill">
                <Flame size={14} />
                <span>5 Day Streak</span>
              </div>
            </div>

            {/* Mockup Progress Summary */}
            <div className="mockup-progress-box">
              <div className="mockup-progress-label">
                <span>Daily Topic Completion</span>
                <span className="progress-percentage">75%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Mockup Task List (UI Preview only) */}
            <div className="mockup-task-list">
              <div className="mockup-task-item done">
                <div className="task-status-indicator done">
                  <CheckCircle2 size={16} />
                </div>
                <div className="task-content">
                  <div className="task-title">Data Structures &amp; Algorithms</div>
                  <div className="task-desc">Binary Search Trees &amp; Traversal Revision</div>
                </div>
                <span className="task-tag tag-completed">Completed</span>
              </div>

              <div className="mockup-task-item done">
                <div className="task-status-indicator done">
                  <CheckCircle2 size={16} />
                </div>
                <div className="task-content">
                  <div className="task-title">Operating Systems</div>
                  <div className="task-desc">Process Scheduling Algorithms &amp; Gantt Charts</div>
                </div>
                <span className="task-tag tag-completed">Completed</span>
              </div>

              <div className="mockup-task-item active">
                <div className="task-status-indicator active">
                  <Clock3 size={16} />
                </div>
                <div className="task-content">
                  <div className="task-title">Web Technology</div>
                  <div className="task-desc">React Component Hierarchy &amp; Props</div>
                </div>
                <span className="task-tag tag-progress">In Progress</span>
              </div>

              <div className="mockup-task-item upcoming">
                <div className="task-status-indicator pending">
                  <BookOpen size={16} />
                </div>
                <div className="task-content">
                  <div className="task-title">Database Systems</div>
                  <div className="task-desc">3NF &amp; BCNF Normalization Practice</div>
                </div>
                <span className="task-tag tag-pending">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
