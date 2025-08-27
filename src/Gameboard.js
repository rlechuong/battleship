class Gameboard {
  constructor() {
    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i][j] = null;
      }
    }

    this.misses = new Set();
    this.hits = new Set();
    this.ships = [];
  }

  placeShip(ship, coordinate, direction) {
    const row = coordinate[0];
    const column = coordinate[1];

    if (row > 9 || column > 9) {
      return false;
    }

    if (direction === "horizontal" && column + ship.length > 10) {
      return false;
    }

    if (direction === "vertical" && row + ship.length > 10) {
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

  receiveAttack(coordinate) {
    const row = coordinate[0];
    const column = coordinate[1];

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

  allShipsSunk() {
    if (this.ships.length === 0) {
      return false;
    }

    const allShipsSunk = this.ships.every(function (ship) {
      return ship.isSunk();
    });

    return allShipsSunk;
  }
}

export { Gameboard };
