const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


const key = process.env.JWT_KEY

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        minlength:3,
        maxlength:100
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        minlength:5,
        maxlength:255
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:3,
        maxlength:1024
    },
    admin:{
        type:Boolean,
        default:false
    }

    
},{timestamps:true})

userSchema.methods.generateAuthToken = function(){
    const payload = {
        _id: this._id,
        admin: this.admin
    }
return jwt.sign(payload,key)
}
const User = mongoose.model('users',userSchema)


module.exports={
    User,
    userSchema
}