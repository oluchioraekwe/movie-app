const {Router} = require("express")
const {validateMovies} = require('../validator/validate')
const {Genre} = require('../Models/genre')
const mongoose = require("mongoose")

const router = Router()



/**
 * GET all genres
 */
const getAllGenres = async (req,res,next)=>{
try {
    
    const genres = await Genre.find().sort({name:1})
    // if(genres.length<1){
    //     return res.status(404).send(`No genre found`)
    // }
    return res.status(200).send(genres)
} catch (error) {
    next(error)
    //return res.status(500).send('Something went wrong')
}
    
 
}

/**
 * GET a single genre
 */



const getSingleGenre = async (req,res,next)=>{
    const id = req.params.id
    // if(!mongoose.isValidObjectId(id)){
    //     return res.status(400).send("Not a valid Id")
    // }
try {
    const genre = await Genre.findById(id)
    if(!genre){
        return res.status(404).send("genre with give id not found")
    }
    return res.status(200).send(genre)
} catch (error) {
    next(error)
}
}

/**
 * POST create a genre
 */

const createGenre = async (req,res,next)=>{
    const {error} = validateMovies(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
      try {
      const genre = await Genre.create(req.body)
       return  res.status(201).send(genre)
   } catch (error) {
    next(error)
   }
   
}

/**
 * PUT update a genre
 */

const updateGenre = async (req,res)=>{
    const {error} = validateMovies(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
    try {
        const genre = await Genre.findByIdAndUpdate(id,{$set:req.body},{new:true})
        if(!genre){
            return res.status(404).send(`The genre with id: ${id} does not exist`)
        }
        return res.status(200).send(genre)
    } catch (error) {
        return res.status(500).send(error.message)
    }
    
 
}


/**
 * DELETE delete a genre
 */

const deleteGenre = async (req,res)=>{
    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
    try {
       const result = await Genre.findByIdAndRemove(id)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


module.exports ={
    getAllGenres,
    getSingleGenre,
    createGenre,
    updateGenre,
    deleteGenre
}