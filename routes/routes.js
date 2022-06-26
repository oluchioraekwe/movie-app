const express = require("express")
const morgan = require('morgan')
const genres = require("./genres")
const customers = require('./customers')
const movies = require('./movies')
const rentals = require('./rentals')
const users = require('./user')
const error = require('../middlewares/error')
require('dotenv').config()
//const app = express()
const apiDocumentation = `https://documenter.getpostman.com/view/16889062/UzBsHQ2X`
module.exports=function(app){
app.use(express.json())
if(process.env.NODE_ENV == "development"){
    app.use(morgan('dev'))
}
app.use("/",apiDocumentation)
app.use("/api/genres",genres)
app.use("/api/customers",customers)
app.use("/api/movies",movies)
app.use("/api/rentals",rentals)
app.use("/api/users",users)

app.use(error)

}