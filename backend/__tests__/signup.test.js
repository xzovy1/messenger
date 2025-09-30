const request = require("supertest");
const express = require("express");
const prisma = require("../prisma/client.js");
const {
  expect,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  test,
} = require("@jest/globals");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userController = require("../controllers/userController.js");
app.post("/api/user", userController.createUser);

describe("User Router", () => {
  beforeEach(async () => {
    await prisma.message.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.pW.deleteMany();
  });
  afterAll(async () => {
    await prisma.message.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.pW.deleteMany();
    await prisma.$disconnect();
  });
  test("true", async () => {
    expect(true).toBe(true)
  })
  test("should create a user when all fields are filled correctly", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "Hi, I'm Test User",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);
  });

  test("fails with username missing", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "Hi, I'm Test User",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("fails with password missing", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        // password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "Hi, I'm Test User",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("fails with password-confirm missing", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        // "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "Hi, I'm Test User",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("fails with firstname missing", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        // firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "Hi, I'm Test User",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("fails with lastname missing", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        // lastname: "User",
        dob: "2020-10-10",
        bio: "Hi, I'm Test User",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("fails with dob missing", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        // dob: "2020-10-10",
        bio: "Hi, I'm Test User",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("passes with bio empty", async () => {
    const userpass = "testUser2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);
  });
  test("password fails less than 8 characters", async () => {
    const userpass = "testU2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "hi",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("fails when password confirmation is not password", async () => {
    const userpass = "testU2@";
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": "test",
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "hi",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("creating a duplicate user throws an error", async () => {
    const userpass = "testUs2@";
    const response1 = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "hi",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);
    const response2 = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: userpass,
        "password-confirm": userpass,
        firstname: "Test",
        lastname: "User",
        dob: "2020-10-10",
        bio: "hi",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
  });
  test("password is hashed before storing", async () => {
    const plainPassword = "Testtest@1";
    await request(app).post("/api/user").send({
      username: "testUser",
      password: plainPassword,
      "password-confirm": plainPassword,
      firstname: "Test",
      lastname: "User",
      dob: "2020-10-10",
      bio: "Test bio",
    });
    const storedUser = await prisma.user.findUnique({
      where: {
        username: "testUser",
      },
      include: {
        password: true,
      },
    });

    expect(storedUser.password.hash).not.toBe(plainPassword);
    expect(storedUser.password.hash).toMatch(/^\$2[aby]\$\d+\$/);
    expect(storedUser.password.hash.length).toBeGreaterThan(50);
  });
});
