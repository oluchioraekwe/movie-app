const {validateCreateMovies,validateUpdateMovies} = require('../validator/validate')
const {Movie} = require('../Models/movies')
const {Genre} = require('../Models/genre')
const mongoose = require("mongoose")




/**
 * GET all customers
 */
const getAllMovies = async (req,res)=>{
    const {genre} = req.query
  try {
      let movies = []
      if(genre){
        movies = await Movie.find({'genre.name':genre})

      }else{
        movies = await Movie.find()

      }
       
      return res.status(200).send(movies)
  } catch (error) {
    return res.status(500).send(error.message)
  }
   
}

/**
 * GET a single movie
 */

const getSingleMovie = async (req,res)=>{
    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
   try {
    const movie = await Movie.findById(id)
    if(!movie){
        return res.status(404).send("movie with give id not found")
    }
    return res.status(200).send(movie)
   } catch (error) {
    return res.status(500).send(error.message)
   }
}



/**
 * POST create a movie
 */

const createMovie = async (req,res)=>{
    const {error} =validateCreateMovies(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const{title,genreId,numberInStock, dailyRentalRate} = req.body
    if(!mongoose.isValidObjectId(genreId)){
        return res.status(400).send("Not a valid Id")
    }
   
    const {_id,name} = await Genre.findById(genreId)
    if(!_id){
        return res.status(404).send(`Genre with id: ${genreId} does not exist`)
    }
    
      try {
        const movie = await Movie.create({
            title,
            genre:{
                _id,
                name
            },
            numberInStock,
            dailyRentalRate
        })
     // const movie = await Movie.create(req.body)
     //const result = await movie.save()
       return  res.status(201).send(movie)
   } catch (error) {
    return res.status(500).send(error.message)
   }
   
}

/**
 * PUT update a movie
 */

const updateMovie = async (req,res)=>{
    const {error} =validateUpdateMovies(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
    let genre = {}
    if(req.body.genreId){
        genre = await Genre.findById(req.body.genreId)
        if(!genre){
            return res.status(404).send(`Genre with id: ${req.body.genreId} does not exist`)
        }
    }
    
    try {
        const movie = await Movie.findByIdAndUpdate(id,{$set:{
            title:req.body.title,
            'genre.name':genre.name,
            'genre._id':genre._id,
            numberInStock:req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate
            
        }},{new:true})
        if(!movie){
            return res.status(404).send(`The Movie with id: ${id} does not exist`)
        }
        return res.status(200).send(movie)
    } catch (error) {
        return res.status(500).send(error.message)
    }
    
 
}


/**
 * DELETE delete a Movie
 */

const deleteMovie = async (req,res)=>{
    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
    try {
       const result = await Movie.findByIdAndRemove(id)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


module.exports ={
    getAllMovies,
    getSingleMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    
}