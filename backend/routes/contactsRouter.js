const express = require('express')
const contactsRouter = express.Router();
const contactsController = require("../controllers/contactsController")

contactsRouter.get("/", contactsController.getAllContacts)
// contactsRouter.get("/favorites")
// contactsRouter.post("/favorites")
// contactsRouter.get("/add")

module.exports = contactsRouter;