const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/messageController");
const { addTokenToHeader, verifyToken } = require("./jwt.js")
messageRouter.use(addTokenToHeader);
messageRouter.use(verifyToken)

// '/chat'
messageRouter
  .route("/")
  .get(messageController.getAllConversations)
  .post(messageController.newConversation);

messageRouter
  .route("/:id")
  .delete(messageController.deleteConversation)
  .get(messageController.getChatMessages)
  .post(messageController.newMessage);

module.exports = messageRouter;
