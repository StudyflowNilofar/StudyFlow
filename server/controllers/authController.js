import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Subject from '../models/Subject.js'
import Task from '../models/Task.js'
import Note from '../models/Note.js'

// Helper: Generate JWT Token
const generateToken = (id, name, email) => {
  const secret = process.env.JWT_SECRET || 'studyflow_secret_key_2026_academic_secure'
  return jwt.sign({ id, name, email }, secret, {
    expiresIn: '30d',
  })
}

// Helper: Seed Default Starter Data for New Users
export const seedDefaultUserData = async (userId) => {
  try {
    const existingSubjects = await Subject.countDocuments({ user: userId })
    if (existingSubjects > 0) return

    // Create starter core subjects
    await Subject.insertMany([
      {
        user: userId,
        title: 'Software Testing & QA',
        code: 'STQA-601',
        teacher: 'Prof. Anderson',
        color: '#3b82f6',
        progress: 75,
        totalTopics: 12,
        topicsCovered: 9,
        hoursSpent: 14.5,
        status: 'On Track',
        description: 'Black-box, White-box, Integration testing, and automated test frameworks.'
      },
      {
        user: userId,
        title: 'Indian Knowledge Systems',
        code: 'IKS-602',
        teacher: 'Dr. Sharma',
        color: '#10b981',
        progress: 60,
        totalTopics: 10,
        topicsCovered: 6,
        hoursSpent: 10.0,
        status: 'In Progress',
        description: 'Vedic mathematics, traditional architecture, astronomy, and ancient metallurgy.'
      },
      {
        user: userId,
        title: 'Artificial Intelligence',
        code: 'AI-603',
        teacher: 'Prof. Chen',
        color: '#8b5cf6',
        progress: 85,
        totalTopics: 14,
        topicsCovered: 12,
        hoursSpent: 18.0,
        status: 'On Track',
        description: 'Search algorithms, heuristic functions, neural networks, and decision trees.'
      },
      {
        user: userId,
        title: 'Cyber Security & Forensics',
        code: 'CSF-604',
        teacher: 'Dr. Patel',
        color: '#f59e0b',
        progress: 45,
        totalTopics: 11,
        topicsCovered: 5,
        hoursSpent: 8.5,
        status: 'Needs Focus',
        description: 'Network defense, cryptography, penetration testing, and digital forensics.'
      }
    ])

    // Create starter tasks
    await Task.insertMany([
      {
        user: userId,
        title: 'Review Unit 3: Boundary Value Analysis & Equivalence Partitioning',
        subject: 'Software Testing & QA',
        subjectCode: 'STQA-601',
        description: 'Solve 5 sample problem test cases for login boundary validation.',
        dueDate: 'Today, 5:00 PM',
        priority: 'High',
        completed: false,
        estimatedMinutes: 45
      },
      {
        user: userId,
        title: 'Prepare Short Notes on Sulba Sutras Geometric Principles',
        subject: 'Indian Knowledge Systems',
        subjectCode: 'IKS-602',
        description: 'Highlight historical theorem proofs and sacrificial altar constructions.',
        dueDate: 'Tomorrow, 10:00 AM',
        priority: 'Medium',
        completed: false,
        estimatedMinutes: 30
      },
      {
        user: userId,
        title: 'Implement A* Search Algorithm in Python',
        subject: 'Artificial Intelligence',
        subjectCode: 'AI-603',
        description: 'Complete heuristic calculation for 8-puzzle problem visualization.',
        dueDate: 'Friday',
        priority: 'High',
        completed: true,
        estimatedMinutes: 60
      }
    ])

    // Create starter notes
    await Note.insertMany([
      {
        user: userId,
        title: 'Black-Box vs White-Box Testing Techniques',
        subject: 'Software Testing & QA',
        subjectCode: 'STQA-601',
        topic: 'Unit 2: Dynamic Testing',
        content: 'Black-box testing focuses on functionality without knowledge of internal code structure. Key techniques include Boundary Value Analysis (BVA), Equivalence Class Partitioning (ECP), and Decision Table Testing.\n\nWhite-box testing examines the internal structure, code paths, and branch coverage.',
        tags: ['STQA', 'Testing', 'BVA', 'ExamImportant'],
        color: '#3b82f6',
        updatedAtText: 'Today'
      },
      {
        user: userId,
        title: 'Sulba Sutras Geometric Theorems & Baudhayana Theorem',
        subject: 'Indian Knowledge Systems',
        subjectCode: 'IKS-602',
        topic: 'Unit 1: Mathematics & Geometry',
        content: 'The Sulba Sutras contain the earliest known geometric statements of the Pythagorean theorem (Baudhayana Theorem). Baudhayana formulated that the diagonal of a rectangle produces by itself both the areas which the two sides produce separately.',
        tags: ['IKS', 'Geometry', 'AncientTech'],
        color: '#10b981',
        updatedAtText: 'Yesterday'
      }
    ])
  } catch (err) {
    console.warn('Starter data seeding notice:', err.message)
  }
}

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, institution, semester } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      })
    }

    const userExists = await User.findOne({ email: email.toLowerCase() })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      })
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      institution: institution || 'University / College',
      semester: semester || 'Semester 6',
      streakDays: 5,
    })

    if (user) {
      // Seed default starter data
      await seedDefaultUserData(user._id)

      res.status(201).json({
        success: true,
        token: generateToken(user._id, user.name, user.email),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          institution: user.institution,
          semester: user.semester,
          streakDays: user.streakDays,
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid student registration data.',
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during student registration.',
    })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (user && (await user.matchPassword(password))) {
      // Update streak and last active
      user.lastActiveDate = new Date()
      await user.save()

      // Ensure user has starter data
      await seedDefaultUserData(user._id)

      res.json({
        success: true,
        token: generateToken(user._id, user.name, user.email),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          institution: user.institution,
          semester: user.semester,
          streakDays: user.streakDays,
        },
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email address or password. Please check your credentials.',
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during student login.',
    })
  }
}

// @desc    Get current student profile
// @route   GET /api/auth/me
// @access  Private
export const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          institution: user.institution,
          semester: user.semester,
          streakDays: user.streakDays,
        },
      })
    } else {
      res.status(404).json({ success: false, message: 'Student profile not found.' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.institution = req.body.institution || user.institution
      user.semester = req.body.semester || user.semester

      if (req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          institution: updatedUser.institution,
          semester: updatedUser.semester,
          streakDays: updatedUser.streakDays,
        },
      })
    } else {
      res.status(404).json({ success: false, message: 'Student profile not found.' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
