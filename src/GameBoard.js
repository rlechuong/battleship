class GameBoard {
  static BOARD_SIZE = 10;
  static MAX_COORDINATE = 9;

  constructor() {
    this.initializeBoard();
  }

  initializeBoard() {
    this.board = [];
    for (let i = 0; i < GameBoard.BOARD_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < GameBoard.BOARD_SIZE; j++) {
        this.board[i][j] = null;
      }
    }

    this.misses = new Set();
    this.hits = new Set();
    this.ships = [];
  }

  resetGameBoard() {
    this.initializeBoard();
  }

  /**
   * Attempts to place a ship on the board at specified coordinates and direction
   * @param {Ship} ship - The ship object to place
   * @param {number[]} coordinates - Starting coordinates [row, column]
   * @param {string} direction - Direction to place ship ("horizontal" or "vertical")
   * @returns {boolean} True if placement succeeds, false if placement fails
   */
  placeShip(ship, coordinates, direction) {
    const row = coordinates[0];
    const column = coordinates[1];

    if (row > GameBoard.MAX_COORDINATE || column > GameBoard.MAX_COORDINATE) {
      return false;
    }

    if (direction === "horizontal" && column + ship.length > GameBoard.BOARD_SIZE) {
      return false;
    }

    if (direction === "vertical" && row + ship.length > GameBoard.BOARD_SIZE) {
      return false;
    }

    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        if (this.board[row][column + i] !== null) {
          return false;
        }
      } else if (direction === "vertical") {
        if (this.board[row + i][column] !== null) {
          return false;
        }
      }
    }

    this.ships.push(ship);

    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        this.board[row][column + i] = ship;
      } else if (direction === "vertical") {
        this.board[row + i][column] = ship;
      }
    }
    return true;
  }

  getShipAt(coordinates) {
    const row = coordinates[0];
    const column = coordinates[1];

    if (
      row < 0 ||
      row > GameBoard.MAX_COORDINATE ||
      column < 0 ||
      column > GameBoard.MAX_COORDINATE
    ) {
      console.error(`Invalid coordinates: [${row}, ${column}]`);
      return null;
    }

    return this.board[row][column];
  }

  /**
   * Processes an attack at the specified coordinates and determines the outcome
   * @param {number[]} coordinates - Attack coordinates [row, column]
   * @returns {boolean|string} True for hit, false for miss, "already-attacked" if square was
   * previously attacked, "invalid-coordinates" if out of bounds
   */
  receiveAttack(coordinates) {
    const row = coordinates[0];
    const column = coordinates[1];

    if (
      row < 0 ||
      row > GameBoard.MAX_COORDINATE ||
      column < 0 ||
      column > GameBoard.MAX_COORDINATE
    ) {
      console.error(`Invalid coordinates: [${row}, ${column}]`);
      return "invalid-coordinates";
    }

    const stringCoordinate = `${row},${column}`;
    if (this.hits.has(stringCoordinate) || this.misses.has(stringCoordinate)) {
      return "already-attacked";
    }

    if (this.board[row][column] === null) {
      this.misses.add(`${row},${column}`);
      return false;
    } else {
      this.board[row][column].hit();
      this.hits.add(`${row},${column}`);
      return true;
    }
  }

  /**
   * Determines whether all ships on the board have sunk
   * @returns {boolean} True if all ships sunk, false if any ship remains
   */
  allShipsSunk() {
    if (this.ships.length === 0) {
      return false;
    }

    const allShipsSunk = this.ships.every((ship) => {
      return ship.isSunk();
    });

    return allShipsSunk;
  }
}

export { GameBoard };
