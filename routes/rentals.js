const {Router} = require("express");
const{createRental,getAllRentals,getSingleRental,returnMovie} = require('../controllers/rentalController')
const {auth,isAdmin} = require('../middlewares/authentication')

const router = Router()

router.get("/",getAllRentals)
router.get("/:id",getSingleRental)
router.post("/",auth,createRental)
router.post("/returns",auth,returnMovie)


module.exports = router
