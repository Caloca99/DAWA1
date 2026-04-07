# CRUD de Productos con Node.js, Express y MongoDB Atlas

Aplicacion web que implementa una API REST y una interfaz HTML/CSS/JS para gestionar productos con operaciones CRUD.

## Tecnologias usadas

- Node.js
- Express.js
- MongoDB Atlas o MongoDB local
- Mongoose
- HTML, CSS y JavaScript con Fetch API

## Campos del producto

- `nombre`
- `descripcion`
- `precio`
- `stock`
- `categoria`

Categorias permitidas:

- `Electronica`
- `Ropa`
- `Alimentos`

## Endpoints disponibles

- `POST /productos`
- `GET /productos`
- `GET /productos/:id`
- `PUT /productos/:id`
- `DELETE /productos/:id`

## Instalacion y ejecucion

1. Instala las dependencias:

```bash
npm install
```

2. Crea un archivo `.env` basandote en `.env.example`.

3. Configura tu conexion:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/productosdb?retryWrites=true&w=majority&appName=Cluster0
```

Si prefieres MongoDB local, tambien puedes usar:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/productosdb
```

4. Inicia el proyecto:

```bash
npm run dev
```

o

```bash
npm start
```

5. Abre en el navegador:

- `http://localhost:3000`

## Validaciones implementadas

- Nombre obligatorio, minimo 2 caracteres
- Descripcion obligatoria, minimo 5 caracteres
- Precio numerico mayor o igual a 0
- Stock numerico mayor o igual a 0
- Categoria obligatoria y limitada a opciones predefinidas

## Manejo de errores

- `400` para datos invalidos o ID incorrecto
- `404` cuando el producto no existe
- `500` para errores internos del servidor
