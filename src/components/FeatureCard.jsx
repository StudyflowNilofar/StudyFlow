import React from 'react'

function FeatureCard({ icon: Icon, title, description, badge }) {
  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <div className="feature-icon-wrapper">
          <Icon size={24} />
        </div>
        {badge && <span className="feature-badge">{badge}</span>}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  )
}

export default FeatureCard
