const express = require('express')
const router = express.Router()
const controller = require('../Api/user')
const validate = require('../middleware/inputValidation');

router.post("/signup", validate.user, controller.registerUser)
router.post("/login", validate.user, controller.login)

module.exports = router