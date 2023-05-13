const controller = require("./controller");
const express = require("express");
var router = express.Router();
const ErrorHandler = require("../../middle/error-handler");
const { Auth } = require("../../middle/AuthMiddleware");
const MessageManagementRouter = require("../message-management/routes");

router.post("/", Auth, ErrorHandler(controller.createConversation));
router.get("/", Auth, ErrorHandler(controller.getConversationsByUser));
router.get(
  "/by-partner/:partnerId",
  Auth,
  ErrorHandler(controller.getConversationDetailByPartnerId)
);
router.get("/:id", Auth, ErrorHandler(controller.getConversationDetail));
router.use("/:id/message", Auth, ErrorHandler(MessageManagementRouter));

module.exports = router;
