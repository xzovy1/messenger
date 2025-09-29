const request = require("supertest")
const express = require('express')
const prisma = require("../prisma/client.js")
const bcrypt = require("bcryptjs")
const { expect, describe, afterAll, beforeEach, test, beforeAll } = require("@jest/globals")

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const authRouter = require("../routes/authRouter.js")
const userRouter = require("../routes/userRouter.js")


const { addTokenToHeader, verifyToken } = require("../jwt.js");

app.use("/auth", authRouter);
app.use(addTokenToHeader);
app.use(verifyToken);
app.use('/api/user', userRouter)

describe("User Router", () => {
    beforeAll(async () => {
        const delUsers = prisma.user.deleteMany();
        const delPass = prisma.pW.deleteMany();
        const delProfile = prisma.profile.deleteMany();
        const delMessages = prisma.message.deleteMany();
        const delChats = prisma.chat.deleteMany()
        await prisma.$transaction([delMessages, delChats, delProfile, delPass, delUsers])
        const user1 = await prisma.user.create({
            data:
            {
                username: "TestUser",
                password: {
                    create: {
                        password: await bcrypt.hash("TestUser@1", 10)
                    }
                },
                profile: {
                    create: {
                        firstname: "Test",
                        lastname: "User",
                        bio: "Hi I'm Test User",
                        dob: "2020-10-10T00:00:00Z"
                    }
                }
            },
        })
    })
    let jwt, user;
    beforeEach(async () => {
        jwt = await request(app).post("/auth/log-in").send({ username: "TestUser", password: "TestUser@1" }).expect(200).then(resp => resp.body)
        user = await request(app).get("/api/user/profile").set("authorization", `bearer ${jwt}`).set("Content-Type", "application/json").then(response => response.body)
    })

    test("user profile can be retrieved by user", async () => {
        const profile = await request(app).get("/api/user/profile").set("authorization", `bearer ${jwt}`).set("Content-Type", "application/json").expect(200)
        expect(profile.body.username).toBe("TestUser")
        expect(profile.body.profile.firstname).toBe("Test")
        expect(profile.body.profile.lastname).toBe("User")
    })
    test("user can update username", async () => {
        const updatedInfo = {
            username: "TestUser3"
        }
        updatedInfo["current-password"] = 'TestUser@1'
        console.log(updatedInfo)
        const update = await request(app)
            .put(`/api/user/${user.id}`)
            .set("authorization", `bearer ${jwt}`)
            .set("Content-Type", "application/json")
            .send(updatedInfo)
            .expect(200)
            .then(r => console.log(r.text))
    })
})
