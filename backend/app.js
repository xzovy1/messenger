const express = require("express");
require('dotenv').config();
const contactsRouter = require("./routes/contactsRouter");
const messageRouter = require("./routes/messageRouter");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/contacts", contactsRouter)

app.use("/messages", messageRouter)

app.use("/user", userRouter)

app.get("/", (req, res) => res.send("home route"))

const PORT = process.env.PORT || PORT;
app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });
