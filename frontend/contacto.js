const API_URL = "https://proyecto-bd-9c79.onrender.com";

const formContacto = document.getElementById("formularioContacto");
const nombreInput = document.getElementById("nombre");
const correoInput = document.getElementById("correo");
const asuntoInput = document.getElementById("asunto");
const mensajeInput = document.getElementById("mensaje");
const listaMensajes = document.getElementById("listaMensajes");
const estadoForm = document.getElementById("estadoFormulario");

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function mostrarEstado(texto, esError = false) {
  estadoForm.textContent = texto;
  estadoForm.classList.toggle("error", esError);
}

// consultar
async function cargarMensajes() {
  try {
    const respuesta = await fetch(`${API_URL}/contactos`);
    if (!respuesta.ok) throw new Error("Respuesta no válida del servidor");
    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
      listaMensajes.innerHTML = "<p class='vacio'>Aún no hay mensajes. Envía el primero desde el formulario.</p>";
      return;
    }

    mensajes.forEach((m) => {
      const elemento = document.createElement("article");
      elemento.classList.add("mensaje");

      elemento.innerHTML = `
        <div class="mensaje-cabecera">
          <h3>${escapar(m.asunto)}</h3>
          <span class="mensaje-fecha">${formatearFecha(m.fecha)}</span>
        </div>
        <p class="mensaje-remitente">${escapar(m.nombre)} · ${escapar(m.correo)}</p>
        <p class="mensaje-texto">${escapar(m.mensaje)}</p>
        <div class="acciones">
          <button class="btn-eliminar" data-id="${m.id}">Eliminar</button>
        </div>
      `;

      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
    listaMensajes.innerHTML =
      "<p class='vacio'>No se pudieron cargar los mensajes. Verifica que el servidor esté encendido.</p>";
  }
}

// guardar
formContacto.addEventListener("submit", async (event) => {
  event.preventDefault();

  const datos = {
    nombre: nombreInput.value,
    correo: correoInput.value,
    asunto: asuntoInput.value,
    mensaje: mensajeInput.value,
  };

  try {
    const respuesta = await fetch(`${API_URL}/contactos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      throw new Error(error.mensaje || "No se pudo enviar el mensaje");
    }

    formContacto.reset();
    mostrarEstado("Mensaje enviado correctamente.");
    cargarMensajes();
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    mostrarEstado(error.message, true);
  }
});

// eliminar
listaMensajes.addEventListener("click", async (event) => {
  const boton = event.target.closest(".btn-eliminar");
  if (!boton) return;

  if (!confirm("¿Deseas eliminar este mensaje de la base de datos?")) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos/${boton.dataset.id}`, {
      method: "DELETE",
    });
    if (!respuesta.ok) throw new Error("No se pudo eliminar");

    cargarMensajes();
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    alert("No se pudo eliminar el mensaje.");
  }
});

// carga inicial
cargarMensajes();