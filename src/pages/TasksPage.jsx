import React, { useState, useEffect } from 'react'
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Search,
  X,
  Filter,
  Sparkles,
  ListTodo
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import TaskItem from '../components/tasks/TaskItem'
import AddTaskModal from '../components/tasks/AddTaskModal'

import { useAuth } from '../context/AuthContext'
import { taskApi, subjectApi } from '../services/api'
import { mockStudentProfile } from '../utils/mockDashboardData'
import { mockInitialTasks, mockEnrolledSubjects } from '../utils/mockTasksData'

function TasksPage({ onNavigate }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState(mockInitialTasks)
  const [subjectsList, setSubjectsList] = useState(mockEnrolledSubjects)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [noticeMessage, setNoticeMessage] = useState('')
  const studentName = user?.name || mockStudentProfile.name

  // Fetch tasks and subjects from backend
  const fetchTasksData = async () => {
    try {
      const res = await taskApi.getAll()
      if (res?.success && res.data && res.data.length > 0) {
        const normalized = res.data.map((t) => ({
          ...t,
          id: t._id || t.id,
        }))
        setTasks(normalized)
      }
    } catch (err) {
      console.warn('Task fetch notice:', err.message)
    }

    try {
      const subjRes = await subjectApi.getAll()
      if (subjRes?.success && subjRes.data && subjRes.data.length > 0) {
        setSubjectsList(subjRes.data.map((s) => s.title))
      }
    } catch (err) {
      console.warn('Subject list fetch notice:', err.message)
    }
  }

  useEffect(() => {
    fetchTasksData()
  }, [])

  // Toast feedback
  const triggerNotice = (msg) => {
    setNoticeMessage(msg)
    setTimeout(() => {
      setNoticeMessage('')
    }, 3500)
  }

  // Toggle task completion
  const handleToggleComplete = async (taskId) => {
    // Optimistic local state update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed
          triggerNotice(
            nextState
              ? `Task "${t.title}" marked as completed! 🎉`
              : `Task "${t.title}" marked as pending.`
          )
          return { ...t, completed: nextState }
        }
        return t
      })
    )

    try {
      await taskApi.toggleStatus(taskId)
    } catch (err) {
      console.warn('Task toggle API notice:', err.message)
    }
  }

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    triggerNotice(`Task "${taskToDelete?.title || ''}" deleted successfully.`)

    try {
      await taskApi.delete(taskId)
    } catch (err) {
      console.warn('Task delete API notice:', err.message)
    }
  }

  // Add task
  const handleAddTask = async (newTask) => {
    try {
      const res = await taskApi.create({
        title: newTask.title,
        subject: newTask.subject,
        subjectCode: newTask.subjectCode || '',
        description: newTask.description || '',
        dueDate: newTask.dueDate || 'Today',
        priority: newTask.priority || 'Medium',
        estimatedMinutes: newTask.estimatedMinutes || 45,
      })

      if (res?.success && res.data) {
        const created = {
          ...res.data,
          id: res.data._id || res.data.id,
        }
        setTasks((prev) => [created, ...prev])
        triggerNotice(`New task "${created.title}" added to your study schedule!`)
        return
      }
    } catch (err) {
      console.warn('Task creation API notice, saving locally:', err.message)
    }

    // Local fallback
    setTasks((prev) => [newTask, ...prev])
    triggerNotice(`New task "${newTask.title}" added to your study schedule!`)
  }

  // Calculated Metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const highPriorityPending = tasks.filter((t) => t.priority === 'High' && !t.completed).length

  // Filtered Task List
  const filteredTasks = tasks.filter((t) => {
    // 1. Search Query
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))

    // 2. Status Filter
    let matchesStatus = true
    if (statusFilter === 'Pending') {
      matchesStatus = !t.completed
    } else if (statusFilter === 'Completed') {
      matchesStatus = t.completed
    } else if (statusFilter === 'High Priority') {
      matchesStatus = t.priority === 'High'
    }

    // 3. Subject Filter
    let matchesSubject = true
    if (selectedSubject !== 'All') {
      matchesSubject = t.subject === selectedSubject
    }

    return matchesSearch && matchesStatus && matchesSubject
  })

  const statusOptions = ['All', 'Pending', 'Completed', 'High Priority']

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="tasks"
        onTabChange={(tab) => {
          if (tab === 'dashboard') {
            onNavigate('dashboard')
          } else if (tab === 'subjects') {
            onNavigate('subjects')
          } else if (tab === 'planner') {
            onNavigate('planner')
          } else if (tab === 'tasks') {
            // Already on tasks
          } else if (tab === 'notes') {
            onNavigate('notes')
          } else {
            triggerNotice(`Switched to ${tab.charAt(0).toUpperCase() + tab.slice(1)} view`)
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

        {/* Tasks Content Area */}
        <main className="dashboard-content-area">
          {/* Toast Notice Banner if triggered */}
          {noticeMessage && (
            <div className="dashboard-notice-banner">
              <Sparkles size={16} />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* 1. Header Banner */}
          <section className="tasks-header-banner">
            <div className="tasks-banner-content">
              <div className="banner-badge">
                <CheckSquare size={15} />
                <span>Task Manager</span>
              </div>
              <h1 className="banner-title">Study Tasks &amp; Assignments</h1>
              <p className="banner-subtitle">
                Organize homework, revision checkpoints, exam problem sets, and submission deadlines.
              </p>
            </div>

            <div className="tasks-banner-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusCircle size={17} />
                <span>+ Add Study Task</span>
              </button>
            </div>
          </section>

          {/* 2. Key Metrics Summary Strip (4 KPI cards) */}
          <section className="tasks-kpi-grid">
            <div className="task-kpi-card">
              <div className="kpi-icon-box blue">
                <ListTodo size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{totalTasks}</div>
                <div className="kpi-label">Total Assigned Tasks</div>
                <div className="kpi-subtext">Across all subjects</div>
              </div>
            </div>

            <div className="task-kpi-card">
              <div className="kpi-icon-box amber">
                <Clock size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{pendingTasks}</div>
                <div className="kpi-label">Pending Deadlines</div>
                <div className="kpi-subtext">{highPriorityPending} high priority items</div>
              </div>
            </div>

            <div className="task-kpi-card">
              <div className="kpi-icon-box green">
                <CheckCircle2 size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{completedTasks}</div>
                <div className="kpi-label">Completed Tasks</div>
                <div className="kpi-subtext">{completionPercentage}% task completion rate</div>
              </div>
            </div>

            <div className="task-kpi-card">
              <div className="kpi-icon-box red">
                <AlertCircle size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{highPriorityPending}</div>
                <div className="kpi-label">High Priority Pending</div>
                <div className="kpi-subtext">Requires immediate focus</div>
              </div>
            </div>
          </section>

          {/* 3. Search and Multi-Filter Toolbar */}
          <section className="tasks-filter-toolbar">
            <div className="toolbar-search-box">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks by topic, description, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="toolbar-filters-row">
              {/* Status Filter Pills */}
              <div className="filter-group">
                <div className="filter-label">
                  <Filter size={14} />
                  <span>Status:</span>
                </div>
                <div className="filter-pills-list">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`filter-pill-btn ${statusFilter === opt ? 'active' : ''}`}
                      onClick={() => setStatusFilter(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Dropdown Filter */}
              <div className="filter-group subject-select-group">
                <div className="filter-label">
                  <span>Subject:</span>
                </div>
                <select
                  className="subject-dropdown-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="All">All Subjects</option>
                  {subjectsList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 4. Task Items List */}
          <section className="tasks-list-section">
            <div className="tasks-list-header">
              <div className="results-count-text">
                Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> study tasks
              </div>
              {(searchQuery || statusFilter !== 'All' || selectedSubject !== 'All') && (
                <button
                  type="button"
                  className="reset-filters-link"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('All')
                    setSelectedSubject('All')
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>

            {filteredTasks.length > 0 ? (
              <div className="tasks-cards-stack">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              /* Empty State Fallback */
              <div className="tasks-empty-state">
                <div className="empty-state-icon">
                  <CheckSquare size={36} />
                </div>
                <h3 className="empty-state-title">No study tasks found</h3>
                <p className="empty-state-text">
                  {searchQuery || statusFilter !== 'All' || selectedSubject !== 'All'
                    ? 'No tasks matched your current search and filter criteria. Try clearing or adjusting your filters.'
                    : 'Your task list is completely clear! Click the button below to add your first study task.'}
                </p>
                <div className="empty-state-actions">
                  {(searchQuery || statusFilter !== 'All' || selectedSubject !== 'All') ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchQuery('')
                        setStatusFilter('All')
                        setSelectedSubject('All')
                      }}
                    >
                      Clear Search &amp; Filters
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <PlusCircle size={16} />
                      <span>Create New Task</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Add Task Modal Dialog */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
        availableSubjects={subjectsList}
      />
    </div>
  )
}

export default TasksPage
