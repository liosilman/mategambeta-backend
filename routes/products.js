import express from "express"
import Product from "../models/Product.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// CREATE product (requires auth)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, price, category, image, customizable, customizationPrice } = req.body

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      customizable,
      customizationPrice: customizable ? customizationPrice : 0,
    })

    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE product (requires auth)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, description, price, category, image, customizable, customizationPrice } = req.body

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        image,
        customizable,
        customizationPrice: customizable ? customizationPrice : 0,
        updatedAt: Date.now(),
      },
      { new: true },
    )

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE product (requires auth)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json({ message: "Product deleted", product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
