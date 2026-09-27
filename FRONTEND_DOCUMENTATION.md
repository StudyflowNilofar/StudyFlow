# StudyFlow - Complete Frontend Technical Documentation

This document contains the complete frontend architecture, component hierarchy, user interface modules, state management, and source code for the **StudyFlow (Smart Study Management System)** project report and documentation.

---

## 1. Frontend Architecture & Tech Stack

```
USER INTERACTION (Web Browser)
         │
         ▼
REACT 19 + VITE APPLICATION ROOT (`src/App.jsx`)
   ├── AuthProvider Context (`src/context/AuthContext.jsx`)
   │      └── Manages user authentication, token storage, and session state
   ├── Centralized API Service Layer (`src/services/api.js`)
   │      └── Communicates with Express.js REST API via HTTP / JWT Bearer Tokens
   └── Stateful Hash Router (`#home`, `#login`, `#register`, `#dashboard`, `#subjects`, `#tasks`, `#notes`, `#planner`)
         │
         ├── Public Pages
         │   ├── LandingPage (`src/pages/LandingPage.jsx`)
         │   ├── LoginPage (`src/pages/LoginPage.jsx`)
         │   └── RegisterPage (`src/pages/RegisterPage.jsx`)
         │
         └── Student Dashboard Modules (Protected)
             ├── DashboardPage (`src/pages/DashboardPage.jsx`)
             ├── SubjectsPage (`src/pages/SubjectsPage.jsx`)
             ├── TasksPage (`src/pages/TasksPage.jsx`)
             ├── NotesPage (`src/pages/NotesPage.jsx`)
             └── PlannerPage (`src/pages/PlannerPage.jsx`)
```

### Key Libraries & Tools Used:
* **React 19:** Modern component-based UI library.
* **Vite 8:** Next-generation frontend build tool and hot-module replacement server.
* **Lucide React:** Clean, lightweight SVG icon library for consistent dashboard icons.
* **Pure CSS3:** Modern responsive design with flexbox, CSS grid, CSS variables, and animated transitions without heavyweight UI frameworks.

---

## 2. Directory Structure (`src/`)

```
src/
├── assets/                  # Images, hero illustration, and SVG icons
├── components/              # Modular, reusable UI components
│   ├── dashboard/           # Sidebar, DashboardHeader, StatCard, SubjectCard, TaskSummaryCard
│   ├── notes/               # NoteCard, NoteModal, NoteDetailModal
│   ├── planner/             # ConceptExplanationView, ExamAnswerView, FlashcardDeck, RevisionScheduleCard, StudySessionBanner
│   ├── subjects/            # SubjectDetailCard, AddSubjectModal
│   ├── tasks/               # TaskItem, AddTaskModal
│   ├── FeatureCard.jsx      # Landing page feature card
│   ├── Features.jsx         # Feature showcase section
│   ├── Footer.jsx           # Global application footer
│   ├── Hero.jsx             # Hero section with call-to-actions
│   ├── InputField.jsx       # Floating label text and password input with eye toggle
│   └── Navbar.jsx           # Responsive top navigation bar
├── context/
│   ├── AuthContext.jsx      # Global React Context Provider & useAuth hook
│   └── auth-context-base.js # Context definition
├── pages/
│   ├── DashboardPage.jsx    # Analytics dashboard, today's tasks & weekly hours
│   ├── LandingPage.jsx      # Public home page
│   ├── LoginPage.jsx        # Student login screen
│   ├── NotesPage.jsx        # Notes repository with search & modal reader
│   ├── PlannerPage.jsx      # Smart study planner & active recall flashcards
│   ├── RegisterPage.jsx     # Student signup screen
│   ├── SubjectsPage.jsx     # Semester course & syllabus manager
│   └── TasksPage.jsx        # Study to-do list & assignment tracker
├── services/
│   └── api.js               # Centralized REST API client with JWT interceptor
├── utils/                   # Initial fallback and starter data structures
├── App.css                  # Comprehensive application styling
├── App.jsx                  # Main router and component tree
├── index.css                # Global base styles, reset, and font declarations
└── main.jsx                 # Vite application entry point
```

---

## 3. Core Frontend Code Modules

### A. Centralized API Client (`src/services/api.js`)
Handles all asynchronous HTTP requests and injects the JWT Authorization Bearer header:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('studyflow_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'API request failed')
  return data
}

export const authApi = {
  login: (creds) => request('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
}

export const subjectApi = {
  getAll: () => request('/subjects'),
  create: (data) => request('/subjects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/subjects/${id}`, { method: 'DELETE' }),
}

export const taskApi = {
  getAll: (params = {}) => request(`/tasks?${new URLSearchParams(params).toString()}`),
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  toggleStatus: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
}

