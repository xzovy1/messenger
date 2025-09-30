const authRouter = require("../routes/authRouter.js");
const request = require("supertest");
const express = require("express");
const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");
const { expect } = require("@jest/globals");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);

describe("Auth Controller", () => {
  beforeEach(async () => {
    // Clean and seed test data
    await prisma.message.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.pW.deleteMany();
    const hashedPassword = await bcrypt.hash("Adminadmin@1", 10);
    await prisma.user.create({
      data: {
        username: "admin",
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  test("true", async () => {
    expect(true).toBe(true)
  })
  test("should login with valid credentials", async () => {
    const response = await request(app)
      .post("/auth/log-in")
      .send({ username: "admin", password: "Adminadmin@1" })
      .expect(200)

    // Test that we get a JWT token back
    expect(typeof response.body).toBe("string");
    expect(response.body).toMatch(/^eyJ/); // JWT starts with eyJ
  });

  test("should not find invalid username in db", async () => {
    await request(app)
      .post("/auth/login")
      .send({ username: "test", password: "Adminadmin@1" })
      .expect(404);
  });

  test("should reject invalid password credentials", async () => {
    await request(app)
      .post("/auth/log-in")
      .send({ username: "admin", password: "wrong" })
      .expect(401);
  });
});
