import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      customization: String,
    },
  ],
  customerInfo: {
    name: String,
    phone: String,
    email: String,
    address: String,
    notes: String,
  },
  total: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 1500,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["whatsapp", "mercado-pago"],
    default: "whatsapp",
  },
  preferenceId: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Order", orderSchema)
