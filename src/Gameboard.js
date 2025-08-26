class Gameboard {
  constructor() {
    this.board = [];
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i][j] = null;
      }
    }
  }

  placeShip(ship, coordinate, direction) {
    const row = coordinate[0];
    const column = coordinate[1];

    if (row > 9 || column > 9) {
      return false;
    }

    if (direction === "horizontal" && column + ship.length > 9) {
      return false;
    }

    if (direction === "vertical" && row + ship.length > 9) {
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

    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        this.board[row][column + i] = ship;
      } else if (direction === "vertical") {
        this.board[row + i][column] = ship;
      }
    }
    return true;
  }
}

export { Gameboard };
