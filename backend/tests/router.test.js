//see package.json "test" for allowing imports with jest
const authRouter = require("../routes/auth.js");
const messageRouter = require("../routes/messageRouter");
const request = require("supertest");
const express = require("express");

const session = require("express-session");

const app = express();
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

app.use(express.urlencoded({ extended: false }));
app.use("/", authRouter);

test("log in", (done) => {
  request(app)
    .post("/log-in")
    // .then(console.log)
    .send({ username: "admin", password: "admin" })
    .then(() => {
      request(app).get("/").expect({ username: "admin" }, done);
    });
});
