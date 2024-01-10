const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config();
const signinRouter = require('./routers/signinRouter');
const userLoginRouter = require('./routers/loginRouter');
const app = express()
const PORT = 9090;
app.use(express.json());


mongoose.connect( process.env.MONGODB__CLUSTER)

app.get('/', (req, res) => {
    res.send('This server is for outlay!')
})

app.use('/api/signin', signinRouter);

app.use('/api/login/', userLoginRouter);

app.listen(PORT, ()=>{
    console.log(`server is at ${PORT}`);
})