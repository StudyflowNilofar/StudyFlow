import React from 'react'
import { GraduationCap } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="brand-icon">
              <GraduationCap size={20} />
            </div>
            <span className="brand-text">StudyFlow</span>
          </div>
          <p className="footer-tagline">
            Smart Study Management System for college students.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; 2026 StudyFlow. Designed for College Students.
        </p>
      </div>
    </footer>
  )
}

export default Footer
