const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const monthyearExpenseModel = require('../models/monthyearExpenseModel');
const jwt = require('jsonwebtoken') 

const expenditureRouter = express.Router();
expenditureRouter.post('/', authenticatingToken,expressAsyncHandler(async(request, response)=>{
    // console.log("Request", request)
    const email = request.body.email;
    const date = request.body.date;
    const dateparts = date.split('/');
    const month = dateparts[0];
    const year = dateparts[2];
    const month_year = `${month}_${year}`;
    const expense = Number(request.body.expense);
    const category = request.body.category;
    try{
        const user = await User.findOne({email});
        console.log("email found!")
        if(!user.expenditure[month_year]){
            user.expenditure[month_year] = [];
            console.log("done initializing")
        }
        console.log("expenditure...")
        const result = await User.findOneAndUpdate(
            { email: email },
            { $push: { [`expenditure.${month_year}`]: { expense, category, date } } },
            { new: true }
        );
        console.log(`${month_year}`,result)
        // await User.save();
        response.status(201).json("Expense Added!");
    }catch(error){
        response.status(500).json({error:"Couldn't sync expense"});
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

module.exports = expenditureRouter;