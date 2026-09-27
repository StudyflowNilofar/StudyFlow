# StudyFlow - Complete Backend Technical Documentation

This document contains the complete backend architecture, database schemas, API routes, and source code for the **StudyFlow (Smart Study Management System)** project report and documentation.

---

## 1. System Architecture & Tech Stack

```
USER / BROWSER (React.js Frontend)
         │  HTTP / REST API (JSON + JWT)
         ▼
EXPRESS.JS SERVER (Node.js runtime, Port 5000)
   ├── Auth Middleware (JWT Verification & bcryptjs)
   ├── REST API Routers (/api/auth, /api/subjects, /api/tasks, /api/notes, /api/planner, /api/dashboard)
   └── Controllers (Business Logic & Analytics)
         │  Mongoose ODM
         ▼
DATABASE (MongoDB / MongoDB Atlas Cloud)
   ├── Users Collection
   ├── Subjects Collection
   ├── Tasks Collection
   ├── Notes Collection
   └── StudySessions Collection
```

---

## 2. File Directory Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection & fallback handler
├── controllers/
│   ├── authController.js      # Student Registration, Login & Data Seeding
│   ├── subjectController.js   # Subject CRUD Operations
│   ├── taskController.js      # Study Task CRUD & Status Toggling
│   ├── noteController.js      # Revision Notes CRUD & Search
│   ├── plannerController.js   # Active Study Session Logging
│   └── dashboardController.js # Analytics & Streak Aggregation
├── middleware/
│   └── authMiddleware.js     # JWT Bearer Token Validation
├── models/
│   ├── User.js               # Student Schema & Password Hashing
│   ├── Subject.js            # Subject & Syllabus Schema
│   ├── Task.js               # Study Task Schema
│   ├── Note.js               # Revision Notes Schema
│   └── StudySession.js       # Study Session Tracker Schema
├── routes/
│   ├── authRoutes.js
│   ├── subjectRoutes.js
│   ├── taskRoutes.js
│   ├── noteRoutes.js
│   ├── plannerRoutes.js
│   └── dashboardRoutes.js
├── .env                      # Environment Variables
├── package.json              # Server Dependencies
└── server.js                 # Express Application Entry Point
```

---

## 3. Database Schemas (Mongoose Models)

### A. User Model (`server/models/User.js`)
```javascript
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please provide a name'], trim: true },
    email: { type: String, required: [true, 'Please provide an email address'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Please provide a password'], minlength: 6 },
    institution: { type: String, default: 'University / College', trim: true },
    semester: { type: String, default: 'Semester 6', trim: true },
    streakDays: { type: Number, default: 5 },
    lastActiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Pre-save hook: Hash password with bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
```

---

### B. Subject Model (`server/models/Subject.js`)
```javascript
import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Subject title is required'], trim: true },
    code: { type: String, required: [true, 'Subject code is required'], trim: true, uppercase: true },
    teacher: { type: String, default: 'Course Instructor', trim: true },
    color: { type: String, default: '#3b82f6' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    totalTopics: { type: Number, default: 10 },
    topicsCovered: { type: Number, default: 0 },
    hoursSpent: { type: Number, default: 0 },
    status: { type: String, enum: ['On Track', 'In Progress', 'Needs Focus', 'Completed'], default: 'In Progress' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
)

const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema)
export default Subject
```

---

### C. Task Model (`server/models/Task.js`)
```javascript
import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Task title is required'], trim: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    subjectCode: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    dueDate: { type: String, default: 'Today' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    completed: { type: Boolean, default: false },
    estimatedMinutes: { type: Number, default: 45 },
  },
  { timestamps: true }
)

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)
export default Task
```

---

### D. Note Model (`server/models/Note.js`)
```javascript
import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Note title is required'], trim: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    subjectCode: { type: String, default: '', trim: true },
    topic: { type: String, default: 'General Revision', trim: true },
    content: { type: String, required: [true, 'Note content is required'] },
    tags: { type: [String], default: ['Revision'] },
    color: { type: String, default: '#3b82f6' },
    updatedAtText: { type: String, default: 'Today' },
  },
  { timestamps: true }
)

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema)
export default Note
```

---

### E. StudySession Model (`server/models/StudySession.js`)
```javascript
import mongoose from 'mongoose'

const studySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: String, required: true },
    shortTitle: { type: String, default: '' },
    subject: { type: String, default: '' },
    durationMinutes: { type: Number, default: 45 },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema)
export default StudySession
```

---

## 4. Middleware: JWT Authentication (`server/middleware/authMiddleware.js`)

```javascript
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const secret = process.env.JWT_SECRET || 'studyflow_secret_key_2026_academic_secure'
      const decoded = jwt.verify(token, secret)

      const user = await User.findById(decoded.id).select('-password')
      if (!user) {
        req.user = { _id: decoded.id, name: decoded.name || 'Student', email: decoded.email }
      } else {
        req.user = user
      }

      return next()
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token.' })
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' })
  }
}
```

---

## 5. Express Entry Point (`server/server.js`)

```javascript
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

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check
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

// Error Handler
app.use((err, req, res, _next) => {
  console.error('Server error:', err)
  res.status(err.status || 500).json({ success: false, message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 StudyFlow API Server running on port ${PORT}`)
})

export default app
```

---

## 6. Complete REST API Endpoint Summary Table

| Module | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register new student, hash password & seed initial data | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate student & return signed JWT token | Public |
| **Auth** | `GET` | `/api/auth/me` | Fetch current student profile | Private (JWT) |
| **Auth** | `PUT` | `/api/auth/profile` | Update student name, semester, or institution | Private (JWT) |
| **Subjects** | `GET` | `/api/subjects` | Fetch all registered courses with progress metrics | Private (JWT) |
| **Subjects** | `POST` | `/api/subjects` | Create new semester subject & topic breakdown | Private (JWT) |
| **Subjects** | `PUT` | `/api/subjects/:id` | Update subject details or topic completion count | Private (JWT) |
| **Subjects** | `DELETE`| `/api/subjects/:id` | Remove subject from student curriculum | Private (JWT) |
| **Tasks** | `GET` | `/api/tasks` | Get filtered tasks (by subject, status, priority) | Private (JWT) |
| **Tasks** | `POST` | `/api/tasks` | Create new study task / homework assignment | Private (JWT) |
| **Tasks** | `PATCH`| `/api/tasks/:id/toggle` | Toggle task between `completed` & `pending` | Private (JWT) |
| **Tasks** | `PUT` | `/api/tasks/:id` | Edit task title, deadline, priority | Private (JWT) |
| **Tasks** | `DELETE`| `/api/tasks/:id` | Delete study task | Private (JWT) |
| **Notes** | `GET` | `/api/notes` | Get study notes with keyword & subject filter | Private (JWT) |
| **Notes** | `POST` | `/api/notes` | Create revision note with markdown content & tags | Private (JWT) |
| **Notes** | `PUT` | `/api/notes/:id` | Edit existing study note | Private (JWT) |
| **Notes** | `DELETE`| `/api/notes/:id` | Delete revision note | Private (JWT) |
| **Planner** | `GET` | `/api/planner` | Get active recall topics, exam answers & flashcards | Private (JWT) |
| **Planner** | `POST` | `/api/planner/session`| Log study session completion and update streak | Private (JWT) |
| **Dashboard**| `GET` | `/api/dashboard/stats` | Aggregated analytics (streak, syllabus %, hours) | Private (JWT) |
| **Health** | `GET` | `/api/health` | Service uptime and status probe | Public |
