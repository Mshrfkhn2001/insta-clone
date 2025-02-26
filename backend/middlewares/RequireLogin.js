const jwt=require('jsonwebtoken');
// const {Jwt_secret}=require("../keys")
const {jwt_secret}=require("../keys")
const mongoose=require("mongoose");
const USER=mongoose.model("USER")

module.exports=(req,res,next)=>{
    // console.log("hello middleware")
    const {authorization}=req.headers;
    if(!authorization)
    {
        return res.status(401).json({error:"You must have logged in"})
    }
    // res.json("Ok")
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,jwt_secret,(err,payload)=>{
        if(err)
        {
            return res.status(401).json("You must have logged in 2")
        }
        const {_id}=payload
        USER.findById(_id).then(userData=>{
            // console.log(userData)
            req.user=userData
            next() 
        })
    })
    
}