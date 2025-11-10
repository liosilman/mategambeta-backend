import dotenv from "dotenv"
import Product from "../models/Product.js"
import { connectDB } from "../config/db.js"

dotenv.config()

const seedProducts = [
  {
    name: "Mate Tradicional",
    description: "Mate de cerámica tradicional, perfecto para yerba mate",
    price: 3500,
    category: "mate",
    image: "/yerba-mate-tradicional.jpg",
    customizable: true,
    customizationPrice: 800,
    stock: 50,
  },
  {
    name: "Mate de Cerámica",
    description: "Mate elegante de cerámica esmaltada",
    price: 4200,
    category: "mate",
    image: "/mate-ceramica.jpg",
    customizable: true,
    customizationPrice: 800,
    stock: 50,
  },
  {
    name: "Bombilla Plata",
    description: "Bombilla de plata 925, resistente y duradera",
    price: 2800,
    category: "bombilla",
    image: "/bombilla-plata.jpg",
    customizable: false,
    customizationPrice: 0,
    stock: 100,
  },
  {
    name: "Combo Premium",
    description: "Kit completo: Mate, bombilla y yerba premium",
    price: 9500,
    category: "combo",
    image: "/combo-premium.jpg",
    customizable: true,
    customizationPrice: 1200,
    stock: 30,
  },
  {
    name: "Yerba Premium",
    description: "Yerba mate premium seleccionada",
    price: 1800,
    category: "yerba",
    image: "/yerba-mate-premium.jpg",
    customizable: false,
    customizationPrice: 0,
    stock: 200,
  },
]

async function seed() {
  try {
    await connectDB()

    // Limpiar productos existentes
    await Product.deleteMany({})
    console.log("[Seed] Productos previos eliminados")

    // Insertar nuevos productos
    const insertedProducts = await Product.insertMany(seedProducts)
    console.log(`[Seed] ${insertedProducts.length} productos creados`)

    console.log("[Seed] Base de datos sembrada exitosamente")
    process.exit(0)
  } catch (error) {
    console.error("[Seed Error]:", error)
    process.exit(1)
  }
}

seed()
