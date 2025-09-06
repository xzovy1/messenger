const jwt = require("jsonwebtoken");

const addTokenToHeader = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
    } else {
        res.sendStatus(500);
    }
    next();
};
const verifyToken = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403);
        } else {
            const { user } = authData
            req.app.user = user
            req.user = user
            next();
        }
    })
};

module.exports = { addTokenToHeader, verifyToken };