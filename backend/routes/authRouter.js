const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");

authRouter.post("/log-in", authController.login);

authRouter.get("/log-out", (req, res) => {
  res.json({ message: "logged out" });
});

module.exports = authRouter;
