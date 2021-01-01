const jwt = require("jsonwebtoken");

const jwtKey = "connect4";

const authenticate = (req, res, next) => {
  // Obtain session token from request cookies,
  // comes with every request
  const token = req.cookies.token;

  if (!token) {
    // Redirect to login if cookie is not set
    return res.redirect("/login");
  }

  try {
    // const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, jwtKey);

    req.user = decode;
    console.log("User authenticated: ", req.user);
    next();
  } catch (error) {
    if (e instanceof jwt.JsonWebTokenError) {
      res.json({
        message: "Authentication failed",
      });
    }

    res.json({
      message: "Bad request",
    });
  }
};

module.exports = authenticate;
