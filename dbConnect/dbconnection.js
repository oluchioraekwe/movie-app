const mongoose = require('mongoose')
const winston = require('winston')
require('dotenv').config()

const db={
    test:"mongodb://localhost:27017/genres_test",
    local:"mongodb://localhost:27017/genres",
    remote:`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.vvnhcpc.mongodb.net/?retryWrites=true&w=majority`
}
let dbUri;
if(process.env.NODE_ENV === "production"){
    dbUri=db.remote
}else if(process.env.NODE_ENV === "test"){
    dbUri=db.test
}else{
    dbUri=db.local
}
module.exports = ()=>{
mongoose.connect(dbUri)
.then(()=> winston.info(`Connected to ${dbUri}`))
.catch((error)=>winston.warn('Could not connect to MongoDB...',error.message))
}


// module.exports={
//     connect
// }