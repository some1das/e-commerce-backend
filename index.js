const express=require("express")
const mongoose=require('mongoose')
require('dotenv').config()
const bodyParser=require("body-parser")
const cors=require('cors')
const cookieParser=require('cookie-parser')
//My routes
const authRoutes=require('./routs/auth')
const userRoutes=require('./routs/user')
const categoryRoutes=require("./routs/category")
const productRoutes=require('./routs/product')
const orderRoutes=require("./routs/order")

const app = express()
//Port
const port= process.env.PORT || 8000
//DB connections
mongoose.connect(process.env.DB_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED SUCCESSFULLY....")
}).catch(()=>{
    console.log("CONNECTION UNSUCCESSFUL.......")
})

//Middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//Routs
app.use("/api",authRoutes)
app.use("/api",userRoutes)
const allUsers=require('./routs/allUsers')
app.use("/api",allUsers)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)




//Server runner
app.listen(port,()=>{
    console.log("Server has been started successfully")
})