const {Router} = require('express')
const {registerUser,loginUser,getCurrentUser} = require('../controllers/authController')
const{auth} = require('../middlewares/authentication')

const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",auth,getCurrentUser)

module.exports=router