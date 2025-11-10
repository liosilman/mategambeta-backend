import express from "express"
import Order from "../models/Order.js"

const router = express.Router()

// Generate unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

// CREATE order
router.post("/", async (req, res) => {
  try {
    const { items, customerInfo, total, shippingCost, paymentMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must have items" })
    }

    if (!customerInfo) {
      return res.status(400).json({ error: "Customer info required" })
    }

    const order = new Order({
      orderNumber: generateOrderNumber(),
      items,
      customerInfo,
      total,
      shippingCost: shippingCost || 1500,
      paymentMethod: paymentMethod || "whatsapp",
      paymentStatus: "pending",
      status: "pending",
    })

    await order.save()
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE order status
router.put("/:id", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        paymentStatus,
        updatedAt: Date.now(),
      },
      { new: true },
    )

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json({ message: "Order deleted", order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
