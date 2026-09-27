import React, { useState } from 'react'
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react'

function FlashcardDeck({ topic, topicData, onNotice }) {
  const currentTopic = topic || topicData || {}
  const flashcards = currentTopic.flashcards || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCards, setMasteredCards] = useState({})
  const [showHint, setShowHint] = useState(false)

  const currentCard = flashcards[currentIndex]
  const totalCards = flashcards.length
  const masteredCount = Object.values(masteredCards).filter(Boolean).length
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
      setShowHint(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setIsFlipped(false)
      setShowHint(false)
    }
  }

  const handleMarkMastered = () => {
    setMasteredCards((prev) => ({ ...prev, [currentCard.id]: true }))
    if (onNotice) {
      onNotice(`Card ${currentIndex + 1} marked as Mastered! (${masteredCount + 1}/${totalCards})`)
    }
    // Automatically advance to next card after short delay
    setTimeout(() => {
      if (currentIndex < totalCards - 1) {
        handleNext()
      }
    }, 400)
  }

  const handleMarkReview = () => {
    setMasteredCards((prev) => ({ ...prev, [currentCard.id]: false }))
    if (onNotice) {
      onNotice(`Card ${currentIndex + 1} flagged for further review.`)
    }
    setTimeout(() => {
      if (currentIndex < totalCards - 1) {
        handleNext()
      }
    }, 400)
  }

  const handleResetDeck = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setMasteredCards({})
    setShowHint(false)
    if (onNotice) {
      onNotice('Flashcard session reset for active recall practice.')
    }
  }

  if (!currentCard) {
    return <div className="planner-card">No flashcards available for this topic.</div>
  }

  const isCurrentCardMastered = !!masteredCards[currentCard.id]

  return (
    <div className="planner-tab-view flashcards-view">
      {/* 1. Deck Mastery Score Bar */}
      <div className="planner-card flashcard-progress-card">
        <div className="flashcard-score-row">
          <div className="score-info">
            <span className="score-label">Active Recall Mastery:</span>
            <span className="score-val"><strong>{masteredCount}</strong> / {totalCards} Cards ({masteryPercentage}%)</span>
          </div>

          <button
            type="button"
            className="reset-deck-btn"
            onClick={handleResetDeck}
            title="Reset flashcard progress"
          >
            <RefreshCw size={13} />
            <span>Reset Deck</span>
          </button>
        </div>

        <div className="mastery-track">
          <div
            className="mastery-fill"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Interactive Flipping Flashcard Card */}
      <div className="flashcard-interaction-container">
        <div
          className={`flashcard-scene ${isFlipped ? 'is-flipped' : ''}`}
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          aria-label="Click to flip flashcard"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              handleFlip()
            }
          }}
        >
          <div className="flashcard-flipper">
            {/* Front of Flashcard (Question) */}
            <div className="flashcard-face flashcard-front">
              <div className="card-face-header">
                <span className="card-tag-pill">{currentCard.tag || 'Recall Prompt'}</span>
                <span className="card-index-pill">Card {currentIndex + 1} of {totalCards}</span>
              </div>

              <div className="card-question-box">
                <p className="card-question-text">{currentCard.question}</p>
              </div>

              {currentCard.hint && (
                <div
                  className="card-hint-container"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowHint((prev) => !prev)
                  }}
                >
                  <HelpCircle size={14} className="hint-icon" />
                  <span className="hint-prompt">
                    {showHint ? `Hint: ${currentCard.hint}` : 'Need a hint? Click here'}
                  </span>
                </div>
              )}

              <div className="card-flip-prompt">
                <RotateCw size={14} className="rotate-icon" />
                <span>Click card to reveal answer</span>
              </div>
            </div>

            {/* Back of Flashcard (Answer) */}
            <div className="flashcard-face flashcard-back">
              <div className="card-face-header">
                <span className="card-tag-pill verified">Key Concept Answer</span>
                <span className="card-index-pill">Card {currentIndex + 1} of {totalCards}</span>
              </div>

              <div className="card-answer-box">
                <p className="card-answer-text">{currentCard.answer}</p>
              </div>

              <div className="card-flip-prompt">
                <RotateCw size={14} className="rotate-icon" />
                <span>Click card to return to question</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Flashcard Controls & Navigation */}
        <div className="flashcard-controls-panel">
          <div className="nav-buttons-group">
            <button
              type="button"
              className="card-nav-btn prev-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous card"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              className="card-flip-action-btn"
              onClick={handleFlip}
            >
              <RotateCw size={15} />
              <span>{isFlipped ? 'Show Question' : 'Flip to Answer'}</span>
            </button>

            <button
              type="button"
              className="card-nav-btn next-btn"
              onClick={handleNext}
              disabled={currentIndex === totalCards - 1}
              aria-label="Next card"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Self-Assessment Recall Action Buttons */}
          <div className="self-assessment-row">
            <span className="assessment-label">Self-Assessment:</span>
            <div className="assessment-btns">
              <button
                type="button"
                className="assessment-btn needs-review"
                onClick={handleMarkReview}
              >
                <AlertCircle size={15} />
                <span>Needs Review</span>
              </button>

              <button
                type="button"
                className={`assessment-btn mastered ${isCurrentCardMastered ? 'active' : ''}`}
                onClick={handleMarkMastered}
              >
                <CheckCircle2 size={15} />
                <span>Mastered / Knew It</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Card Index Indicators (Dots) */}
        <div className="card-dots-indicator">
          {flashcards.map((c, i) => {
            const isMastered = !!masteredCards[c.id]
            const isCurrent = i === currentIndex

            return (
              <button
                key={c.id}
                type="button"
                className={`dot-indicator ${isCurrent ? 'current' : ''} ${isMastered ? 'mastered' : ''}`}
                onClick={() => {
                  setCurrentIndex(i)
                  setIsFlipped(false)
                  setShowHint(false)
                }}
                aria-label={`Jump to card ${i + 1}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FlashcardDeck
