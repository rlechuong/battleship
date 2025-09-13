class GameController {
  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;
    this.player1GameBoard = null;
    this.player2GameBoard = null;
  }

  initializeGame() {
    this.game.placePlayerShip(
      this.game.player1,
      "Carrier",
      [2, 1],
      "horizontal",
    );
    this.game.placePlayerShip(
      this.game.player1,
      "Battleship",
      [6, 3],
      "vertical",
    );
    this.game.placePlayerShip(
      this.game.player1,
      "Cruiser",
      [4, 6],
      "horizontal",
    );
    this.game.placePlayerShip(
      this.game.player1,
      "Submarine",
      [1, 8],
      "vertical",
    );
    this.game.placePlayerShip(
      this.game.player1,
      "Destroyer",
      [9, 0],
      "horizontal",
    );

    this.game.placePlayerShip(this.game.player2, "Carrier", [0, 5], "vertical");
    this.game.placePlayerShip(
      this.game.player2,
      "Battleship",
      [3, 0],
      "horizontal",
    );
    this.game.placePlayerShip(this.game.player2, "Cruiser", [7, 7], "vertical");
    this.game.placePlayerShip(
      this.game.player2,
      "Submarine",
      [5, 2],
      "horizontal",
    );
    this.game.placePlayerShip(
      this.game.player2,
      "Destroyer",
      [1, 4],
      "vertical",
    );

    this.player1GameBoard = this.renderer.createGameBoard();
    this.player2GameBoard = this.renderer.createGameBoard();

    const leftBoard = document.querySelector("#left-board");
    leftBoard.appendChild(this.player1GameBoard);

    const rightBoard = document.querySelector("#right-board");
    rightBoard.appendChild(this.player2GameBoard);

    this.game.player1.gameboard.receiveAttack([2, 1]);
    this.game.player1.gameboard.receiveAttack([2, 2]);
    this.game.player1.gameboard.receiveAttack([0, 0]);

    this.game.player2.gameboard.receiveAttack([0, 5]);
    this.game.player2.gameboard.receiveAttack([1, 5]);
    this.game.player2.gameboard.receiveAttack([9, 9]);

    this.renderer.updateGameBoard(
      this.player1GameBoard,
      this.game.player1,
      true,
    );
    this.renderer.updateGameBoard(
      this.player2GameBoard,
      this.game.player2,
      false,
    );

    this.addEventListeners(
      this.player1GameBoard,
      this.game.player1,
      this.player2GameBoard,
      this.game.player2,
    );

    this.updateGameStatusMessage();
  }

  addEventListeners(playerBoard, player, opponentBoard, opponent) {
    const squares = opponentBoard.querySelectorAll(".game-board-square");

    squares.forEach((square) => {
      square.addEventListener("click", () => {
        if (this.game.gameState === "ended") {
          return;
        }

        if (this.game.currentPlayer.type !== "real") {
          return;
        }

        const row = parseInt(square.dataset.row);
        const column = parseInt(square.dataset.column);
        const coordinates = [row, column];

        const result = this.game.processTurn(coordinates);

        if (result === "already-attacked") {
          return;
        } else {
          this.renderer.updateOpponentBoard(opponentBoard, opponent);
          this.updateGameStatusMessage();
          setTimeout(() => {
            this.handleComputerTurn(playerBoard, player);
            this.updateGameStatusMessage();
          }, 1000);
        }
      });
    });
  }

  handleComputerTurn(playerBoard, player) {
    if (this.game.gameState === "ended") {
      return;
    }

    if (this.game.currentPlayer.type !== "computer") {
      return;
    }

    const result = this.game.processTurn();
    if (result === "already-attacked") {
      return;
    } else {
      this.renderer.updatePlayerGameBoard(playerBoard, player);
    }
  }

  updateGameStatusMessage() {
    const gameStatusMessage = document.querySelector("#game-status-message");

    if (this.game.gameState === "ended") {
      const winnerType =
        this.game.winner.type === "real" ? "You" : "The Computer";
      gameStatusMessage.textContent = `Game Over! ${winnerType} Won`;
    } else {
      const currentPlayerType =
        this.game.currentPlayer.type === "real" ? "Your" : "Computer's";
      gameStatusMessage.textContent = `It Is ${currentPlayerType} Turn`;
    }
  }
}

export { GameController };
