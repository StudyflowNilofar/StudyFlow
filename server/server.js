import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import plannerRoutes from './routes/plannerRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to Database
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'StudyFlow API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/dashboard', dashboardRoutes)

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

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 StudyFlow API Server running on port ${PORT} (http://localhost:${PORT})`)
})

export default app
