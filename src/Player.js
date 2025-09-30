import { GameBoard } from "./GameBoard.js";

class Player {
  constructor(type) {
    this.type = type;
    this.gameBoard = new GameBoard();
    this.computerAttackQueue = [];
    this.computerAttackMode = "random";
    this.computerLockedDirection = "";
    this.computerCurrentTargetHits = [];
  }

  computerAttack(opponentBoard) {
    if (opponentBoard.misses.size + opponentBoard.hits.size === 100) {
      throw new Error("Cannot Attack: All Squares Attacked. Game Should Have Ended.");
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

  updateComputerAttackStrategy(result, coordinates, opponentBoard) {
    if (result === true) {
      this.computerCurrentTargetHits.push(coordinates);

      const ship = opponentBoard.getShipAt(coordinates);

      if (ship && ship.isSunk()) {
        this.computerAttackQueue.length = 0;
        this.computerAttackMode = "random";
        this.computerLockedDirection = "";
        this.computerCurrentTargetHits.length = 0;
        return;
      }

      if (this.computerAttackMode === "locked") {
        this.computerAttackQueue.length = 0;

        if (this.computerLockedDirection === "horizontal") {
          const row = this.computerCurrentTargetHits[0][0];
          const columns = this.computerCurrentTargetHits
            .filter((hit) => hit[0] === row)
            .map((hit) => hit[1]);

          const minColumn = Math.min(...columns);
          const maxColumn = Math.max(...columns);

          if (minColumn - 1 >= 0) {
            this.computerAttackQueue.push([row, minColumn - 1]);
          }
          if (maxColumn + 1 <= 9) {
            this.computerAttackQueue.push([row, maxColumn + 1]);
          }
        } else if (this.computerLockedDirection === "vertical") {
          const column = this.computerCurrentTargetHits[0][1];
          const rows = this.computerCurrentTargetHits
            .filter((hit) => hit[1] === column)
            .map((hit) => hit[0]);

          const minRow = Math.min(...rows);
          const maxRow = Math.max(...rows);

          if (minRow - 1 >= 0) {
            this.computerAttackQueue.push([minRow - 1, column]);
          }
          if (maxRow + 1 <= 9) {
            this.computerAttackQueue.push([maxRow + 1, column]);
          }
        }
        return;
      }

      if (this.computerCurrentTargetHits.length >= 2 && this.computerAttackMode === "target") {
        const lastHit = this.computerCurrentTargetHits[this.computerCurrentTargetHits.length - 1];

        const secondLastHit =
          this.computerCurrentTargetHits[this.computerCurrentTargetHits.length - 2];

        if (
          lastHit[0] === secondLastHit[0] &&
          (lastHit[1] - secondLastHit[1] === 1 || lastHit[1] - secondLastHit[1] === -1)
        ) {
          this.computerAttackMode = "locked";
          this.computerLockedDirection = "horizontal";
          this.computerAttackQueue.length = 0;
          const row = lastHit[0];
          const columns = this.computerCurrentTargetHits
            .filter((hit) => hit[0] === row)
            .map((hit) => hit[1]);

          const minColumn = Math.min(...columns);
          const maxColumn = Math.max(...columns);

          if (minColumn - 1 >= 0) {
            this.computerAttackQueue.push([row, minColumn - 1]);
          }
          if (maxColumn + 1 <= 9) {
            this.computerAttackQueue.push([row, maxColumn + 1]);
          }
        } else if (
          lastHit[1] === secondLastHit[1] &&
          (lastHit[0] - secondLastHit[0] === 1 || lastHit[0] - secondLastHit[0] === -1)
        ) {
          this.computerAttackMode = "locked";
          this.computerLockedDirection = "vertical";
          this.computerAttackQueue.length = 0;
          const column = lastHit[1];
          const rows = this.computerCurrentTargetHits
            .filter((hit) => hit[1] === column)
            .map((hit) => hit[0]);

          const minRow = Math.min(...rows);
          const maxRow = Math.max(...rows);

          if (minRow - 1 >= 0) {
            this.computerAttackQueue.push([minRow - 1, column]);
          }
          if (maxRow + 1 <= 9) {
            this.computerAttackQueue.push([maxRow + 1, column]);
          }
        }
      } else {
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
}

export { Player };
