const Joi = require("joi")
//Joi.objectId = require('joi-objectid')(Joi)

function validateMovies(movie){
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
      
    })
  
    const {error,value} = schema.validate({name:movie.name})
    return {error,value}
}

function validateCreateCustomers(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        phone:Joi.string().min(5).max(50).required(),
        isGold:Joi.boolean()
    })
  
    const {error,value} = schema.validate({
        name:customer.name,
        phone:customer.phone,
        isGold:customer.isGold
    })
    return {error,value}
}
function validateUpdateCustomers(customer){
    const schema = Joi.object({
        name: Joi.string().min(3).max(100),
        phone:Joi.string().min(5).max(50),
        isGold:Joi.boolean()
    })
  
    const {error,value} = schema.validate({
        name:customer.name,
        phone:customer.phone,
        isGold:customer.isGold
    })
    return {error,value}
}

function validateCreateMovies(movie){
    const schema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        genreId:Joi.string().required(),
        numberInStock:Joi.number().min(0).required(),
        dailyRentalRate:Joi.number().min(0).required()
    })
  
    const {error,value} = schema.validate({
        title:movie.title,
        genreId:movie.genreId,
        numberInStock:movie.numberInStock,
        dailyRentalRate:movie.dailyRentalRate
    })
    return {error,value}
}
function validateUpdateMovies(movie){
    const schema = Joi.object({
        title: Joi.string().min(5).max(100),
        genreId:Joi.string(),
        numberInStock:Joi.number().min(0),
        dailyRentalRate:Joi.number().min(0)
    })
  
    const {error,value} = schema.validate({
        title:movie.title,
        genreId:movie.genreId,
        numberInStock:movie.numberInStock,
        dailyRentalRate:movie.dailyRentalRate
    })
    return {error,value}
}

function validateRental(rental){
    const schema = Joi.object({
        customerId:Joi.string().required(),
        movieId:Joi.string().required(),
      
    })
  
    const {error,value} = schema.validate({
        customerId:rental.customerId,
        movieId:rental.movieId
    })
    return {error,value}
}

function validateRegisterUser(user){
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email:Joi.string().email().min(5).max(50).required(),
        password:Joi.string().min(5).max(1024).required(),
        admin: Joi.boolean()
      
    })
  
    const {error,value} = schema.validate({
        name:user.name,
        email:user.email,
        password:user.password,
        admin:user.admin
    })
    return {error,value}
}
function validateLoginUser(user){
    const schema = Joi.object({
        email:Joi.string().email().min(5).max(50).required(),
        password:Joi.string().min(5).max(1024).required()
      
    })
  
    const {error,value} = schema.validate({
        email:user.email,
        password:user.password
    })
    return {error,value}
}
module.exports={
    validateMovies,
    validateCreateCustomers,
    validateUpdateCustomers,
    validateCreateMovies,
    validateUpdateMovies,
    validateRental,
    validateRegisterUser,
    validateLoginUser
}