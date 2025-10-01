const request = require("supertest");
const express = require("express");
const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");
const {
  expect,
  describe,
  afterAll,
  beforeEach,
  test,
} = require("@jest/globals");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRouter = require("../routes/authRouter.js");
const messageRouter = require("../routes/messageRouter.js");

const { user, createNewUser } = require("./mockUsers.js");
let dbUser, dbUser2;
const user2 = { ...user };
user2.username = user.username + "2";

const { addTokenToHeader, verifyToken } = require("../jwt.js");

app.use("/auth", authRouter);
app.use(addTokenToHeader);
app.use(verifyToken);
app.use("/api/chat", messageRouter);

let jwt;

beforeEach(async () => {
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pW.deleteMany();

  dbUser = await createNewUser(user);
  dbUser2 = await createNewUser(user2);

  jwt = await request(app)
    .post("/auth/log-in")
    .send({ username: user.username, password: user.password })
    .expect(200)
    .then((resp) => resp.body);
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("fetches user conversations with no current conversations", async () => {
  const response = await request(app)
    .get("/api/chat/")
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .expect(200)
    .then((response) => response.body);
  expect(response.length).toBe(0);
});
test("user conversations are protected routes", async () => {
  const tamperedJwt = jwt + "asfdasdfadsf";
  await request(app)
    .get("/api/chat/")
    .set("authorization", `bearer ${tamperedJwt}`)
    .set("Content-Type", "application/json")
    .expect(403);
});
test("new conversation fails with incorrect recipient", async () => {
  const badId = dbUser2.id + "6366369";
  const chat = await request(app)
    .post("/api/chat")
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .send({ recipientId: badId })
    .expect(400)
    .then((r) => r.body);

  expect(chat.message).toBe(`Recipient not found`);
});

test("user can create a conversation with another user and send a message", async () => {
  const messageBody = `Hi ${dbUser2.username}`;
  //create convo
  await request(app)
    .post("/api/chat")
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .send({
      recipientId: dbUser2.id,
    })
    .expect(200)
    .then(async (resp) => {
      //send message
      const response = await request(app)
        .post(`/api/chat/${resp.body.conversation.id}`)
        .set("authorization", `bearer ${jwt}`)
        .set("Content-Type", "application/json")
        .send({
          recipient: dbUser2.id,
          body: messageBody,
        })
        .expect(200);
      expect(response.body.message).toBe(`message sent to ${dbUser2.id}`);
    });
  const message = await prisma.message.findMany({
    where: {
      body: messageBody,
      sender_id: dbUser.id,
      recipient_id: dbUser2.id,
    },
  });
  //tests if message is in db and read status is false.
  expect(message.length).toBe(1);
  expect(message[0].read).toBe(false);
});

test("recipient can view the conversation, mark previous message as read and reply to the conversation", async () => {
  const recievedMessage = `Hi ${dbUser2.username}`;
  //create convo
  await request(app)
    .post("/api/chat")
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .send({
      recipientId: dbUser2.id,
    })
    .expect(200)
    .then(async (resp) => {
      //send message
      const response = await request(app)
        .post(`/api/chat/${resp.body.conversation.id}`)
        .set("authorization", `bearer ${jwt}`)
        .set("Content-Type", "application/json")
        .send({
          recipient: dbUser2.id,
          body: recievedMessage,
        })
        .expect(200);
      expect(response.body.message).toBe(`message sent to ${dbUser2.id}`);
    });
  let temp = dbUser;
  dbUser = dbUser2;
  dbUser2 = temp;

  jwt = "";
  const senderMessage = "Hey! Thanks for the message";
  jwt = await request(app)
    .post("/auth/log-in")
    .send({ username: user2.username, password: user2.password })
    .set("content-type", "application/json")
    .expect(200)
    .then((response) => response.body);

  const chat = await request(app)
    .get("/api/chat")
    .set("content-type", "application/json")
    .set("authorization", `bearer ${jwt}`)
    .expect(200)
    .then((response) => response.body[0].id);

  const message = await request(app)
    .get(`/api/chat/${chat}`)
    .set("content-type", "application/json")
    .set("authorization", `bearer ${jwt}`)
    .expect(200)
    .then((response) => response.body[0]);
  expect(message.read).toBe(true);

  const reply = await request(app)
    .post(`/api/chat/${chat}`)
    .set("content-type", "application/json")
    .set("authorization", `bearer ${jwt}`)
    .send({ body: senderMessage, recipient: dbUser2.id })
    .expect(200)
    .then((response) => response.body);
  expect(reply.message).toBe(`message sent to ${dbUser2.id}`);
});
