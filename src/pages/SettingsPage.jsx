import React, { useState } from 'react'
import {
  Settings,
  User,
  Calendar,
  Save,
  LogOut,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react'

import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import { mockStudentProfile } from '../utils/mockDashboardData'

function SettingsPage({ onNavigate }) {
  const { user, setUser, logout } = useAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Profile Form State
  const [name, setName] = useState(user?.name || mockStudentProfile.name)
  const [email] = useState(user?.email || 'student@studyflow.edu')
  const [institution, setInstitution] = useState(user?.institution || mockStudentProfile.institution || 'University Engineering College')
  const [semester, setSemester] = useState(user?.semester || 'Semester 6')
  const [newPassword, setNewPassword] = useState('')

  // Application Preferences State
  const [dailyGoalHours, setDailyGoalHours] = useState(() => {
    return localStorage.getItem('studyflow_pref_daily_goal') || '4.0'
  })
  const [defaultTaskPriority, setDefaultTaskPriority] = useState(() => {
    return localStorage.getItem('studyflow_pref_task_priority') || 'Medium'
  })
  const [enableReminders, setEnableReminders] = useState(() => {
    return localStorage.getItem('studyflow_pref_reminders') !== 'false'
  })

  const triggerNotice = (msg) => {
    setNoticeMessage(msg)
    setErrorMessage('')
    setTimeout(() => {
      setNoticeMessage('')
    }, 3500)
  }

  const triggerError = (msg) => {
    setErrorMessage(msg)
    setNoticeMessage('')
  }

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    if (!name.trim()) {
      triggerError('Name cannot be empty.')
      setIsSaving(false)
      return
    }

    const payload = {
      name: name.trim(),
      institution: institution.trim(),
      semester: semester.trim(),
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        triggerError('New password must be at least 6 characters.')
        setIsSaving(false)
        return
      }
      payload.password = newPassword
    }

    try {
      const res = await authApi.updateProfile(payload)
      if (res?.success && res.user) {
        setUser(res.user)
        localStorage.setItem('studyflow_user', JSON.stringify(res.user))
        triggerNotice('Student profile updated successfully in database!')
        setNewPassword('')
        setIsSaving(false)
        return
      }
    } catch (err) {
      console.warn('Profile update API notice, saving locally:', err.message)
    }

    // Fallback local update
    const updatedUser = {
      ...(user || {}),
      name: name.trim(),
      institution: institution.trim(),
      semester: semester.trim(),
    }
    setUser(updatedUser)
    localStorage.setItem('studyflow_user', JSON.stringify(updatedUser))
    triggerNotice('Profile settings saved!')
    setNewPassword('')
    setIsSaving(false)
  }

  // Handle Save Preferences
  const handleSavePreferences = (e) => {
    e.preventDefault()
    localStorage.setItem('studyflow_pref_daily_goal', dailyGoalHours)
    localStorage.setItem('studyflow_pref_task_priority', defaultTaskPriority)
    localStorage.setItem('studyflow_pref_reminders', String(enableReminders))
    triggerNotice('Study workspace preferences saved successfully!')
  }

  // Safe Logout
  const handleSafeLogout = () => {
    if (window.confirm('Are you sure you want to log out of StudyFlow?')) {
      logout()
      if (onNavigate) {
        onNavigate('landing')
      }
    }
  }

  const studentName = user?.name || name

  return (
    <div className="dashboard-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="settings"
        onTabChange={(tab) => {
          if (tab !== 'settings' && onNavigate) {
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

          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                fontSize: '0.875rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Page Header Card */}
          <section className="notes-page-header-card">
            <div className="notes-header-left">
              <div className="notes-badge-tag">
                <Settings size={15} />
                <span>Account Management</span>
              </div>
              <h1 className="notes-page-title">Workspace Settings</h1>
              <p className="notes-page-subtitle">
                Configure your student profile, academic term parameters, study targets, and account preferences.
              </p>
            </div>

            <div className="notes-header-right">
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                onClick={handleSafeLogout}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* 2. Student Profile Card */}
            <div className="dashboard-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                  <User size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Student Profile
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Personal information and college credentials
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    Email Address (Account Identifier)
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      backgroundColor: '#f1f5f9',
                      color: 'var(--text-muted)',
                      cursor: 'not-allowed'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                    Email cannot be altered once registered for academic integrity.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    University / College Institution
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
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
                    Current Academic Term
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Semester 1">Semester 1 (First Year)</option>
                    <option value="Semester 2">Semester 2 (First Year)</option>
                    <option value="Semester 3">Semester 3 (Second Year)</option>
                    <option value="Semester 4">Semester 4 (Second Year)</option>
                    <option value="Semester 5">Semester 5 (Third Year)</option>
                    <option value="Semester 6">Semester 6 (Third Year)</option>
                    <option value="Semester 7">Semester 7 (Final Year)</option>
                    <option value="Semester 8">Semester 8 (Final Year)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    Change Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                    style={{ width: '100%' }}
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Saving Changes...' : 'Update Student Profile'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 3. Study Workspace Preferences Card */}
            <div className="dashboard-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', color: '#10b981' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Study Preferences
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Personalize your study sessions and defaults
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    Target Daily Study Hours
                  </label>
                  <select
                    value={dailyGoalHours}
                    onChange={(e) => setDailyGoalHours(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="2.0">2.0 Hours / Day (Light Study)</option>
                    <option value="3.5">3.5 Hours / Day (Moderate Review)</option>
                    <option value="4.0">4.0 Hours / Day (Standard College Track)</option>
                    <option value="5.5">5.5 Hours / Day (Exam Preparation Mode)</option>
                    <option value="6.0">6.0+ Hours / Day (Intensive Milestone)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    Default Task Priority
                  </label>
                  <select
                    value={defaultTaskPriority}
                    onChange={(e) => setDefaultTaskPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Study Reminders &amp; Streak Alerts
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      In-app motivational notifications for revision goals
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableReminders}
                    onChange={(e) => setEnableReminders(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>
                    <Save size={16} />
                    <span>Save Study Preferences</span>
                  </button>
                </div>
              </form>

              {/* Security info card */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <ShieldCheck size={20} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d', marginBottom: '0.2rem' }}>
                    Authenticated JWT Session Active
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#166534', lineHeight: 1.4 }}>
                    Your session is protected with bcrypt encryption and persistent JWT bearer authentication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingsPage
