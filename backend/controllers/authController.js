const prisma = require("../prisma/client.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");


exports.login =  // module exports need to be an object
  async (req, res, next) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(errors.array());
      return;
    }
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
  }

