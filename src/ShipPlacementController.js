class ShipPlacementController {
  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;
    this.currentDragData = null;
    this.callbacks = {};
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
    console.log("handleDragStart called"); // Add this line
    const shipType = event.target.dataset.shipType;
    const shipLength = parseInt(event.target.dataset.length);

    const shipData = {
      shipType: shipType,
      length: shipLength,
      direction: "horizontal",
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
    console.log("handleDragOver called"); // Add this line
    event.preventDefault();

    if (!this.currentDragData) {
      console.log("No data found, returning"); // Add this line
      return;
    }

    const shipData = this.currentDragData;
    const row = parseInt(event.target.dataset.row);
    const column = parseInt(event.target.dataset.column);
    console.log("Using stored data:", shipData, "at position:", row, column); // Add this line

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
      this.onShipPlaced(player);
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

  onShipPlaced(player) {
    if (this.callbacks.onShipPlaced) {
      this.callbacks.onShipPlaced(player);
    }
  }
}

export { ShipPlacementController };
