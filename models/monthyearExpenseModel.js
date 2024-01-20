const mongoose = require('mongoose');

const monthYearExpenseSchema = new mongoose.Schema({
    expense:{type:Number, required:true},
    category:{type:String, required:true},
    month_date_year:{type:String, required:true},
})

const monthyearExpenseModel = mongoose.model('monthyearExpenseModel', monthYearExpenseSchema);
module.exports = monthyearExpenseModel