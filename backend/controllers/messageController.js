const prisma = require("../prisma/client.js")

exports.newConversation = async (req, res) => {
    const { body, recipient } = req.body;
    const message = await prisma.message.create({
        data: {
            body,

        }
    })
    return res.json(message)
}
exports.deleteConversation = async (req, res) => {
    //only deletes conversation for user
}

exports.getAllConversations = async (req, res) => {
    const chats = await prisma.chat.findMany();
    return res.json(chats)
}

exports.newMessage = async (req, res) => {
    const message = await prisma.message.create({
        data: {

        }
    })
    return res.json(message)
}
exports.deleteMessage = async (req, res) => {
    //only able to delete when recipient has not read it
}
exports.updateMessage = async (req, res) => {
    //only able to update when recipient has not read it
}