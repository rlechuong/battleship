import { Ship } from "./Ship.js";

class Renderer {
  constructor(game) {
    this.game = game;
  }

  createGameBoard() {
    const gameBoard = document.createElement("div");
    gameBoard.classList.add("game-board");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const gameBoardSquare = document.createElement("div");
        gameBoardSquare.classList.add("game-board-square");
        gameBoardSquare.dataset.row = i;
        gameBoardSquare.dataset.column = j;
        gameBoard.appendChild(gameBoardSquare);
      }
    }

    return gameBoard;
  }

  updateGameBoard(gameboard, player, isOpponentBoard = false) {
    const squares = gameboard.querySelectorAll(".game-board-square");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const squareIndex = i * 10 + j;
        const targetSquare = squares[squareIndex];
        const playerBoardValue = player.gameboard.board[i][j];

        const coordinates = `${i},${j}`;

        if (player.gameboard.hits.has(coordinates)) {
          this.resetSquareClasses(targetSquare);
          targetSquare.classList.add("hit");
        } else if (player.gameboard.misses.has(coordinates)) {
          this.resetSquareClasses(targetSquare);
          targetSquare.classList.add("miss");
        } else if (playerBoardValue === null) {
          this.resetSquareClasses(targetSquare);
          targetSquare.classList.add("water");
        } else if (playerBoardValue instanceof Ship) {
          this.resetSquareClasses(targetSquare);
          if (isOpponentBoard) {
            targetSquare.classList.add("hidden-ship");
          } else {
            targetSquare.classList.add("ship");
          }
        }
      }
    }
    return squares[0];
  }

  resetSquareClasses(square) {
    square.className = "game-board-square";
  }

  addClickableSquares(
    ownGameBoard,
    ownPlayer,
    opponentGameBoard,
    opponentPlayer,
  ) {
    const squares = opponentGameBoard.querySelectorAll(".game-board-square");

    squares.forEach((square) => {
      square.addEventListener("click", () => {
        const row = parseInt(square.dataset.row);
        const column = parseInt(square.dataset.column);
        const coordinate = [row, column];

        const result = this.game.processTurn(coordinate);

        if (result === "already-attacked") {
          return;
        } else {
          this.updateGameBoard(opponentGameBoard, opponentPlayer, true);
          this.handleComputerTurn(ownGameBoard, ownPlayer);
        }
      });
    });
  }

  handleComputerTurn(ownGameBoard, ownPlayer) {
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
      this.updateGameBoard(ownGameBoard, ownPlayer, false);
    }
  }
}

export { Renderer };
