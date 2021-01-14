const express = require("express");

const GameApiController = require("../apiControllers/GameApiController");

const router = express.Router();

router.get("/game", GameApiController.create);
// router.get("/games", GameApiController.getUserGames);
// router.get("/game/:gameId", GameApiController.getGame);

module.exports = router;
