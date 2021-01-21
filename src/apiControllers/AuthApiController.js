const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtKey = "connect4";
const expiresSecs = 3600;

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      let user = new User({
        username: req.body.username,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          console.log(("Registered", user));
          res.json({
            registered: true,
            message: "Registered account successfully",
          });
        })
        .catch((error) => {
          if (error.name === "MongoError" && error.code === 11000) {
            res.json({
              registered: false,
              message: `A user with the username "${req.body.username}" already exists. Please select another username.`,
            });
          } else {
            res.json({
              registered: false,
              message: `An error occured: ${error}`,
            });
          }
        });
    }
  });
};

const login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            login: false,
            message: err,
          });
        } else {
          if (result) {
            // Create JWT token to return
            let token = jwt.sign({ username: user.username }, jwtKey, {
              algorithm: "HS256",
              expiresIn: expiresSecs,
            });
            console.log("Token: ", token);

            // Set the redirect url
            let redirectUrl = "/";
            if (req.cookies.redirect) {
              redirectUrl = req.cookies.redirect;
              res.clearCookie("redirect");
            }

            // Set a "token" cookie
            res.cookie("token", token, {
              maxAge: expiresSecs * 1000,
              httpOnly: true,
            });
            res.json({
              login: true,
              message: "Login successful",
              redirectUrl,
            });

            res.end();
          } else {
            res.json({
              login: false,
              message: "Check your credentials",
            });
          }
        }
      });
    } else {
      res.json({
        login: false,
        message: "No user found",
      });
    }
  });
};

const logout = (req, res) => {
  // Clear cookies and re-direct to login
  res.clearCookie("token");
  res.clearCookie("redirect");
  res.json({
    redirectUrl: "/",
  });
};

module.exports = {
  register,
  login,
  logout,
};
