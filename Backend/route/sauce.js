const express = require('express')
const router = express.Router()
const controller = require('../Api/sauce')
const isAuth = require("../middleware/auth")
const multer = require('../middleware/multer');
const validate = require('../middleware/inputValidation');

router.get("/", isAuth.verifyToken ,controller.getAllSauces)
router.get('/:id', validate.id, isAuth.verifyToken, controller.getSauce)
router.post("/", multer, validate.sauce, isAuth.verifyToken ,controller.createSauce)
router.delete('/:id', validate.id, isAuth.verifyToken, controller.deleteSauce)
router.put('/:id', multer, validate.id, isAuth.verifyToken, controller.updateSauce);
router.post('/:id/like', validate.id, isAuth.verifyToken, controller.likeDislikeSauce);

module.exports = router