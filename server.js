const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const productosRouter = require("./src/routes/productos");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/productosdb";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api", (req, res) => {
  res.json({
    mensaje: "API de productos activa",
    endpoints: [
      "GET /productos",
      "GET /productos/:id",
      "POST /productos",
      "PUT /productos/:id",
      "DELETE /productos/:id"
    ]
  });
});

app.use("/productos", productosRouter);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      mensaje: "Error de validacion",
      errores: Object.values(err.errors).map((error) => error.message)
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ mensaje: "ID de producto no valido" });
  }

  console.error(err);
  return res.status(500).json({
    mensaje: "Ocurrio un error interno en el servidor"
  });
});

async function iniciarServidor() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB conectado correctamente");
    app.listen(PORT, () => {
      console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
