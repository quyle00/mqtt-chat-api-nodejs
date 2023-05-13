const controller = require("./controller");
const express = require("express");
var router = express.Router();
const ErrorHandler = require("../../middle/error-handler");
const { Auth } = require("../../middle/AuthMiddleware");

router.post("/register", ErrorHandler(controller.register));
router.post("/login", ErrorHandler(controller.login));
router.get("/me", Auth, ErrorHandler(controller.getProlile));

module.exports = router;
