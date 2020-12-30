const mongoose = require("mongoose");

// Create User schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
