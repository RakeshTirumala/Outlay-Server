const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const outlayRouter = express.Router();
const getRandomColor = () => {
    const randomColor = () => Math.floor(Math.random() * 256);
    const r = randomColor();
    const g = randomColor();
    const b = randomColor();
  
    const hexValue = (component) => {
      const hex = component.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
  
    const isValidHex = (hex) => /^#[0-9A-F]{6}$/i.test(hex);
  
    const color = `#${hexValue(r)}${hexValue(g)}${hexValue(b)}`;
  
    return isValidHex(color) ? color : getRandomColor();
  };
  
const getColorPalette = (count) => {
    const palette = [];
    for (let i = 0; i < count; i++) {
        palette.push(getRandomColor());
    }
    return palette;
};
outlayRouter.get('/', authenticatingToken, expressAsyncHandler(async(request, response)=>{
    const email = request.query.email;
    const monthYear = request.query.monthYear;
    let categories = [];
    let expenses = [];
    let colors = [];
    let percentages = [];
    let total = 0;
    try{
        const user = await User.findOne({email})
        if(!user.expenditure[monthYear]) return response.status(200).json({message:'No data!', data:[]})
        const data = user.expenditure[monthYear];   
        // console.log("date:",data)
        let categoryExpenseMap = new Map();
        console.log("Iterating through the data")
        data.map((item)=>{
            const {expense, category, date} = item;
            total+=expense;
            if(categoryExpenseMap.has(category)) categoryExpenseMap.set(category, categoryExpenseMap.get(category)+expense);
            else categoryExpenseMap.set(category, expense);
        })
        // console.log('categoryExpenseMap',categoryExpenseMap);
        total = total.toFixed(2);
        console.log("total:", total);

        //GENERATING CATEGORIES AND EXPENSES ARRAY
        categories = Array.from(categoryExpenseMap.keys());
        expenses = Array.from(categoryExpenseMap.values());

        //GENERATING COLORS
        colors = getColorPalette(categories.length)
        // SETTING PERCENTAGES
        expenses.forEach(exp=>percentages.push(`${((exp/total)*100).toFixed(2)}%`));

        //FORMATTING THE DATA
        const combinedData = categories.map((category, index)=>({
            "category":category, 
            "color":colors[index],
            "percentage":percentages[index],
            "expense":expenses[index]
        }))

        combinedData.sort((a,b)=>b.expense-a.expense);
        console.log("combinedData",combinedData)

        // categories = combinesData.map(item=>item.category);
        expenses = combinedData.map(item=>item.expense.toFixed(2));
        colors = combinedData.map(item=>item.color);

        response.status(200).json({
            expenses:expenses, 
            colors:colors, 
            combinedData:combinedData});
        
    }catch(error){
        response.status(500).json({error:"couldn't get"});
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

module.exports = outlayRouter;