const express = require('express')
const messageRouter = express.Router();
const messageController = require("../controllers/messageController")

messageRouter.get("/", messageController.getAllConversations)

messageRouter.post("/:id", messageController.newConversation)
messageRouter.delete("/:id", messageController.deleteConversation)

messageRouter.post("/message/:id", messageController.newMessage)

module.exports = messageRouter;