const mongoose = require('mongoose')
const {genreSchema} = require('./genre')

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        minlength:5,
        maxlength:255
    },
    genre:{
        type:genreSchema,
        
    },
    numberInStock:{
        type:Number,
        min:0,
        max:255
    },
    dailyRentalRate:{
        type:Number,
        min:0,
        max:255
    }

})

const Movie = mongoose.model("movies",movieSchema)

module.exports={
    Movie,
    movieSchema
}