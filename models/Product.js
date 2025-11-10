import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["mate", "yerba", "bombilla", "combo"],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  customizable: {
    type: Boolean,
    default: false,
  },
  customizationPrice: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Product", productSchema)
