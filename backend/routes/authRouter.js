const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");
const { validateUsername, validateUserPassword } = require("../controllers/validation/userValidation.js")

authRouter.post("/log-in", validateUsername, validateUserPassword, authController.login);

authRouter.get("/log-out", (req, res) => {
  res.json({ message: "logged out" });
});

module.exports = authRouter;
