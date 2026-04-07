const express = require("express");
const mongoose = require("mongoose");

const {
  Producto,
  categoriasPermitidas
} = require("../models/Producto");

const router = express.Router();

function validarProducto(req, res, next) {
  const { nombre, descripcion, precio, stock, categoria } = req.body;
  const errores = [];

  if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
    errores.push("El nombre es obligatorio y debe tener al menos 2 caracteres");
  }

  if (
    !descripcion ||
    typeof descripcion !== "string" ||
    descripcion.trim().length < 5
  ) {
    errores.push(
      "La descripcion es obligatoria y debe tener al menos 5 caracteres"
    );
  }

  if (precio === undefined || Number.isNaN(Number(precio)) || Number(precio) < 0) {
    errores.push("El precio es obligatorio y debe ser un numero mayor o igual a 0");
  }

  if (stock === undefined || Number.isNaN(Number(stock)) || Number(stock) < 0) {
    errores.push("El stock es obligatorio y debe ser un numero mayor o igual a 0");
  }

  if (!categoriasPermitidas.includes(categoria)) {
    errores.push(`La categoria debe ser una de: ${categoriasPermitidas.join(", ")}`);
  }

  if (errores.length > 0) {
    return res.status(400).json({
      mensaje: "Datos de producto invalidos",
      errores
    });
  }

  req.body.precio = Number(precio);
  req.body.stock = Number(stock);
  req.body.nombre = nombre.trim();
  req.body.descripcion = descripcion.trim();
  return next();
}

function validarObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ mensaje: "ID de producto no valido" });
  }

  return next();
}

router.get("/", async (req, res, next) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    return res.status(200).json(productos);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", validarObjectId, async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    return res.status(200).json(producto);
  } catch (error) {
    return next(error);
  }
});

router.post("/", validarProducto, async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body);
    return res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto
    });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", validarObjectId, validarProducto, async (req, res, next) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    return res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: productoActualizado
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", validarObjectId, async (req, res, next) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    return res.status(200).json({
      mensaje: "Producto eliminado correctamente"
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
