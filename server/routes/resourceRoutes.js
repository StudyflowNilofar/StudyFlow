import express from 'express'
import {
  getResources,
  createResource,
  deleteResource,
} from '../controllers/resourceController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.route('/')
  .get(getResources)
  .post(createResource)

router.route('/:id')
  .delete(deleteResource)

export default router
