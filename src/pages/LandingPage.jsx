import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Footer from '../components/Footer'

function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <Navbar onNavigate={onNavigate} currentPage="landing" />
      <main>
        <Hero onNavigate={onNavigate} />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
