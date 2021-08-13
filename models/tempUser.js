const mongoose=require("mongoose")

const tempUserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    code:{
        type:String,
    }
},{timestamps:true})

module.exports=mongoose.model("TempUser",tempUserSchema)