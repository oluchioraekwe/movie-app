const {Router} = require("express");
const{getAllMovies,getSingleMovie,createMovie,updateMovie,deleteMovie} = require('../controllers/moviesController')
const {auth,isAdmin} = require('../middlewares/authentication')

const router = Router()

router.get("/",getAllMovies)
router.get("/:id",getSingleMovie)
router.post("/",auth,createMovie)
router.put("/:id",auth,updateMovie)
router.delete("/:id",[auth,isAdmin],deleteMovie)


module.exports = router