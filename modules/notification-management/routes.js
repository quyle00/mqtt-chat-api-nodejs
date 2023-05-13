const controller = require('./controller');
const express = require('express');
var router = express.Router();
const ErrorHandler = require('../../middle/error-handler');
const { Auth } = require('../../middle/AuthMiddleware')

router.post('/push', ErrorHandler(controller.pushNotification));
router.get('/', Auth, ErrorHandler(controller.getAll));
router.get('/me',Auth,ErrorHandler(controller.getByUser))
router.get('/:id', Auth, ErrorHandler(controller.getOne));
router.delete('/:id', Auth, ErrorHandler(controller.deleteOne));
router.put('/mark-read/:id', Auth, ErrorHandler(controller.markRead));
router.put('/mark-read-all', Auth, ErrorHandler(controller.markAllRead));

module.exports = router