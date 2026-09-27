import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const secret = process.env.JWT_SECRET || 'studyflow_secret_key_2026_academic_secure'
      const decoded = jwt.verify(token, secret)

      // Fetch user without password
      const user = await User.findById(decoded.id).select('-password')
      if (!user) {
        // Fallback for demo user ID if in offline store
        req.user = { _id: decoded.id, name: decoded.name || 'Student', email: decoded.email || 'student@studyflow.edu' }
      } else {
        req.user = user
      }

      return next()
    } catch (error) {
      console.error('Token verification error:', error.message)
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired session token.',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no session token provided.',
    })
  }
}
