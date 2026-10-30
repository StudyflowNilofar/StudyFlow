import mongoose from 'mongoose'

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Subject title is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
    },
    teacher: {
      type: String,
      default: 'Course Instructor',
      trim: true,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalTopics: {
      type: Number,
      default: 10,
    },
    topicsCovered: {
      type: Number,
      default: 0,
    },
    hoursSpent: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['On Track', 'In Progress', 'Needs Focus', 'Completed'],
      default: 'In Progress',
    },
    description: {
      type: String,
      default: '',
    },
    topics: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        unit: { type: String, default: 'Unit 1' },
      },
    ],
  },
  { timestamps: true }
)

const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema)
export default Subject
