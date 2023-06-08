const express = require ("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../model/user")
const { SECRET_KEY } = require('../keys')
const requireLogin = require("../middleware/requireLogin")


router.post("/signup",(req,res)=>{
    const {name,email,password} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error:"Please add all the fields"})
    }else{
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
    bcrypt.hash(password,12)
    .then((hashedPassword)=>{
        const user1 = new User({
            email,
            password:hashedPassword,
            name,
        })
        user1.save()
        .then((user)=>{
            res.status(200).json({message:"User created successfully"})
        })
    })
    }else{
            return res.status(422).json({error:"Email already exists"})
        }
    })
    }
    })
    
    router.post("/login",(req,res)=>{
        const{email,password} = req.body
        if(!email || !password){
            return res.status(422).json({error:"Please all the fields"})
        }else{
            User.findOne({ email: email})
            .then(savedUser =>{
                if(!savedUser){
                    return res.status(422).json({error:"Invalid Email"})
                }else{
                 bcrypt.compare(password,savedUser.password)
                 .then((doMatch) =>{
                    if(doMatch){
    const token = jwt.sign({_id:savedUser._id},SECRET_KEY)
    const{_id,name,email,followers,followings} = savedUser
    return res.status(200).json({token,user:{_id,name,email,followers,followings}
    })
                    }else{
                        return res.status(422).json({error:"Invalid Password"})
                     }
                 })
                }
            })
        }
    })

    router.get("/protected",requireLogin,(req,res)=>{
        return res.json('hello')
    })
    

module.exports = router