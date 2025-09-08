import { Ship } from "./Ship";

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.player1UnplacedShips = [
      "Carrier",
      "Battleship",
      "Cruiser",
      "Submarine",
      "Destroyer",
    ];
    this.player2UnplacedShips = [
      "Carrier",
      "Battleship",
      "Cruiser",
      "Submarine",
      "Destroyer",
    ];
    this.currentPlayer = player1;
    this.opponent = player2;
    this.gameState = "running";
    this.winner = null;
  }

  switchTurn() {
    [this.currentPlayer, this.opponent] = [this.opponent, this.currentPlayer];
  }

  isGameOver() {
    return this.opponent.gameboard.allShipsSunk();
  }

  endGame() {
    this.gameState = "ended";
    this.winner = this.currentPlayer;
  }

  processTurn(coordinates = null) {
    let result;

    if (this.currentPlayer.type === "computer") {
      result = this.currentPlayer.computerAttack(this.opponent.gameboard);
      if (
        result === false &&
        this.opponent.gameboard.hits.size +
          this.opponent.gameboard.misses.size ===
          100
      ) {
        throw new Error(
          "Error: Invalid Game State: All Squares Attacked, Game Should Have Ended",
        );
      }
    } else if (this.currentPlayer.type === "real") {
      result = this.opponent.gameboard.receiveAttack(coordinates);
    }

    if (this.isGameOver()) {
      this.endGame();
      return result;
    }

    if (result === true || result === false) {
      this.switchTurn();
    }

    return result;
  }

  placePlayerShip(player, shipName, coordinates, direction) {
    let unplacedShips = this.getUnplacedShips(player);
    if (!unplacedShips.includes(shipName)) {
      return false;
    }

    const ship = SHIP_TYPES[shipName];
    const success = player.gameboard.placeShip(ship, coordinates, direction);

    if (success) {
      const index = unplacedShips.indexOf(shipName);
      unplacedShips.splice(index, 1);
      return true;
    }

    return false;
  }

  getUnplacedShips(player) {
    if (player === this.player1) {
      return this.player1UnplacedShips;
    } else if (player === this.player2) {
      return this.player2UnplacedShips;
    } else {
      throw new Error("Invalid Player.");
    }
  }
}

const SHIP_TYPES = {
  Carrier: new Ship(5),
  Battleship: new Ship(4),
  Cruiser: new Ship(3),
  Submarine: new Ship(3),
  Destroyer: new Ship(2),
};

export { Game };
