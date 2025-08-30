const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/messageController");

messageRouter.get("/", messageController.getAllConversations);

messageRouter
  .route("/:id")
  .post(messageController.newConversation)
  .delete(messageController.deleteConversation);

messageRouter.post("/message/:id", messageController.newMessage);

module.exports = messageRouter;
