const mongoose = require('mongoose');

const monthYearExpenseSchema = new mongoose.Schema({
    expense:{type:Number, required:true},
    category:{type:String, required:true},
    date:{type:String, required:true},
    month:{type:String, required:true},
    year:{type:String, required:true}
})

const monthyearExpenseModel = mongoose.model('monthyearExpenseModel', monthYearExpenseSchema);
module.exports = monthyearExpenseModel