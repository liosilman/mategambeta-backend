import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mate_y_gambeta")
    console.log("[DB] Conectado a MongoDB:", "MateyGambetaDB" || conn.connection.host  )
    return conn
  } catch (error) {
    console.error("[DB Error]:", error.message)
    process.exit(1)
  }
}
