const {Router} = require("express")
const {validateCreateCustomers,validateUpdateCustomers} = require('../validator/validate')
const {Customer} = require('../Models/customers')
const mongoose = require("mongoose")

const router = Router()




/**
 * GET all customers
 */
const getAllCustomers = async (req,res)=>{
  try {
      const customers = await Customer.find().sort({name:1})
      return res.status(200).send(customers)
  } catch (error) {
    return res.status(500).send(error.message)
  }
   
}

/**
 * GET a single customer
 */



const getSingleCustomer = async (req,res)=>{
    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
   try {
    const customer = await Customer.findById(id)
    if(!customer){
        return res.status(404).send("customer with give id not found")
    }
    return res.status(200).send(customer)
   } catch (error) {
    return res.status(500).send(error.message)
   }
}

/**
 * POST create a customer
 */

const createCustomer = async (req,res)=>{
    const {error} =validateCreateCustomers(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
      try {
      const customer = await Customer.create(req.body)
       return  res.status(201).send(customer)
   } catch (error) {
    return res.status(500).send(error.message)
   }
   
}

/**
 * PUT update a customer
 */

const updateCustomer = async (req,res)=>{
    const {error} =validateUpdateCustomers(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
    try {
        const customer = await Customer.findByIdAndUpdate(id,{$set:req.body},{new:true})
        if(!customer){
            return res.status(404).send(`The Customer with id: ${id} does not exist`)
        }
        return res.status(200).send(customer)
    } catch (error) {
        return res.status(500).send(error.message)
    }
    
 
}


/**
 * DELETE delete a Customer
 */

const deleteCustomer = async (req,res)=>{
    const id = req.params.id
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Not a valid Id")
    }
    try {
       const result = await Customer.findByIdAndRemove(id)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


module.exports ={
    getAllCustomers,
    getSingleCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
}