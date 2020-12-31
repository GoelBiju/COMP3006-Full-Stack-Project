const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
            message: "User registration successful",
          });
        })
        .catch((error) => {
          res.json({
            message: "An error occured",
          });
        });
    }
  });
};

module.exports = {
  register,
};
