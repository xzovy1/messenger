const express = require("express");
require('dotenv').config();

const app = express();

const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const session = require("express-session")

const bcrypt = require("bcryptjs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username
                }
            })

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            if (user.password !== hashedPassword) {
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
                username
            }
        })

        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);


const contactsRouter = require("./routes/contactsRouter");
app.use("/contacts", contactsRouter)

const messageRouter = require("./routes/messageRouter");
app.use("/chat", messageRouter)

const userRouter = require("./routes/userRouter");
app.use("/user", userRouter)

const PORT = process.env.PORT || PORT;
app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });
