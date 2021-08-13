const express=require('express')
const router=express.Router()
const { body, validationResult } = require("express-validator");
const {signup,preSignup,signout,signin ,isSignedIn}=require("../controllers/auth")
const {checkData}=require("./validators/uservalidator")

router.post('/preSignup',checkData,preSignup)
router.post('/signup',signup)
router.post('/signin',signin)
router.get('/signout',signout)
router.get('/test',isSignedIn,(req,res)=>{
    res.send('a protected route')
})

module.exports=router