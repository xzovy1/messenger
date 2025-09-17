const prisma = require("../prisma/client.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();

passport.use(
  new LocalStrategy(async (username, password, done) => {
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
        return done(null, false, { message: "Incorrect username" });
      }
      const pass = user.password;
      const hashedPassword = pass.password;
      const matched = await bcrypt.compare(password, hashedPassword);
      if (!matched) {
        console.log("incorrect password");
        return done(null, false, { message: "Incorrect password" });
      }
      console.log("authenticated");
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err);
  }
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    failureRedirect: "/log-in",
  }),
  function (req, res) {
    const user = req.user;
    jwt.sign(
      { user },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        res.json({ token }).redirect("/");
      },
    );
  },
);

router.get("/", (req, res) => {
  const user = req.user;
  res.json({ message: "logged in" });
});

router.get("/log-out", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
  });
  res.json({ message: "logged out" });
});

module.exports = router;
