import Note from '../models/Note.js'

// @desc    Get all study notes
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const { subject, search } = req.query
    const query = { user: req.user._id }

    if (subject && subject !== 'All') {
      query.$or = [
        { subject: subject },
        { subjectCode: subject }
      ]
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' }
      query.$or = [
        { title: searchRegex },
        { topic: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } },
      ]
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 })
    res.json({
      success: true,
      count: notes.length,
      data: notes,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { title, subject, subjectCode, topic, content, tags, color } = req.body

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Note title and content are required.',
      })
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      subject: subject || 'General',
      subjectCode: subjectCode || '',
      topic: topic || 'General Notes',
      content,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['Revision']),
      color: color || '#3b82f6',
      updatedAtText: 'Just now',
    })

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update an existing note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id })

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' })
    }

    const { title, subject, subjectCode, topic, content, tags, color } = req.body

    if (title !== undefined) note.title = title
    if (subject !== undefined) note.subject = subject
    if (subjectCode !== undefined) note.subjectCode = subjectCode
    if (topic !== undefined) note.topic = topic
    if (content !== undefined) note.content = content
    if (tags !== undefined) {
      note.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())
    }
    if (color !== undefined) note.color = color
    note.updatedAtText = 'Today'

    const updated = await note.save()

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' })
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
