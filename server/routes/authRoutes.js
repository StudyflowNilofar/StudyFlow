import express from 'express'
import {
  registerUser,
  loginUser,
  getStudentProfile,
  updateStudentProfile,
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getStudentProfile)
router.put('/profile', protect, updateStudentProfile)

export default router
