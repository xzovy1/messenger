const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const prisma = require("./prisma/client.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.json())// ensure Content-Type of header is 'application/json'



const authRouter = require("./routes/auth");
app.use("/", authRouter);

// app.use(async (req, res, next) => {
//   const user = await prisma.user.findUnique({
//     where: {
//       username: "user1",
//     },
//   });
//   req.user = user;
//   next();
// });
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
