const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/messageController");

// '/api/chat'
messageRouter
  .route("/")
  .get(messageController.getAllConversations)
  .post(messageController.newConversation);

messageRouter
  .route("/:id")
  .delete(messageController.deleteConversation)
  .get(messageController.getConversation)
  .post(messageController.sendMessage);

module.exports = messageRouter;