export const noteApi = {
  getAll: (params = {}) => request(`/notes?${new URLSearchParams(params).toString()}`),
  create: (data) => request('/notes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
}

export const plannerApi = {
  getPlanner: () => request('/planner'),
  toggleSession: (data) => request('/planner/session', { method: 'POST', body: JSON.stringify(data) }),
}

export const dashboardApi = {
  getStats: () => request('/dashboard/stats'),
}
```

---

### B. Global Authentication Context (`src/context/AuthContext.jsx`)
Provides reactive student session state across all pages:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

export const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('studyflow_token') || null)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('studyflow_token')
      if (storedToken) {
        try {
          const res = await authApi.getMe()
          if (res?.success && res.user) setUser(res.user)
        } catch (err) {
          console.warn('Session check:', err.message)
        }
      }
    }
    initializeAuth()
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    if (res?.success && res.token) {
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem('studyflow_token', res.token)
      localStorage.setItem('studyflow_user', JSON.stringify(res.user))
      return { success: true, user: res.user }
    }
    return { success: false, message: res?.message || 'Login failed' }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('studyflow_token')
    localStorage.removeItem('studyflow_user')
    window.location.hash = '#home'
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

### C. Application Root Router (`src/App.jsx`)
Handles single-page navigation and view rendering:

```javascript
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
    window.location.hash = `#${page === 'landing' ? 'home' : page}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      const routeMap = {
        '#register': 'register',
        '#login': 'login',
        '#dashboard': 'dashboard',
        '#subjects': 'subjects',
        '#planner': 'planner',
        '#tasks': 'tasks',
        '#notes': 'notes',
      }
      setCurrentPage(routeMap[hash] || 'landing')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  switch (currentPage) {
    case 'register': return <RegisterPage onNavigate={handleNavigate} />
    case 'login': return <LoginPage onNavigate={handleNavigate} />
    case 'dashboard': return <DashboardPage onNavigate={handleNavigate} />
    case 'subjects': return <SubjectsPage onNavigate={handleNavigate} />
    case 'planner': return <PlannerPage onNavigate={handleNavigate} />
    case 'tasks': return <TasksPage onNavigate={handleNavigate} />
    case 'notes': return <NotesPage onNavigate={handleNavigate} />
    default: return <LandingPage onNavigate={handleNavigate} />
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
```

---

## 4. Key UI Pages Overview

| Page Name | File Path | Main Features & UI Elements |
| :--- | :--- | :--- |
| **Landing Page** | `src/pages/LandingPage.jsx` | Hero banner with CTAs, academic features grid, workflow preview, footer. |
| **Login Page** | `src/pages/LoginPage.jsx` | Email/password fields with eye toggle, client validation, JWT login, error alerts. |
| **Register Page** | `src/pages/RegisterPage.jsx` | Full name, semester & institution selection, password confirmation, auto-login. |
| **Dashboard** | `src/pages/DashboardPage.jsx` | 4 KPI cards (hours, tasks, syllabus %, streak), today's task checklist, weekly bar chart. |
| **Subjects Page** | `src/pages/SubjectsPage.jsx` | Enrolled courses grid, topic completion rate bar, add subject modal, search & filters. |
| **Tasks Page** | `src/pages/TasksPage.jsx` | Assignment to-do list, priority badges (High/Medium/Low), status pills, creation modal. |
| **Notes Page** | `src/pages/NotesPage.jsx` | Notes repository, keyword/tag filtering, grid/list view switcher, note reading modal. |
| **Planner Page** | `src/pages/PlannerPage.jsx` | Active topic switcher, 4 learning modules: Concepts, 10M Exam Answers, Flashcards, Timetable. |

---

## 5. Reusable Components & Sub-Modules

### 1. Dashboard Components (`src/components/dashboard/`)
* **`Sidebar.jsx`**: Collapsible navigation with active route highlights and student profile badge.
* **`DashboardHeader.jsx`**: Top app bar with mobile hamburger menu and quick alerts.
* **`StatCard.jsx`**: Summary KPI metric card with icon and positive/negative trend pills.
* **`SubjectCard.jsx`**: Subject card with syllabus progress bar and topic count.
* **`TaskSummaryCard.jsx`**: Compact task item with completion checkbox.

### 2. Smart Planner Components (`src/components/planner/`)
* **`StudySessionBanner.jsx`**: Header card with topic dropdown and session complete button.
* **`ConceptExplanationView.jsx`**: Prescribed curriculum textbooks and core theory explanation.
* **`ExamAnswerView.jsx`**: 10-Mark structured exam answer with copy-to-clipboard button.
* **`FlashcardDeck.jsx`**: 3D interactive flashcard flipper with active recall mastery scoring.
* **`RevisionScheduleCard.jsx`**: Spaced repetition schedule (Day 1, Day 3, Day 7, Day 14) with reminder toggles.

### 3. Modals & Forms
* **`AddSubjectModal.jsx`**: Form for adding new semester courses, codes, and teachers.
* **`AddTaskModal.jsx`**: Form for creating tasks with priority levels and due dates.
* **`NoteModal.jsx`**: Rich note editor with tags, topics, and subject associations.
* **`NoteDetailModal.jsx`**: Full-screen distraction-free note reader with copy function.
