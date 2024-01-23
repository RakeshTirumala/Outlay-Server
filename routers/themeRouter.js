const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


const themeRouter = express.Router();

themeRouter.put('/', authenticatingToken, expressAsyncHandler(async(request, response)=>{
    const email = request.body.email;
    const theme = request.body.theme;
    try{
        const user = await User.findOne({email})
        user.theme = theme;
        await user.save()
        response.status(200).json({message:'Successully updated!'})
    }catch(error){
        response.status(500).json({error:'Internal Error!'})
    }
}))

function authenticatingToken(req,res,next){
    console.log("Authenticating...")
    console.log("header", req.headers.authorization)
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1]
    console.log("token:",token)
    if(token==null) return res.sendStatus(401).json({user:User})
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, User)=>{
        if(err) return res.status(403).json({user:User})
        req.body.email = User.email
        console.log("email:", User.email)
        next()
    })
    console.log("Authentication done!")
}


module.exports = themeRouter