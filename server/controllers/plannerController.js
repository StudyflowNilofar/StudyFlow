import StudySession from '../models/StudySession.js'
import Subject from '../models/Subject.js'

// Default starter planner topics (can be customized or fetched dynamically)
const defaultPlannerTopics = [
  {
    id: 'stqa-bva-ecp',
    subject: 'Software Testing & QA (STQA)',
    subjectCode: 'STQA-601',
    shortTitle: 'Dynamic Testing: BVA & ECP',
    title: 'Unit 3: Boundary Value Analysis & Equivalence Partitioning',
    subtitle: 'Black-box test design heuristics, robust boundary analysis, 2-value vs 3-value boundary test generation.',
    duration: '45 mins',
    difficulty: 'Moderate (Exam Core)',
    targetDate: 'Today (Priority)',
    completed: false
  },
  {
    id: 'iks-sulba-sutras',
    subject: 'Indian Knowledge Systems (IKS)',
    subjectCode: 'IKS-602',
    shortTitle: 'Sulba Sutras Geometry',
    title: 'Unit 1: Baudhayana Theorem & Vedic Geometry',
    subtitle: 'Geometric altar designs, rational square root approximations, and Baudhayana formulation.',
    duration: '35 mins',
    difficulty: 'Conceptual',
    targetDate: 'Tomorrow, 10:00 AM',
    completed: false
  },
  {
    id: 'ai-a-star-heuristic',
    subject: 'Artificial Intelligence (AI)',
    subjectCode: 'AI-603',
    shortTitle: 'A* Search & Heuristics',
    title: 'Unit 2: Informed Search & A* Optimality',
    subtitle: 'Evaluation function f(n) = g(n) + h(n), admissible and consistent heuristics, 8-puzzle state space.',
    duration: '50 mins',
    difficulty: 'High (Numerical + Theory)',
    targetDate: 'Friday Revision',
    completed: false
  }
]

// @desc    Get planner topics and completion states
// @route   GET /api/planner
// @access  Private
export const getPlannerData = async (req, res) => {
  try {
    const sessions = await StudySession.find({ user: req.user._id })
    const completedMap = {}
    sessions.forEach((s) => {
      if (s.completed) {
        completedMap[s.topicId] = true
      }
    })

    const topicsWithState = defaultPlannerTopics.map((t) => ({
      ...t,
      completed: !!completedMap[t.id],
    }))

    res.json({
      success: true,
      data: topicsWithState,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Log / Toggle planner study session completion
// @route   POST /api/planner/session
// @access  Private
export const toggleSession = async (req, res) => {
  try {
    const { topicId, shortTitle, subject, durationMinutes } = req.body

    if (!topicId) {
      return res.status(400).json({ success: false, message: 'Topic ID is required.' })
    }

    let session = await StudySession.findOne({ user: req.user._id, topicId })

    if (session) {
      session.completed = !session.completed
      await session.save()
    } else {
      session = await StudySession.create({
        user: req.user._id,
        topicId,
        shortTitle: shortTitle || topicId,
        subject: subject || 'General',
        durationMinutes: durationMinutes || 45,
        completed: true,
      })
    }

    // Update subject hours if completed
    if (session.completed && subject) {
      await Subject.findOneAndUpdate(
        { user: req.user._id, title: new RegExp(subject, 'i') },
        { $inc: { hoursSpent: 0.75, topicsCovered: 1 } }
      )
    }

    res.json({
      success: true,
      message: `Session for "${session.shortTitle || topicId}" is now ${session.completed ? 'completed' : 'in progress'}.`,
      data: session,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
