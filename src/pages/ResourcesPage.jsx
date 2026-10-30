import React, { useState, useEffect } from 'react'
import {
  FolderGit2,
  FileText,
  Video,
  Globe,
  GitBranch,
  BookOpen,
  PlusCircle,
  Search,
  ExternalLink,
  Trash2,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { useAuth } from '../context/AuthContext'
import { resourceApi, subjectApi } from '../services/api'
import { mockStudentProfile } from '../utils/mockDashboardData'

// Starter fallback resources if network / database has not yet synced
const DEFAULT_RESOURCES = [
  {
    id: 'res-1',
    title: 'IEEE 829 Standard Test Documentation Guide',
    subject: 'Software Testing & QA',
    type: 'Document',
    url: 'https://en.wikipedia.org/wiki/IEEE_829',
    description: 'Guidelines on test plans, test design specs, test case specifications, and test logging.'
  },
  {
    id: 'res-2',
    title: 'Baudhayana Sulba Sutras Geometric Proofs PDF',
    subject: 'Indian Knowledge Systems',
    type: 'Document',
    url: 'https://archive.org/details/Sulbasutras',
    description: 'Primary text translations and geometric diagrams for ancient Vedic altar measurements.'
  },
  {
    id: 'res-3',
    title: 'AI Search Algorithms & Heuristics Visualizer',
    subject: 'Artificial Intelligence',
    type: 'Website',
    url: 'https://qiao.github.io/PathFinding.js/visual/',
    description: 'Interactive visualization for A*, Dijkstra, Breadth-First, and Best-First search algorithms.'
  },
  {
    id: 'res-4',
    title: 'OWASP Top 10 Security Vulnerabilities Cheat Sheet',
    subject: 'Cyber Security & Forensics',
    type: 'Website',
    url: 'https://owasp.org/www-project-top-ten/',
    description: 'Essential reference guide for identifying, mitigating and auditing web security flaws.'
  },
  {
    id: 'res-5',
    title: 'Selenium WebDriver Automation Framework Repository',
    subject: 'Software Testing & QA',
    type: 'Repository',
    url: 'https://github.com/SeleniumHQ/selenium',
    description: 'Official browser automation tools and code samples for integration test suites.'
  }
]

function ResourcesPage({ onNavigate }) {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('ALL')
  const [selectedType, setSelectedType] = useState('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    type: 'Document',
    url: '',
    description: ''
  })
  const [formError, setFormError] = useState('')

  const studentName = user?.name || mockStudentProfile.name

  // Fetch resources & registered subjects
  const loadResourcesAndSubjects = async () => {
    try {
      const res = await resourceApi.getAll()
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setResources(res.data.map((r) => ({ ...r, id: r._id || r.id })))
      } else {
        setResources(DEFAULT_RESOURCES)
      }
    } catch (err) {
      console.warn('Resource fetch notice:', err.message)
      setResources(DEFAULT_RESOURCES)
    }

    try {
      const subjRes = await subjectApi.getAll()
      if (subjRes?.success && Array.isArray(subjRes.data) && subjRes.data.length > 0) {
        const subList = subjRes.data.map((s) => s.title)
        setAvailableSubjects(subList)
        if (!formData.subject) {
          setFormData((prev) => ({ ...prev, subject: subList[0] }))
        }
      } else {
        setAvailableSubjects([
          'Software Testing & QA',
          'Indian Knowledge Systems',
          'Artificial Intelligence',
          'Cyber Security & Forensics'
        ])
      }
    } catch (err) {
      console.warn('Subject list fetch notice in resources:', err.message)
    }
  }

  useEffect(() => {
    loadResourcesAndSubjects()
  }, [])

  const triggerNotice = (msg) => {
    setNoticeMessage(msg)
    setTimeout(() => {
      setNoticeMessage('')
    }, 3500)
  }

  // Safe URL Validator & Opener
  const handleOpenUrl = (rawUrl) => {
    if (!rawUrl) return
    let trimmed = rawUrl.trim()
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`
    }

    try {
      const parsed = new URL(trimmed)
      if (['http:', 'https:'].includes(parsed.protocol)) {
        window.open(parsed.href, '_blank', 'noopener,noreferrer')
      } else {
        triggerNotice('Invalid URL protocol. Only web links are supported.')
      }
    } catch {
      triggerNotice('Invalid link format. Please check the URL.')
    }
  }

  // Handle Create Resource
  const handleCreateResource = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.title.trim() || !formData.subject.trim()) {
      setFormError('Please enter a resource title and select a subject.')
      return
    }

    let cleanUrl = formData.url.trim()
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`
    }

    const payload = {
      title: formData.title.trim(),
      subject: formData.subject.trim(),
      type: formData.type,
      url: cleanUrl,
      description: formData.description.trim()
    }

    try {
      const res = await resourceApi.create(payload)
      if (res?.success && res.data) {
        const created = { ...res.data, id: res.data._id || res.data.id }
        setResources((prev) => [created, ...prev])
        triggerNotice(`Resource "${created.title}" added successfully!`)
        setIsAddModalOpen(false)
        setFormData({
          title: '',
          subject: availableSubjects[0] || '',
          type: 'Document',
          url: '',
          description: ''
        })
        return
      }
    } catch (err) {
      console.warn('Resource API create notice, adding locally:', err.message)
    }

    // Local fallback
    const fallbackRes = {
      ...payload,
      id: `res-${Date.now()}`
    }
    setResources((prev) => [fallbackRes, ...prev])
    triggerNotice(`Resource "${fallbackRes.title}" added!`)
    setIsAddModalOpen(false)
    setFormData({
      title: '',
      subject: availableSubjects[0] || '',
      type: 'Document',
      url: '',
      description: ''
    })
  }

  // Handle Delete Resource
  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) return

    setResources((prev) => prev.filter((r) => r.id !== id))
    triggerNotice(`Removed resource "${title}"`)

    try {
      await resourceApi.delete(id)
    } catch (err) {
      console.warn('Resource delete API notice:', err.message)
    }
  }

  // Type Icon Resolver
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video':
        return <Video size={18} />
      case 'Website':
        return <Globe size={18} />
      case 'Repository':
        return <GitBranch size={18} />
      case 'Textbook':
        return <BookOpen size={18} />
      default:
        return <FileText size={18} />
    }
  }

  // Filtered List
  const filteredResources = resources.filter((r) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      r.subject.toLowerCase().includes(q)

    const matchesSubject = selectedSubject === 'ALL' || r.subject === selectedSubject
    const matchesType = selectedType === 'ALL' || r.type === selectedType

    return matchesSearch && matchesSubject && matchesType
  })

  // Summary Counts
  const docCount = resources.filter((r) => r.type === 'Document').length
  const webCount = resources.filter((r) => r.type === 'Website').length
  const repoCount = resources.filter((r) => r.type === 'Repository').length

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="resources"
        onTabChange={(tab) => {
          if (tab !== 'resources' && onNavigate) {
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
          {/* Toast Notification Banner */}
          {noticeMessage && (
            <div className="dashboard-notice-banner">
              <Sparkles size={16} />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* 1. Page Header Card */}
          <section className="notes-page-header-card">
            <div className="notes-header-left">
              <div className="notes-badge-tag">
                <FolderGit2 size={15} />
                <span>Reference Materials</span>
              </div>
              <h1 className="notes-page-title">Study Resources</h1>
              <p className="notes-page-subtitle">
                Access and organize documentation, textbooks, lab repositories, and curriculum reference links.
              </p>
            </div>

            <div className="notes-header-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusCircle size={18} />
                <span>+ Add Resource</span>
              </button>
            </div>
          </section>

          {/* 2. Summary Metrics */}
          <section className="notes-summary-stats-grid">
            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                  <FolderGit2 size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Library</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{resources.length}</div>
                <div className="stat-label">Total Resources</div>
                <div className="stat-subtext">Across Semester 6 courses</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <FileText size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Documents</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{docCount}</div>
                <div className="stat-label">Documents &amp; PDFs</div>
                <div className="stat-subtext">Standard guides &amp; specs</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Globe size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Web Portals</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{webCount}</div>
                <div className="stat-label">Websites &amp; Tools</div>
                <div className="stat-subtext">Interactive simulators</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                  <GitBranch size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Code</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{repoCount}</div>
                <div className="stat-label">Code Repositories</div>
                <div className="stat-subtext">Practical frameworks</div>
              </div>
            </div>
          </section>

          {/* 3. Search & Filter Bar */}
          <section className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Search input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 280px', position: 'relative' }}>
                <Search size={17} style={{ position: 'absolute', left: '0.85rem', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search resources by title, subject, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem 0.55rem 2.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Subject & Type Dropdowns */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="ALL">All Subjects</option>
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.85rem',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="ALL">All Types</option>
                  <option value="Document">Documents</option>
                  <option value="Video">Videos</option>
                  <option value="Website">Websites</option>
                  <option value="Repository">Repositories</option>
                  <option value="Textbook">Textbooks</option>
                </select>
              </div>
            </div>
          </section>

          {/* 4. Resources Grid */}
          {filteredResources.length === 0 ? (
            <div
              className="dashboard-card"
              style={{ padding: '3rem 1.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}
            >
              <FolderGit2 size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                No resources found
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Try adjusting your search criteria or add a new academic resource.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                + Add Resource
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="dashboard-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.35rem',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Header badge & type */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '9999px',
                          backgroundColor: '#e0f2fe',
                          color: '#0284c7'
                        }}
                      >
                        {getTypeIcon(resource.type)}
                        <span>{resource.type}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteResource(resource.id, resource.title)}
                        title="Delete resource"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          padding: '0.25rem',
                          borderRadius: '4px'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                      {resource.title}
                    </h3>

                    {/* Subject tag */}
                    <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', backgroundColor: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
                      {resource.subject}
                    </div>

                    {/* Description */}
                    {resource.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {resource.description}
                      </p>
                    )}
                  </div>

                  {/* Action Link Footer */}
                  {resource.url && (
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenUrl(resource.url)}
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '0.45rem 0.85rem', fontSize: '0.85rem', gap: '0.4rem' }}
                      >
                        <span>Open Resource Link</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Resource Modal */}
          {isAddModalOpen && (
            <div
              className="modal-backdrop"
              onClick={() => setIsAddModalOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
                padding: '1rem'
              }}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  width: '100%',
                  maxWidth: '520px',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Add Study Resource
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {formError && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#fef2f2',
                      color: '#b91c1c',
                      fontSize: '0.85rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Resource Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. A* Search Algorithm Interactive Visualizer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.9rem'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                        Subject *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.85rem',
                          backgroundColor: '#ffffff'
                        }}
                        required
                      >
                        {availableSubjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                        Resource Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.85rem',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <option value="Document">Document / PDF</option>
                        <option value="Website">Website / Portal</option>
                        <option value="Video">Video Lecture</option>
                        <option value="Repository">GitHub Repository</option>
                        <option value="Textbook">Textbook Reference</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Web Link / URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://github.com/... or https://owasp.org/..."
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Description / Key Takeaways
                    </label>
                    <textarea
                      placeholder="Brief notes on what this resource covers..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Resource
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ResourcesPage
