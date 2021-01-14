const Game = require("../models/Game");

// Create a game
const create = (req, res, next) => {
  const game = Game();
  game
    .save()
    .then((created) => {
      console.log("Created game: ", created);

      // Return redirect url
      res.json({
        redirectUrl: `/game/${created._id}`,
      });
    })
    .catch((error) => {
      res.json({
        message: `An error occurred: ${error}`,
      });
    });
};

// const getGame = (req, res, next) => {
//   const { gameId } = req.params;

//   Game.findById(gameId)
//     .then((game) => {
//       res.json({
//         game,
//       });
//     })
//     .catch((err) => {
//       res.json({
//         message: `An error occurred: ${err}`,
//       });
//     });
// };

// const getUserGames = (req, res, next) => {
//   const { username } = req.query;

//   if (username) {
//     Game.find({ players: username })
//       .then((games) => {
//         res.json({
//           games: games.map((g) => [g._id, g.state]),
//         });
//       })
//       .catch((err) => {
//         res.json({
//           message: `An error occurred: ${err}`,
//         });
//       });
//   } else {
//     res.json({
//       message: "No query parameters",
//     });
//   }
// };

module.exports = {
  create,
  // getGame,
  // getUserGames,
};
