import React from 'react'
import { Menu, Calendar, Bell, Sparkles } from 'lucide-react'

function DashboardHeader({ onOpenMobileSidebar, studentName = 'Alex Sharma' }) {
  const todayDateFormatted = 'Sunday, Aug 16, 2026'

  return (
    <header className="dashboard-top-header">
      <div className="header-left">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          className="dashboard-mobile-toggle mobile-only"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Date & Semester Display */}
        <div className="header-date-badge">
          <Calendar size={16} className="date-icon" />
          <span>{todayDateFormatted}</span>
          <span className="date-separator">•</span>
          <span className="semester-pill">Semester 6 (TYCS)</span>
        </div>
      </div>

      <div className="header-right">
        {/* Focus Mode / Status Indicator */}
        <div className="header-status-pill">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Focus Mode Ready</span>
        </div>

        {/* Quick Notifications */}
        <button
          type="button"
          className="header-icon-btn"
          aria-label="Notifications"
          title="3 upcoming deadlines this week"
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {/* Header Profile Badge */}
        <div className="header-user-badge">
          <div className="header-avatar">AS</div>
          <span className="header-username">{studentName}</span>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
