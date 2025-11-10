import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"

const router = express.Router()

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await Admin.findOne({ username })

        if (!admin) {
            return res.status(401).json({ error: "Credenciales inválidas" })
        }

        const isValid = await bcrypt.compare(password, admin.password)
        if (!isValid) {
            return res.status(401).json({ error: "Credenciales inválidas" })
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.json({ token, admin: { id: admin._id, username: admin.username } })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
