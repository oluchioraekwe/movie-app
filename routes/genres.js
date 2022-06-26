const {Router} = require("express");
const{getAllGenres,getSingleGenre,createGenre,updateGenre,deleteGenre} = require('../controllers/genresController')
const {auth,isAdmin} = require('../middlewares/authentication')
const {asyncMiddleware} = require('../middlewares/errorHandler')
const{validObjectId} = require("../middlewares/validateObjectId")
const router = Router()


 

router.get("/",getAllGenres)
router.get("/:id",validObjectId,getSingleGenre)
router.post("/",auth,createGenre)
router.put("/:id",auth,updateGenre)
router.delete("/:id",[auth,isAdmin],deleteGenre)


module.exports = router