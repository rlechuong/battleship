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

      const opponentGameBoard = game.opponent.gameBoard;

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

      const opponentGameBoard = game.opponent.gameBoard;

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
      game.opponent.gameBoard.placeShip(ship, [0, 0], "horizontal");
      const initialOpponent = game.opponent;

      expect([true, false]).toContain(game.processTurn());
      expect(
        initialOpponent.gameBoard.hits.size +
          initialOpponent.gameBoard.misses.size,
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
        initialOpponent.gameBoard.hits.size +
          initialOpponent.gameBoard.misses.size,
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
      game.opponent.gameBoard.placeShip(ship, [0, 0], "horizontal");

      game.opponent.gameBoard.receiveAttack([0, 0]);
      game.opponent.gameBoard.receiveAttack([0, 1]);

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
      game.opponent.gameBoard.placeShip(ship, [0, 0], "horizontal");

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
      game.opponent.gameBoard.placeShip(ship, [0, 0], "horizontal");

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

      game.opponent.gameBoard.receiveAttack([0, 0]);

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
          game.opponent.gameBoard.receiveAttack([i, j]);
        }
      }

      expect(() => game.processTurn()).toThrow(
        "Error: Invalid Game State: All Squares Attacked, Game Should Have Ended",
      );
    });
  });

  describe("Game Integration Testing", () => {
    test("should play through a game with one ship per player correctly", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");
      const game = new Game(realPlayer, computerPlayer);

      const realPlayerShip = new Ship(3);
      const computerPlayerShip = new Ship(3);

      if (game.currentPlayer != realPlayer) {
        game.switchTurn();
      }

      game.currentPlayer.gameBoard.placeShip(
        realPlayerShip,
        [0, 0],
        "horizontal",
      );
      game.opponent.gameBoard.placeShip(
        computerPlayerShip,
        [0, 0],
        "horizontal",
      );

      expect(game.currentPlayer).toBe(realPlayer);
      expect([true, false]).toContain(game.processTurn([0, 0]));
      expect(game.currentPlayer).toBe(computerPlayer);
      expect([true, false]).toContain(game.processTurn());
      expect(game.currentPlayer).toBe(realPlayer);
      expect([true, false]).toContain(game.processTurn([0, 1]));
      expect(game.currentPlayer).toBe(computerPlayer);
      expect([true, false]).toContain(game.processTurn());
      expect(game.currentPlayer).toBe(realPlayer);
      expect([true, false]).toContain(game.processTurn([0, 2]));
      expect(game.currentPlayer).toBe(realPlayer);
      expect(game.opponent.gameBoard.allShipsSunk()).toBe(true);
      expect(game.gameState).toBe("ended");
      expect(game.winner).toBe(realPlayer);
    });
  });

  describe("placePlayerShip()", () => {
    test("should place ship with valid parameters", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(
        game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal"),
      ).toBe(true);
      expect(realPlayer1.gameBoard.board[0][0]).toBeInstanceOf(Ship);
      expect(realPlayer1.gameBoard.board[0][4]).toBeInstanceOf(Ship);
      expect(game.player1UnplacedShips).not.toContain("Carrier");
      expect(game.player1UnplacedShips.length).toBe(4);
    });

    test("should place ship for second player with valid parameters", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(
        game.placePlayerShip(
          computerPlayer2,
          "Battleship",
          [3, 6],
          "horizontal",
        ),
      ).toBe(true);
      expect(computerPlayer2.gameBoard.board[3][6]).toBeInstanceOf(Ship);
      expect(computerPlayer2.gameBoard.board[3][9]).toBeInstanceOf(Ship);
      expect(game.player2UnplacedShips).not.toContain("Battleship");
      expect(game.player2UnplacedShips.length).toBe(4);
    });

    test("should throw error if invalid player parameter", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(() => {
        game.placePlayerShip(null, "Carrier", [0, 0], "horizontal");
      }).toThrow("Invalid Player.");
    });

    test("should return false if invalid ship name", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(
        game.placePlayerShip(realPlayer1, "Invalid", [0, 0], "horizontal"),
      ).toBe(false);
      expect(realPlayer1.gameBoard.board[0][0]).toBe(null);
      expect(game.player1UnplacedShips.length).toBe(5);
    });

    test("should return false if trying to place an already placed ship", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(
        game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal"),
      ).toBe(true);

      expect(
        game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal"),
      ).toBe(false);

      expect(game.player1UnplacedShips).not.toContain("Carrier");
      expect(game.player1UnplacedShips.length).toBe(4);
      expect(realPlayer1.gameBoard.ships.length).toBe(1);
    });

    test("should return false if trying to place ship on out of bounds coordinates", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(
        game.placePlayerShip(realPlayer1, "Carrier", [9, 9], "horizontal"),
      ).toBe(false);
      expect(game.player1UnplacedShips).toContain("Carrier");
      expect(realPlayer1.gameBoard.ships.length).toBe(0);
    });

    test("should return false if trying to place ship on occupied coordinates", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(
        game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal"),
      ).toBe(true);
      expect(
        game.placePlayerShip(realPlayer1, "Battleship", [0, 3], "horizontal"),
      ).toBe(false);
      expect(game.player1UnplacedShips).toContain("Battleship");
      expect(realPlayer1.gameBoard.ships.length).toBe(1);
    });

    test("should return false if trying to place a ship after they have all been placed", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Cruiser", [2, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Submarine", [3, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Destroyer", [4, 0], "horizontal");

      expect(
        game.placePlayerShip(realPlayer1, "Carrier", [5, 0], "horizontal"),
      ).toBe(false);
      expect(game.player1UnplacedShips.length).toBe(0);
      expect(realPlayer1.gameBoard.ships.length).toBe(5);
    });
  });

  describe("resetPlayerShips()", () => {
    test("should reset Player 1's board and unplaced ships array", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");

      expect(realPlayer1.gameBoard.ships.length).toBe(2);
      expect(game.player1UnplacedShips.length).toBe(3);
      game.resetPlayerShips(realPlayer1);
      expect(realPlayer1.gameBoard.ships.length).toBe(0);
      expect(game.player1UnplacedShips.length).toBe(5);

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          expect(game.player1.gameBoard.board[i][j]).toBe(null);
        }
      }

      expect(game.player1UnplacedShips).toEqual([
        "Carrier",
        "Battleship",
        "Cruiser",
        "Submarine",
        "Destroyer",
      ]);
    });

    test("should reset Player 2's board and unplaced ships array", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(computerPlayer2, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Battleship", [1, 0], "horizontal");

      expect(computerPlayer2.gameBoard.ships.length).toBe(2);
      expect(game.player2UnplacedShips.length).toBe(3);
      game.resetPlayerShips(computerPlayer2);
      expect(computerPlayer2.gameBoard.ships.length).toBe(0);
      expect(game.player2UnplacedShips.length).toBe(5);

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          expect(game.player2.gameBoard.board[i][j]).toBe(null);
        }
      }

      expect(game.player2UnplacedShips).toEqual([
        "Carrier",
        "Battleship",
        "Cruiser",
        "Submarine",
        "Destroyer",
      ]);
    });

    test("should throw error for invalid player", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");

      expect(() => game.resetPlayerShips(null)).toThrow("Invalid Player.");
    });
  });

  describe("isPlayerSetupComplete()", () => {
    test("should return true if player has placed all ships", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Cruiser", [2, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Submarine", [3, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Destroyer", [4, 0], "horizontal");

      expect(game.isPlayerSetupComplete(realPlayer1)).toBe(true);
    });

    test("should return false if player has placed no ships", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(game.isPlayerSetupComplete(realPlayer1)).toBe(false);
    });

    test("should return false if player has only placed some ships", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Cruiser", [2, 0], "horizontal");

      expect(game.isPlayerSetupComplete(realPlayer1)).toBe(false);
    });
  });

  describe("canStartGame()", () => {
    test("should return true if both players have placed all ships", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Cruiser", [2, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Submarine", [3, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Destroyer", [4, 0], "horizontal");

      game.placePlayerShip(computerPlayer2, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Cruiser", [2, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Submarine", [3, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Destroyer", [4, 0], "horizontal");

      expect(game.canStartGame()).toBe(true);
    });

    test("should return false if only first player has placed all ships", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Cruiser", [2, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Submarine", [3, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Destroyer", [4, 0], "horizontal");

      game.placePlayerShip(computerPlayer2, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Cruiser", [2, 0], "horizontal");

      expect(game.canStartGame()).toBe(false);
    });

    test("should return false if only second player has placed all ships", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      game.placePlayerShip(realPlayer1, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(realPlayer1, "Cruiser", [2, 0], "horizontal");

      game.placePlayerShip(computerPlayer2, "Carrier", [0, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Battleship", [1, 0], "horizontal");
      game.placePlayerShip(computerPlayer2, "Cruiser", [2, 0], "horizontal");

      expect(game.canStartGame()).toBe(false);
    });

    test("should return false if neither player has placed ships", () => {
      const realPlayer1 = new Player("real");
      const computerPlayer2 = new Player("computer");
      const game = new Game(realPlayer1, computerPlayer2);

      expect(game.canStartGame()).toBe(false);
    });
  });
});
