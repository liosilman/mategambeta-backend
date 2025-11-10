import express from "express"
import Order from "../models/Order.js"
import MercadoPago from "mercadopago"

const router = express.Router()

// ✅ Nueva forma de inicializar Mercado Pago
const client = new MercadoPago.MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
})

// ✅ Crear preferencia de pago
router.post("/preference", async (req, res) => {
    try {
        const { items, customerInfo, total, shippingCost } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Items required" })
        }

        // Crear orden en la base de datos
        const order = new Order({
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            items,
            customerInfo,
            total,
            shippingCost: shippingCost || 1500,
            paymentMethod: "mercado-pago",
            paymentStatus: "pending",
            status: "pending",
        })

        const savedOrder = await order.save()

        // Formatear items para Mercado Pago
        const mpItems = items.map((item) => ({
            id: item.productId || item._id,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: "ARS",
        }))

        // Agregar envío como ítem si aplica
        if (shippingCost && shippingCost > 0) {
            mpItems.push({
                id: "shipping",
                title: "Envío",
                quantity: 1,
                unit_price: shippingCost,
                currency_id: "ARS",
            })
        }

        // Crear preferencia
        const preference = {
            items: mpItems,
            payer: {
                name: customerInfo.name,
                email: customerInfo.email || "",
                phone: { number: customerInfo.phone },
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/success`,
                failure: `${process.env.FRONTEND_URL}/failure`,
                pending: `${process.env.FRONTEND_URL}/pending`,
            },
            auto_return: "approved",
            external_reference: savedOrder._id.toString(),
            notification_url: `${process.env.BACKEND_URL || "http://localhost:5000/api"}/mercado-pago/webhook`,
        }

        const preferenceResponse = await new MercadoPago.Preference(client).create({
            body: preference,
        })

        // Guardar el ID de preferencia
        savedOrder.preferenceId = preferenceResponse.id
        await savedOrder.save()

        res.json({
            preference_id: preferenceResponse.id,
            orderId: savedOrder._id,
            init_point: preferenceResponse.init_point,
        })
    } catch (error) {
        console.error("[Mercado Pago Error]:", error)
        res.status(500).json({ error: error.message })
    }
})

// ✅ Webhook (notificaciones de pago)
router.post("/webhook", async (req, res) => {
    try {
        const { type, data } = req.query

        if (type === "payment") {
            const paymentId = data.id

            const payment = await new MercadoPago.Payment(client).get({ id: paymentId })

            if (payment.status === "approved") {
                const externalReference = payment.external_reference

                await Order.findByIdAndUpdate(externalReference, {
                    paymentStatus: "completed",
                    status: "confirmed",
                })

                console.log("[Payment] Pago aprobado para orden:", externalReference)
            } else if (payment.status === "rejected") {
                const externalReference = payment.external_reference

                await Order.findByIdAndUpdate(externalReference, {
                    paymentStatus: "failed",
                    status: "cancelled",
                })

                console.log("[Payment] Pago rechazado para orden:", externalReference)
            }
        }

        res.sendStatus(200)
    } catch (error) {
        console.error("[Webhook Error]:", error)
        res.sendStatus(200)
    }
})

export default router
