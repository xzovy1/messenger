const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const prisma = require("./prisma/client.js");
const passport = require("passport");

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // ensure Content-Type of header is application/json

const session = require("express-session");
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

// app.use((req, res, next) => {
//   console.log("body", req.session);
//   next();
// });

const authRouter = require("./routes/authRouter");
app.use("/", authRouter);

const contactsRouter = require("./routes/contactsRouter");
app.use("/api/contacts", contactsRouter);

const messageRouter = require("./routes/messageRouter");
app.use("/api/chat", messageRouter);

const userRouter = require("./routes/userRouter");
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
