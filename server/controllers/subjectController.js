import Subject from '../models/Subject.js'

// @desc    Get all subjects for the logged-in student
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({
      success: true,
      count: subjects.length,
      data: subjects,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
export const createSubject = async (req, res) => {
  try {
    const { title, code, teacher, color, totalTopics, description } = req.body

    if (!title || !code) {
      return res.status(400).json({
        success: false,
        message: 'Subject title and subject code are required.',
      })
    }

    const newSubject = await Subject.create({
      user: req.user._id,
      title,
      code: code.toUpperCase(),
      teacher: teacher || 'Course Instructor',
      color: color || '#3b82f6',
      totalTopics: Number(totalTopics) || 10,
      topicsCovered: 0,
      hoursSpent: 0,
      status: 'In Progress',
      progress: 0,
      description: description || '',
    })

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: newSubject,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id })

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found.' })
    }

    const {
      title,
      code,
      teacher,
      color,
      totalTopics,
      topicsCovered,
      hoursSpent,
      status,
      description,
      topics,
    } = req.body

    if (title) subject.title = title
    if (code) subject.code = code.toUpperCase()
    if (teacher !== undefined) subject.teacher = teacher
    if (color) subject.color = color
    if (hoursSpent !== undefined) subject.hoursSpent = Number(hoursSpent)
    if (status) subject.status = status
    if (description !== undefined) subject.description = description

    if (topics !== undefined && Array.isArray(topics)) {
      subject.topics = topics
      subject.totalTopics = topics.length
      subject.topicsCovered = topics.filter((t) => t.completed).length
    } else {
      if (totalTopics !== undefined) subject.totalTopics = Number(totalTopics)
      if (topicsCovered !== undefined) subject.topicsCovered = Number(topicsCovered)
    }

    // Recalculate progress %
    if (subject.totalTopics > 0) {
      subject.progress = Math.min(100, Math.round((subject.topicsCovered / subject.totalTopics) * 100))
    }

    const updated = await subject.save()

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found.' })
    }

    res.json({
      success: true,
      message: 'Subject deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
