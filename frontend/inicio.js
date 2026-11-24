const API_URL = "https://proyecto-bd-9c79.onrender.com";

const heroProductos = document.getElementById("heroProductos");
const heroUnidades = document.getElementById("heroUnidades");
const heroValor = document.getElementById("heroValor");

// Resumen del inventario que se muestra en el inicio
async function cargarResumen() {
  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    if (!respuesta.ok) throw new Error("Respuesta no válida del servidor");
    const productos = await respuesta.json();

    const unidades = productos.reduce((t, p) => t + Number(p.stock), 0);
    const valor = productos.reduce((t, p) => t + Number(p.precio) * Number(p.stock), 0);

    heroProductos.textContent = productos.length;
    heroUnidades.textContent = unidades;
    heroValor.textContent = valor.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.error("Error al cargar el resumen:", error);
  }
}

cargarResumen();