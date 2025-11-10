import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import productsRouter from "./routes/products.js"
import adminRouter from "./routes/admin.js"
import ordersRouter from "./routes/orders.js"
import paymentsRouter from "./routes/payments.js"

dotenv.config()
const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Conectar a la base de datos
await connectDB()

// Routes
app.use("/api/products", productsRouter)
app.use("/api/admin", adminRouter)
app.use("/api/orders", ordersRouter)
app.use("/api/mercado-pago", paymentsRouter)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

// Error handling
app.use((err, req, res, next) => {
  console.error("[Backend Error]:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  })
})

const PORT = process.env.PORT || 5000
app.listen(process.env.PORT || 3000, () => console.log(`Servidor corriendo en el puerto ${process.env.PORT || 3000}`))


