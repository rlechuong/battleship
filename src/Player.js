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
    }
  }
}

export { Player };
