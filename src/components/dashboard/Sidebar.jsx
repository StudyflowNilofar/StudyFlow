import React from 'react'
import {
  GraduationCap,
  LayoutDashboard,
  Layers,
  Calendar,
  CheckSquare,
  BookOpen,
  ListChecks,
  FolderGit2,
  TrendingUp,
  Settings,
  LogOut,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Sidebar({
  activeTab = 'dashboard',
  onTabChange,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile
}) {
  const { logout, user } = useAuth()

  const displayName = user?.name || 'Alex Sharma'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AS'
  const displaySub = user?.semester
    ? `${user.semester} • ${user.institution || 'Student'}`
    : 'TYCS • Semester 6'

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subjects', icon: Layers },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: ListChecks },
    { id: 'resources', label: 'Resources', icon: FolderGit2 },
    { id: 'analytics', label: 'Progress / Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const handleItemClick = (id) => {
    if (onNavigate) {
      onNavigate(id)
    }
    if (onTabChange) {
      onTabChange(id)
    }
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  const handleLogout = () => {
    logout()
    if (onNavigate) {
      onNavigate('landing')
    }
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop mobile-only"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`dashboard-sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <div className="brand-info">
              <span className="brand-name">StudyFlow</span>
              <span className="brand-tag">Student Workspace</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close-btn mobile-only"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">MAIN NAVIGATION</div>
          <ul className="sidebar-menu">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <li key={item.id} className="sidebar-menu-item">
                  <button
                    type="button"
                    className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon size={19} className="sidebar-item-icon" />
                    <span className="sidebar-item-label">{item.label}</span>
                    {isActive && <span className="active-pill-indicator" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer: Student Profile & Logout */}
        <div className="sidebar-footer">
          <div className="student-profile-badge">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <div className="profile-name">{displayName}</div>
              <div className="profile-sub">{displaySub}</div>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Log out of StudyFlow"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
