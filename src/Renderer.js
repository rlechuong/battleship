import { Ship } from "./Ship.js";

class Renderer {
  constructor() {}

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

  updateGameBoard(gameBoard, player, isPlayerBoard = true) {
    const squares = gameBoard.querySelectorAll(".game-board-square");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const squareIndex = i * 10 + j;
        const targetSquare = squares[squareIndex];
        const playerBoardValue = player.gameBoard.board[i][j];

        const coordinates = `${i},${j}`;

        if (player.gameBoard.hits.has(coordinates)) {
          this.resetSquareClasses(targetSquare);
          targetSquare.classList.add("hit");
        } else if (player.gameBoard.misses.has(coordinates)) {
          this.resetSquareClasses(targetSquare);
          targetSquare.classList.add("miss");
        } else if (playerBoardValue === null) {
          this.resetSquareClasses(targetSquare);
          targetSquare.classList.add("water");
        } else if (playerBoardValue instanceof Ship) {
          this.resetSquareClasses(targetSquare);
          if (isPlayerBoard) {
            targetSquare.classList.add("ship");
          } else {
            targetSquare.classList.add("hidden-ship");
          }
        }
      }
    }

    return squares[0];
  }

  updatePlayerGameBoard(gameBoard, player) {
    this.updateGameBoard(gameBoard, player, true);
  }

  updateOpponentBoard(gameBoard, player) {
    this.updateGameBoard(gameBoard, player, false);
  }

  resetSquareClasses(square) {
    square.className = "game-board-square";
  }
}

export { Renderer };
