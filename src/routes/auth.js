const express = require("express");

const AuthController = require("../controllers/AuthController");
// const authenticate = require("../middleware/authenticate");

// Get express Router
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
