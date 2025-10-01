const request = require("supertest");
const express = require("express");
const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");
const { expect, afterAll, beforeEach, test } = require("@jest/globals");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRouter = require("../routes/authRouter.js");
const userRouter = require("../routes/userRouter.js");

const { addTokenToHeader, verifyToken } = require("../jwt.js");

app.use("/auth", authRouter);
app.use(addTokenToHeader);
app.use(verifyToken);
app.use("/api/user", userRouter);

let jwt;

const { user, createNewUser } = require("./mockUsers.js");

let dbUser, dbUser2;
const user2 = { ...user };
user2.username = user.username + "2";

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

test("user can update username", async () => {
  const newUsername = "TestUsererer";
  const updatedInfo = {
    username: newUsername,
    "password-current": "TestUser@1",
  };
  const updateUsername = await request(app)
    .put(`/api/user/${dbUser.id}`)
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .send(updatedInfo)
    .expect(200)
    .then((resp) => resp.body);
  const dbuser = await prisma.user.findUnique({
    where: {
      username: newUsername,
    },
    include: {
      password: true,
    },
  });
  expect(dbuser.username).toBe(newUsername);
});

test("user cannot update username if current password is inputted incorrectly", async () => {
  const newUsername = "TestUser";
  const updatedInfo = {
    username: newUsername,
    "password-current": "TestUser",
  };
  const updateUsername = await request(app)
    .put(`/api/user/${dbUser.id}`)
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .send(updatedInfo)
    .expect(401)
    .then((resp) => resp.body);
  expect(updateUsername.message).toBe("password incorrect");
});

test("password can be updated with correct password", async () => {
  const newPass = "Password123#";
  const updatedInfo = {
    "password-current": "TestUser@1",
    password: newPass,
    "password-confirm": newPass,
  };
  const updatePassword = await request(app)
    .put(`/api/user/${dbUser.id}`)
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .send(updatedInfo)
    .expect(200)
    .then((resp) => resp.body);
  const data = await prisma.user.findUnique({
    where: {
      id: dbUser.id,
    },
    include: {
      password: {
        where: {
          id: updatePassword["password_id"],
        },
      },
    },
  });
  expect(await bcrypt.compare("TestUser@1", newPass)).toBe(false); //old password != new password
  expect(await bcrypt.compare(newPass, data.password.hash)).toBe(true); //new password == db password
});

test("password cannot be updated if password-confirm does not match new password", async () => {
  const newPass = "Password123#";
  const updatedInfo = {
    "password-current": "TestUser@1",
    password: newPass,
    "password-confirm": "asdfjasdf",
  };
  const data = await request(app)
    .put(`/api/user/${dbUser.id}`)
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .send(updatedInfo)
    .expect(400)
    .then((resp) => resp.body);
  expect(data.message).toBe("passwords must match");
  expect(await bcrypt.compare("TestUser@1", newPass)).toBe(false); //old password != new password
});

test("should fail if username is updated to an already taken username", async () => {
  const response = await request(app)
    .put(`/api/user/${dbUser.id}`)
    .send({
      username: dbUser2.username,
      "password-current": user.password,
    })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("authorization", `bearer ${jwt}`)
    .expect(400)
    .then((res) => res.body);
  expect(response.message).toBe("username already taken");
});
