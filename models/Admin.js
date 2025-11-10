import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "Admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password antes de guardar
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Método para comparar contraseñas
adminSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password)
}

export default mongoose.model("Admin", adminSchema)
