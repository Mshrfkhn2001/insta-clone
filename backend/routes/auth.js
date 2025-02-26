const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const USER=mongoose.model("USER");
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const {jwt_secret}=require('../keys');
const requireLogin = require("../middlewares/RequireLogin");


router.get('/',(req,res)=>{
    res.send("hello")
})
// router.get("/createPost",requireLogin,(req,res)=>{
//     console.log("hello auth")

// })

router.post("/signup",(req,res)=>{
    const {name,userName,email,password}=req.body;
    if(!name || !email || !userName || !password)
        {
            return res.status(422).json({error:"Please enter all fields"})
        }
        USER.findOne({ $or:[{email:email},{userName:userName}]}).then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({error:"User already exist with this email or username"})
            }
            bcrypt.hash(password,12).then((hashedPassword)=>{
                const user=new USER({
                    name,
                    email,
                    userName,
                    password:hashedPassword
                })
                user.save()
                .then(user=>{res.json({message:"Registered successfully"})})
                .catch(err=>{console.log(err)})
            })
            
        })
    
})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return res.status(422).json({error:"please add email and password"})
    }
    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser)
        {
            return res.status(422).json({error:"Invalid email"})
        }
        // console.log(savedUser);
        bcrypt.compare(password,savedUser.password)
        .then((match)=>{
            if(match)
            {
                // res.status(200).json({message:"Signed in Successfully"})
                const token=jwt.sign({_id:savedUser.id},jwt_secret)
                const {_id,name,email,userName}=savedUser
                res.json({token,user:{_id,name,email,userName}})
                console.log({token,user:{_id,name,email,userName}})
            }
            else
            {
                return res.status(422).json({error:"Invalid password"})
            }
        })
        .catch(err=>console.log(err))
    })
})


router.post("/googleLogin",(req,res)=>{
    const{email_verified,email,name,clientId,userName,Photo}=req.body
    if(email_verified)
    {
        USER.findOne({email:email}).then((savedUser)=>{
            if(savedUser)
            {
                const token=jwt.sign({_id:savedUser.id},jwt_secret)
                const {_id,name,email,userName}=savedUser
                res.json({token,user:{_id,name,email,userName}})
                console.log({token,user:{_id,name,email,userName}})
            }
            
            else
            {
                const password=email+clientId
                const user=new USER({
                    name,
                    email,
                    userName,
                    password:password,
                    Photo
                })
                user.save()
                .then(user=>{
                    let userId=user._id.toString()
                    const token=jwt.sign({_id:userId},jwt_secret)
                const {_id,name,email,userName}=user
                res.json({token,user:{_id,name,email,userName}})
                console.log({token,user:{_id,name,email,userName}})
                })
                .catch(err=>{console.log(err)})
            }
        })
    }
})
module.exports=router;