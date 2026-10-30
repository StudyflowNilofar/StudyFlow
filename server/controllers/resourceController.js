import Resource from '../models/Resource.js'

// @desc    Get all study resources for logged-in user
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({
      success: true,
      count: resources.length,
      data: resources,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create a new study resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (req, res) => {
  try {
    const { title, subject, type, url, description } = req.body

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Resource title and subject are required.',
      })
    }

    const resource = await Resource.create({
      user: req.user._id,
      title,
      subject,
      type: type || 'Document',
      url: url || '',
      description: description || '',
    })

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete a study resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' })
    }

    res.json({
      success: true,
      message: 'Resource deleted successfully',
      data: { id: req.params.id },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
