import React, { useState } from 'react'
import { GraduationCap, Menu, X } from 'lucide-react'

function Navbar({ onNavigate, currentPage = 'landing' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (e, page, targetId) => {
    e.preventDefault()
    closeMobileMenu()

    if (page === 'landing' && targetId) {
      if (currentPage !== 'landing' && onNavigate) {
        onNavigate('landing')
        setTimeout(() => {
          const el = document.getElementById(targetId)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const el = document.getElementById(targetId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    if (onNavigate) {
      onNavigate(page)
    }
  }

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a
          href="#home"
          className="navbar-brand"
          onClick={(e) => handleNavClick(e, 'landing')}
        >
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <span className="brand-text">StudyFlow</span>
        </a>

        {/* Desktop Navigation & Actions */}
        <div className="nav-desktop-group desktop-only">
          <nav className="nav-links">
            <a
              href="#home"
              className={`nav-link ${currentPage === 'landing' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'landing')}
            >
              Home
            </a>
            <a
              href="#features"
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'landing', 'features')}
            >
              Features
            </a>
            <a
              href="#login"
              className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'login')}
            >
              Login
            </a>
          </nav>
          <button
            type="button"
            className={`btn btn-primary btn-nav-cta ${currentPage === 'register' ? 'btn-nav-active' : ''}`}
            onClick={(e) => handleNavClick(e, 'register')}
          >
            Register
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu mobile-only">
          <nav className="mobile-nav-links">
            <a
              href="#home"
              className={`mobile-nav-link ${currentPage === 'landing' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'landing')}
            >
              Home
            </a>
            <a
              href="#features"
              className="mobile-nav-link"
              onClick={(e) => handleNavClick(e, 'landing', 'features')}
            >
              Features
            </a>
            <a
              href="#login"
              className={`mobile-nav-link ${currentPage === 'login' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'login')}
            >
              Login
            </a>
          </nav>
          <div className="mobile-nav-actions">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={(e) => handleNavClick(e, 'register')}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
