import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Flame,
  PlusCircle,
  Clock,
  BookOpen,
  CalendarCheck,
  ArrowRight,
  TrendingUp,
  Calendar
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatCard from '../components/dashboard/StatCard'
import TaskSummaryCard from '../components/dashboard/TaskSummaryCard'
import SubjectCard from '../components/dashboard/SubjectCard'

import { useAuth } from '../context/AuthContext'
import { dashboardApi, taskApi } from '../services/api'
import {
  mockStudentProfile,
  mockDashboardStats,
  mockTodayTasks,
  mockSubjects,
  mockUpcomingActivities,
  mockWeeklyProgress
} from '../utils/mockDashboardData'

function DashboardPage({ onNavigate }) {
  const { user } = useAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [tasks, setTasks] = useState(mockTodayTasks)
  const [subjects, setSubjects] = useState(mockSubjects)
  const [stats, setStats] = useState(mockDashboardStats)
  const [weeklyProgress, setWeeklyProgress] = useState(mockWeeklyProgress)
  const [studentName, setStudentName] = useState(user?.name || mockStudentProfile.name)
  const [streakDays, setStreakDays] = useState(user?.streakDays || mockStudentProfile.streakDays)
  const [activeQuickNotice, setActiveQuickNotice] = useState('')

  // Fetch real live stats from backend API
  const fetchDashboardData = async () => {
    try {
      const res = await dashboardApi.getStats()
      if (res?.success && res.data) {
        if (res.data.profile) {
          setStudentName(res.data.profile.name)
          setStreakDays(res.data.profile.streakDays)
        }
        if (res.data.stats) {
          setStats(res.data.stats)
        }
        if (res.data.todayTasks && res.data.todayTasks.length > 0) {
          // Normalize task IDs
          const normalized = res.data.todayTasks.map((t) => ({
            ...t,
            id: t._id || t.id,
          }))
          setTasks(normalized)
        }
        if (res.data.subjects && res.data.subjects.length > 0) {
          const normalizedSubjs = res.data.subjects.map((s) => ({
            ...s,
            id: s._id || s.id,
          }))
          setSubjects(normalizedSubjs)
        }
        if (res.data.weeklyProgress) {
          setWeeklyProgress(res.data.weeklyProgress)
        }
      }
    } catch (err) {
      console.warn('Live dashboard fetch notice:', err.message)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Toggle task completion in local state + sync to backend API
  const handleToggleTask = async (taskId) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )

    try {
      await taskApi.toggleStatus(taskId)
      // Refresh stats after toggle
      fetchDashboardData()
    } catch (err) {
      console.warn('Task toggle sync notice:', err.message)
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length

  const handleQuickAction = (actionName) => {
    setActiveQuickNotice(`"${actionName}" action triggered`)
    setTimeout(() => {
      setActiveQuickNotice('')
    }, 3500)
  }

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="dashboard"
        onTabChange={(tab) => {
          if (tab !== 'dashboard' && onNavigate) {
            onNavigate(tab)
          }
        }}
        onNavigate={onNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="dashboard-main-wrapper">
        {/* Top Header */}
        <DashboardHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          studentName={studentName}
        />

        {/* Workspace Content */}
        <main className="dashboard-content-area">
          {/* Quick Notice Banner if triggered */}
          {activeQuickNotice && (
            <div className="dashboard-notice-banner">
              <Sparkles size={16} />
              <span>{activeQuickNotice}</span>
            </div>
          )}

          {/* 1. Welcome Section */}
          <section className="dashboard-welcome-card">
            <div className="welcome-content">
              <div className="welcome-badge">
                <Sparkles size={15} />
                <span>Academic Focus Dashboard</span>
              </div>
              <h1 className="welcome-title">
                Welcome back, {studentName.split(' ')[0]}! 👋
              </h1>
              <p className="welcome-subtext">
                You have <strong>{tasks.length - completedCount} pending study tasks</strong> and <strong>2 upcoming assessments</strong> this week. Stay consistent!
              </p>
            </div>

            <div className="welcome-stats-group">
              <div className="welcome-streak-pill">
                <Flame size={18} className="streak-flame-icon" />
                <div>
                  <div className="streak-count">{streakDays}-Day Streak</div>
                  <div className="streak-sub">Consistency record</div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Today's Study Summary (4 Stat Cards) */}
          <section className="dashboard-stats-grid">
            {stats.map((stat) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                subtext={stat.subtext}
                icon={stat.icon}
                trend={stat.trend}
                trendType={stat.trendType}
              />
            ))}
          </section>

          {/* 3. Middle Section: Today's Tasks Summary + Study Progress Card */}
          <section className="dashboard-middle-grid">
            {/* Left: Today's Tasks Summary */}
            <div className="dashboard-card tasks-summary-card">
              <div className="card-header-row">
                <div>
                  <h2 className="card-title">Today's Study Tasks</h2>
                  <p className="card-subtitle">
                    {completedCount} of {tasks.length} topics completed today
                  </p>
                </div>
                <button
                  type="button"
                  className="card-header-action-btn"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('tasks')
                    } else {
                      handleQuickAction('Add Task')
                    }
                  }}
                >
                  <PlusCircle size={15} />
                  <span>Manage Tasks</span>
                </button>
              </div>

              {/* Tasks Progress Bar */}
              <div className="tasks-progress-track">
                <div
                  className="tasks-progress-fill"
                  style={{
                    width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%`
                  }}
                />
              </div>

              {/* Tasks List */}
              <div className="dashboard-tasks-list">
                {tasks.map((task) => (
                  <TaskSummaryCard
                    key={task.id}
                    task={task}
                    onToggleTask={handleToggleTask}
                  />
                ))}
              </div>
            </div>

            {/* Right: Study Progress Card / Weekly Analytics Widget */}
            <div className="dashboard-card progress-summary-card">
              <div className="card-header-row">
                <div>
                  <h2 className="card-title">Weekly Study Momentum</h2>
                  <p className="card-subtitle">
                    Target: 30.0 hrs • Logged: 27.5 hrs (92%)
                  </p>
                </div>
                <div className="card-status-tag positive">
                  <TrendingUp size={14} />
                  <span>On Pace</span>
                </div>
              </div>

              {/* Weekly Hours Bar Chart Visualization */}
              <div className="weekly-chart-container">
                {weeklyProgress.map((dayItem) => {
                  const maxDisplayHeight = 6.0
                  const barHeightPct = Math.min(100, (dayItem.hours / maxDisplayHeight) * 100)
                  const isToday = dayItem.day.includes('Today')

                  return (
                    <div key={dayItem.day} className={`chart-bar-column ${isToday ? 'is-today' : ''}`}>
                      <div className="bar-val-label">{dayItem.hours}h</div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ height: `${barHeightPct}%` }}
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
                  <div className="metric-num">3.9 hrs</div>
                  <div className="metric-text">Daily Avg Study</div>
                </div>
                <div className="highlight-metric-divider" />
                <div className="highlight-metric-box">
                  <div className="metric-num">68%</div>
                  <div className="metric-text">Syllabus Covered</div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Subject Overview Grid */}
          <section className="dashboard-section-block">
            <div className="section-title-row">
              <div>
                <h2 className="section-main-heading">Subject Overview</h2>
                <p className="section-sub-heading">
                  Semester 6 Core Curriculum • {subjects.length} Registered Subjects
                </p>
              </div>
              <button
                type="button"
                className="section-link-btn"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('subjects')
                  } else {
                    handleQuickAction('View All Subjects')
                  }
                }}
              >
                <span>View All Details</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="subjects-cards-grid">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </section>

          {/* 5. Bottom Section: Quick Action Buttons + Upcoming Study Activities */}
          <section className="dashboard-bottom-grid">
            {/* Quick Action Buttons Card */}
            <div className="dashboard-card quick-actions-card">
              <div className="card-header-row">
                <div>
                  <h2 className="card-title">Quick Actions</h2>
                  <p className="card-subtitle">Common study management shortcuts</p>
                </div>
              </div>

              <div className="quick-actions-grid">
                <button
                  type="button"
                  className="quick-action-btn primary"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('tasks')
                    } else {
                      handleQuickAction('Create New Task')
                    }
                  }}
                >
                  <PlusCircle size={18} className="qa-icon" />
                  <span className="qa-title">+ Add Task</span>
                  <span className="qa-desc">Manage academic to-do</span>
                </button>

                <button
                  type="button"
                  className="quick-action-btn"
                  onClick={() => handleQuickAction('Log Study Session')}
                >
                  <Clock size={18} className="qa-icon" />
                  <span className="qa-title">+ Log Study Block</span>
                  <span className="qa-desc">Record study hours</span>
                </button>

                <button
                  type="button"
                  className="quick-action-btn"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('notes')
                    } else {
                      handleQuickAction('Create New Note')
                    }
                  }}
                >
                  <BookOpen size={18} className="qa-icon" />
                  <span className="qa-title">+ New Note</span>
                  <span className="qa-desc">Create revision notes</span>
                </button>

                <button
                  type="button"
                  className="quick-action-btn"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('planner')
                    } else {
                      handleQuickAction('View Timetable / Planner')
                    }
                  }}
                >
                  <CalendarCheck size={18} className="qa-icon" />
                  <span className="qa-title">View Timetable / Planner</span>
                  <span className="qa-desc">Open smart study planner</span>
                </button>
              </div>
            </div>

            {/* Upcoming Study Activities Card */}
            <div className="dashboard-card upcoming-activities-card">
              <div className="card-header-row">
                <div>
                  <h2 className="card-title">Upcoming Activities</h2>
                  <p className="card-subtitle">Exams, submissions &amp; milestones</p>
                </div>
                <span className="card-status-tag warning">3 Upcoming</span>
              </div>

              <div className="upcoming-list">
                {mockUpcomingActivities.map((act) => (
                  <div key={act.id} className="upcoming-item">
                    <div className="upcoming-icon-box">
                      <Calendar size={17} />
                    </div>
                    <div className="upcoming-info">
                      <div className="upcoming-title">{act.title}</div>
                      <div className="upcoming-date">{act.date}</div>
                    </div>
                    <span className="upcoming-tag-pill">{act.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
