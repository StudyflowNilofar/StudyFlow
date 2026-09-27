import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studyflow'
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    })
    console.log(` MongoDB Connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`)
    console.warn(`ℹ️ Running in resilient mode. Ensure MongoDB is running locally or provide a valid MONGO_URI in server/.env for cloud persistence.`)
    return false
  }
}
