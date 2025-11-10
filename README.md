# Mate Store Backend

Backend API para la tienda de mate online.

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

1. Crear archivo `.env` en la raíz del backend:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/mate-store
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@matestore.com
ADMIN_PASSWORD=mate2024
MERCADO_PAGO_ACCESS_TOKEN=your_token_here
MERCADO_PAGO_PUBLIC_KEY=your_public_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
\`\`\`

2. Asegurar que MongoDB está corriendo localmente o tener una URI de MongoDB Atlas

## Desarrollo

\`\`\`bash
npm run dev
\`\`\`

## Scripts

### Sembrar la base de datos con productos iniciales

\`\`\`bash
npm run seed
\`\`\`

## Rutas de la API

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (requiere autenticación)
- `PUT /api/products/:id` - Actualizar producto (requiere autenticación)
- `DELETE /api/products/:id` - Eliminar producto (requiere autenticación)

### Admin
- `POST /api/admin/login` - Login del administrador
- `GET /api/admin/verify` - Verificar token JWT
- `GET /api/admin/profile` - Obtener perfil del admin (requiere autenticación)

### Órdenes
- `GET /api/orders` - Obtener todas las órdenes
- `GET /api/orders/:id` - Obtener orden por ID
- `POST /api/orders` - Crear nueva orden
- `PUT /api/orders/:id` - Actualizar estado de orden
- `DELETE /api/orders/:id` - Eliminar orden

### Pagos (Mercado Pago)
- `POST /api/mercado-pago/preference` - Crear preferencia de pago
- `POST /api/mercado-pago/webhook` - Webhook para notificaciones

## Autenticación

El backend usa JWT (JSON Web Tokens) para proteger las rutas de administrador. El token se envía en el header Authorization:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Integración con Frontend

El frontend en `http://localhost:3000` se comunica con este backend en `http://localhost:5000/api`.

CORS está habilitado para permitir requests desde el frontend.
\`\`\`
