const mongoose = require('mongoose')
const moment = require('moment')
const { customerSchema } = require('./customers')
const { movieSchema } = require('./movies')

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,

    },
    movie: {
        type: movieSchema,

    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date,

    },
    rentalFee: {
        type: Number,
        default: 0,
        min: 0
    }
})
rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    })
}
rentalSchema.methods.return = function(){
    this.dateReturned = new Date()

    const noOfDays = moment().diff( this.dateOut,'days')
   this.rentalFee = noOfDays* this.movie.dailyRentalRate
   return noOfDays* this.movie.dailyRentalRate
    
}
const Rental = mongoose.model('rentals', rentalSchema)

module.exports = {
    Rental
}