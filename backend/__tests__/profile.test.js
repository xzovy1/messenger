const request = require("supertest");
const express = require("express");
const prisma = require("../prisma/client.js");
const { expect, afterAll, beforeEach, test } = require("@jest/globals");

const { user, createNewUser } = require("./mockUsers.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("../routes/authRouter.js");
app.use("/auth", authRouter);

const { addTokenToHeader, verifyToken } = require("../jwt.js");
app.use(addTokenToHeader);
app.use(verifyToken);

const userRouter = require("../routes/userRouter.js");
app.use("/api/user", userRouter);
let jwt;

const user2 = { ...user };
user2.username = user.username + "2";
let dbUser, dbUser2;

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

test("user profile can be retrieved by user", async () => {
  const profile = await request(app)
    .get("/api/user/profile")
    .set("authorization", `bearer ${jwt}`)
    .set("Content-Type", "application/json")
    .expect(200);
  expect(profile.body.username).toBe("TestUser");
  expect(profile.body.profile.firstname).toBe("Test");
  expect(profile.body.profile.lastname).toBe("User");
});

test("should update a user's profile when all fields are filled correctly", async () => {
  const updatedUser = {
    firstname: "TestNew",
    lastname: "UserNew",
    dob: "2000-01-01",
    bio: "Updated Bio",
  };

  const response = await request(app)
    .put(`/api/user/${dbUser.id}/profile`)
    .send(updatedUser)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("authorization", `bearer ${jwt}`)
    .expect(200)
    .then((r) => r.body);
  expect(response.firstname).toBe(updatedUser.firstname);
  expect(response.lastname).toBe(updatedUser.lastname);
  expect(response.bio).toBe(updatedUser.bio);
  expect(response.dob).toBe(updatedUser.dob + "T00:00:00.000Z");
});

test("firstname can only be letters", async () => {
  const response = await request(app)
    .put(`/api/user/${dbUser.id}/profile`)
    .send({
      firstname: "TestNew234!@",
      lastname: dbUser.profile.lastname,
      dob: "2000-01-01",
    })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("authorization", `bearer ${jwt}`)
    .expect(400);
});
test("lastname can only be letters", async () => {
  const response = await request(app)
    .put(`/api/user/${dbUser.id}/profile`)
    .send({
      firstname: dbUser.profile.firstname,
      lastname: "TestNew234!@",
      dob: "2000-01-01",
    })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("authorization", `bearer ${jwt}`)
    .expect(400);
});
test("age resulting from birthday cannot be greater than 110 years old", async () => {
  const response = await request(app)
    .put(`/api/user/${dbUser.id}/profile`)
    .send({
      firstname: dbUser.profile.firstname,
      lastname: dbUser.profile.lastname,
      dob: "0020-01-01",
    })
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("authorization", `bearer ${jwt}`)
    // .expect(400);
    .then((r) => r.body);
  expect(response.message).toBe(
    "Age must be less than 110 years and more than 12",
  );
});
