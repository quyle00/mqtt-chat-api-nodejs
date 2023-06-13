const controller = require("./controller");
const express = require("express");
var router = express.Router({ mergeParams: true });
const ErrorHandler = require("../../middle/error-handler");
const { Auth } = require("../../middle/AuthMiddleware");
const upload = require("../../middle/upload");

router.use(Auth);
router.get("", ErrorHandler(controller.getMessageByConversationId));
router.post("", upload.array("images"), ErrorHandler(controller.createMessage));
router.put("", ErrorHandler(controller.updateMessage));
router.delete("/:id", ErrorHandler(controller.deleteMessage));
router.put("/seen", ErrorHandler(controller.updateSeenMessages));

module.exports = router;
