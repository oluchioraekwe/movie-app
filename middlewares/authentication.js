const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config()


const key = process.env.JWT_KEY

function auth (req,res,next){
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).send('Access denied. No Token Provided')
    }
    try {
        const decoded = jwt.verify(token,key)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(400).send('Invalid Token')
    }
   
}

function isAdmin (req,res,next){
    const user = req.user
    
    if(!user.admin){
        return res.status(403).send('Not Admin')
    }
    next()
  
   
}
module.exports={
    auth,
    isAdmin
}