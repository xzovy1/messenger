const express = require('express')
const messageRouter = express.Router();
const prisma = require("../app")

messageRouter.get("/chats", async (req, res) => {

})
messageRouter.get("/chats/:id", async (req, res) => {

})
messageRouter.get("/:id", async (req, res) => {

})

module.exports = messageRouter;