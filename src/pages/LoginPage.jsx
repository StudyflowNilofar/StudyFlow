import React, { useState } from 'react'
import { Mail, Lock, LogIn, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InputField from '../components/InputField'
import { useAuth } from '../context/AuthContext'

function LoginPage({ onNavigate }) {
  const { login } = useAuth()

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false)

  // Validation Errors State
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Submission Success State
  const [isSuccess, setIsSuccess] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState('')

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (serverError) setServerError('')

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Client-Side Validation Logic
  const validateForm = () => {
    const newErrors = {}

    // Email Address Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. student@college.edu).'
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    return newErrors
  }

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const result = await login(formData.email.trim(), formData.password)
      if (result.success) {
        setLoggedInUser(result.user?.name || formData.email.trim())
        setIsSuccess(true)
      } else {
        setServerError(result.message || 'Invalid login credentials.')
      }
    } catch (err) {
      setServerError(err.message || 'Unable to connect to the authentication server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Reset / Login Again
  const handleLoginAgain = () => {
    setFormData({
      email: '',
      password: ''
    })
    setErrors({})
    setServerError('')
    setIsSuccess(false)
    setShowPassword(false)
  }

  const handleRegisterClick = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('register')
    }
  }

  return (
    <div className="landing-page">
      {/* Header Navigation */}
      <Navbar onNavigate={onNavigate} currentPage="login" />

      {/* Main Login Container */}
      <main className="auth-main-content">
        <div className="auth-card-container">
          <div className="auth-card">
            {/* Header / Badge */}
            <div className="auth-header">
              <div className="auth-badge">
                <Sparkles size={15} />
                <span>Student Login</span>
              </div>
              <h1 className="auth-title">Login to StudyFlow</h1>
              <p className="auth-subtitle">
                Enter your email and password to access your study planner.
              </p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Success State Screen */}
            {isSuccess ? (
              <div className="auth-success-card">
                <div className="success-icon-box">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="success-title">Login Successful!</h2>
                <p className="success-desc">
                  Welcome back, <strong>{loggedInUser}</strong>! Your session is authenticated with JWT.
                </p>
                <div className="success-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => onNavigate && onNavigate('dashboard')}
                  >
                    Proceed to Dashboard
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-block"
                    onClick={() => onNavigate && onNavigate('landing')}
                  >
                    Back to Home
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={handleLoginAgain}
                  >
                    Login with Another Account
                  </button>
                </div>
              </div>
            ) : (
              /* Login Form */
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                {/* Email Address Field */}
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. student@college.edu"
                  icon={Mail}
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                {/* Password Field */}
                <InputField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={Lock}
                  error={errors.password}
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((prev) => !prev)}
                  required
                  autoComplete="current-password"
                />

                {/* Submit Action Button */}
                <div className="auth-submit-group">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={isSubmitting}
                  >
                    <LogIn size={18} />
                    <span>{isSubmitting ? 'Verifying...' : 'Login'}</span>
                  </button>
                </div>

                {/* Switch to Register Link */}
                <div className="auth-switch-box">
                  <span>Don't have an account?</span>{' '}
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={handleRegisterClick}
                  >
                    Register
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LoginPage
