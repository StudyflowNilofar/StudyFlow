import React from 'react'

function StatCard({ label, value, subtext, icon: Icon, trend, trendType = 'positive' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon-wrapper">
          <Icon size={22} />
        </div>
        {trend && (
          <span className={`stat-trend-badge ${trendType === 'warning' ? 'trend-warning' : 'trend-positive'}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  )
}

export default StatCard
