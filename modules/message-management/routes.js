const controller = require("./controller");
const express = require("express");
var router = express.Router({ mergeParams: true });
const ErrorHandler = require("../../middle/error-handler");
const { Auth } = require("../../middle/AuthMiddleware");

router.get("", ErrorHandler(controller.getMessageByConversationId));
router.post("", ErrorHandler(controller.createMessage));
router.put("/seen", ErrorHandler(controller.updateSeenMessages));

module.exports = router;
