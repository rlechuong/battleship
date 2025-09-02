import { Gameboard } from "./Gameboard";

class Player {
  constructor(type) {
    this.type = type;
    this.gameboard = new Gameboard();
  }

  computerAttack(opponentBoard) {
    if (opponentBoard.misses.size + opponentBoard.hits.size === 100) {
      return false;
    }

    let attackResult;

    do {
      const randomRow = Math.floor(Math.random() * 10);
      const randomColumn = Math.floor(Math.random() * 10);

      attackResult = opponentBoard.receiveAttack([randomRow, randomColumn]);
    } while (attackResult !== true && attackResult !== false);

    return true;
  }
}

export { Player };
