const mongoose = require("mongoose");

const categoriasPermitidas = ["Electronica", "Ropa", "Alimentos"];

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede superar los 100 caracteres"]
    },
    descripcion: {
      type: String,
      required: [true, "La descripcion es obligatoria"],
      trim: true,
      minlength: [5, "La descripcion debe tener al menos 5 caracteres"],
      maxlength: [300, "La descripcion no puede superar los 300 caracteres"]
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"]
    },
    categoria: {
      type: String,
      required: [true, "La categoria es obligatoria"],
      enum: {
        values: categoriasPermitidas,
        message: "La categoria seleccionada no es valida"
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = {
  Producto: mongoose.model("Producto", productoSchema),
  categoriasPermitidas
};
