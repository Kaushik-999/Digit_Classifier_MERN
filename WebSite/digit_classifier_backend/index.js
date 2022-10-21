//import express and assign to app
const express = require('express');
const app = express()

const path = require("path")

// import cors and assign cors
const cors = require('cors')

// middle ware
app.use(express.json())
app.use(cors())  // cors

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world')
})

//static route to the model.json
app.use(
    "/models/classify",
    express.static(path.join(__dirname,"model/model.json"))
)

// a internal request is made by loadgraphmodel.
// so made this route
app.use(
    "/models",
    express.static(path.join(__dirname,"model"))
)

// assign and listen to the port 5000
const port = 5000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})