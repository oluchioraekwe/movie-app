const config = require('config')
const _ = require('lodash')
const {User} = require('../Models/user')
const {validateRegisterUser,validateLoginUser} = require('../validator/validate')
const bcrypt = require('bcrypt')

/**
 * POST register a user 
*/

const registerUser = async(req,res)=>{
    const {error} = validateRegisterUser(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(409).send(`User with email: ${req.body.email} already exists`)
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassord = await bcrypt.hash(req.body.password,salt)
    try {
         user = await User.create({
             name:req.body.name,
            email:req.body.email,
            password:hashedPassord,
            admin:req.body.admin
         })
        const token = user.generateAuthToken()
        return res.header('x-auth-token',token).status(201).send( _.pick(user,['_id','name','email']))
    } catch (error) {
      return res.status(500).send(error.message)  
    }
}

/**
 * POST login a user 
*/
const loginUser = async (req,res)=>{
    const {error} = validateLoginUser(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const {email,password} = req.body
    let user = await User.findOne({email:email})
    if(!user){
        return res.status(400).send(`Invalid login credentials`)
    }
    const validPassword = await bcrypt.compare(password,user.password)

    if(!validPassword){
        return res.status(400).send(`Invalid login credentials`)
    }

   
   const token = user.generateAuthToken()
    user.token = token
    
    return res.status(200).send(_.pick(user,['_id','token']))
}

/**
 * GET  current user 
*/

const getCurrentUser = async(req,res)=>{
    const id = req.user._id
    const user = await User.findById(id)
   return res.status(200).send(_.pick(user,['_id','name','email']))
    
}
module.exports={
    registerUser,
    loginUser,
    getCurrentUser
}