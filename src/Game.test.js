import { describe, test, expect } from "@jest/globals";
import { Game } from "./Game.js";
import { Player } from "./Player.js";
import { Ship } from "./Ship.js";

describe("Game", () => {
  describe("creation", () => {
    test("should create a game with two players", () => {
      const player1 = new Player("real");
      const player2 = new Player("computer");
      const game = new Game(player1, player2);

      expect(game).toHaveProperty("currentPlayer");
      expect(game).toHaveProperty("opponent");

      expect([player1, player2]).toContain(game.currentPlayer);
      expect([player1, player2]).toContain(game.opponent);

      expect(game.currentPlayer).not.toBe(game.opponent);
    });
  });

  describe("switchTurn()", () => {
    test("should switch currentPlayer and opponent when switchTurn() called", () => {
      const player1 = new Player("real");
      const player2 = new Player("computer");
      const game = new Game(player1, player2);

      const initialCurrentPlayer = game.currentPlayer;
      const initialOpponent = game.opponent;

      game.switchTurn();

      expect(game.currentPlayer).toBe(initialOpponent);
      expect(game.opponent).toBe(initialCurrentPlayer);
      expect(game.currentPlayer).not.toBe(game.opponent);
    });

    test("should handle switching currentPlayer and opponent multiple times", () => {
      const player1 = new Player("real");
      const player2 = new Player("computer");
      const game = new Game(player1, player2);

      const initialCurrentPlayer = game.currentPlayer;
      const initialOpponent = game.opponent;

      game.switchTurn();
      game.switchTurn();

      expect(game.currentPlayer).toBe(initialCurrentPlayer);
      expect(game.opponent).toBe(initialOpponent);
      expect(game.currentPlayer).not.toBe(game.opponent);
    });
  });

  describe("isGameOver()", () => {
    test("should return true if all opponent's ships are sunk", () => {
      const player1 = new Player("real");
      const player2 = new Player("computer");
      const game = new Game(player1, player2);

      const opponentGameBoard = game.opponent.gameboard;

      const ship = new Ship(3);
      opponentGameBoard.placeShip(ship, [0, 0], "horizontal");
      opponentGameBoard.receiveAttack([0, 0]);
      opponentGameBoard.receiveAttack([0, 1]);
      opponentGameBoard.receiveAttack([0, 2]);

      expect(game.isGameOver()).toBe(true);
    });

    test("should return false if all opponent's ships are not sunk", () => {
      const player1 = new Player("real");
      const player2 = new Player("computer");
      const game = new Game(player1, player2);

      const opponentGameBoard = game.opponent.gameboard;

      const ship = new Ship(3);
      opponentGameBoard.placeShip(ship, [0, 0], "horizontal");
      opponentGameBoard.receiveAttack([0, 0]);

      expect(game.isGameOver()).toBe(false);
    });
  });

  describe("endGame()", () => {
    test("should change gameState to ended and set currentPlayer as winner", () => {
      const player1 = new Player("real");
      const player2 = new Player("computer");
      const game = new Game(player1, player2);

      game.endGame();

      expect(game.gameState).toBe("ended");
      expect(game.winner).toBe(game.currentPlayer);
    });
  });

  describe("processTurn()", () => {
    test("should handle computer attack", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      if (game.currentPlayer != computerPlayer) {
        game.switchTurn();
      }

      const ship = new Ship(3);
      game.opponent.gameboard.placeShip(ship, [0, 0], "horizontal");
      const initialOpponent = game.opponent;

      expect([true, false]).toContain(game.processTurn());
      expect(
        initialOpponent.gameboard.hits.size +
          initialOpponent.gameboard.misses.size,
      ).toBe(1);
      expect(game.currentPlayer).toBe(initialOpponent);
    });

    test("should handle real (human) attack", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      if (game.currentPlayer != realPlayer) {
        game.switchTurn();
      }

      const initialOpponent = game.opponent;

      expect([true, false]).toContain(game.processTurn([0, 0]));
      expect(
        initialOpponent.gameboard.hits.size +
          initialOpponent.gameboard.misses.size,
      ).toBe(1);
      expect(game.currentPlayer).toBe(initialOpponent);
    });

    test("should detect when all opponent's ships sunk and game is over", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      if (game.currentPlayer != realPlayer) {
        game.switchTurn();
      }

      const ship = new Ship(3);
      game.opponent.gameboard.placeShip(ship, [0, 0], "horizontal");

      game.opponent.gameboard.receiveAttack([0, 0]);
      game.opponent.gameboard.receiveAttack([0, 1]);

      expect([true, false]).toContain(game.processTurn([0, 2]));
      expect(game.gameState).toBe("ended");
      expect(game.winner).toBe(realPlayer);
    });

    test("should switch turns after a successful attack that hits", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      if (game.currentPlayer != realPlayer) {
        game.switchTurn();
      }

      const ship = new Ship(3);
      game.opponent.gameboard.placeShip(ship, [0, 0], "horizontal");

      expect(game.processTurn([0, 0])).toBe(true);
      expect(game.currentPlayer).toBe(computerPlayer);
    });

    test("should switch turns after a successful attack that misses", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      if (game.currentPlayer != realPlayer) {
        game.switchTurn();
      }

      const ship = new Ship(3);
      game.opponent.gameboard.placeShip(ship, [0, 0], "horizontal");

      expect(game.processTurn([9, 9])).toBe(false);
      expect(game.currentPlayer).toBe(computerPlayer);
    });

    test("should not switch turns if trying to attack an already attacked square", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      if (game.currentPlayer != realPlayer) {
        game.switchTurn();
      }

      game.opponent.gameboard.receiveAttack([0, 0]);

      expect(game.processTurn([0, 0])).toBe("already-attacked");
      expect(game.currentPlayer).toBe(realPlayer);
    });

    test("should throw error if computer attacks full board", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      if (game.currentPlayer != computerPlayer) {
        game.switchTurn();
      }

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          game.opponent.gameboard.receiveAttack([i, j]);
        }
      }

      expect(() => game.processTurn()).toThrow(
        "Error: Invalid Game State: All Squares Attacked, Game Should Have Ended",
      );
    });
  });
});
