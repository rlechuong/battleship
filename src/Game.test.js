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
});
