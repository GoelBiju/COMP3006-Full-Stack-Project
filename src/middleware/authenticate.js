const jwt = require("jsonwebtoken");

const jwtKey = "connect4";

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, jwtKey);

    req.user = decode;
    next();
  } catch (error) {
    res.json({
      message: "Authentication failed",
    });
  }
};

module.exports = authenticate;
