const controller = require('./controller');
const express = require('express');
var router = express.Router();
const ErrorHandler = require('../../middle/error-handler');
const { Auth } = require('../../middle/AuthMiddleware')

router.post('/', ErrorHandler(controller.create));

module.exports = router