const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtKey = "connect4";

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      let user = new User({
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          res.json({
            registered: true,
            message: "Registered account successfully",
          });
        })
        .catch((error) => {
          res.json({
            registered: false,
            message: "An error occured",
          });
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
              expiresIn: "1h",
            });

            res.json({
              login: true,
              message: "Login successful",
              token,
            });
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

module.exports = {
  register,
  login,
};
