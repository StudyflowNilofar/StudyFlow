import React from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  required = false,
  autoComplete,
  disabled = false
}) {
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={name} className="form-label">
        <span>{label}</span>
        {required && <span className="required-star">*</span>}
      </label>

      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon-left">
            <Icon size={18} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-control ${Icon ? 'has-left-icon' : ''} ${isPassword ? 'has-right-icon' : ''}`}
          autoComplete={autoComplete}
          disabled={disabled}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={onTogglePassword}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <div className="form-error-msg" role="alert">
          <AlertCircle size={14} className="error-icon" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export default InputField
