class GameController {
  constructor(game, renderer, shipPlacementController) {
    this.game = game;
    this.renderer = renderer;
    this.shipPlacementController = shipPlacementController;
    this.player1GameBoard = null;
    this.player2GameBoard = null;
    this.phase = "setup";
  }

  initializeGame() {
    this.player1GameBoard = this.renderer.createGameBoard();
    this.player2GameBoard = this.renderer.createGameBoard();

    const leftBoard = document.querySelector("#left-board");
    leftBoard.appendChild(this.player1GameBoard);

    const rightBoard = document.querySelector("#right-board");
    rightBoard.appendChild(this.player2GameBoard);

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

    this.setUpShipPlacementButtons();
    this.setUpGamePhaseChangeButtons();
    this.updateGameStatusMessage();
  }

  startPlayingPhase() {
    this.phase = "playing";

    this.addEventListeners(
      this.player1GameBoard,
      this.game.player1,
      this.player2GameBoard,
      this.game.player2,
    );

    this.renderer.updateGameBoard(
      this.player2GameBoard,
      this.game.player2,
      false,
    );

    const leftBoardRandomPlacementButton = document.querySelector(
      "#left-board-random-placement-button",
    );
    leftBoardRandomPlacementButton.classList.add("hidden");
    const leftBoardResetPlacementButton = document.querySelector(
      "#left-board-reset-placement-button",
    );
    leftBoardResetPlacementButton.classList.add("hidden");
    const rightBoardRandomPlacementButton = document.querySelector(
      "#right-board-random-placement-button",
    );
    rightBoardRandomPlacementButton.classList.add("hidden");
    const rightBoardResetPlacementButton = document.querySelector(
      "#right-board-reset-placement-button",
    );
    rightBoardResetPlacementButton.classList.add("hidden");
    const startPlayingPhaseContainer = document.querySelector(
      "#start-playing-phase-container",
    );
    startPlayingPhaseContainer.classList.add("hidden");
    const quickStartComputerContainer = document.querySelector(
      "#quick-start-computer-container",
    );
    quickStartComputerContainer.classList.add("hidden");
    const gamePhaseChangeError = document.querySelector(
      "#game-phase-change-error",
    );
    gamePhaseChangeError.classList.add("hidden");

    this.updateGameStatusMessage();
  }

  setUpShipPlacementButtons() {
    const leftBoardRandomPlacementButton = document.querySelector(
      "#left-board-random-placement-button",
    );
    leftBoardRandomPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.randomlyPlaceShips(this.game.player1);
      this.renderer.updateGameBoard(
        this.player1GameBoard,
        this.game.player1,
        true,
      );
    });

    const leftBoardResetPlacementButton = document.querySelector(
      "#left-board-reset-placement-button",
    );
    leftBoardResetPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.resetPlayerShips(this.game.player1);
      this.renderer.updateGameBoard(
        this.player1GameBoard,
        this.game.player1,
        true,
      );
    });

    const rightBoardRandomPlacementButton = document.querySelector(
      "#right-board-random-placement-button",
    );
    rightBoardRandomPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.randomlyPlaceShips(this.game.player2);
      this.renderer.updateGameBoard(
        this.player2GameBoard,
        this.game.player2,
        true,
      );
    });

    const rightBoardResetPlacementButton = document.querySelector(
      "#right-board-reset-placement-button",
    );
    rightBoardResetPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.resetPlayerShips(this.game.player2);
      this.renderer.updateGameBoard(
        this.player2GameBoard,
        this.game.player2,
        true,
      );
    });
  }

  setUpGamePhaseChangeButtons() {
    const gamePhaseChangeError = document.querySelector(
      "#game-phase-change-error",
    );

    const startPlayingPhaseButton = document.querySelector(
      "#start-playing-phase-button",
    );
    startPlayingPhaseButton.addEventListener("click", () => {
      if (this.game.canStartGame()) {
        this.startPlayingPhase();
      } else {
        gamePhaseChangeError.textContent =
          "Please place all ships on both boards.";
        return;
      }
    });

    const quickStartComputerButton = document.querySelector(
      "#quick-start-computer-button",
    );
    quickStartComputerButton.addEventListener("click", () => {
      if (this.game.isPlayerSetupComplete(this.game.player1)) {
        this.shipPlacementController.resetPlayerShips(this.game.player2);
        this.shipPlacementController.randomlyPlaceShips(this.game.player2);
        if (this.game.canStartGame()) {
          this.startPlayingPhase();
        }
      } else {
        gamePhaseChangeError.textContent =
          "Please place all ships on your board.";
        return;
      }
    });
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

    if (this.phase === "setup" && this.game.gameState === "running") {
      gameStatusMessage.textContent = "Please Place Ships.";
    } else if (this.phase === "setup" && this.game.gameState === "ended") {
      const winnerType =
        this.game.winner.type === "real" ? "You" : "The Computer";
      gameStatusMessage.textContent = `Game Over! ${winnerType} Won`;
    } else {
      const currentPlayerType =
        this.game.currentPlayer.type === "real" ? "Your" : "Computer's";
      gameStatusMessage.textContent = `It Is ${currentPlayerType} Turn`;
    }
  }

  populateLeftBoardShipDropdown() {
    const unplacedShips = this.game.getUnplacedShips(this.game.player1);
  }
}

export { GameController };
