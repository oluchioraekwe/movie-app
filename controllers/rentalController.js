let mongoose = require("mongoose")
const {Rental} = require('../Models/rental')
const {Customer} = require('../Models/customers')
const {Movie} = require('../Models/movies')
const {validateRental} = require('../validator/validate')

/**
 * GET all Rentals
*/
const getAllRentals = async(req,res)=>{
    try {
        const rentals = await Rental.find().sort({dateOut:-1})
        return res.status(200).send(rentals)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
/**
 * GET a single rental
*/

const getSingleRental = async(req,res)=>{
    const id = req.params.id
    try {
        const rental = await Rental.findById(id)
        if(!rental){
            return res.status(404).send('No rental found')
        }
        return res.status(200).send(rental)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

/**
 * POST Create Rental
*/

const createRental = async(req,res)=>{
    const {error} =validateRental(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
const{customerId,movieId} = req.body

if(!mongoose.isValidObjectId(customerId)){
    return res.status(400).send("Not a valid customer Id")
}
const customer = await Customer.findById(customerId)
if(!customer){
    return res.status(404).send(`Invalid Customer`)
}
if(!mongoose.isValidObjectId(movieId)){
    return res.status(400).send("Not a valid movie Id")
}
const movie = await Movie.findById(movieId)
if(!movie){
    return res.status(404).send(`Invalid Movie`)
}
if(movie.numberInStock === 0){
    return res.status(400).send(`Movie out of stock`)
}
try {
    const rental = await Rental.create({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    })
    movie.numberInStock--
    await movie.save()
    return res.status(201).send(rental)
} catch (error) {
    return res.status(500).send(error.message)
}
}

/**
 * POST return a movie
 */

const returnMovie = async(req,res)=>{
    const{customerId,movieId} = req.body
    if(!customerId) return res.status(400).send('No customerId')
    if(!movieId) return res.status(400).send('No movieId')

    const rental = await Rental.lookup(customerId,movieId)
    if(!rental) return res.status(404).send('No rental found')
    if(rental.dateReturned) return res.status(400).send('Rental already processed')

    rental.return()

    await rental.save()
    
    const movie = await Movie.findById(movieId)
    await Movie.updateOne({_id:rental.movie._id},{
        $inc:{numberInStock:1}
    })
  
    return res.send(rental)
   
}

module.exports={
    createRental,
    getAllRentals,
    getSingleRental,
    returnMovie
}