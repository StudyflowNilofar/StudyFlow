import express from 'express'
import {
  getPlannerData,
  toggleSession,
} from '../controllers/plannerController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/', getPlannerData)
router.post('/session', toggleSession)

export default router
