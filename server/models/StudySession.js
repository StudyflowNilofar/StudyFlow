import mongoose from 'mongoose'

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    shortTitle: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema)
export default StudySession
