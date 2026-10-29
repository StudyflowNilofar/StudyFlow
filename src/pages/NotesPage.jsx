import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Layers,
  FileText,
  Clock,
  PlusCircle,
  Search,
  X,
  Filter,
  Grid,
  List,
  Sparkles
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import NoteCard from '../components/notes/NoteCard'
import NoteModal from '../components/notes/NoteModal'
import NoteDetailModal from '../components/notes/NoteDetailModal'

import { useAuth } from '../context/AuthContext'
import { noteApi, subjectApi } from '../services/api'
import { mockStudentProfile } from '../utils/mockDashboardData'
import { mockInitialNotes, mockNoteSubjects } from '../utils/mockNotesData'

function NotesPage({ onNavigate }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState(mockInitialNotes)
  const [availableSubjects, setAvailableSubjects] = useState(mockNoteSubjects)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [readingNote, setReadingNote] = useState(null)
  const [noticeMessage, setNoticeMessage] = useState('')
  const studentName = user?.name || mockStudentProfile.name

  // Fetch live notes and subjects
  const fetchNotesData = async () => {
    try {
      const res = await noteApi.getAll()
      if (res?.success && Array.isArray(res.data)) {
        const normalized = res.data.map((n) => ({
          ...n,
          id: n._id || n.id,
        }))
        setNotes(normalized)
      }
    } catch (err) {
      console.warn('Note fetch notice:', err.message)
    }

    try {
      const subjRes = await subjectApi.getAll()
      if (subjRes?.success && Array.isArray(subjRes.data) && subjRes.data.length > 0) {
        setAvailableSubjects(subjRes.data.map((s) => s.title))
      }
    } catch (err) {
      console.warn('Subject list fetch notice:', err.message)
    }
  }

  useEffect(() => {
    fetchNotesData()
  }, [])

  // Toast feedback helper
  const triggerNotice = (msg) => {
    setNoticeMessage(msg)
    setTimeout(() => {
      setNoticeMessage('')
    }, 3500)
  }

  // Handle Save (Create / Edit)
  const handleSaveNote = async (noteData, isEdit) => {
    if (isEdit) {
      // Optimistic update
      setNotes((prev) =>
        prev.map((n) => (n.id === noteData.id ? { ...n, ...noteData, updatedAt: 'Today' } : n))
      )
      triggerNotice(`Note "${noteData.title}" updated successfully!`)

      try {
        await noteApi.update(noteData.id, noteData)
      } catch (err) {
        console.warn('Note update API notice:', err.message)
      }
    } else {
      try {
        const res = await noteApi.create(noteData)
        if (res?.success && res.data) {
          const created = {
            ...res.data,
            id: res.data._id || res.data.id,
            updatedAt: 'Today',
          }
          setNotes((prev) => [created, ...prev])
          triggerNotice(`Note "${created.title}" created successfully!`)
          return
        }
      } catch (err) {
        console.warn('Note create API notice, saving locally:', err.message)
      }

      const fallbackNote = {
        ...noteData,
        id: `note-${Date.now()}`,
        updatedAt: 'Today',
      }
      setNotes((prev) => [fallbackNote, ...prev])
      triggerNotice(`Note "${noteData.title}" created successfully!`)
    }
  }

  // Handle Delete
  const handleDeleteNote = async (noteId) => {
    const noteToDelete = notes.find((n) => n.id === noteId)
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    triggerNotice(`Note "${noteToDelete?.title || ''}" deleted.`)

    try {
      await noteApi.delete(noteId)
    } catch (err) {
      console.warn('Note delete API notice:', err.message)
    }
  }

  // Handle Edit Trigger
  const handleEditTrigger = (note) => {
    setEditingNote(note)
    setIsNoteModalOpen(true)
  }

  // Handle Create Trigger
  const handleCreateTrigger = () => {
    setEditingNote(null)
    setIsNoteModalOpen(true)
  }

  // Filtered Notes
  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      (n.topic && n.topic.toLowerCase().includes(q)) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))

    const matchesSubject = (() => {
      if (!selectedSubject || selectedSubject === 'All') return true
      const filter = selectedSubject.trim().toLowerCase()
      const noteSubj = (n.subject || '').trim().toLowerCase()
      const noteCode = (n.subjectCode || '').trim().toLowerCase()

      // Exact matches
      if (noteSubj === filter || noteCode === filter) return true

      // Substring matches in both directions
      if (noteSubj.includes(filter) || filter.includes(noteSubj)) return true
      if (noteCode && (noteCode.includes(filter) || filter.includes(noteCode))) return true

      // Alphanumeric stripped comparison
      const cleanFilter = filter.replace(/[^a-z0-9]/g, '')
      const cleanSubj = noteSubj.replace(/[^a-z0-9]/g, '')
      const cleanCode = noteCode.replace(/[^a-z0-9]/g, '')

      if (cleanFilter && (cleanSubj.includes(cleanFilter) || cleanFilter.includes(cleanSubj))) return true
      if (cleanCode && (cleanCode.includes(cleanFilter) || cleanFilter.includes(cleanCode))) return true

      return false
    })()

    return matchesSearch && matchesSubject
  })

  // Dynamic Metrics
  const totalNotesCount = notes.length
  const subjectsCoveredCount = new Set(notes.map((n) => n.subject)).size
  const uniqueTopicsCount = new Set(notes.map((n) => n.topic)).size
  const latestUpdatedDate = notes.length > 0 ? (notes[0].updatedAt || 'Today') : 'None'

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="notes"
        onTabChange={(tab) => {
          if (tab === 'dashboard') {
            onNavigate('dashboard')
          } else if (tab === 'subjects') {
            onNavigate('subjects')
          } else if (tab === 'planner') {
            onNavigate('planner')
          } else if (tab === 'tasks') {
            onNavigate('tasks')
          } else if (tab === 'notes') {
            // Already on notes
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

        {/* Notes Content Area */}
        <main className="dashboard-content-area notes-workspace-area">
          {/* Toast Notification Banner */}
          {noticeMessage && (
            <div className="dashboard-notice-banner notes-notice-banner">
              <Sparkles size={16} />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* 1. Page Header Card */}
          <section className="notes-page-header-card">
            <div className="notes-header-left">
              <div className="notes-badge-tag">
                <BookOpen size={15} />
                <span>Knowledge Base</span>
              </div>
              <h1 className="notes-page-title">My Study Notes</h1>
              <p className="notes-page-subtitle">
                Organize, review and manage your academic notes by subject and topic.
              </p>
            </div>

            <div className="notes-header-right">
              <div className="notes-semester-pill">
                <span className="sem-label">Current Term</span>
                <span className="sem-value">Semester 6</span>
              </div>
              <button
                type="button"
                className="btn btn-primary create-note-btn"
                onClick={handleCreateTrigger}
              >
                <PlusCircle size={18} />
                <span>Create Note</span>
              </button>
            </div>
          </section>

          {/* 2. Summary Metric Cards (4 Cards) */}
          <section className="notes-summary-stats-grid">
            {/* Card 1: Total Notes */}
            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper">
                  <BookOpen size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Repository</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{totalNotesCount}</div>
                <div className="stat-label">Total Notes</div>
                <div className="stat-subtext">Across Semester 6 curriculum</div>
              </div>
            </div>

            {/* Card 2: Subjects Covered */}
            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper">
                  <Layers size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Curriculum</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{subjectsCoveredCount}</div>
                <div className="stat-label">Subjects Covered</div>
                <div className="stat-subtext">Active course materials</div>
              </div>
            </div>

            {/* Card 3: Curriculum Topics */}
            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper">
                  <FileText size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Organized</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{uniqueTopicsCount}</div>
                <div className="stat-label">Curriculum Topics</div>
                <div className="stat-subtext">Structured revision units</div>
              </div>
            </div>

            {/* Card 4: Last Updated */}
            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper">
                  <Clock size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Synced</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{latestUpdatedDate}</div>
                <div className="stat-label">Last Updated</div>
                <div className="stat-subtext">Latest revision notes</div>
              </div>
            </div>
          </section>

          {/* 3. Search & Filter Toolbar */}
          <section className="notes-toolbar-card">
            {/* Search Input Box */}
            <div className="notes-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="notes-search-input"
                placeholder="Search notes by title, topic, content, or tags (e.g. QA, Newton, Pramana, Regression)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Subject Filter Dropdown */}
            <div className="notes-subject-filter-wrapper">
              <div className="filter-icon-label">
                <Filter size={15} />
                <span>Subject:</span>
              </div>
              <select
                className="notes-subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                aria-label="Filter notes by subject"
              >
                <option value="All">All Subjects ({notes.length})</option>
                {availableSubjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid / List View Mode Switcher */}
            <div className="notes-view-mode-toggle">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Switch to Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="Switch to List View"
              >
                <List size={16} />
              </button>
            </div>
          </section>

          {/* 4. Notes Grid / List Section */}
          <section className="notes-content-section">
            <div className="notes-list-header">
              <div className="results-count-text">
                Showing <strong>{filteredNotes.length}</strong> of <strong>{notes.length}</strong> study notes
              </div>
              {(searchQuery || selectedSubject !== 'All') && (
                <button
                  type="button"
                  className="reset-filters-link"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSubject('All')
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>

            {filteredNotes.length > 0 ? (
              <div className={viewMode === 'grid' ? 'notes-grid-container' : 'notes-list-container'}>
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onView={(n) => setReadingNote(n)}
                    onEdit={handleEditTrigger}
                    onDelete={handleDeleteNote}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              /* Empty State Fallback */
              <div className="notes-empty-state">
                <div className="empty-state-icon">
                  <BookOpen size={36} />
                </div>
                <h3 className="empty-state-title">No notes found</h3>
                <p className="empty-state-text">
                  {searchQuery || selectedSubject !== 'All'
                    ? `No notes matched "${searchQuery || selectedSubject}". Try adjusting your search query or reset filters.`
                    : 'You have not created any study notes yet. Click "+ Create Note" to write your first revision note!'}
                </p>
                <div className="empty-state-actions">
                  {(searchQuery || selectedSubject !== 'All') ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedSubject('All')
                      }}
                    >
                      Clear Search &amp; Filters
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleCreateTrigger}
                    >
                      <PlusCircle size={16} />
                      <span>Create First Note</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Create / Edit Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSaveNote={handleSaveNote}
        editingNote={editingNote}
        subjects={availableSubjects}
      />

      {/* Note Detail Reading Modal */}
      <NoteDetailModal
        note={readingNote}
        isOpen={Boolean(readingNote)}
        onClose={() => setReadingNote(null)}
        onEditNote={handleEditTrigger}
        onCopyNotice={triggerNotice}
      />
    </div>
  )
}

export default NotesPage
