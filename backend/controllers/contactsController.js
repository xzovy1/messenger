const prisma = require("../prisma/client.js");

exports.addToFavorite = async (req, res) => {
    const contact = await prisma.contacts.update({
        where: {

        }
    })
    res.json(contact)
}
exports.getAllFavorites = async (req, res) => {
    const contact = await prisma.user.findMany({
        where: {

        }
    })
    res.json(contact)
}
exports.getAllContacts = async (req, res) => {
    const contacts = await prisma.profile.findMany({
        where: {

        },
        include: {
            user: true
        }
    })
    res.json(contacts)
}