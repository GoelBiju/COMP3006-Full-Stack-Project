// Game related actions
$(function () {
  // Get table rows
  let tableRows = $("tr");

  // Get cells and slots
  let tableCells = $("td");
  let tableSlots = $(".slot");

  // Player turn
  const playerTurn = $("#player-turn");
  const reset = $("#reset");

  // Add event listener to each table cell to
  // find row and column location of cell
  $("td").click(function (e) {
    console.log(
      "Row, Column of clicked: ",
      `${e.target.parentElement.rowIndex}, ${e.target.cellIndex}`
    );
  });

  // Handle players
  let playerOne = "";
  let playerTwo = "";

  playerOneColor = "red";
  playerTwoColor = "yellow";

  while (!playerOne) {
    playerOne = prompt("Player One: Enter your name (Red)");
  }

  while (!playerTwo) {
    playerTwo = prompt("Player Two: Enter your name (Yellow)");
  }

  let currentPlayer = 1;
  playerTurn.text(`${playerOne}'s turn`);

  function changeColor(e) {
    let column = e.target.cellIndex;
    let row = [];

    // Change the colour depending on the player
    for (let i = 5; i > -1; i--) {
      //
      if (tableRows[i].children[column].style.backgroundColor == "white") {
        //
        row.push(tableRows[i].children[column]);

        //
        if (currentPlayer == 1) {
          row[0].style.backgroundColor = playerOneColor;
          playerTurn.text(`${playerTwo}'s turn`);
          return (currentPlayer = 2);
        } else {
          row[0].style.backgroundColor = playerTwoColor;
          playerTurn.text(`${playerOne}'s turn`);
          return (currentPlayer = 1);
        }
      }
    }
  }

  // Change the colour of each cell
  console.log("tableCells: ", tableCells);
  tableCells.each(function () {
    $(this).click(changeColor);
    $(this).css("backgroundColor", "white");
  });
});
