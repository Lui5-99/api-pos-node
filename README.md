# POS System API

API REST para un sistema de punto de venta (POS) construido con Node.js, Express, TypeScript y MongoDB.

## Características

- Autenticación de usuarios (registro, inicio de sesión)
- Gestión de productos (CRUD)
- Carrito de compras
- Gestión de pedidos
- Panel de administración
- Control de acceso basado en roles
- Gestión de perfil de usuario

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd api-pos
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pos-system
JWT_SECRET=your-secret-key-change-this-in-production
```

4. Iniciar MongoDB:

```bash
mongod
```

5. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario

  ```json
  {
    "name": "Usuario",
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```

- `POST /api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }
  ```

### Usuario

- `GET /api/user/profile` - Obtener perfil del usuario
- `PUT /api/user/profile` - Actualizar perfil
  ```json
  {
    "name": "Nuevo Nombre",
    "email": "nuevo@ejemplo.com"
  }
  ```
- `PUT /api/user/password` - Cambiar contraseña
  ```json
  {
    "currentPassword": "contraseña123",
    "newPassword": "nuevaContraseña123"
  }
  ```
- `DELETE /api/user/account` - Eliminar cuenta
  ```json
  {
    "password": "contraseña123"
  }
  ```

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (admin)
  ```json
  {
    "name": "Producto",
    "description": "Descripción del producto",
    "price": 99.99,
    "stock": 100,
    "category": "Categoría",
    "image": "url-imagen"
  }
  ```
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)
- `PATCH /api/products/:id/stock` - Actualizar stock (admin)
  ```json
  {
    "stock": 150
  }
  ```

### Carrito

- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
  ```json
  {
    "productId": "id-producto",
    "quantity": 2
  }
  ```
- `PUT /api/cart/:productId` - Actualizar cantidad
  ```json
  {
    "quantity": 3
  }
  ```
- `DELETE /api/cart/:productId` - Eliminar producto del carrito
- `DELETE /api/cart` - Vaciar carrito

### Pedidos

- `POST /api/orders` - Crear pedido
  ```json
  {
    "shippingAddress": "Dirección de envío",
    "paymentMethod": "Método de pago"
  }
  ```
- `GET /api/orders` - Obtener pedidos del usuario
- `GET /api/orders/:id` - Obtener pedido por ID

### Admin

- `GET /api/admin/users` - Obtener todos los usuarios
- `PUT /api/admin/users/:userId/role` - Actualizar rol de usuario
  ```json
  {
    "role": "admin"
  }
  ```
- `GET /api/admin/dashboard` - Obtener estadísticas del dashboard

## Seguridad

- Autenticación basada en JWT
- Hash de contraseñas con bcrypt
- Control de acceso basado en roles
- Validación de datos
- Manejo de errores centralizado

## Desarrollo

- `npm run dev` - Iniciar servidor en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor en producción
- `npm test` - Ejecutar pruebas

## Estructura del Proyecto

```
src/
├── controllers/     # Controladores de la API
├── models/         # Modelos de MongoDB
├── routes/         # Rutas de la API
├── middleware/     # Middlewares
└── index.ts        # Punto de entrada
```

## Contribuir

1. Fork el repositorio
2. Crea tu rama de características
3. Commit tus cambios
4. Push a la rama
5. Crea un Pull Request
