import React, { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SubjectsPage from './pages/SubjectsPage'
import PlannerPage from './pages/PlannerPage'
import TasksPage from './pages/TasksPage'
import NotesPage from './pages/NotesPage'
import './App.css'

function AppContent() {
  const getInitialPage = () => {
    const hash = window.location.hash.toLowerCase()
    if (hash === '#register') return 'register'
    if (hash === '#login') return 'login'
    if (hash === '#dashboard') return 'dashboard'
    if (hash === '#subjects') return 'subjects'
    if (hash === '#planner') return 'planner'
    if (hash === '#tasks') return 'tasks'
    if (hash === '#notes') return 'notes'
    return 'landing'
  }

  const [currentPage, setCurrentPage] = useState(getInitialPage)

  const handleNavigate = (page) => {
    setCurrentPage(page)
    if (page === 'landing') {
      window.location.hash = '#home'
    } else if (page === 'register') {
      window.location.hash = '#register'
    } else if (page === 'login') {
      window.location.hash = '#login'
    } else if (page === 'dashboard') {
      window.location.hash = '#dashboard'
    } else if (page === 'subjects') {
      window.location.hash = '#subjects'
    } else if (page === 'planner') {
      window.location.hash = '#planner'
    } else if (page === 'tasks') {
      window.location.hash = '#tasks'
    } else if (page === 'notes') {
      window.location.hash = '#notes'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash === '#register') {
        setCurrentPage('register')
      } else if (hash === '#login') {
        setCurrentPage('login')
      } else if (hash === '#dashboard') {
        setCurrentPage('dashboard')
      } else if (hash === '#subjects') {
        setCurrentPage('subjects')
      } else if (hash === '#planner') {
        setCurrentPage('planner')
      } else if (hash === '#tasks') {
        setCurrentPage('tasks')
      } else if (hash === '#notes') {
        setCurrentPage('notes')
      } else if (hash === '#home' || hash === '#features' || hash === '') {
        setCurrentPage('landing')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (currentPage === 'register') {
    return <RegisterPage onNavigate={handleNavigate} />
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={handleNavigate} />
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
