import { describe, test, expect } from "@jest/globals";
import { GameBoard } from "./GameBoard.js";
import { Ship } from "./Ship.js";

describe("GameBoard", () => {
  describe("creation", () => {
    test("should have board property", () => {
      const gameBoard = new GameBoard();
      expect(gameBoard).toHaveProperty("board");
    });

    test("board property should be an array", () => {
      const gameBoard = new GameBoard();
      expect(gameBoard.board).toBeInstanceOf(Array);
    });

    test("board should be a 2D array with 10x10 dimension", () => {
      const gameBoard = new GameBoard();
      expect(gameBoard.board.length).toBe(10);

      for (let i = 0; i < 10; i++) {
        expect(gameBoard.board[i]).toBeInstanceOf(Array);
        expect(gameBoard.board[i].length).toBe(10);
      }
    });
  });

  describe("resetGameBoard()", () => {
    test("should set all squares to null", () => {
      const ship = new Ship(3);
      const gameBoard = new GameBoard();
      expect(gameBoard.placeShip(ship, [0, 0], "horizontal")).toBe(true);
      gameBoard.resetGameBoard();

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          expect(gameBoard.board[i][j]).toBe(null);
        }
      }
    });

    test("should clear ships array", () => {
      const ship = new Ship(3);
      const gameBoard = new GameBoard();
      expect(gameBoard.placeShip(ship, [0, 0], "horizontal")).toBe(true);
      gameBoard.resetGameBoard();

      expect(gameBoard.ships.length).toBe(0);
    });

    test("should clear misses set", () => {
      const gameBoard = new GameBoard();
      expect(gameBoard.receiveAttack([9, 9])).toBe(false);
      expect(gameBoard.misses.size).toBe(1);
      gameBoard.resetGameBoard();

      expect(gameBoard.misses.size).toBe(0);
    });

    test("should clear hits set", () => {
      const ship = new Ship(3);
      const gameBoard = new GameBoard();
      expect(gameBoard.placeShip(ship, [0, 0], "horizontal")).toBe(true);
      expect(gameBoard.receiveAttack([0, 0])).toBe(true);
      expect(gameBoard.hits.size).toBe(1);
      gameBoard.resetGameBoard();

      expect(gameBoard.hits.size).toBe(0);
    });
  });

  describe("placeShip()", () => {
    test("should successfully place a ship of length 2 at [0,0] horizontally", () => {
      const ship = new Ship(2);
      const gameBoard = new GameBoard();

      expect(gameBoard.placeShip(ship, [0, 0], "horizontal")).toBe(true);
      expect(gameBoard.board[0][0]).toBe(ship);
      expect(gameBoard.board[0][1]).toBe(ship);
    });

    test("should successfully place a ship of length 2 at [0,0] vertically", () => {
      const ship = new Ship(2);
      const gameBoard = new GameBoard();

      expect(gameBoard.placeShip(ship, [0, 0], "vertical")).toBe(true);
      expect(gameBoard.board[0][0]).toBe(ship);
      expect(gameBoard.board[1][0]).toBe(ship);
    });

    test("should not alter board if initial coordinates are out of bounds", () => {
      const ship = new Ship(2);
      const gameBoard = new GameBoard();

      expect(gameBoard.placeShip(ship, [10, 0], "horizontal")).toBe(false);
    });

    test("should not alter board if extends out of bounds horizontally", () => {
      const ship = new Ship(3);
      const gameBoard = new GameBoard();

      expect(gameBoard.placeShip(ship, [0, 8], "horizontal")).toBe(false);
      expect(gameBoard.board[0][8]).toBe(null);
      expect(gameBoard.board[0][9]).toBe(null);
    });

    test("should not alter board if extends out of bounds vertically", () => {
      const ship = new Ship(3);
      const gameBoard = new GameBoard();

      expect(gameBoard.placeShip(ship, [8, 0], "vertical")).toBe(false);
      expect(gameBoard.board[8][0]).toBe(null);
      expect(gameBoard.board[9][0]).toBe(null);
    });

    test("should not alter board if trying to place on occupied coordinate", () => {
      const ship = new Ship(3);
      const ship2 = new Ship(3);
      const gameBoard = new GameBoard();

      expect(gameBoard.placeShip(ship, [0, 0], "horizontal")).toBe(true);
      expect(gameBoard.placeShip(ship2, [0, 2], "horizontal")).toBe(false);
      expect(gameBoard.board[0][3]).toBe(null);
      expect(gameBoard.board[0][4]).toBe(null);
    });

    test("should add ship to ships array if placed successfully", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);
      gameBoard.placeShip(ship, [0, 0], "horizontal");

      expect(gameBoard.ships.length).toBe(1);
      expect(gameBoard.ships[0]).toBe(ship);
    });

    test("should not add ship to ships array if not placed successfully", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);
      const ship2 = new Ship(3);
      gameBoard.placeShip(ship, [0, 0], "horizontal");

      expect(gameBoard.placeShip(ship2, [0, 0], "horizontal")).toBe(false);

      expect(gameBoard.ships.length).toBe(1);
      expect(gameBoard.ships[0]).toBe(ship);
    });
  });

  describe("receiveAttack()", () => {
    test("attacking an empty square returns false (miss)", () => {
      const gameBoard = new GameBoard();

      expect(gameBoard.receiveAttack([0, 0])).toBe(false);
      expect(gameBoard.board[0][0]).toBe(null);
    });

    test("attacking a ship returns true (hit) and calls ship.hit()", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);
      gameBoard.placeShip(ship, [0, 0], "horizontal");

      expect(gameBoard.receiveAttack([0, 0])).toBe(true);
      expect(ship.hits).toBe(1);
      expect(gameBoard.board[0][0]).toBe(ship);
    });

    test("missed attack coordinates should be stored in misses Set", () => {
      const gameBoard = new GameBoard();

      expect(gameBoard.receiveAttack([0, 0])).toBe(false);
      expect(gameBoard.board[0][0]).toBe(null);
      expect(gameBoard.misses.has("0,0")).toBe(true);
    });

    test("successful attack coordinates should be stored in hits Set", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);
      gameBoard.placeShip(ship, [0, 0], "horizontal");

      expect(gameBoard.receiveAttack([0, 0])).toBe(true);
      expect(ship.hits).toBe(1);
      expect(gameBoard.board[0][0]).toBe(ship);
      expect(gameBoard.hits.has("0,0")).toBe(true);
    });

    test("duplicate attacks on an already missed attack coordinate should not register", () => {
      const gameBoard = new GameBoard();

      gameBoard.receiveAttack([0, 0]);
      expect(gameBoard.receiveAttack([0, 0])).toBe("already-attacked");
    });

    test("duplicate attacks on an already successful attack coordinate should not register", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);
      gameBoard.placeShip(ship, [0, 0], "horizontal");

      gameBoard.receiveAttack([0, 0]);
      expect(gameBoard.receiveAttack([0, 0])).toBe("already-attacked");
      expect(ship.hits).toBe(1);
    });
  });

  describe("allShipsSunk()", () => {
    test("should return false if no ships placed", () => {
      const gameBoard = new GameBoard();
      expect(gameBoard.allShipsSunk()).toBe(false);
    });

    test("should return false if a ship placed, but not sunk", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);

      gameBoard.placeShip(ship, [0, 0], "horizontal");
      expect(gameBoard.allShipsSunk()).toBe(false);
    });

    test("should return true if a ship placed and then sunk", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);

      gameBoard.placeShip(ship, [0, 0], "horizontal");
      gameBoard.receiveAttack([0, 0]);
      gameBoard.receiveAttack([0, 1]);
      gameBoard.receiveAttack([0, 2]);
      expect(gameBoard.allShipsSunk()).toBe(true);
    });

    test("should return false if multiple ship placed, but not all sunk", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);
      const ship2 = new Ship(3);

      gameBoard.placeShip(ship, [0, 0], "horizontal");
      gameBoard.placeShip(ship2, [1, 0], "horizontal");
      gameBoard.receiveAttack([0, 0]);
      gameBoard.receiveAttack([0, 1]);
      gameBoard.receiveAttack([0, 2]);
      expect(gameBoard.allShipsSunk()).toBe(false);
    });

    test("should return true if multiple ships placed and all ships are sunk", () => {
      const gameBoard = new GameBoard();
      const ship = new Ship(3);
      const ship2 = new Ship(3);

      gameBoard.placeShip(ship, [0, 0], "horizontal");
      gameBoard.placeShip(ship2, [1, 0], "horizontal");
      gameBoard.receiveAttack([0, 0]);
      gameBoard.receiveAttack([0, 1]);
      gameBoard.receiveAttack([0, 2]);
      gameBoard.receiveAttack([1, 0]);
      gameBoard.receiveAttack([1, 1]);
      gameBoard.receiveAttack([1, 2]);
      expect(gameBoard.allShipsSunk()).toBe(true);
    });
  });
});
