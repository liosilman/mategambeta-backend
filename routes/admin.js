import express from "express"
import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// LOGIN admin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    // Para mantener compatibilidad con el frontend que usa contraseña simple,
    // también permitimos login con la contraseña del .env
    const adminEmail = process.env.ADMIN_EMAIL || "admin@matestore.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "mate2024"

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ id: "admin-system", email }, process.env.JWT_SECRET, { expiresIn: "24h" })

      return res.json({
        token,
        admin: {
          email,
          name: "Administrator",
        },
      })
    }

    // Intenta buscar en BD (para casos futuros)
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValidPassword = await admin.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// VERIFY token
router.get("/verify", verifyToken, async (req, res) => {
  res.json({ valid: true, adminId: req.adminId })
})

// GET admin profile (requires auth)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    res.json({
      email: process.env.ADMIN_EMAIL || "admin@matestore.com",
      name: "Administrator",
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
