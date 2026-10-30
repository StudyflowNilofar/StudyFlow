import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Document', 'Video', 'Website', 'Repository', 'Textbook', 'Notes'],
      default: 'Document',
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
)

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema)
export default Resource
