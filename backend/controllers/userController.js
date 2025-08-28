const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs")

exports.getUser = async (req, res) => {
    const user = await prisma.user.findMany();
    return res.json(user)
}

exports.createUser = async (req, res) => {
    const user = await prisma.user.create({
        data: {

        }
    })
    res.json(user)
}

exports.updateUser = async (req, res) => {
    try {

        const user = await prisma.user.update({
            where: {

            }
        })
        return res.json(user)
    } catch (error) {
        res.json({ error: `user does not exist in the database` })
    }
}

exports.deleteUser = async (req, res) => {
    try {

        const user = await prisma.user.delete({
            where: {

            }
        })
        res.json(user)
    } catch (error) {
        res.json({ error: `user does not exist in the database` })
    }
}
