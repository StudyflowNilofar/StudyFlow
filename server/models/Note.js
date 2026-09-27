import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
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
    topic: {
      type: String,
      default: 'General Revision',
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    tags: {
      type: [String],
      default: ['Revision'],
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    updatedAtText: {
      type: String,
      default: 'Today',
    },
  },
  { timestamps: true }
)

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema)
export default Note
