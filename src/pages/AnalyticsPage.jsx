import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  ListTodo,
  BookOpen,
  Flame,
  Award,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { useAuth } from '../context/AuthContext'
import { dashboardApi, subjectApi, taskApi } from '../services/api'
import {
  mockSubjects,
  mockTodayTasks,
  mockWeeklyProgress,
  mockStudentProfile
} from '../utils/mockDashboardData'

function AnalyticsPage({ onNavigate }) {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [weeklyProgress, setWeeklyProgress] = useState([])
  const [streakDays, setStreakDays] = useState(5)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const studentName = user?.name || mockStudentProfile.name

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const statsRes = await dashboardApi.getStats()
        if (statsRes?.success && statsRes.data) {
          if (statsRes.data.subjects && statsRes.data.subjects.length > 0) {
            setSubjects(statsRes.data.subjects)
          }
          if (statsRes.data.weeklyProgress) {
            setWeeklyProgress(statsRes.data.weeklyProgress)
          }
          if (statsRes.data.profile?.streakDays) {
            setStreakDays(statsRes.data.profile.streakDays)
          }
        }
      } catch (err) {
        console.warn('Analytics stats API notice:', err.message)
      }

      try {
        const tasksRes = await taskApi.getAll()
        if (tasksRes?.success && Array.isArray(tasksRes.data)) {
          setTasks(tasksRes.data)
        } else {
          setTasks(mockTodayTasks)
        }
      } catch (err) {
        console.warn('Tasks API fetch notice in analytics:', err.message)
        setTasks(mockTodayTasks)
      }

      try {
        const subjRes = await subjectApi.getAll()
        if (subjRes?.success && Array.isArray(subjRes.data) && subjRes.data.length > 0) {
          setSubjects(subjRes.data)
        }
      } catch (err) {
        console.warn('Subjects fetch notice in analytics:', err.message)
      }
    }

    fetchAnalytics()
  }, [])

  const effectiveSubjects = subjects.length > 0 ? subjects : mockSubjects
  const effectiveWeekly = weeklyProgress.length > 0 ? weeklyProgress : mockWeeklyProgress

  // Metrics Calculation from real state
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Priority Breakdown
  const highPriorityTasks = tasks.filter((t) => (t.priority || '').toLowerCase() === 'high').length
  const mediumPriorityTasks = tasks.filter((t) => (t.priority || '').toLowerCase() === 'medium').length
  const lowPriorityTasks = tasks.filter((t) => (t.priority || '').toLowerCase() === 'low').length

  // Hours & Syllabus
  const totalHoursLogged = effectiveSubjects.reduce((acc, s) => acc + (s.hoursSpent || 0), 0)
  const totalTopicsOverall = effectiveSubjects.reduce((acc, s) => acc + (s.totalTopics || 0), 0)
  const totalTopicsCovered = effectiveSubjects.reduce((acc, s) => acc + (s.topicsCovered || 0), 0)
  const overallCoveragePct =
    totalTopicsOverall > 0 ? Math.round((totalTopicsCovered / totalTopicsOverall) * 100) : 0

  // Top Subject and Subject Needing Focus
  const sortedByProgress = [...effectiveSubjects].sort((a, b) => (b.progress || 0) - (a.progress || 0))
  const strongestSubject = sortedByProgress[0]
  const focusSubject = sortedByProgress[sortedByProgress.length - 1]

  // Weekly Stats
  const weeklyTotalHours = effectiveWeekly.reduce((acc, day) => acc + (day.hours || 0), 0)
  const dailyAverageHours = (weeklyTotalHours / 7).toFixed(1)
  const maxWeeklyHour = Math.max(...effectiveWeekly.map((d) => d.hours || 0), 5.5)

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="analytics"
        onTabChange={(tab) => {
          if (tab !== 'analytics' && onNavigate) {
            onNavigate(tab)
          }
        }}
        onNavigate={onNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="dashboard-main-wrapper">
        <DashboardHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          studentName={studentName}
        />

        <main className="dashboard-content-area">
          {/* 1. Header Card */}
          <section className="notes-page-header-card">
            <div className="notes-header-left">
              <div className="notes-badge-tag">
                <TrendingUp size={15} />
                <span>Performance Insights</span>
              </div>
              <h1 className="notes-page-title">Progress &amp; Study Analytics</h1>
              <p className="notes-page-subtitle">
                Comprehensive overview of your study velocity, curriculum milestones, and academic habits.
              </p>
            </div>

            <div className="notes-header-right">
              <div className="notes-semester-pill">
                <span className="sem-label">Streak Status</span>
                <span className="sem-value" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Flame size={15} style={{ color: '#f59e0b' }} />
                  <span>{streakDays} Days</span>
                </span>
              </div>
            </div>
          </section>

          {/* 2. Top Metric Cards */}
          <section className="notes-summary-stats-grid">
            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                  <Clock size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Academic Time</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{totalHoursLogged.toFixed(1)} hrs</div>
                <div className="stat-label">Total Hours Logged</div>
                <div className="stat-subtext">Across {effectiveSubjects.length} registered subjects</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <CheckCircle2 size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Task Rate</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{taskCompletionRate}%</div>
                <div className="stat-label">Task Completion Velocity</div>
                <div className="stat-subtext">{completedTasks} of {totalTasks} tasks resolved</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <BookOpen size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Coverage</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{overallCoveragePct}%</div>
                <div className="stat-label">Average Syllabus Progress</div>
                <div className="stat-subtext">{totalTopicsCovered} of {totalTopicsOverall} topics completed</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                  <Flame size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Consistency</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{streakDays} Days</div>
                <div className="stat-label">Active Study Streak</div>
                <div className="stat-subtext">Daily revision record</div>
              </div>
            </div>
          </section>

          {/* 3. Middle Section: Weekly Activity Chart + Task Breakdown */}
          <section className="dashboard-middle-grid" style={{ marginBottom: '1.5rem' }}>
            {/* Weekly Study Hours Chart */}
            <div className="dashboard-card progress-summary-card">
              <div className="card-header-row">
                <div>
                  <h2 className="card-title">Weekly Study Distribution</h2>
                  <p className="card-subtitle">
                    Total: {weeklyTotalHours.toFixed(1)} hrs • Daily Avg: {dailyAverageHours} hrs
                  </p>
                </div>
                <div className="card-status-tag positive">
                  <TrendingUp size={14} />
                  <span>Weekly Pace</span>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="weekly-chart-container" style={{ minHeight: '180px' }}>
                {effectiveWeekly.map((dayItem) => {
                  const barHeightPct = Math.min(100, ((dayItem.hours || 0) / maxWeeklyHour) * 100)
                  const isToday = (dayItem.day || '').includes('Today')

                  return (
                    <div key={dayItem.day} className={`chart-bar-column ${isToday ? 'is-today' : ''}`}>
                      <div className="bar-val-label">{dayItem.hours}h</div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            height: `${barHeightPct}%`,
                            backgroundColor: isToday ? 'var(--primary)' : 'var(--primary-border)'
                          }}
                        />
                      </div>
                      <div className="bar-day-label">{dayItem.day}</div>
                    </div>
                  )
                })}
              </div>

              {/* Progress Summary Card Footer */}
              <div className="progress-card-highlight">
                <div className="highlight-metric-box">
                  <div className="metric-num">{dailyAverageHours}h</div>
                  <div className="metric-text">Avg Daily Study</div>
                </div>
                <div className="highlight-metric-divider" />
                <div className="highlight-metric-box">
                  <div className="metric-num">30.0h</div>
                  <div className="metric-text">Target Weekly Hours</div>
                </div>
                <div className="highlight-metric-divider" />
                <div className="highlight-metric-box">
                  <div className="metric-num">{Math.round((weeklyTotalHours / 30) * 100)}%</div>
                  <div className="metric-text">Goal Attainment</div>
                </div>
              </div>
            </div>

            {/* Task Management Velocity & Priority Breakdown */}
            <div className="dashboard-card tasks-summary-card">
              <div className="card-header-row">
                <div>
                  <h2 className="card-title">Task Velocity &amp; Priorities</h2>
                  <p className="card-subtitle">
                    {completedTasks} completed • {pendingTasks} remaining tasks
                  </p>
                </div>
                <button
                  type="button"
                  className="card-header-action-btn"
                  onClick={() => onNavigate('tasks')}
                >
                  <ListTodo size={15} />
                  <span>Open Tasks</span>
                </button>
              </div>

              {/* Overall Completion Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Overall Resolution Rate</span>
                  <span style={{ color: 'var(--primary)' }}>{taskCompletionRate}%</span>
                </div>
                <div className="tasks-progress-track">
                  <div className="tasks-progress-fill" style={{ width: `${taskCompletionRate}%` }} />
                </div>
              </div>

              {/* Priority Breakdown Blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#991b1b' }}>High Priority Tasks</span>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>{highPriorityTasks}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#92400e' }}>Medium Priority Tasks</span>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e' }}>{mediumPriorityTasks}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#166534' }}>Low Priority Tasks</span>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534' }}>{lowPriorityTasks}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Subject-Wise Progress & Curriculum Mastery */}
          <section className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
            <div className="card-header-row" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h2 className="card-title">Subject-Wise Curriculum Mastery</h2>
                <p className="card-subtitle">
                  Detailed syllabus progress and study hours across registered Semester 6 courses
                </p>
              </div>
              <button
                type="button"
                className="section-link-btn"
                onClick={() => onNavigate('syllabus')}
              >
                <span>Syllabus Tracker</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {effectiveSubjects.map((sub) => {
                const covered = sub.topicsCovered || 0
                const total = sub.totalTopics || 10
                const pct = sub.progress || (total > 0 ? Math.round((covered / total) * 100) : 0)

                return (
                  <div
                    key={sub.id || sub._id}
                    style={{
                      padding: '1.1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: sub.color || '#3b82f6'
                          }}
                        />
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {sub.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          ({sub.code})
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <strong>{sub.hoursSpent || 0} hrs</strong> logged
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {covered}/{total} topics
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: sub.color || 'var(--primary)' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="tasks-progress-track" style={{ height: '7px' }}>
                      <div
                        className="tasks-progress-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: sub.color || 'var(--primary)'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 5. Academic Study Habit Insights */}
          <section className="dashboard-bottom-grid">
            {/* Strongest Subject Card */}
            {strongestSubject && (
              <div className="dashboard-card" style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', color: '#059669' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Highest Syllabus Mastery
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top academic progression</span>
                  </div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {strongestSubject.title}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  You have completed <strong>{strongestSubject.progress}%</strong> of the curriculum with {strongestSubject.hoursSpent || 0} study hours logged. Keep reviewing key formulas!
                </p>
              </div>
            )}

            {/* Focus Needed Card */}
            {focusSubject && (
              <div className="dashboard-card" style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fffbeb', color: '#d97706' }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Recommended Study Focus
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target for upcoming block</span>
                  </div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {focusSubject.title}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Currently at <strong>{focusSubject.progress}%</strong> completion. Allocating your next study session here will bring your syllabus on track for midterm exams.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default AnalyticsPage
