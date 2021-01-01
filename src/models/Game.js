const mongoose = require("mongoose");

// Create Game schema
const GameSchema = mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  board: {
    type: [[Number]],
    default: [
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
    ],
  },
  players: [String],
  nextMove: {
    type: Number,
    default: -1,
  },
});

module.exports = mongoose.model("Game", GameSchema);
