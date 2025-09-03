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
}

export { Game };
