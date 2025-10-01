const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const path = require("path");
app.use((req, res, next) => {
  // console.log(req.url)
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // ensure Content-Type of header is application/json

const authRouter = require("./routes/authRouter");
app.use("/auth", authRouter);

const userController = require("./controllers/userController");
app.post("/api/user", userController.createUser);

const { addTokenToHeader, verifyToken } = require("./jwt");

app.use(addTokenToHeader);
app.use(verifyToken);

const contactsRouter = require("./routes/contactsRouter");
app.use("/api/contacts", contactsRouter);

const messageRouter = require("./routes/messageRouter");
app.use("/api/chat", messageRouter);

const userRouter = require("./routes/userRouter");
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  console.error(" ERROR MIDDLEWARE", err);
  if (Array.isArray(err) && err.length > 0 && err[0].msg) {
    err.message = err[0].msg;
    res.status(400).json({
      message: err[0].msg,
      errors: err,
    });
    return;
  }
  console.error(err.message, err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
