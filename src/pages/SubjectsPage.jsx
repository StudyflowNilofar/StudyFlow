import React, { useState, useEffect } from 'react'
import {
  Layers,
  TrendingUp,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  X,
  Filter,
  Sparkles,
  BookOpen
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import SubjectDetailCard from '../components/subjects/SubjectDetailCard'
import AddSubjectModal from '../components/subjects/AddSubjectModal'

import { useAuth } from '../context/AuthContext'
import { subjectApi } from '../services/api'
import {
  mockStudentProfile,
  mockSubjects as initialMockSubjects
} from '../utils/mockDashboardData'

function SubjectsPage({ onNavigate }) {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState(initialMockSubjects)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [noticeMessage, setNoticeMessage] = useState('')
  const studentName = user?.name || mockStudentProfile.name

  // Fetch subjects from backend
  const fetchSubjects = async () => {
    try {
      const res = await subjectApi.getAll()
      if (res?.success && res.data && res.data.length > 0) {
        const normalized = res.data.map((s) => ({
          ...s,
          id: s._id || s.id,
        }))
        setSubjects(normalized)
      }
    } catch (err) {
      console.warn('Subject fetch notice:', err.message)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  // Show temporary interactive notice toast
  const triggerNotice = (msg) => {
    setNoticeMessage(msg)
    setTimeout(() => {
      setNoticeMessage('')
    }, 3500)
  }

  // Handle adding a new subject from modal & saving to backend API
  const handleAddSubject = async (newSubjectData) => {
    const formattedPayload = {
      title: newSubjectData.name || newSubjectData.title,
      code: newSubjectData.code,
      teacher: newSubjectData.teacher || 'Course Instructor',
      totalTopics: Number(newSubjectData.totalTopics) || 10,
      description: newSubjectData.description || '',
      status: newSubjectData.status || 'In Progress',
    }

    try {
      const res = await subjectApi.create(formattedPayload)
      if (res?.success && res.data) {
        const created = {
          ...res.data,
          id: res.data._id || res.data.id,
        }
        setSubjects((prev) => [created, ...prev])
        triggerNotice(`Subject "${created.title}" (${created.code}) created and saved!`)
        return
      }
    } catch (err) {
      console.warn('Creating subject via API failed, updating local state:', err.message)
    }

    // Fallback local update
    const fallbackItem = {
      id: `subj-${Date.now()}`,
      ...formattedPayload,
      progress: 0,
      topicsCovered: 0,
      hoursSpent: 0,
      color: '#3b82f6',
    }
    setSubjects((prev) => [fallbackItem, ...prev])
    triggerNotice(`Subject "${fallbackItem.title}" (${fallbackItem.code}) added!`)
  }

  // Handle viewing subject details
  const handleViewDetails = (subject) => {
    triggerNotice(`Opening syllabus & topic breakdown for ${subject.code}: ${subject.title}`)
  }

  // Calculated Metrics
  const totalSubjectsCount = subjects.length
  const avgProgress = totalSubjectsCount > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progress || 0), 0) / totalSubjectsCount)
    : 0
  const totalTopicsCovered = subjects.reduce((sum, s) => sum + (s.topicsCovered || 0), 0)
  const totalTopicsOverall = subjects.reduce((sum, s) => sum + (s.totalTopics || 0), 0)
  const totalHoursLogged = subjects.reduce((sum, s) => sum + (s.hoursSpent || 0), 0).toFixed(1)
  const topicsCompletionRate = totalTopicsOverall > 0
    ? Math.round((totalTopicsCovered / totalTopicsOverall) * 100)
    : 0

  // Filtered Subjects List
  const filteredSubjects = subjects.filter((subj) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch = !q ||
      subj.title.toLowerCase().includes(q) ||
      subj.code.toLowerCase().includes(q) ||
      (subj.teacher && subj.teacher.toLowerCase().includes(q)) ||
      (subj.description && subj.description.toLowerCase().includes(q))

    const matchesStatus =
      statusFilter === 'All' || subj.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Filter status options
  const filterOptions = ['All', 'On Track', 'In Progress', 'Needs Focus']

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="subjects"
        onTabChange={(tab) => {
          if (tab === 'dashboard') {
            onNavigate('dashboard')
          } else if (tab === 'subjects') {
            // Already on subjects
          } else if (tab === 'planner') {
            onNavigate('planner')
          } else if (tab === 'tasks') {
            onNavigate('tasks')
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

        {/* Subjects Content Area */}
        <main className="dashboard-content-area">
          {/* Toast Notice Banner if triggered */}
          {noticeMessage && (
            <div className="dashboard-notice-banner">
              <Sparkles size={16} />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* 1. Header Banner */}
          <section className="subjects-header-banner">
            <div className="subjects-banner-content">
              <div className="banner-badge">
                <Layers size={15} />
                <span>Academic Curriculum</span>
              </div>
              <h1 className="banner-title">Semester Subjects &amp; Syllabus</h1>
              <p className="banner-subtitle">
                Track topic coverage, syllabus milestones, and study hours across all registered courses.
              </p>
            </div>

            <div className="subjects-banner-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusCircle size={17} />
                <span>+ Add Subject</span>
              </button>
            </div>
          </section>

          {/* 2. Key Metrics Summary Strip (4 KPI cards) */}
          <section className="subjects-kpi-grid">
            <div className="subject-kpi-card">
              <div className="kpi-icon-box blue">
                <Layers size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{totalSubjectsCount}</div>
                <div className="kpi-label">Enrolled Subjects</div>
                <div className="kpi-subtext">Semester 6 Core Curriculum</div>
              </div>
            </div>

            <div className="subject-kpi-card">
              <div className="kpi-icon-box green">
                <TrendingUp size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{avgProgress}%</div>
                <div className="kpi-label">Average Syllabus Progress</div>
                <div className="kpi-subtext">{topicsCompletionRate}% overall topics completed</div>
              </div>
            </div>

            <div className="subject-kpi-card">
              <div className="kpi-icon-box purple">
                <CheckCircle2 size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{totalTopicsCovered} / {totalTopicsOverall}</div>
                <div className="kpi-label">Topics Mastered</div>
                <div className="kpi-subtext">{totalTopicsOverall - totalTopicsCovered} topics remaining</div>
              </div>
            </div>

            <div className="subject-kpi-card">
              <div className="kpi-icon-box amber">
                <Clock size={20} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{totalHoursLogged} hrs</div>
                <div className="kpi-label">Total Time Invested</div>
                <div className="kpi-subtext">Logged revision blocks</div>
              </div>
            </div>
          </section>

          {/* 3. Search and Status Filter Bar */}
          <section className="subjects-filter-toolbar">
            <div className="toolbar-search-box">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by subject name, course code, teacher, or topic..."
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

            <div className="toolbar-filter-group">
              <div className="filter-label">
                <Filter size={15} />
                <span>Filter by Status:</span>
              </div>

              <div className="filter-pills-list">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`filter-pill-btn ${statusFilter === opt ? 'active' : ''}`}
                    onClick={() => setStatusFilter(opt)}
                  >
                    {opt}
                    {opt === 'All' && ` (${subjects.length})`}
                    {opt !== 'All' && ` (${subjects.filter((s) => s.status === opt).length})`}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Subject Detail Cards Grid */}
          <section className="subjects-grid-section">
            <div className="subjects-grid-header">
              <div className="results-count-text">
                Showing <strong>{filteredSubjects.length}</strong> of <strong>{subjects.length}</strong> subjects
              </div>
              {(searchQuery || statusFilter !== 'All') && (
                <button
                  type="button"
                  className="reset-filters-link"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('All')
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>

            {filteredSubjects.length > 0 ? (
              <div className="subjects-detail-grid">
                {filteredSubjects.map((subject) => (
                  <SubjectDetailCard
                    key={subject.id}
                    subject={subject}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              /* Empty State Fallback */
              <div className="subjects-empty-state">
                <div className="empty-state-icon">
                  <BookOpen size={36} />
                </div>
                <h3 className="empty-state-title">No subjects found</h3>
                <p className="empty-state-text">
                  {searchQuery || statusFilter !== 'All'
                    ? `No courses matched "${searchQuery || statusFilter}". Try adjusting your search query or filter.`
                    : 'No subjects have been added yet. Add your first semester course to get started.'}
                </p>
                <div className="empty-state-actions">
                  {(searchQuery || statusFilter !== 'All') ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchQuery('')
                        setStatusFilter('All')
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
                      <span>Add First Subject</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Add Subject Modal Dialog */}
      <AddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSubject={handleAddSubject}
      />
    </div>
  )
}

export default SubjectsPage
