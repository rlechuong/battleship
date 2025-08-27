import { describe, test, expect } from "@jest/globals";
import { Gameboard } from "./Gameboard.js";
import { Ship } from "./Ship.js";

describe("Gameboard", () => {
  describe("creation", () => {
    test("should have board property", () => {
      const gameboard = new Gameboard();
      expect(gameboard).toHaveProperty("board");
    });

    test("board property should be an array", () => {
      const gameboard = new Gameboard();
      expect(gameboard.board).toBeInstanceOf(Array);
    });

    test("board should be a 2D array with 10x10 dimension", () => {
      const gameboard = new Gameboard();
      expect(gameboard.board.length).toBe(10);

      for (let i = 0; i < 10; i++) {
        expect(gameboard.board[i]).toBeInstanceOf(Array);
        expect(gameboard.board[i].length).toBe(10);
      }
    });
  });

  describe("placeShip()", () => {
    test("should successfully place a ship of length 2 at [0,0] horizontally", () => {
      const ship = new Ship(2);
      const gameboard = new Gameboard();

      expect(gameboard.placeShip(ship, [0, 0], "horizontal")).toBe(true);
      expect(gameboard.board[0][0]).toBe(ship);
      expect(gameboard.board[0][1]).toBe(ship);
    });

    test("should successfully place a ship of length 2 at [0,0] vertically", () => {
      const ship = new Ship(2);
      const gameboard = new Gameboard();

      expect(gameboard.placeShip(ship, [0, 0], "vertical")).toBe(true);
      expect(gameboard.board[0][0]).toBe(ship);
      expect(gameboard.board[1][0]).toBe(ship);
    });

    test("should not alter board if initial coordinates are out of bounds", () => {
      const ship = new Ship(2);
      const gameboard = new Gameboard();

      expect(gameboard.placeShip(ship, [10, 0], "horizontal")).toBe(false);
    });

    test("should not alter board if extends out of bounds horizontally", () => {
      const ship = new Ship(3);
      const gameboard = new Gameboard();

      expect(gameboard.placeShip(ship, [0, 8], "horizontal")).toBe(false);
      expect(gameboard.board[0][8]).toBe(null);
      expect(gameboard.board[0][9]).toBe(null);
    });

    test("should not alter board if extends out of bounds vertically", () => {
      const ship = new Ship(3);
      const gameboard = new Gameboard();

      expect(gameboard.placeShip(ship, [8, 0], "vertical")).toBe(false);
      expect(gameboard.board[8][0]).toBe(null);
      expect(gameboard.board[9][0]).toBe(null);
    });

    test("should not alter board if trying to place on occupied coordinate", () => {
      const ship = new Ship(3);
      const ship2 = new Ship(3);
      const gameboard = new Gameboard();

      expect(gameboard.placeShip(ship, [0, 0], "horizontal")).toBe(true);
      expect(gameboard.placeShip(ship2, [0, 2], "horizontal")).toBe(false);
      expect(gameboard.board[0][3]).toBe(null);
      expect(gameboard.board[0][4]).toBe(null);
    });

    test("should add ship to ships array if placed successfully", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      gameboard.placeShip(ship, [0, 0], "horizontal");

      expect(gameboard.ships.length).toBe(1);
      expect(gameboard.ships[0]).toBe(ship);
    });

    test("should not add ship to ships array if not placed successfully", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      const ship2 = new Ship(3);
      gameboard.placeShip(ship, [0, 0], "horizontal");

      expect(gameboard.placeShip(ship2, [0, 0], "horizontal")).toBe(false);

      expect(gameboard.ships.length).toBe(1);
      expect(gameboard.ships[0]).toBe(ship);
    });
  });

  describe("receiveAttack()", () => {
    test("attacking an empty square returns false (miss)", () => {
      const gameboard = new Gameboard();

      expect(gameboard.receiveAttack([0, 0])).toBe(false);
      expect(gameboard.board[0][0]).toBe(null);
    });

    test("attacking a ship returns true (hit) and calls ship.hit()", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      gameboard.placeShip(ship, [0, 0], "horizontal");

      expect(gameboard.receiveAttack([0, 0])).toBe(true);
      expect(ship.hits).toBe(1);
      expect(gameboard.board[0][0]).toBe(ship);
    });

    test("missed attack coordinates should be stored in misses Set", () => {
      const gameboard = new Gameboard();

      expect(gameboard.receiveAttack([0, 0])).toBe(false);
      expect(gameboard.board[0][0]).toBe(null);
      expect(gameboard.misses.has("0,0")).toBe(true);
    });

    test("successful attack coordinates should be stored in hits Set", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      gameboard.placeShip(ship, [0, 0], "horizontal");

      expect(gameboard.receiveAttack([0, 0])).toBe(true);
      expect(ship.hits).toBe(1);
      expect(gameboard.board[0][0]).toBe(ship);
      expect(gameboard.hits.has("0,0")).toBe(true);
    });

    test("duplicate attacks on an already missed attack coordinate should not register", () => {
      const gameboard = new Gameboard();

      gameboard.receiveAttack([0, 0]);
      expect(gameboard.receiveAttack([0, 0])).toBe("already-attacked");
    });

    test("duplicate attacks on an already successful attack coordinate should not register", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      gameboard.placeShip(ship, [0, 0], "horizontal");

      gameboard.receiveAttack([0, 0]);
      expect(gameboard.receiveAttack([0, 0])).toBe("already-attacked");
      expect(ship.hits).toBe(1);
    });
  });

  describe("allShipsSunk()", () => {
    test("should return false if no ships placed", () => {
      const gameboard = new Gameboard();
      expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("should return false if a ship placed, but not sunk", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, [0, 0], "horizontal");
      expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("should return true if a ship placed and then sunk", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, [0, 0], "horizontal");
      gameboard.receiveAttack([0, 0]);
      gameboard.receiveAttack([0, 1]);
      gameboard.receiveAttack([0, 2]);
      expect(gameboard.allShipsSunk()).toBe(true);
    });

    test("should return false if multiple ship placed, but not all sunk", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      const ship2 = new Ship(3);

      gameboard.placeShip(ship, [0, 0], "horizontal");
      gameboard.placeShip(ship2, [1, 0], "horizontal");
      gameboard.receiveAttack([0, 0]);
      gameboard.receiveAttack([0, 1]);
      gameboard.receiveAttack([0, 2]);
      expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("should return true if multiple ships placed and all ships are sunk", () => {
      const gameboard = new Gameboard();
      const ship = new Ship(3);
      const ship2 = new Ship(3);

      gameboard.placeShip(ship, [0, 0], "horizontal");
      gameboard.placeShip(ship2, [1, 0], "horizontal");
      gameboard.receiveAttack([0, 0]);
      gameboard.receiveAttack([0, 1]);
      gameboard.receiveAttack([0, 2]);
      gameboard.receiveAttack([1, 0]);
      gameboard.receiveAttack([1, 1]);
      gameboard.receiveAttack([1, 2]);
      expect(gameboard.allShipsSunk()).toBe(true);
    });
  });
});
