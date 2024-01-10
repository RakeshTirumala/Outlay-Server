const express = require('express');
const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
require('dotenv').config();

const userLoginRouter = express.Router();

userLoginRouter.post('/', expressAsyncHandler(async(request, response)=>{
    try{
        const email = request.body.email;
        const password = request.body.password;
    
        const existingUser = await User.findOne({email});
        if(!existingUser) return response.status(401).json({error:"Invalid email or password!"});
    
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
    
        if(!passwordMatch) return response.status(401).json({error:"Invalid email or password!"});
    
        response.status(201).json({message:'Login Successful!'})
    }catch(error){
        console.log(error)
        response.status(500).json({error:'Internal Error!'});
    }

}))

module.exports = userLoginRouter;