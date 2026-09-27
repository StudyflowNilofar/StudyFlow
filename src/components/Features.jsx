import React from 'react'
import { CalendarCheck, BookOpen, ListChecks, TrendingUp } from 'lucide-react'
import FeatureCard from './FeatureCard'

function Features() {
  const featuresList = [
    {
      id: 'daily-planner',
      icon: CalendarCheck,
      title: 'Daily Study Planner',
      description:
        'Plan your study sessions with focused time blocks, prioritize daily academic tasks, and stay consistent throughout your semester.',
      badge: 'Time Management'
    },
    {
      id: 'notes-manager',
      icon: BookOpen,
      title: 'Notes Manager',
      description:
        'Store, structure, and categorize your subject notes, lecture summaries, and reference materials in one clutter-free space.',
      badge: 'Knowledge Hub'
    },
    {
      id: 'syllabus-tracker',
      icon: ListChecks,
      title: 'Syllabus Tracker',
      description:
        'Monitor topic completion, unit-wise progress, and pending chapters across all your courses to stay exam-ready with zero stress.',
      badge: 'Curriculum'
    },
    {
      id: 'progress-dashboard',
      icon: TrendingUp,
      title: 'Progress Dashboard',
      description:
        'Gain clarity on your study habits with visual insights into completed topics, study streaks, and overall academic momentum.',
      badge: 'Analytics'
    }
  ]

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-badge">Core Capabilities</span>
          <h2 className="section-title">Built for College Students</h2>
          <p className="section-subtitle">
            Essential tools designed to simplify your study workflow and help you achieve academic excellence.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="features-grid">
          {featuresList.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
