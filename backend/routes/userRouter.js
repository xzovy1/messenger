const { Router } = require('express')
const userRouter = Router();
const prisma = require("../prisma/client.js")

userRouter.get("/profile", async (req, res) => {
    const user = await prisma.user.findMany();
    res.send(user)
})

module.exports = userRouter;