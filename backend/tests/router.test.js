//see package.json "test" for allowing imports with jest
const router = require("../routes/auth")
const request = require("supertest")
const express = require("express")

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use("/", router)

