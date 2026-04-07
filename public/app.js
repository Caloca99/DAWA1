const API_URL = "/productos";

const form = document.getElementById("producto-form");
const inputId = document.getElementById("producto-id");
const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const inputCategoria = document.getElementById("categoria");
const tablaProductos = document.getElementById("tabla-productos");
const mensaje = document.getElementById("mensaje");
const btnCancelar = document.getElementById("btn-cancelar");
const btnGuardar = document.getElementById("btn-guardar");
const btnRecargar = document.getElementById("btn-recargar");

function mostrarMensaje(texto, tipo = "exito") {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

function limpiarFormulario() {
  form.reset();
  inputId.value = "";
  btnGuardar.textContent = "Guardar producto";
  btnCancelar.classList.add("oculto");
}

function cargarProductoEnFormulario(producto) {
  inputId.value = producto._id;
  inputNombre.value = producto.nombre;
  inputDescripcion.value = producto.descripcion;
  inputPrecio.value = producto.precio;
  inputStock.value = producto.stock;
  inputCategoria.value = producto.categoria;
  btnGuardar.textContent = "Actualizar producto";
  btnCancelar.classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function crearFilaProducto(producto) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${producto.nombre}</td>
    <td>${producto.descripcion}</td>
    <td>S/ ${Number(producto.precio).toFixed(2)}</td>
    <td>${producto.stock}</td>
    <td>${producto.categoria}</td>
    <td>
      <div class="acciones-tabla">
        <button class="btn-editar" data-id="${producto._id}">Editar</button>
        <button class="btn-eliminar" data-id="${producto._id}">Eliminar</button>
      </div>
    </td>
  `;
  return fila;
}

async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_URL);
    const productos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(productos.mensaje || "No se pudieron cargar los productos");
    }

    tablaProductos.innerHTML = "";

    if (productos.length === 0) {
      tablaProductos.innerHTML =
        '<tr><td colspan="6" class="sin-productos">No hay productos registrados.</td></tr>';
      return;
    }

    productos.forEach((producto) => {
      tablaProductos.appendChild(crearFilaProducto(producto));
    });
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function guardarProducto(evento) {
  evento.preventDefault();

  const producto = {
    nombre: inputNombre.value,
    descripcion: inputDescripcion.value,
    precio: Number(inputPrecio.value),
    stock: Number(inputStock.value),
    categoria: inputCategoria.value
  };

  const productoId = inputId.value;
  const url = productoId ? `${API_URL}/${productoId}` : API_URL;
  const metodo = productoId ? "PUT" : "POST";

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      const detalle = data.errores ? data.errores.join(". ") : data.mensaje;
      throw new Error(detalle || "No se pudo guardar el producto");
    }

    mostrarMensaje(data.mensaje, "exito");
    limpiarFormulario();
    await obtenerProductos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function editarProducto(productoId) {
  try {
    const respuesta = await fetch(`${API_URL}/${productoId}`);
    const producto = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(producto.mensaje || "No se pudo obtener el producto");
    }

    cargarProductoEnFormulario(producto);
    mostrarMensaje("Editando producto seleccionado", "exito");
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function eliminarProducto(productoId) {
  const confirmar = window.confirm("Deseas eliminar este producto?");

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/${productoId}`, {
      method: "DELETE"
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.mensaje || "No se pudo eliminar el producto");
    }

    mostrarMensaje(data.mensaje, "exito");

    if (inputId.value === productoId) {
      limpiarFormulario();
    }

    await obtenerProductos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

form.addEventListener("submit", guardarProducto);

btnCancelar.addEventListener("click", () => {
  limpiarFormulario();
  mostrarMensaje("Edicion cancelada", "exito");
});

btnRecargar.addEventListener("click", () => {
  obtenerProductos();
  mostrarMensaje("Lista actualizada", "exito");
});

tablaProductos.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");

  if (!boton) {
    return;
  }

  const productoId = boton.dataset.id;

  if (boton.classList.contains("btn-editar")) {
    editarProducto(productoId);
  }

  if (boton.classList.contains("btn-eliminar")) {
    eliminarProducto(productoId);
  }
});

obtenerProductos();
