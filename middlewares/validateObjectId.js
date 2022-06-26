const mongoose = require('mongoose')

function validObjectId(req,res,next){
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("Not a valid Id")
    }
    next()

}
module.exports={
validObjectId
}