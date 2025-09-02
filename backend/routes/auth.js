const prisma = require("../prisma/client.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();

router.use(passport.initialize())
router.use(passport.session());
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

// router.use((req, res, next) => {
//   // console.log(req.user)
//   if (req.user) {
//     const user = req.user;
//     jwt.sign({ user }, "secretkey", (err, token) => {
//       {
//         res.j;
//       }
//     });
//   }
//   next();
// });
// router.use(passport.authenticate('session'))
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);

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
  console.log(req.session)
  if (req.user) {
    const user = req.user;
    jwt.sign({ user }, "secretkey", (err, token) => {
      {
        res.json({ token });
      }
    });
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
