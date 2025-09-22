const jwt = require("jsonwebtoken");
const CustomJwtExpiredError = require("./errors/CustomJwtExpiredError");

const addTokenToHeader = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    next(new Error("failed"));
    return;
  }
};
const verifyToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      next(new CustomJwtExpiredError("JWT error"));
      return;
    } else {
      const { user } = authData;
      req.user = user;
      next();
    }
  });
};

module.exports = { addTokenToHeader, verifyToken };
