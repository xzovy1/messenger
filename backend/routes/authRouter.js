const prisma = require("../prisma/client.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();

router.use(async (req, res, next) => {
  console.log(req.session)
  next();
});
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        console.log("incorrect username")
        return done(null, false, { message: "Incorrect username" });
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        console.log("incorrect password")
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
    done(null, user);
  } catch (err) {
    console.log(err)
    done(err);
  }
});


router.post(
  "/log-in", (req, res, next) => {
    passport.authenticate("local", function (err, user, info, status) {

      if (err) { return next(err) };
      if (!user) { return res.redirect('/log-in') };
      req.app.user = user;
      jwt.sign(
        { user },
        process.env.JWT_KEY,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) { next(err) };
          res.json({
            token,
          });
        }
      );
      res.redirect('/')
    })(req, res, next)
  });

router.post("/sign-up", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword
    }
  })
  res.json({ user })

})

router.get("/", (req, res) => {
  if (req.app.user) {
    const user = req.app.user;
    jwt.sign({ user }, "secretkey", (err, token) => {
      {
        res.json({ token });
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


module.exports = router;
