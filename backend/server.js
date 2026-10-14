const express = require("express");
const cors = require("cors");
const conexion = require("./db"); // Importamos la conexión creada en db.js

const app = express();

// Middlewares globales
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Habilitar la lectura de datos en formato JSON en el cuerpo (req.body)

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    // Retornamos el array de productos como JSON al cliente
    res.json(resultados);
  });
});

// 2. Crear un nuevo producto (CREATE)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  // Consulta parametrizada con '?' para prevenir inyección SQL
  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

// 3. Actualizar un producto existente (UPDATE)
app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;

  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

// 4. Eliminar un producto (DELETE)
app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

//contacto
app.get("/contactos", (req, res) => {
  const sql = "select * from contactos order by fecha DESC, id DESC";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar contactos:", error);
      return res.status(500).json({ mensaje: "Error al consultar los mensajes" });
    }
    res.json(resultados);
  });
});

app.post("/contactos", (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql =
    "insert into contactos (nombre, correo, asunto, mensaje, fecha) VALUES (?, ?, ?, ?, NOW())";
  const valores = [nombre.trim(), correo.trim(), asunto.trim(), mensaje.trim()];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al guardar contacto:", error);
      return res.status(500).json({ mensaje: "Error al guardar el mensaje" });
    }
    res.status(201).json({
      mensaje: "Mensaje enviado correctamente",
      id: resultado.insertId,
    });
  });
});

app.delete("/contactos/:id", (req, res) => {
  const sql = "delete from contactos where id = ?";

  conexion.query(sql, [req.params.id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar contacto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje" });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "El mensaje no existe" });
    }
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
  console.log(" Servidor ejecutándose en http://localhost:3000");
});