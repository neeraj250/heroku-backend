const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/users'

const app = new express()

mongoose.connect(url,{useNewUrlParser:true})

const connect = mongoose.connection
app.use(cors())


connect.on('open',() => {
    console.log('connected...')
})

app.use(express.json())


const usersRouter = require('./routes/users')
const adminRouter = require('./routes/admin')

app.use('/users',usersRouter)
app.use('/admin',adminRouter);


app.listen(8000,() =>
{
    console.log("server started")
})