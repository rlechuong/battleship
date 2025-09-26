class ShipPlacementController {
  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;
    this.currentDragData = null;
    this.callbacks = {};
    this.rotateDraggableShipsSetup = false;
  }

  randomlyPlaceShips(player) {
    while (this.game.getUnplacedShips(player).length > 0) {
      const remainingShips = this.game.getUnplacedShips(player);
      const ship = remainingShips[0];

      let placementResult;
      do {
        const randomRow = Math.floor(Math.random() * 10);
        const randomColumn = Math.floor(Math.random() * 10);
        const coordinates = [randomRow, randomColumn];
        const randomDirection = Math.random() < 0.5 ? "horizontal" : "vertical";
        placementResult = this.game.placePlayerShip(
          player,
          ship,
          coordinates,
          randomDirection,
        );
      } while (placementResult !== true);
    }
  }

  resetPlayerShips(player) {
    this.game.resetPlayerShips(player);
  }

  setUpDragAndDrop(gameBoard, player, callbacks = {}) {
    this.callbacks = callbacks;

    if (!this.rotateDraggableShipsSetup) {
      const draggableShips = document.querySelectorAll(".draggable-ship");
      draggableShips.forEach((ship) => {
        ship.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          this.rotateDraggableShip(event.target);
        });
      });
      this.rotateDraggableShipsSetup = true;
    }

    const draggableShips = document.querySelectorAll(".draggable-ship");
    draggableShips.forEach((ship) => {
      ship.addEventListener("dragstart", (event) => {
        this.handleDragStart(event);
      });
      ship.addEventListener("dragend", (event) => {
        this.handleDragEnd(event);
      });
    });

    const boardSquares = gameBoard.querySelectorAll(".game-board-square");
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
    console.log("handleDragStart called");
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

  rotateDraggableShip(shipElement) {
    let currentDirection = shipElement.dataset.direction || "horizontal";

    const newDirection =
      currentDirection === "horizontal" ? "vertical" : "horizontal";

    shipElement.dataset.direction = newDirection;

    console.log(`Ship rotated to: ${newDirection}`);

    const visual = shipElement.querySelector(".draggable-ship-visual");
    if (visual) {
      if (newDirection === "vertical") {
        visual.classList.add("vertical");
      } else {
        visual.classList.remove("vertical");
      }
    }
  }

  handleDragOver(event, gameBoard, player) {
    console.log("handleDragOver called");
    event.preventDefault();

    if (!this.currentDragData) {
      console.log("No data found, returning");
      return;
    }

    const shipData = this.currentDragData;
    const row = parseInt(event.target.dataset.row);
    const column = parseInt(event.target.dataset.column);
    console.log("Using stored data:", shipData, "at position:", row, column);

    this.showPlacementPreview(
      gameBoard,
      row,
      column,
      shipData.length,
      shipData.direction,
    );
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

  showPlacementPreview(gameBoard, row, column, length, direction) {
    this.clearPlacementPreview();

    const previewSquares = [];

    for (let i = 0; i < length; i++) {
      const targetRow = direction === "horizontal" ? row : row + i;
      const targetColumn = direction === "vertical" ? column : column + i;

      if (
        targetRow >= 0 &&
        targetRow <= 9 &&
        targetColumn >= 0 &&
        targetColumn <= 9
      ) {
        const targetSquareIndex = targetRow * 10 + targetColumn;
        const boardSquares = gameBoard.querySelectorAll(".game-board-square");
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

    const cssClass = isValidPlacement
      ? "valid-drop-preview"
      : "invalid-drop-preview";

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
