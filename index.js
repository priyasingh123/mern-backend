const connectToMongo = require('./db');
const express = require('express');

connectToMongo()
const app = express()
const port = 3000

//using middleware to access req body
app.use (express.json())


//available routes 
app.use ('/api/auth', require ('./routes/auth'))
// app.use ('/api/notes', require ('./routes/notes'))

app.listen (port, () => {
    console.log (`Example app listening at https://localhost:${port}`)
})
