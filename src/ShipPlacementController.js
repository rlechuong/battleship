class ShipPlacementController {
  static BOARD_SIZE = 10;
  static MAX_COORDINATE = 9;

  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;
    this.currentDragData = null;
    this.callbacks = {};
    this.rotateDraggableShipsSetup = false;
  }

  /**
   * Sets up drag and drop functionality for ship placement on game board
   * @param {HTMLElement} gameBoard - Game board DOM element
   * @param {Player} player - The player whose board is being set up for placement
   * @param {Object} callbacks - Optional callbacks for ship placement events
   * @param {Function} callbacks.onShipPlaced - Called on successful ship placement
   * @returns {void}
   */
  setUpDragAndDrop(gameBoard, player, callbacks = {}) {
    if (!gameBoard) {
      console.error("Game Board Not Found For Drag And Drop Setup");
      return;
    }
    this.callbacks = callbacks;

    if (!this.rotateDraggableShipsSetup) {
      const draggableShips = document.querySelectorAll(".draggable-ship");

      if (draggableShips.length === 0) {
        console.error("No Draggable Ships Found For Rotation Setup");
        return;
      }

      draggableShips.forEach((ship) => {
        ship.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          this.rotateDraggableShip(event.target);
        });
      });
      this.rotateDraggableShipsSetup = true;
    }

    const draggableShips = document.querySelectorAll(".draggable-ship");

    if (draggableShips.length === 0) {
      console.error("No Draggable Ships Found");
      return;
    }

    draggableShips.forEach((ship) => {
      ship.addEventListener("dragstart", (event) => {
        this.handleDragStart(event);
      });
      ship.addEventListener("dragend", (event) => {
        this.handleDragEnd(event);
      });
    });

    const boardSquares = gameBoard.querySelectorAll(".game-board-square");

    if (boardSquares.length === 0) {
      console.error("No Squares Found On Game Board For Drag And Drop");
      return;
    }

    boardSquares.forEach((square) => {
      square.addEventListener("dragover", (event) => {
        this.handleDragOver(event, gameBoard, player);
      });
      square.addEventListener("dragenter", (event) => {
        event.preventDefault();
      });
      square.addEventListener("drop", (event) => {
        this.handleDrop(event, gameBoard, player);
      });
    });
  }

  handleDragStart(event) {
    const shipType = event.target.dataset.shipType;
    const shipLength = parseInt(event.target.dataset.length);
    const direction = event.target.dataset.direction || "horizontal";

    const shipData = {
      shipType: shipType,
      length: shipLength,
      direction: direction,
    };

    event.dataTransfer.setData("application/json", JSON.stringify(shipData));
    this.currentDragData = shipData;
    event.target.classList.add("dragging");
  }

  handleDragEnd(event) {
    event.target.classList.remove("dragging");
    this.clearPlacementPreview();
    this.currentDragData = null;
  }

  handleDragOver(event, gameBoard, player) {
    event.preventDefault();

    if (!this.currentDragData) {
      return;
    }

    const shipData = this.currentDragData;
    const row = parseInt(event.target.dataset.row);
    const column = parseInt(event.target.dataset.column);

    this.showPlacementPreview(gameBoard, row, column, shipData.length, shipData.direction);
  }

  handleDrop(event, gameBoard, player) {
    event.preventDefault();

    const data = event.dataTransfer.getData("application/json");
    if (!data) {
      return;
    }

    const shipData = JSON.parse(data);
    const row = parseInt(event.target.dataset.row);
    const column = parseInt(event.target.dataset.column);

    const success = this.game.placePlayerShip(
      player,
      shipData.shipType,
      [row, column],
      shipData.direction,
    );

    if (success) {
      this.renderer.updateGameBoard(gameBoard, player, true);
      this.notifyShipPlaced(player);
    }

    this.clearPlacementPreview();
  }

  /**
   * Randomly places all unplaced ships on the specified player's game board
   * @param {Player} player - The player whose game board will have ships placed on it
   * @returns {void}
   */
  randomlyPlaceShips(player) {
    while (this.game.getUnplacedShips(player).length > 0) {
      const remainingShips = this.game.getUnplacedShips(player);
      const ship = remainingShips[0];

      let placementResult;
      do {
        const randomRow = Math.floor(Math.random() * ShipPlacementController.BOARD_SIZE);
        const randomColumn = Math.floor(Math.random() * ShipPlacementController.BOARD_SIZE);
        const coordinates = [randomRow, randomColumn];
        const randomDirection = Math.random() < 0.5 ? "horizontal" : "vertical";
        placementResult = this.game.placePlayerShip(player, ship, coordinates, randomDirection);
      } while (placementResult !== true);
    }
  }

  resetPlayerShips(player) {
    this.game.resetPlayerShips(player);
  }

  rotateDraggableShip(shipElement) {
    let currentDirection = shipElement.dataset.direction || "horizontal";

    const newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";

    shipElement.dataset.direction = newDirection;

    const visual = shipElement.querySelector(".draggable-ship-visual");
    if (visual) {
      if (newDirection === "vertical") {
        visual.classList.add("vertical");
      } else {
        visual.classList.remove("vertical");
      }
    }
  }

  /**
   * Shows a visual preview of where ship would be placed on game board
   * @param {HTMLElement} gameBoard - Game board DOM element
   * @param {number} row - The starting row coordinate for ship placement
   * @param {number} column - The starting column coordinate for ship placement
   * @param {number} length - Length of the ship to be placed
   * @param {string} direction - Direction of ship placement ("horizontal" or "vertical")
   * @returns {void}
   */
  showPlacementPreview(gameBoard, row, column, length, direction) {
    this.clearPlacementPreview();

    const boardSquares = gameBoard.querySelectorAll(".game-board-square");
    if (boardSquares.length === 0) {
      return;
    }

    const previewSquares = [];

    for (let i = 0; i < length; i++) {
      const targetRow = direction === "horizontal" ? row : row + i;
      const targetColumn = direction === "vertical" ? column : column + i;

      if (
        targetRow >= 0 &&
        targetRow <= ShipPlacementController.MAX_COORDINATE &&
        targetColumn >= 0 &&
        targetColumn <= ShipPlacementController.MAX_COORDINATE
      ) {
        const targetSquareIndex = targetRow * ShipPlacementController.BOARD_SIZE + targetColumn;
        const targetSquare = boardSquares[targetSquareIndex];
        previewSquares.push(targetSquare);
      }
    }

    let isValidPlacement = previewSquares.length === length;

    for (const square of previewSquares) {
      if (
        square.classList.contains("ship") ||
        square.classList.contains("hit") ||
        square.classList.contains("miss")
      ) {
        isValidPlacement = false;
        break;
      }
    }

    const cssClass = isValidPlacement ? "valid-drop-preview" : "invalid-drop-preview";

    previewSquares.forEach((square) => {
      square.classList.add(cssClass);
    });
  }

  clearPlacementPreview() {
    const boardSquares = document.querySelectorAll(".game-board-square");
    boardSquares.forEach((square) => {
      square.classList.remove("valid-drop-preview", "invalid-drop-preview");
    });
  }

  notifyShipPlaced(player) {
    if (this.callbacks.onShipPlaced) {
      this.callbacks.onShipPlaced(player);
    }
  }
}

export { ShipPlacementController };
