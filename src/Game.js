class Game {
  constructor(player1, player2) {
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
    }

    if (result === true || result === false) {
      this.switchTurn();
    }

    return result;
  }
}

export { Game };
