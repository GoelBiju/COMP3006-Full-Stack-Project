const { request } = require("express");

const express = require("express");

const AuthController = require("../controllers/AuthController");

// Get express Router
const router = express.Router();

router.post("/register", AuthController.register);

module.exports = router;
