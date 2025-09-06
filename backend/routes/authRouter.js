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
      });
      if (!user) {
        console.log("incorrect username");
        return done(null, false, { message: "Incorrect username" });
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        console.log("incorrect password");
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
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
    // console.log(user);
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err);
  }
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    // successRedirect: "/",
    failureRedirect: "/log-in",
  }),
  function (req, res) {
    // console.log("after auth", req.user);
    const user = req.user;
    jwt.sign(
      { user },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        res.json({ token }).redirect('/');
      }
    );
  }
);

router.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  res.json({ user });
});

router.get("/", (req, res) => {
  // console.log("user", req.session);
  const user = req.user;
  res.json("logged out");
});

router.get("/log-out", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
  });
  res.json('logged out')
});

module.exports = router;
