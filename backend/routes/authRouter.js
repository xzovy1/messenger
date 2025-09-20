const prisma = require("../prisma/client.js");
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();

router.post('/log-in', async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password)
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        password: true,
      },
    });

    if (!user) {
      console.log("incorrect username");
      res.status(401).json({ message: "Incorrect username" });
      return;
    }
    const pass = user.password;
    const hashedPassword = pass.password;
    const matched = await bcrypt.compare(password, hashedPassword);
    if (!matched) {
      console.log("incorrect password");
      res.status(401).json({ message: "Incorrect password" });
      return;
    }
    console.log("authenticated");
    jwt.sign(
      { user: { username, id: user.id } },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.log("login", err);
        }
        res.json(token);
      },
    );
  } catch (err) {
    return next(err);
  }
})

router.get("/log-out", (req, res) => {

  res.json({ message: "logged out" });
});

module.exports = router;
