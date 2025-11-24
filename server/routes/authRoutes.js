import express from 'express'
import User from '../models/User.js'

const route = express.Router()


route.post('/signup',async(req,res)=>{
    const existingUser = await User.findOne({email: req.body.email})
    if(existingUser){
        return res.json({error: "Email already exists"})
    }
    else{
        await User.create(req.body)
        res.json({message: "Signup Successful"})
    }
})

route.post('/login',async(req,res)=>{
    const email = req.body.email
    const foundUser = await User.findOne({email})
    if(foundUser){
        if(foundUser.password === req.body.password){
            res.json({success: true, user: {_id: foundUser._id, name: foundUser.name, email: foundUser.email}})
        }
        else{
            res.json({success: false})
        }
    }
    else{
        res.json({message: "User not Found!"})
    }
})

export default route