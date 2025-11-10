import express from "express"
import { MercadoPagoConfig, Preference } from "mercadopago"

const router = express.Router()
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
})

router.post("/preference", async (req, res) => {
    try {
        const { items, payer, back_urls, external_reference, metadata } = req.body

        const preference = new Preference(client)
        const response = await preference.create({
            body: {
                items: items.map((item) => ({
                    title: item.title,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    currency_id: "ARS",
                })),
                payer,
                back_urls,
                auto_return: "approved",
                external_reference,
                notification_url: `${process.env.BACKEND_URL}/api/mercado-pago/webhook`,
            },
        })

        res.json({ preference_id: response.id })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post("/webhook", (req, res) => {
    // Handle Mercado Pago webhooks
    res.json({ status: "ok" })
})

export default router
