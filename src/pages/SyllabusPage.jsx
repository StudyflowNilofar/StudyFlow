import React, { useState, useEffect } from 'react'
import {
  ListChecks,
  CheckCircle2,
  Circle,
  PlusCircle,
  BookOpen,
  Sparkles,
  TrendingUp,
  Layers,
  Filter,
  X
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { useAuth } from '../context/AuthContext'
import { subjectApi } from '../services/api'
import { mockSubjects, mockStudentProfile } from '../utils/mockDashboardData'

// Initial syllabus topics seed for subjects that don't have topics stored yet
const DEFAULT_TOPICS_BY_CODE = {
  'STQA-601': [
    { id: 'stqa-1', unit: 'Unit 1: Fundamentals', title: 'Software Quality Assurance Principles & Metrics', completed: true },
    { id: 'stqa-2', unit: 'Unit 1: Fundamentals', title: 'Verification vs Validation Standards', completed: true },
    { id: 'stqa-3', unit: 'Unit 2: Dynamic Testing', title: 'Boundary Value Analysis & Equivalence Partitioning', completed: true },
    { id: 'stqa-4', unit: 'Unit 2: Dynamic Testing', title: 'Decision Table & Cause-Effect Graphing', completed: true },
    { id: 'stqa-5', unit: 'Unit 2: Dynamic Testing', title: 'Basis Path Testing & Cyclomatic Complexity', completed: true },
    { id: 'stqa-6', unit: 'Unit 3: Integration & System', title: 'Top-down & Bottom-up Integration Strategies', completed: true },
    { id: 'stqa-7', unit: 'Unit 3: Integration & System', title: 'Regression Testing & Automated Test Suites', completed: true },
    { id: 'stqa-8', unit: 'Unit 4: Specialized Testing', title: 'Security & Penetration Testing Protocols', completed: true },
    { id: 'stqa-9', unit: 'Unit 4: Specialized Testing', title: 'Performance, Stress & Load Benchmarking', completed: true },
    { id: 'stqa-10', unit: 'Unit 5: Automation Tools', title: 'Selenium WebDriver Test Scripts', completed: false },
    { id: 'stqa-11', unit: 'Unit 5: Automation Tools', title: 'CI/CD Pipeline Test Automation', completed: false },
    { id: 'stqa-12', unit: 'Unit 5: Automation Tools', title: 'Test Metrics, Defect Density & Sign-off', completed: false }
  ],
  'IKS-602': [
    { id: 'iks-1', unit: 'Unit 1: Vedic Mathematics', title: 'Baudhayana Sulba Sutras Geometric Formulations', completed: true },
    { id: 'iks-2', unit: 'Unit 1: Vedic Mathematics', title: 'Decimal System, Place Value & Zero Concept', completed: true },
    { id: 'iks-3', unit: 'Unit 2: Astronomical Sciences', title: 'Aryabhatiya Planetary Motion Models', completed: true },
    { id: 'iks-4', unit: 'Unit 2: Astronomical Sciences', title: 'Calendar Systems & Yuga Cycles', completed: true },
    { id: 'iks-5', unit: 'Unit 3: Traditional Metallurgy', title: 'Wootz Steel Manufacturing & Rustless Pillars', completed: true },
    { id: 'iks-6', unit: 'Unit 3: Traditional Metallurgy', title: 'Zinc Distillation at Zawar', completed: true },
    { id: 'iks-7', unit: 'Unit 4: Ancient Architecture', title: 'Vastu Shastra Town Planning & Acoustic Design', completed: false },
    { id: 'iks-8', unit: 'Unit 4: Ancient Architecture', title: 'Water Management Systems in Harappan Era', completed: false },
    { id: 'iks-9', unit: 'Unit 5: Holistic Health', title: 'Ayurveda Tridosha Principles & Botanical Taxonomy', completed: false },
    { id: 'iks-10', unit: 'Unit 5: Holistic Health', title: 'Ethics in Classical Indian Thought', completed: false }
  ],
  'AI-603': [
    { id: 'ai-1', unit: 'Unit 1: Problem Formulation', title: 'Intelligent Agent Environments & Task Environments', completed: true },
    { id: 'ai-2', unit: 'Unit 1: Problem Formulation', title: 'State Space Search & Uninformed Search Methods', completed: true },
    { id: 'ai-3', unit: 'Unit 2: Heuristic Search', title: 'A* Search, Heuristic Admissibility & Consistency', completed: true },
    { id: 'ai-4', unit: 'Unit 2: Heuristic Search', title: 'Hill Climbing & Local Search Optima', completed: true },
    { id: 'ai-5', unit: 'Unit 3: Adversarial Games', title: 'Minimax Algorithm & Alpha-Beta Pruning', completed: true },
    { id: 'ai-6', unit: 'Unit 3: Adversarial Games', title: 'Constraint Satisfaction Problems (CSP)', completed: true },
    { id: 'ai-7', unit: 'Unit 4: Knowledge & Logic', title: 'First-Order Propositional Logic & Resolution', completed: true },
    { id: 'ai-8', unit: 'Unit 4: Knowledge & Logic', title: 'Forward & Backward Chaining Inference', completed: true },
    { id: 'ai-9', unit: 'Unit 5: Machine Learning', title: 'Supervised Learning & Decision Trees', completed: true },
    { id: 'ai-10', unit: 'Unit 5: Machine Learning', title: 'Artificial Neural Networks & Backpropagation', completed: true },
    { id: 'ai-11', unit: 'Unit 5: Machine Learning', title: 'K-Means Clustering & Unsupervised Grouping', completed: true },
    { id: 'ai-12', unit: 'Unit 6: Probabilistic Models', title: 'Bayesian Networks & Conditional Independence', completed: true },
    { id: 'ai-13', unit: 'Unit 6: Probabilistic Models', title: 'Markov Decision Processes (MDP)', completed: false },
    { id: 'ai-14', unit: 'Unit 6: Probabilistic Models', title: 'Reinforcement Learning Q-Learning Foundations', completed: false }
  ],
  'CSF-604': [
    { id: 'csf-1', unit: 'Unit 1: Security Architecture', title: 'CIA Triad & Threat Vector Classification', completed: true },
    { id: 'csf-2', unit: 'Unit 1: Security Architecture', title: 'Symmetric vs Asymmetric Cryptography Fundamentals', completed: true },
    { id: 'csf-3', unit: 'Unit 2: Cryptographic Protocols', title: 'RSA, ECC & Diffie-Hellman Key Exchange', completed: true },
    { id: 'csf-4', unit: 'Unit 2: Cryptographic Protocols', title: 'SHA-256 Hashing & Digital Signatures', completed: true },
    { id: 'csf-5', unit: 'Unit 3: Network Security', title: 'Firewalls, IDS/IPS & DMZ Configuration', completed: true },
    { id: 'csf-6', unit: 'Unit 3: Network Security', title: 'TLS/SSL Handshake & HTTPS Hardening', completed: false },
    { id: 'csf-7', unit: 'Unit 4: Forensics & Incident Response', title: 'Evidence Preservation & Chain of Custody', completed: false },
    { id: 'csf-8', unit: 'Unit 4: Forensics & Incident Response', title: 'Disk Imaging & Memory Forensics Analysis', completed: false },
    { id: 'csf-9', unit: 'Unit 5: Vulnerability Assessment', title: 'OWASP Top 10 Web Vulnerabilities & Remediation', completed: false },
    { id: 'csf-10', unit: 'Unit 5: Vulnerability Assessment', title: 'Penetration Testing Methodology & Report Drafting', completed: false },
    { id: 'csf-11', unit: 'Unit 5: Vulnerability Assessment', title: 'Ethical Hacking Lab Scenarios', completed: false }
  ]
}

function SyllabusPage({ onNavigate }) {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('ALL')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState('')
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false)
  const [newTopicData, setNewTopicData] = useState({
    subjectId: '',
    unit: 'Unit 1',
    title: ''
  })

  const studentName = user?.name || mockStudentProfile.name

  // Load subjects & attach topic checklists
  const loadSubjectsWithTopics = async () => {
    try {
      const res = await subjectApi.getAll()
      let rawSubjects = []
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        rawSubjects = res.data
      } else {
        rawSubjects = mockSubjects
      }

      // Ensure each subject has an initialized `topics` array
      const initialized = rawSubjects.map((s) => {
        const id = s._id || s.id
        let topics = s.topics

        if (!topics || topics.length === 0) {
          const defaultList = DEFAULT_TOPICS_BY_CODE[s.code]
          if (defaultList) {
            topics = defaultList
          } else {
            // Generate structured topics based on totalTopics and topicsCovered
            const count = s.totalTopics || 8
            const covered = s.topicsCovered || 0
            topics = Array.from({ length: count }, (_, idx) => ({
              id: `${id}-topic-${idx + 1}`,
              unit: `Unit ${Math.floor(idx / 3) + 1}`,
              title: `Core Concept & Lab Milestone ${idx + 1}`,
              completed: idx < covered
            }))
          }
        }

        const topicsCovered = topics.filter((t) => t.completed).length
        const totalTopics = topics.length
        const progress = totalTopics > 0 ? Math.round((topicsCovered / totalTopics) * 100) : 0

        return {
          ...s,
          id,
          topics,
          topicsCovered,
          totalTopics,
          progress
        }
      })

      setSubjects(initialized)
      if (initialized.length > 0 && !newTopicData.subjectId) {
        setNewTopicData((prev) => ({ ...prev, subjectId: initialized[0].id }))
      }
    } catch (err) {
      console.warn('Syllabus subjects fetch notice:', err.message)
      // Fallback
      const fallback = mockSubjects.map((s) => ({
        ...s,
        id: s.id || s._id,
        topics: DEFAULT_TOPICS_BY_CODE[s.code] || []
      }))
      setSubjects(fallback)
    }
  }

  useEffect(() => {
    loadSubjectsWithTopics()
  }, [])

  const triggerNotice = (msg) => {
    setNoticeMessage(msg)
    setTimeout(() => {
      setNoticeMessage('')
    }, 3500)
  }

  // Toggle topic completion
  const handleToggleTopic = async (subjectId, topicId) => {
    const targetSubject = subjects.find((s) => s.id === subjectId)
    if (!targetSubject) return

    const updatedTopics = targetSubject.topics.map((t) =>
      t.id === topicId ? { ...t, completed: !t.completed } : t
    )

    const topicsCovered = updatedTopics.filter((t) => t.completed).length
    const totalTopics = updatedTopics.length
    const progress = totalTopics > 0 ? Math.round((topicsCovered / totalTopics) * 100) : 0
    const status = progress >= 80 ? 'On Track' : progress >= 50 ? 'In Progress' : 'Needs Focus'

    // Optimistic UI update
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, topics: updatedTopics, topicsCovered, totalTopics, progress, status }
          : s
      )
    )

    const toggledTopic = updatedTopics.find((t) => t.id === topicId)
    triggerNotice(
      `Marked "${toggledTopic.title}" as ${toggledTopic.completed ? 'completed' : 'pending'}`
    )

    // Sync to backend if available
    try {
      await subjectApi.update(subjectId, {
        topics: updatedTopics,
        topicsCovered,
        totalTopics,
        progress,
        status
      })
    } catch (err) {
      console.warn('Syllabus sync API notice:', err.message)
    }
  }

  // Add new topic
  const handleAddTopic = async (e) => {
    e.preventDefault()
    if (!newTopicData.title.trim() || !newTopicData.subjectId) return

    const targetSubject = subjects.find((s) => s.id === newTopicData.subjectId)
    if (!targetSubject) return

    const newTopic = {
      id: `topic-${Date.now()}`,
      unit: newTopicData.unit.trim() || 'Unit 1',
      title: newTopicData.title.trim(),
      completed: false
    }

    const updatedTopics = [...targetSubject.topics, newTopic]
    const totalTopics = updatedTopics.length
    const topicsCovered = updatedTopics.filter((t) => t.completed).length
    const progress = totalTopics > 0 ? Math.round((topicsCovered / totalTopics) * 100) : 0

    setSubjects((prev) =>
      prev.map((s) =>
        s.id === newTopicData.subjectId
          ? { ...s, topics: updatedTopics, totalTopics, topicsCovered, progress }
          : s
      )
    )

    triggerNotice(`Added topic "${newTopic.title}" to ${targetSubject.title}`)
    setIsAddTopicModalOpen(false)
    setNewTopicData((prev) => ({ ...prev, title: '' }))

    // Persist to backend
    try {
      await subjectApi.update(newTopicData.subjectId, {
        topics: updatedTopics,
        totalTopics,
        topicsCovered,
        progress
      })
    } catch (err) {
      console.warn('Subject topic add sync notice:', err.message)
    }
  }

  // Summary Metrics
  const totalTopicsOverall = subjects.reduce((sum, s) => sum + (s.totalTopics || 0), 0)
  const totalTopicsCovered = subjects.reduce((sum, s) => sum + (s.topicsCovered || 0), 0)
  const overallCoveragePct =
    totalTopicsOverall > 0 ? Math.round((totalTopicsCovered / totalTopicsOverall) * 100) : 0

  const onTrackCount = subjects.filter((s) => s.progress >= 70).length

  // Filtered Subject List
  const displayedSubjects =
    selectedSubjectId === 'ALL'
      ? subjects
      : subjects.filter((s) => s.id === selectedSubjectId)

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="syllabus"
        onTabChange={(tab) => {
          if (tab !== 'syllabus' && onNavigate) {
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

          {/* 1. Header Card */}
          <section className="notes-page-header-card">
            <div className="notes-header-left">
              <div className="notes-badge-tag">
                <ListChecks size={15} />
                <span>Curriculum Tracker</span>
              </div>
              <h1 className="notes-page-title">Syllabus Tracker</h1>
              <p className="notes-page-subtitle">
                Track topic-wise progress, exam syllabus milestones, and curriculum coverage across your registered subjects.
              </p>
            </div>

            <div className="notes-header-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsAddTopicModalOpen(true)}
              >
                <PlusCircle size={18} />
                <span>+ Add Syllabus Topic</span>
              </button>
            </div>
          </section>

          {/* 2. Top Summary KPI Row */}
          <section className="notes-summary-stats-grid">
            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                  <TrendingUp size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Curriculum</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{overallCoveragePct}%</div>
                <div className="stat-label">Average Syllabus Coverage</div>
                <div className="stat-subtext">{totalTopicsCovered} of {totalTopicsOverall} total topics marked complete</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <CheckCircle2 size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Completed</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{totalTopicsCovered}</div>
                <div className="stat-label">Completed Topics</div>
                <div className="stat-subtext">Verified academic concepts</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Layers size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Pending</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{totalTopicsOverall - totalTopicsCovered}</div>
                <div className="stat-label">Remaining Topics</div>
                <div className="stat-subtext">Topics scheduled for upcoming study blocks</div>
              </div>
            </div>

            <div className="notes-stat-card">
              <div className="stat-card-top">
                <div className="stat-icon-wrapper" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                  <BookOpen size={20} />
                </div>
                <span className="stat-trend-badge trend-positive">Readiness</span>
              </div>
              <div className="stat-card-body">
                <div className="stat-value">{onTrackCount} / {subjects.length}</div>
                <div className="stat-label">Subjects On Track</div>
                <div className="stat-subtext">Curriculum milestone completion &gt; 70%</div>
              </div>
            </div>
          </section>

          {/* 3. Subject Filter Pills */}
          <section className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Filter size={15} />
                <span>Filter Subject:</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedSubjectId('ALL')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedSubjectId === 'ALL' ? 'var(--primary)' : 'var(--border-light)',
                  backgroundColor: selectedSubjectId === 'ALL' ? 'var(--primary)' : '#ffffff',
                  color: selectedSubjectId === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                All Subjects ({subjects.length})
              </button>

              {subjects.map((sub) => {
                const isSelected = selectedSubjectId === sub.id
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(sub.id)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? sub.color || 'var(--primary)' : 'var(--border-light)',
                      backgroundColor: isSelected ? (sub.color || 'var(--primary)') : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#ffffff' : sub.color || '#3b82f6'
                      }}
                    />
                    <span>{sub.code || sub.title}</span>
                    <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>({sub.progress}%)</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 4. Subject Syllabus Cards & Topic Checklists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {displayedSubjects.map((subject) => {
              // Group topics by unit
              const unitsMap = {}
              subject.topics.forEach((top) => {
                const u = top.unit || 'Unit 1'
                if (!unitsMap[u]) unitsMap[u] = []
                unitsMap[u].push(top)
              })

              return (
                <div
                  key={subject.id}
                  className="dashboard-card"
                  style={{
                    borderLeft: `4px solid ${subject.color || '#3b82f6'}`,
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  {/* Subject Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: `${subject.color || '#3b82f6'}15`,
                            color: subject.color || '#3b82f6',
                            textTransform: 'uppercase'
                          }}
                        >
                          {subject.code}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Instructor: {subject.teacher}
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {subject.title}
                      </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: subject.color || 'var(--primary)' }}>
                          {subject.progress}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {subject.topicsCovered} of {subject.totalTopics} Topics
                        </div>
                      </div>
                      <span
                        className={`card-status-tag ${
                          subject.progress >= 70 ? 'positive' : subject.progress >= 40 ? 'neutral' : 'warning'
                        }`}
                      >
                        {subject.status || 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="tasks-progress-track" style={{ marginBottom: '1.5rem', height: '8px' }}>
                    <div
                      className="tasks-progress-fill"
                      style={{
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color || 'var(--primary)'
                      }}
                    />
                  </div>

                  {/* Units & Topics Checklists */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.entries(unitsMap).map(([unitName, unitTopics]) => (
                      <div
                        key={unitName}
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          padding: '1rem'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{unitName}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                            {unitTopics.filter((t) => t.completed).length} / {unitTopics.length} completed
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {unitTopics.map((topic) => (
                            <div
                              key={topic.id}
                              onClick={() => handleToggleTopic(subject.id, topic.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.75rem',
                                backgroundColor: topic.completed ? '#ffffff' : '#ffffff',
                                border: '1px solid',
                                borderColor: topic.completed ? 'var(--primary-border)' : 'var(--border-light)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: topic.completed ? '#10b981' : 'var(--text-muted)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: 0
                                }}
                                aria-label={topic.completed ? 'Mark incomplete' : 'Mark complete'}
                              >
                                {topic.completed ? (
                                  <CheckCircle2 size={19} />
                                ) : (
                                  <Circle size={19} />
                                )}
                              </button>

                              <span
                                style={{
                                  fontSize: '0.9rem',
                                  color: topic.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                                  textDecoration: topic.completed ? 'line-through' : 'none',
                                  flex: 1
                                }}
                              >
                                {topic.title}
                              </span>

                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '9999px',
                                  backgroundColor: topic.completed ? '#ecfdf5' : '#f1f5f9',
                                  color: topic.completed ? '#059669' : 'var(--text-muted)'
                                }}
                              >
                                {topic.completed ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add Syllabus Topic Modal */}
          {isAddTopicModalOpen && (
            <div
              className="modal-backdrop"
              onClick={() => setIsAddTopicModalOpen(false)}
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
                  maxWidth: '500px',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Add Syllabus Topic
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddTopicModalOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddTopic} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Select Subject
                    </label>
                    <select
                      value={newTopicData.subjectId}
                      onChange={(e) => setNewTopicData({ ...newTopicData, subjectId: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.9rem',
                        backgroundColor: '#ffffff'
                      }}
                      required
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Curriculum Unit / Module
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Unit 3: Dynamic Analysis"
                      value={newTopicData.unit}
                      onChange={(e) => setNewTopicData({ ...newTopicData, unit: e.target.value })}
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

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                      Topic Title / Concept Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Equivalence Class Partitioning and Boundary Values"
                      value={newTopicData.title}
                      onChange={(e) => setNewTopicData({ ...newTopicData, title: e.target.value })}
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

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsAddTopicModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Topic
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

export default SyllabusPage
