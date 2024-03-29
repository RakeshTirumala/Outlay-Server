const express = require('express');
const expressAsyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
require('dotenv').config();
const uRouter = express.Router()

uRouter.post('/', expressAsyncHandler(async(request, response)=>{
    try{
        const email = request.body.email;
        const password = await bcrypt.hash(request.body.password, 10);

        const existingUser = await User.findOne({email})
        if(existingUser) return response.status(400).json({ error: 'Email already exists' });

        const theme = false;
        const mo = "Month";
    
        const newUser = new User({email, password, theme, mo});
        const savedUser = await newUser.save();
        response.status(201).json(savedUser);
    }catch(error){
        console.log(error)
        response.status(500).json({error:'Internal Error!'});
    }
}))

module.exports = uRouter;