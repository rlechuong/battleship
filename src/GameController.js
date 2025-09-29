class GameController {
  static COMPUTER_TURN_DELAY_MS = 1000;
  static ASCII_OFFSET_A = 65;

  constructor(game, renderer, shipPlacementController) {
    this.game = game;
    this.renderer = renderer;
    this.shipPlacementController = shipPlacementController;
    this.player1GameBoard = null;
    this.player2GameBoard = null;
    this.phase = "setup";
    this.squareEventListenersController = null;
  }

  initializeGame() {
    this.player1GameBoard = this.renderer.createGameBoard();
    this.player2GameBoard = this.renderer.createGameBoard();

    const leftBoard = document.querySelector("#left-board");
    const rightBoard = document.querySelector("#right-board");

    if (!leftBoard || !rightBoard) {
      throw new Error(
        "Critical Game Board Container Missing - Cannot Initialize",
      );
    }

    leftBoard.appendChild(this.player1GameBoard);
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

    this.populateLeftBoardShipDropdown();
    this.populateRightBoardShipDropdown();
    this.setUpShipPlacementButtons();

    const shipPlacementCallbacks = {
      onShipPlaced: (player) => {
        if (player === this.game.player1) {
          this.populateLeftBoardShipDropdown();
        } else if (player === this.game.player2) {
          this.populateRightBoardShipDropdown();
        }

        this.clearPlacementErrors();
      },
    };

    this.shipPlacementController.setUpDragAndDrop(
      this.player1GameBoard,
      this.game.player1,
      shipPlacementCallbacks,
    );

    this.shipPlacementController.setUpDragAndDrop(
      this.player2GameBoard,
      this.game.player2,
      shipPlacementCallbacks,
    );

    this.setUpStartGameButtons();
    this.setUpPlayingGameButtons();
    this.updateGameStatusMessage();
  }

  startPlayingPhase() {
    this.phase = "playing";

    this.addSquareEventListeners(
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

    const leftBoardShipPlacementContainer = document.querySelector(
      "#left-board-ship-placement-container",
    );
    leftBoardShipPlacementContainer.classList.add("hidden");
    const rightBoardShipPlacementContainer = document.querySelector(
      "#right-board-ship-placement-container",
    );
    rightBoardShipPlacementContainer.classList.add("hidden");
    const startGameButtonsContainer = document.querySelector(
      "#start-game-buttons-container",
    );
    startGameButtonsContainer.classList.add("hidden");
    const playingGameButtonsContainer = document.querySelector(
      "#playing-game-buttons-container",
    );
    playingGameButtonsContainer.classList.remove("hidden");

    this.updateGameStatusMessage();
  }

  startNewGame() {
    this.phase = "setup";

    this.removeSquareEventListeners();

    this.shipPlacementController.resetPlayerShips(this.game.player1);
    this.shipPlacementController.resetPlayerShips(this.game.player2);

    this.game.currentPlayer = this.game.player1;
    this.game.opponent = this.game.player2;
    this.game.gameState = "running";
    this.game.winner = null;

    const leftBoardShipPlacementContainer = document.querySelector(
      "#left-board-ship-placement-container",
    );
    leftBoardShipPlacementContainer.classList.remove("hidden");
    const rightBoardShipPlacementContainer = document.querySelector(
      "#right-board-ship-placement-container",
    );
    rightBoardShipPlacementContainer.classList.remove("hidden");
    const startGameButtonsContainer = document.querySelector(
      "#start-game-buttons-container",
    );
    startGameButtonsContainer.classList.remove("hidden");
    const playingGameButtonsContainer = document.querySelector(
      "#playing-game-buttons-container",
    );
    playingGameButtonsContainer.classList.add("hidden");

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

    this.populateLeftBoardShipDropdown();
    this.populateRightBoardShipDropdown();
    this.clearPlacementErrors();
    this.updateGameStatusMessage();
  }

  setUpShipPlacementButtons() {
    const leftBoardRandomPlacementButton = document.querySelector(
      "#left-board-random-placement-button",
    );
    leftBoardRandomPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.resetPlayerShips(this.game.player1);
      this.shipPlacementController.randomlyPlaceShips(this.game.player1);
      this.populateLeftBoardShipDropdown();
      this.renderer.updateGameBoard(
        this.player1GameBoard,
        this.game.player1,
        true,
      );
      this.clearPlacementErrors();
    });

    const leftBoardResetPlacementButton = document.querySelector(
      "#left-board-reset-placement-button",
    );
    leftBoardResetPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.resetPlayerShips(this.game.player1);
      this.populateLeftBoardShipDropdown();
      this.renderer.updateGameBoard(
        this.player1GameBoard,
        this.game.player1,
        true,
      );
      this.clearPlacementErrors();
    });

    const rightBoardRandomPlacementButton = document.querySelector(
      "#right-board-random-placement-button",
    );
    rightBoardRandomPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.resetPlayerShips(this.game.player2);
      this.shipPlacementController.randomlyPlaceShips(this.game.player2);
      this.populateRightBoardShipDropdown();
      this.renderer.updateGameBoard(
        this.player2GameBoard,
        this.game.player2,
        true,
      );
      this.clearPlacementErrors();
    });

    const rightBoardResetPlacementButton = document.querySelector(
      "#right-board-reset-placement-button",
    );
    rightBoardResetPlacementButton.addEventListener("click", () => {
      this.shipPlacementController.resetPlayerShips(this.game.player2);
      this.populateRightBoardShipDropdown();
      this.renderer.updateGameBoard(
        this.player2GameBoard,
        this.game.player2,
        true,
      );
      this.clearPlacementErrors();
    });

    this.handleManualPlacementButton(true);
    this.handleManualPlacementButton(false);
  }

  handleManualPlacementButton(isLeftBoard) {
    const boardSide = isLeftBoard ? "left" : "right";
    const player = isLeftBoard ? this.game.player1 : this.game.player2;
    const gameBoard = isLeftBoard
      ? this.player1GameBoard
      : this.player2GameBoard;

    const dropdown = document.querySelector(
      `#${boardSide}-board-manual-ship-dropdown`,
    );
    const coordinatesInput = document.querySelector(
      `#${boardSide}-board-manual-coordinates-input`,
    );
    const button = document.querySelector(
      `#${boardSide}-board-manual-placement-button`,
    );
    const errorElement = document.querySelector(
      `#${boardSide}-board-manual-placement-error`,
    );

    if (!dropdown || !coordinatesInput || !button || !errorElement) {
      console.error(`Manual Placement Element Missing For ${boardSide} Board.`);
      return;
    }

    button.addEventListener("click", () => {
      const directionInput = document.querySelector(
        `input[name="${boardSide}-board-manual-direction-input"]:checked`,
      );

      if (!directionInput) {
        console.error(`Direction Input Missing For ${boardSide} Board.`);
        return;
      }

      const coordinatesInputValue = coordinatesInput.value;
      const coordinates = this.parseCoordinates(coordinatesInputValue);
      if (coordinates === null) {
        errorElement.textContent = "Invalid Coordinates. Please Enter A1-J10.";
        return;
      }

      const ship = dropdown.value;
      const direction = directionInput.value;

      const success = this.game.placePlayerShip(
        player,
        ship,
        coordinates,
        direction,
      );

      if (success) {
        this.renderer.updateGameBoard(gameBoard, player, true);
        if (isLeftBoard) {
          this.populateLeftBoardShipDropdown();
        } else {
          this.populateRightBoardShipDropdown();
        }

        coordinatesInput.value = "";
        errorElement.textContent = "";
      } else {
        errorElement.textContent = "Ship Cannot Be Placed There.";
      }
    });
  }

  setUpStartGameButtons() {
    const startGameButtonsError = document.querySelector(
      "#start-game-buttons-error",
    );

    const startGameButton = document.querySelector("#start-game-button");
    startGameButton.addEventListener("click", () => {
      if (this.game.canStartGame()) {
        startGameButtonsError.textContent = "";
        this.startPlayingPhase();
      } else {
        startGameButtonsError.textContent =
          "Please place all ships on both boards.";
        return;
      }
    });

    const quickStartButton = document.querySelector("#quick-start-button");
    quickStartButton.addEventListener("click", () => {
      if (this.game.isPlayerSetupComplete(this.game.player1)) {
        this.shipPlacementController.resetPlayerShips(this.game.player2);
        this.shipPlacementController.randomlyPlaceShips(this.game.player2);
        if (this.game.canStartGame()) {
          startGameButtonsError.textContent = "";
          this.startPlayingPhase();
        }
      } else {
        startGameButtonsError.textContent =
          "Please place all ships on your board.";
        return;
      }
    });
  }

  setUpPlayingGameButtons() {
    const startNewGameButton = document.querySelector("#start-new-game-button");
    startNewGameButton.addEventListener("click", () => {
      this.startNewGame();
    });
  }

  addSquareEventListeners(playerBoard, player, opponentBoard, opponent) {
    this.squareEventListenersController = new AbortController();
    const squares = opponentBoard.querySelectorAll(".game-board-square");

    squares.forEach((square) => {
      square.addEventListener(
        "click",
        () => {
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
            }, GameController.COMPUTER_TURN_DELAY_MS);
          }
        },
        { signal: this.squareEventListenersController.signal },
      );
    });
  }

  removeSquareEventListeners() {
    this.squareEventListenersController?.abort();
    this.squareEventListenersController = null;
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
    } else if (this.game.gameState === "ended") {
      const winnerType =
        this.game.winner.type === "real" ? "You" : "The Computer";
      gameStatusMessage.textContent = `Game Over! ${winnerType} Won`;
    } else {
      const currentPlayerType =
        this.game.currentPlayer.type === "real" ? "Your" : "Computer's";
      gameStatusMessage.textContent = `It Is ${currentPlayerType} Turn`;
    }
  }

  populateShipDropdown(isLeftBoard) {
    const boardSide = isLeftBoard ? "left" : "right";
    const player = isLeftBoard ? this.game.player1 : this.game.player2;

    const dropdown = document.querySelector(
      `#${boardSide}-board-manual-ship-dropdown`,
    );
    const button = document.querySelector(
      `#${boardSide}-board-manual-placement-button`,
    );

    if (!dropdown || !button) {
      console.error(
        `Required DOM Elements Not Found For ${boardSide} Board Dropdown`,
      );
      return;
    }

    const unplacedShips = this.game.getUnplacedShips(player);

    dropdown.options.length = 0;
    unplacedShips.forEach((ship) => {
      const option = document.createElement("option");
      option.textContent = ship;
      dropdown.appendChild(option);
    });

    button.disabled = unplacedShips.length === 0;
  }

  populateLeftBoardShipDropdown() {
    this.populateShipDropdown(true);
  }

  populateRightBoardShipDropdown() {
    this.populateShipDropdown(false);
  }

  parseCoordinates(input) {
    const coordinates = input.trim().toUpperCase();
    const validPattern = /^[A-J]([1-9]|10)$/.test(coordinates);
    if (!validPattern) {
      return null;
    }

    const rowLetter = coordinates[0];
    const columnNumber = coordinates.slice(1);

    const row = rowLetter.charCodeAt(0) - GameController.ASCII_OFFSET_A;
    const column = parseInt(columnNumber) - 1;

    return [row, column];
  }

  clearPlacementErrors() {
    const leftBoardManualPlacementError = document.querySelector(
      "#left-board-manual-placement-error",
    );
    const rightBoardManualPlacementError = document.querySelector(
      "#right-board-manual-placement-error",
    );

    if (!leftBoardManualPlacementError || !rightBoardManualPlacementError) {
      console.error("Placement Error Elements Not Found");
      return;
    }

    leftBoardManualPlacementError.textContent = "";
    rightBoardManualPlacementError.textContent = "";
  }
}

export { GameController };
