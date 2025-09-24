const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController.js");
console.log(authController);

router.post("/log-in", authController.login);

router.get("/log-out", (req, res) => {
  res.json({ message: "logged out" });
});

module.exports = router;
