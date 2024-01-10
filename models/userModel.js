const mongoose = require('mongoose');
const monthyearExpenseModel = require('./MonthYearExpenseModel.js');

const userSchema = mongoose.Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    theme:{type:Boolean, required:true},
    mo:{type:String, required:true},
    expenditure:{type:mongoose.Schema.Types.Mixed, default:{}}
})

const User = mongoose.model('User', userSchema);
module.exports = User;