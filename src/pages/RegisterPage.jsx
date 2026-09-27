import React, { useState } from 'react'
import { User, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InputField from '../components/InputField'
import { useAuth } from '../context/AuthContext'

function RegisterPage({ onNavigate }) {
  const { register } = useAuth()

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    semester: 'Semester 6'
  })

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation Errors State
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Submission Success State
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedName, setSubmittedName] = useState('')

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

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.'
    }

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

    // Confirm Password Validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.'
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
      const result = await register({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        institution: formData.institution.trim() || 'University / College',
        semester: formData.semester || 'Semester 6',
      })

      if (result.success) {
        setSubmittedName(formData.fullName.trim())
        setIsSuccess(true)
      } else {
        setServerError(result.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setServerError(err.message || 'Unable to connect to registration server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Reset / Register Another
  const handleRegisterAnother = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      institution: '',
      semester: 'Semester 6'
    })
    setErrors({})
    setServerError('')
    setIsSuccess(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('login')
    }
  }

  return (
    <div className="landing-page">
      {/* Header Navigation */}
      <Navbar onNavigate={onNavigate} currentPage="register" />

      {/* Main Form Container */}
      <main className="auth-main-content">
        <div className="auth-card-container">
          <div className="auth-card">
            {/* Header / Badge */}
            <div className="auth-header">
              <div className="auth-badge">
                <Sparkles size={15} />
                <span>Student Registration</span>
              </div>
              <h1 className="auth-title">Create your StudyFlow Account</h1>
              <p className="auth-subtitle">
                Join thousands of students who organize their study schedules effortlessly.
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
                <h2 className="success-title">Account Created Successfully!</h2>
                <p className="success-desc">
                  Welcome to StudyFlow, <strong>{submittedName}</strong>! Your account has been registered and initialized with your default subjects &amp; study plan.
                </p>
                <div className="success-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => onNavigate && onNavigate('dashboard')}
                  >
                    Go to Dashboard
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
                    onClick={handleRegisterAnother}
                  >
                    Register Another Account
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                {/* Full Name Field */}
                <InputField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  icon={User}
                  error={errors.fullName}
                  required
                  autoComplete="name"
                />

                {/* Email Address Field */}
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. alex@college.edu"
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
                  placeholder="Create a strong password (min 6 chars)"
                  icon={Lock}
                  error={errors.password}
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((prev) => !prev)}
                  required
                  autoComplete="new-password"
                />

                {/* Confirm Password Field */}
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  icon={Lock}
                  error={errors.confirmPassword}
                  isPassword
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword((prev) => !prev)}
                  required
                  autoComplete="new-password"
                />

                {/* Submit Action Button */}
                <div className="auth-submit-group">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* Switch to Login Link */}
                <div className="auth-switch-box">
                  <span>Already have an account?</span>{' '}
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={handleLoginClick}
                  >
                    Login
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

export default RegisterPage
