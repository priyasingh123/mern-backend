const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors')

connectToMongo()
const app = express()
const port = 5000

//using middleware to access req body
//cors middleware is server side mechanism and hence handled in backened
app.use(cors())

//express.json() middleware is used to parse json sent during POST, PUT request from client side 
app.use (express.json())

//available routes 
app.use ('/api/auth', require ('./routes/auth'))
app.use ('/api/notes', require ('./routes/notes'))

app.listen (port, () => {
    console.log (`Example app listening at https://localhost:${port}`)
})

