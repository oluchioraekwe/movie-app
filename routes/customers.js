const {Router} = require("express");
const{getAllCustomers,getSingleCustomer,createCustomer,updateCustomer,deleteCustomer} = require('../controllers/customersController')
const {auth,isAdmin} = require('../middlewares/authentication')

const router = Router()

router.get("/",getAllCustomers)
router.get("/:id",getSingleCustomer)
router.post("/",auth,createCustomer)
router.put("/:id",auth,updateCustomer)
router.delete("/:id",[auth,isAdmin],deleteCustomer)


module.exports = router