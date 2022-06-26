const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    phone:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    isGold:{
        type:Boolean,
        default:false
    }
})

const Customer = mongoose.model('customers',customerSchema)


module.exports={
    Customer,
    customerSchema
}