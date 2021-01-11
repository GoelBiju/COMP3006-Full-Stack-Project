const express = require("express");

const AuthApiController = require("../apiControllers/AuthApiController");

// Get express Router
const router = express.Router();

router.post("/register", AuthApiController.register);
router.post("/login", AuthApiController.login);
router.get("/logout", AuthApiController.logout);

module.exports = router;
