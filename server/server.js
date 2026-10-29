import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import plannerRoutes from './routes/plannerRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

dotenv.config()
if (!process.env.MONGO_URI) {
  dotenv.config({ path: 'server/.env' })
}

const app = express()
const PORT = process.env.PORT || 5000

// Initial Database Connection (attempt in background)
connectDB()

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Ensure database connection is active on serverless invocations
app.use(async (_req, _res, next) => {
  try {
    if (mongoose.connection.readyState < 1) {
      await connectDB()
    }
  } catch (err) {
    console.warn('DB reconnection attempt warning:', err.message)
  }
  next()
})

// Health check endpoint
app.get(['/', '/api', '/api/health', '/health'], (req, res) => {
  res.json({
    status: 'OK',
    app: 'StudyFlow API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// Mount API Routes (support both /api/* and root /* for seamless Vercel rewrites)
app.use(['/api/auth', '/auth'], authRoutes)
app.use(['/api/subjects', '/subjects'], subjectRoutes)
app.use(['/api/tasks', '/tasks'], taskRoutes)
app.use(['/api/notes', '/notes'], noteRoutes)
app.use(['/api/planner', '/planner'], plannerRoutes)
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  })
})

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('Server error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// Start listening only in standalone server mode (skip in Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 StudyFlow API Server running on port ${PORT} (http://localhost:${PORT})`)
  })
}

export default app
