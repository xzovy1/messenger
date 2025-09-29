const jwt = require("jsonwebtoken");
const CustomJwtError = require("./errors/CustomJwtError");

const addTokenToHeader = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  // console.log("HEADER", bearerHeader, req.url)
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    next(new CustomJwtError("token not added to header")); //throwing when loading user profile pic
    return;
  }
};
const verifyToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    if (err) {
      next(new CustomJwtError("JWT error"));
      return;
    } else {
      const { user } = authData;
      req.user = user;
      next();
    }
  });
};

module.exports = { addTokenToHeader, verifyToken };
