const express = require("express")
require('express-async-errors')
const winston = require('winston')
require('./dbConnect/dbconnection')()

const app = express()
require('./routes/routes')(app)
process.on('uncaughtException',(ex)=>{
     winston.error(ex.message,ex)
    process.exit(1)
})
require('./prod')(app)
winston.add(winston.transports.File,{filename:'logfile.log'})
const port = process.env.PORT || 3000

const server = app.listen(port,()=>{
    winston.info(`Server running on port ${port}`)
})
module.exports = server