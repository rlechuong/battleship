import { GameBoard } from "./GameBoard.js";

class Player {
  constructor(type) {
    this.type = type;
    this.gameBoard = new GameBoard();
    this.computerAttackQueue = [];
    this.computerAttackMode = "random";
    this.computerLockedDirection = "";
  }

  computerAttack(opponentBoard) {
    if (opponentBoard.misses.size + opponentBoard.hits.size === 100) {
      throw new Error(
        "Cannot Attack: All Squares Attacked. Game Should Have Ended.",
      );
    }

    if (this.computerAttackQueue.length !== 0) {
      let coordinates;

      do {
        coordinates = this.computerAttackQueue.shift();
      } while (
        coordinates &&
        (opponentBoard.hits.has(`${coordinates[0]},${coordinates[1]}`) ||
          opponentBoard.misses.has(`${coordinates[0]},${coordinates[1]}`))
      );

      if (coordinates) {
        const result = opponentBoard.receiveAttack(coordinates);
        return { result: result, coordinates: coordinates };
      }
    }

    let result;
    let coordinates = [];

    do {
      const randomRow = Math.floor(Math.random() * 10);
      const randomColumn = Math.floor(Math.random() * 10);

      result = opponentBoard.receiveAttack([randomRow, randomColumn]);
      coordinates = [randomRow, randomColumn];
    } while (result !== true && result !== false);

    return { result: result, coordinates: coordinates };
  }

  updateComputerAttackStrategy(result, coordinates) {
    if (result === true) {
      this.computerAttackMode = "target";

      const attackedRow = coordinates[0];
      const attackedColumn = coordinates[1];

      if (attackedRow - 1 >= 0) {
        this.computerAttackQueue.push([attackedRow - 1, attackedColumn]);
      }
      if (attackedRow + 1 <= 9) {
        this.computerAttackQueue.push([attackedRow + 1, attackedColumn]);
      }
      if (attackedColumn - 1 >= 0) {
        this.computerAttackQueue.push([attackedRow, attackedColumn - 1]);
      }
      if (attackedColumn + 1 <= 9) {
        this.computerAttackQueue.push([attackedRow, attackedColumn + 1]);
      }
    }
  }
}

export { Player };
