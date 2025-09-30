import { Ship } from "./Ship.js";

class Renderer {
  static BOARD_SIZE = 10;

  constructor() {}

  /**
   * Creates the visual representation of a game board
   * @returns {HTMLElement} The game board DOM element with 100 squares
   */
  createGameBoard() {
    const gameBoard = document.createElement("div");
    gameBoard.classList.add("game-board");

    for (let i = 0; i < Renderer.BOARD_SIZE; i++) {
      for (let j = 0; j < Renderer.BOARD_SIZE; j++) {
        const gameBoardSquare = document.createElement("div");
        gameBoardSquare.classList.add("game-board-square");
        gameBoardSquare.dataset.row = i;
        gameBoardSquare.dataset.column = j;
        gameBoard.appendChild(gameBoardSquare);
      }
    }

    return gameBoard;
  }

  /**
   * Updates the visual representation of the game board based on current game state
   * @param {HTMLElement} gameBoard - The game board DOM element to update
   * @param {Player} player - The player whose game board to update
   * @param {boolean} isPlayerBoard - If true, shows ships; If false, hides non-hit ships
   * @returns {void}
   */
  updateGameBoard(gameBoard, player, isPlayerBoard = true) {
    if (!gameBoard) {
      console.error("Game board element not found for update");
      return;
    }

    const squares = gameBoard.querySelectorAll(".game-board-square");

    if (squares.length === 0) {
      console.error("No squares found on game board for update");
      return;
    }

    for (let i = 0; i < Renderer.BOARD_SIZE; i++) {
      for (let j = 0; j < Renderer.BOARD_SIZE; j++) {
        const squareIndex = i * Renderer.BOARD_SIZE + j;
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
