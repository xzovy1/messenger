const request = require("supertest")
const express = require('express')
const prisma = require("../prisma/client.js")
const bcrypt = require("bcryptjs")
const { expect, describe, afterAll, beforeEach, test } = require("@jest/globals")

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const authRouter = require("../routes/authRouter.js")
const messageRouter = require("../routes/messageRouter.js")


const { addTokenToHeader, verifyToken } = require("../jwt.js");

app.use("/auth", authRouter);
app.use(addTokenToHeader);
app.use(verifyToken);
app.use('/api/chat', messageRouter)


const user = {
    username: "TestUser",
    password: "TestUser@1"
}
const session = {}
beforeEach(async () => {
    await prisma.message.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.pW.deleteMany();
    const user1 = await prisma.user.create({
        data:
        {
            username: user.username,
            password: {
                create: {
                    hash: await bcrypt.hash(user.password, 10)
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

    const user2 = await prisma.user.create({
        data:
        {
            username: "TestUser2",
            password: {
                create: {
                    hash: await bcrypt.hash("TestUser2@", 10)
                }
            },
            profile: {
                create: {
                    firstname: "Test",
                    lastname: "User2",
                    bio: "Hi I'm Test User 2",
                    dob: "2020-10-10T00:00:00Z"
                }
            }
        },
    })
    session.jwt = await request(app)
        .post("/auth/log-in")
        .send({ username: user.username, password: user.password })
        .expect(200)
        .then(resp => resp.body)
    session.sender = user1;
    session.recipient = user2;

})

afterAll(async () => {
    await prisma.$disconnect();
})

test("fetches user conversations with no current conversations", async () => {
    const response = await request(app)
        .get('/api/chat/').set("authorization", `bearer ${session.jwt}`)
        .set("Content-Type", "application/json")
        .expect(200)
        .then(response => response.body);
    expect(response.length).toBe(0)
})
test("user conversations are protected routes", async () => {
    const jwt = session.jwt + "asfdasdfadsf"
    await request(app).get('/api/chat/').set("authorization", `bearer ${jwt}`).set("Content-Type", "application/json").expect(403)
})
test("new conversation fails with incorrect recipient", async () => {
    const badId = session.recipient.id + "6366369"
    const chat = await request(app)
        .post("/api/chat")
        .set("authorization", `bearer ${session.jwt}`)
        .set("Content-Type", 'application/json')
        .send({ recipientId: badId })
        .expect(400)
        .then(r => r.body)

    expect(chat.message).toBe(`Recipient not found`)
})

test("user can create a conversation with another user and send a message", async () => {
    const messageBody = `Hi ${session.recipient.username}`
    //create convo
    await request(app).post("/api/chat").set("authorization", `bearer ${session.jwt}`).set("Content-Type", "application/json").send({
        recipientId: session.recipient.id,
    }).expect(200).then(async resp => {
        //send message
        const response = await request(app)
            .post(`/api/chat/${resp.body.conversation.id}`)
            .set("authorization", `bearer ${session.jwt}`)
            .set("Content-Type", "application/json").send({
                recipient: session.recipient.id,
                body: messageBody
            })
            .expect(200)
        expect(response.body.message).toBe(`message sent to ${session.recipient.id}`)
    })
    const message = await prisma.message.findMany({
        where: {
            body: messageBody,
            sender_id: session.sender.id,
            recipient_id: session.recipient.id
        }
    })
    //tests if message is in db and read status is false.
    expect(message.length).toBe(1)
    expect(message[0].read).toBe(false)
})

test("recipient can view the conversation, mark previous message as read and reply to the conversation", async () => {

    const recievedMessage = `Hi ${session.recipient.username}`
    //create convo
    await request(app).post("/api/chat").set("authorization", `bearer ${session.jwt}`).set("Content-Type", "application/json").send({
        recipientId: session.recipient.id,
    }).expect(200).then(async resp => {
        //send message
        const response = await request(app)
            .post(`/api/chat/${resp.body.conversation.id}`)
            .set("authorization", `bearer ${session.jwt}`)
            .set("Content-Type", "application/json").send({
                recipient: session.recipient.id,
                body: recievedMessage
            }).expect(200)
        expect(response.body.message).toBe(`message sent to ${session.recipient.id}`)
    })
    let temp = session.sender;
    session.sender = session.recipient;
    session.recipient = temp;

    session.jwt = ""
    const senderMessage = "Hey! Thanks for the message"
    session.jwt = await request(app)
        .post('/auth/log-in')
        .send({ username: "TestUser2", password: "TestUser2@" })
        .set("content-type", "application/json")
        .expect(200)
        .then(response => response.body)
    const chat = await request(app)
        .get("/api/chat")
        .set("content-type", "application/json")
        .set("authorization", `bearer ${session.jwt}`)
        .expect(200).then(response => response.body[0].id)
    const message = await request(app)
        .get(`/api/chat/${chat}`)
        .set("content-type", "application/json")
        .set("authorization", `bearer ${session.jwt}`)
        .expect(200).then(response => response.body[0])
    expect(message.read).toBe(true)

    const reply = await request(app)
        .post(`/api/chat/${chat}`)
        .set("content-type", "application/json")
        .set("authorization", `bearer ${session.jwt}`)
        .send({ body: senderMessage, recipient: session.recipient.id })
        .expect(200)
        .then(response => response.body)
    expect(reply.message).toBe(`message sent to ${session.recipient.id}`)
})



