import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  FileText,
  Layers,
  Calendar,
  Sparkles,
  CalendarCheck
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StudySessionBanner from '../components/planner/StudySessionBanner'
import ConceptExplanationView from '../components/planner/ConceptExplanationView'
import ExamAnswerView from '../components/planner/ExamAnswerView'
import FlashcardDeck from '../components/planner/FlashcardDeck'
import RevisionScheduleCard from '../components/planner/RevisionScheduleCard'

import { useAuth } from '../context/AuthContext'
import { plannerApi } from '../services/api'
import { mockStudentProfile } from '../utils/mockDashboardData'
import { mockPlannerTopics } from '../utils/mockPlannerData'

function PlannerPage({ onNavigate }) {
  const { user } = useAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState(mockPlannerTopics[0].id)
  const [activeStudyTab, setActiveStudyTab] = useState('concept')
  const [completedSessions, setCompletedSessions] = useState({})
  const [noticeMessage, setNoticeMessage] = useState('')
  const studentName = user?.name || mockStudentProfile.name

  // Fetch session completion states from backend
  const fetchPlannerData = async () => {
    try {
      const res = await plannerApi.getPlanner()
      if (res?.success && res.data) {
        const completedMap = {}
        res.data.forEach((topic) => {
          if (topic.completed) {
            completedMap[topic.id] = true
          }
        })
        setCompletedSessions(completedMap)
      }
    } catch (err) {
      console.warn('Planner fetch notice:', err.message)
    }
  }

  useEffect(() => {
    fetchPlannerData()
  }, [])

  const activeTopic =
    mockPlannerTopics.find((t) => t.id === selectedTopicId) || mockPlannerTopics[0]

  const isSessionCompleted = !!completedSessions[activeTopic.id]

  // Temporary feedback toast
  const triggerNotice = (msg) => {
    setNoticeMessage(msg)
    setTimeout(() => {
      setNoticeMessage('')
    }, 3500)
  }

  const handleSelectTopic = (topicId) => {
    setSelectedTopicId(topicId)
    const newTopic = mockPlannerTopics.find((t) => t.id === topicId)
    if (newTopic) {
      triggerNotice(`Switched active topic to "${newTopic.title}"`)
    }
  }

  const handleToggleSessionComplete = async () => {
    const nextState = !isSessionCompleted
    setCompletedSessions((prev) => ({ ...prev, [activeTopic.id]: nextState }))
    triggerNotice(
      nextState
        ? `🎉 Study session for "${activeTopic.shortTitle}" marked as complete! Streak & progress updated.`
        : `Study session for "${activeTopic.shortTitle}" reset to In Progress.`
    )

    try {
      await plannerApi.toggleSession({
        topicId: activeTopic.id,
        shortTitle: activeTopic.shortTitle,
        subject: activeTopic.subject,
        durationMinutes: 45,
      })
    } catch (err) {
      console.warn('Planner toggle API notice:', err.message)
    }
  }

  const studyTabs = [
    { id: 'concept', label: 'Concept & Textbooks', icon: BookOpen },
    { id: 'exam', label: 'Exam Answer (10M)', icon: FileText },
    { id: 'flashcards', label: 'Active Recall Flashcards', icon: Layers },
    { id: 'revision', label: 'Revision Schedule & Reminders', icon: Calendar }
  ]

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="planner"
        onTabChange={(tab) => {
          if (tab === 'dashboard') {
            onNavigate('dashboard')
          } else if (tab === 'subjects') {
            onNavigate('subjects')
          } else if (tab === 'planner') {
            // Already on planner
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

        {/* Planner Content Area */}
        <main className="dashboard-content-area planner-workspace-area">
          {/* Interactive Notice Toast */}
          {noticeMessage && (
            <div className="dashboard-notice-banner planner-notice-banner">
              <Sparkles size={16} />
              <span>{noticeMessage}</span>
            </div>
          )}

          {/* 1. Header Banner */}
          <section className="planner-header-banner">
            <div className="planner-banner-content">
              <div className="banner-badge">
                <CalendarCheck size={15} />
                <span>Smart Study Planner</span>
              </div>
              <h1 className="banner-title">Active Study &amp; Revision Plan</h1>
              <p className="banner-subtitle">
                Interactive learning modules: concept breakdowns, 10-mark exam answers, spaced repetition flashcards, and timetable scheduling.
              </p>
            </div>
          </section>

          {/* 2. Active Session Card Banner with Topic Selector */}
          <StudySessionBanner
            activeTopic={activeTopic}
            topicsList={mockPlannerTopics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={handleSelectTopic}
            isCompleted={isSessionCompleted}
            onToggleComplete={handleToggleSessionComplete}
          />

          {/* 3. Study Mode Navigation Tabs */}
          <nav className="planner-tabs-nav" aria-label="Study Module Navigation">
            <div className="planner-tabs-list">
              {studyTabs.map((tab) => {
                const TabIcon = tab.icon
                const isActive = activeStudyTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`planner-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveStudyTab(tab.id)}
                  >
                    <TabIcon size={16} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* 4. Dynamic Content Area based on Active Tab */}
          <div className="planner-active-view-container">
            {activeStudyTab === 'concept' && (
              <ConceptExplanationView topicData={activeTopic} />
            )}

            {activeStudyTab === 'exam' && (
              <ExamAnswerView topicData={activeTopic} />
            )}

            {activeStudyTab === 'flashcards' && (
              <FlashcardDeck topicData={activeTopic} onNotice={triggerNotice} />
            )}

            {activeStudyTab === 'revision' && (
              <RevisionScheduleCard topicData={activeTopic} onNotice={triggerNotice} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PlannerPage
