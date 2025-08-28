const express = require("express");
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));

const contactsRouter = require("./routes/contactsRouter");
app.use("/contacts", contactsRouter)

const messageRouter = require("./routes/messageRouter");
app.use("/chat", messageRouter)

const userRouter = require("./routes/userRouter");
app.use("/user", userRouter)

const PORT = process.env.PORT || PORT;
app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });
