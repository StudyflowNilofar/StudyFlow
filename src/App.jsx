import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SubjectsPage from './pages/SubjectsPage'
import PlannerPage from './pages/PlannerPage'
import TasksPage from './pages/TasksPage'
import NotesPage from './pages/NotesPage'
import SyllabusPage from './pages/SyllabusPage'
import ResourcesPage from './pages/ResourcesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

const PRIVATE_PAGES = [
  'dashboard',
  'subjects',
  'planner',
  'tasks',
  'notes',
  'syllabus',
  'resources',
  'analytics',
  'settings'
]

function AppContent() {
  const { isAuthenticated, loading } = useAuth()

  const getInitialPage = () => {
    const hash = window.location.hash.toLowerCase()
    if (hash === '#register') return 'register'
    if (hash === '#login') return 'login'
    if (hash === '#dashboard') return 'dashboard'
    if (hash === '#subjects') return 'subjects'
    if (hash === '#planner') return 'planner'
    if (hash === '#tasks') return 'tasks'
    if (hash === '#notes') return 'notes'
    if (hash === '#syllabus') return 'syllabus'
    if (hash === '#resources') return 'resources'
    if (hash === '#analytics') return 'analytics'
    if (hash === '#settings') return 'settings'
    return 'landing'
  }

  const [currentPage, setCurrentPage] = useState(getInitialPage)

  const handleNavigate = (page) => {
    setCurrentPage(page)
    const validHashes = [
      'register',
      'login',
      'dashboard',
      'subjects',
      'planner',
      'tasks',
      'notes',
      'syllabus',
      'resources',
      'analytics',
      'settings'
    ]

    if (page === 'landing') {
      window.location.hash = '#home'
    } else if (validHashes.includes(page)) {
      window.location.hash = `#${page}`
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      const cleanHash = hash.replace(/^#/, '')
      const validPages = [
        'register',
        'login',
        'dashboard',
        'subjects',
        'planner',
        'tasks',
        'notes',
        'syllabus',
        'resources',
        'analytics',
        'settings'
      ]

      if (validPages.includes(cleanHash)) {
        setCurrentPage(cleanHash)
      } else if (hash === '#home' || hash === '#features' || hash === '') {
        setCurrentPage('landing')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Guard: Redirect to login if user attempts to access private pages without authentication
  useEffect(() => {
    if (!loading && !isAuthenticated && PRIVATE_PAGES.includes(currentPage)) {
      handleNavigate('login')
    }
  }, [loading, isAuthenticated, currentPage])

  // Public Routes
  if (currentPage === 'register') {
    return <RegisterPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={handleNavigate} />
  }

  // Private Route Auth Guard Check
  if (PRIVATE_PAGES.includes(currentPage)) {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#090d16', color: '#94a3b8' }}>
          <p>Verifying StudyFlow session...</p>
        </div>
      )
    }
    if (!isAuthenticated) {
      return <LoginPage onNavigate={handleNavigate} />
    }
  }

  if (currentPage === 'dashboard') {
    return <DashboardPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'subjects') {
    return <SubjectsPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'planner') {
    return <PlannerPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'tasks') {
    return <TasksPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'notes') {
    return <NotesPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'syllabus') {
    return <SyllabusPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'resources') {
    return <ResourcesPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'analytics') {
    return <AnalyticsPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'settings') {
    return <SettingsPage onNavigate={handleNavigate} />
  }

  return <LandingPage onNavigate={handleNavigate} />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
