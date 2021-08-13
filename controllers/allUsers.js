const User=require("../models/user")

exports.allUsers=(req,res)=>{
    User.find((err,allTheUsers)=>{
        if(err || !allTheUsers){
            return res.status(404).json({
                message:"no user is found"
            })
        }
        res.status(200).json(allTheUsers)
    })
}