import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    subjectCode: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    dueDate: {
      type: String,
      default: 'Today',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    estimatedMinutes: {
      type: Number,
      default: 45,
    },
  },
  { timestamps: true }
)

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)
export default Task
