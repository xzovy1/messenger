const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));

// const session = require("express-session");

// app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

// const authRouter = require("./routes/auth");
// app.use("/", authRouter);

const verifyToken = (req, res, next) => {
  //get auth header value
  const bearerHeader = req.headers["authorization"];
  console.log(req.headers, bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    //store the token in the request.
    req.token = token;
  } else {
    //forbidden
    res.sendStatus(403);
  }
  next();
};
const prisma = require("./prisma/client.js");
app.use(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      username: "user1",
    },
  });
  req.user = user;
  next();
});
const contactsRouter = require("./routes/contactsRouter");
app.use("/api/contacts", contactsRouter);

const messageRouter = require("./routes/messageRouter");
app.use("/api/chat", messageRouter);

const userRouter = require("./routes/userRouter");
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
