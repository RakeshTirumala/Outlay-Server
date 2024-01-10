const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const signinRouter = require('./routers/signinRouter')
const app = express()
const PORT = 9090;
app.use(express.json());

// app.use(express.urlencoded({extended:true}))
mongoose.connect( process.env.MONGODB__CLUSTER)

app.get('/', (req, res) => {
    res.send('This server is for outlay!')
})

app.route('/api/signin', signinRouter)

app.listen(PORT, ()=>{
    console.log(`server is at ${PORT}`);
})