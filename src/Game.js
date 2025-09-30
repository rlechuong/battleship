import { Ship } from "./Ship.js";

const SHIP_TYPES = {
  Carrier: () => new Ship(5),
  Battleship: () => new Ship(4),
  Cruiser: () => new Ship(3),
  Submarine: () => new Ship(3),
  Destroyer: () => new Ship(2),
};

const OG_UNPLACED_SHIPS = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.player1UnplacedShips = [...OG_UNPLACED_SHIPS];
    this.player2UnplacedShips = [...OG_UNPLACED_SHIPS];
    this.currentPlayer = player1;
    this.opponent = player2;
    this.gameState = "running";
    this.winner = null;
  }

  switchTurn() {
    [this.currentPlayer, this.opponent] = [this.opponent, this.currentPlayer];
  }

  isGameOver() {
    return this.opponent.gameBoard.allShipsSunk();
  }

  endGame() {
    this.gameState = "ended";
    this.winner = this.currentPlayer;
  }

  /**
   * Processes a single turn in the game, handling attacks and turn switching
   * @param {number[]|null} coordinates - Attack coordinates [row, column] for human players,
   * null for computer
   * @returns {boolean|string} Attack result - true for hit, false for miss, "already-attacked"
   * if square was already attacked
   */
  processTurn(coordinates = null) {
    let result;

    if (this.currentPlayer.type === "computer") {
      const attackInfo = this.currentPlayer.computerAttack(this.opponent.gameBoard);
      result = attackInfo.result;
      this.currentPlayer.updateComputerAttackStrategy(
        attackInfo.result,
        attackInfo.coordinates,
        this.opponent.gameBoard,
      );
    } else if (this.currentPlayer.type === "real") {
      result = this.opponent.gameBoard.receiveAttack(coordinates);
    } else {
      throw new Error(`Invalid Player Type: ${this.currentPlayer.type}`);
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

  /**
   * Places specified ship for specified player starting at coordinates in specified direction
   * @param {Player} player - The player whose ship to place
   * @param {string} shipName - The name of ship to place (e.g., "Carrier", "Battleship")
   * @param {number[]} coordinates - Starting coordinates [row, column] for ship placement
   * @param {string} direction - Direction of ship placement ("horizontal" or "vertical")
   * @returns {boolean} True if placement succeeds, false if placement fails
   */
  placePlayerShip(player, shipName, coordinates, direction) {
    let unplacedShips = this.getUnplacedShips(player);
    if (!unplacedShips.includes(shipName)) {
      return false;
    }

    if (!SHIP_TYPES[shipName]) {
      console.error(`Invalid Ship Type: ${shipName}`);
      return false;
    }

    const ship = SHIP_TYPES[shipName]();
    const success = player.gameBoard.placeShip(ship, coordinates, direction);

    if (success) {
      const index = unplacedShips.indexOf(shipName);
      unplacedShips.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Returns an array of unplaced ships for a specific player
   * @param {Player} player - The player whose unplaced ships to return
   * @returns {string[]} Array of unplaced ship names
   */
  getUnplacedShips(player) {
    if (player === this.player1) {
      return this.player1UnplacedShips;
    } else if (player === this.player2) {
      return this.player2UnplacedShips;
    } else {
      throw new Error("Invalid Player.");
    }
  }

  resetPlayerShips(player) {
    if (player === this.player1) {
      player.gameBoard.resetGameBoard();
      this.player1UnplacedShips = [...OG_UNPLACED_SHIPS];
    } else if (player === this.player2) {
      player.gameBoard.resetGameBoard();
      this.player2UnplacedShips = [...OG_UNPLACED_SHIPS];
    } else {
      throw new Error("Invalid Player.");
    }
  }

  isPlayerSetupComplete(player) {
    return this.getUnplacedShips(player).length === 0;
  }

  canStartGame() {
    return this.isPlayerSetupComplete(this.player1) && this.isPlayerSetupComplete(this.player2);
  }
}

export { Game };
