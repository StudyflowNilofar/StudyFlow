import express from 'express'
import {
  getTasks,
  createTask,
  toggleTaskStatus,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.route('/')
  .get(getTasks)
  .post(createTask)

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask)

router.patch('/:id/toggle', toggleTaskStatus)

export default router
