require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Habilitar CORS y parseo de JSON
app.use(cors());
app.use(express.json());

// --- Conexión a MongoDB usando variable de entorno ---
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas 🍃"))
  .catch((err) => console.log("Error al conectar MongoDB:", err));

// --- Modelo de Usuario ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// --- Rutas API ---
// Registrar usuario
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const newUser = new User({ email, password });
    await newUser.save();

    res.json({ message: "Usuario guardado en DB" });
  } catch (error) {
    console.error("Error en registro:", error); // Ver el error real en consola
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ese correo ya existe" });
    }
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Login usuario
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    if (user.password !== password)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    res.json({ message: "Login correcto" });
  } catch (error) {
    console.error("Error en login:", error); // Ver el error real en consola
    res.status(500).json({ message: "Error del servidor" });
  }
});

// --- Servir React App ---
app.use(express.static(path.join(__dirname, "tick", "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "tick", "dist", "index.html"));
});

// --- Iniciar servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});