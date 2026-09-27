import Task from '../models/Task.js'

// @desc    Get all study tasks for the student
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, subject, priority, search } = req.query
    const query = { user: req.user._id }

    if (status === 'completed') {
      query.completed = true
    } else if (status === 'pending') {
      query.completed = false
    }

    if (priority) {
      query.priority = priority
    }

    if (subject && subject !== 'All') {
      query.subject = subject
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ]
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 })
    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create a new study task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, subject, subjectCode, description, dueDate, priority, estimatedMinutes } = req.body

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Task title and subject are required.',
      })
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      subject,
      subjectCode: subjectCode || '',
      description: description || '',
      dueDate: dueDate || 'Today',
      priority: priority || 'Medium',
      completed: false,
      estimatedMinutes: Number(estimatedMinutes) || 45,
    })

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Toggle task complete / incomplete status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
export const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' })
    }

    task.completed = !task.completed
    await task.save()

    res.json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'pending'}`,
      data: task,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' })
    }

    const { title, subject, subjectCode, description, dueDate, priority, estimatedMinutes, completed } = req.body

    if (title !== undefined) task.title = title
    if (subject !== undefined) task.subject = subject
    if (subjectCode !== undefined) task.subjectCode = subjectCode
    if (description !== undefined) task.description = description
    if (dueDate !== undefined) task.dueDate = dueDate
    if (priority !== undefined) task.priority = priority
    if (estimatedMinutes !== undefined) task.estimatedMinutes = Number(estimatedMinutes)
    if (completed !== undefined) task.completed = Boolean(completed)

    const updated = await task.save()

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete study task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' })
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
