const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors()) 
app.use(express.json())

// --- Conexión a MongoDB ---
// PON AQUÍ TU URI REAL DE MONGODB ATLAS
const MONGO_URI = "mongodb+srv://admin:12345678910@cluster0.jh1fbmc.mongodb.net/loginDB?retryWrites=true&w=majority"

mongoose.connect(MONGO_URI)
.then(()=> console.log("Conectado a MongoDB Atlas 🍃"))
.catch((err)=> console.log("Error al conectar MongoDB:", err))

// --- Modelo de Usuario ---
const UserSchema = new mongoose.Schema({
email:{
type:String,
required:true,
unique:true
},
password:{
type:String,
required:true
}
})

const User = mongoose.model("User", UserSchema)

// --- Ruta principal ---
app.get("/",(req,res)=>{
res.send("Servidor funcionando 🚀")
})

// --- Registrar usuario ---
app.post("/api/register", async (req,res)=>{

try{

const {email,password} = req.body

const newUser = new User({
email,
password
})

await newUser.save()

res.json({
message:"Usuario guardado en MongoDB"
})

}catch(error){

if(error.code === 11000){
return res.status(400).json({
message:"Ese correo ya existe"
})
}

res.status(500).json({
message:"Error del servidor"
})

}

})

// --- Login usuario ---
app.post("/api/login", async (req,res)=>{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){
return res.status(400).json({
message:"Usuario no encontrado"
})
}

if(user.password !== password){
return res.status(400).json({
message:"Contraseña incorrecta"
})
}

res.json({
message:"Login correcto"
})

})

// --- Iniciar servidor ---
app.listen(3000,()=>{
console.log("Servidor corriendo en http://localhost:3000")
})