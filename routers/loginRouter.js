const express = require('express');
const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userLoginRouter = express.Router();

userLoginRouter.post('/', expressAsyncHandler(async(request, response)=>{
    try{
        const email = request.body.email;
        const password = request.body.password;
    
        //VALIDATING EMAIL AND PASSWORD
        const existingUser = await User.findOne({email});
        if(!existingUser) return response.status(401).json({error:"Invalid email or password!"});
    
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
    
        if(!passwordMatch) return response.status(401).json({error:"Invalid email or password!"});

        //GENERATE TOKEN 
        const token = jwt.sign({ email: existingUser.email}, process.env.JWT_SECRET_KEY, { expiresIn: '720h' });
    
        //RESPONSE
        response.status(201).json({message:'Login Successful!', token:token})
    }catch(error){
        console.log(error)
        response.status(500).json({error:'Internal Error!'});
    }

}))

module.exports = userLoginRouter;