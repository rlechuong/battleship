import { describe, test, expect } from "@jest/globals";
import { Gameboard } from "./Gameboard.js";
import { Ship } from "./Ship.js";

describe("Gameboard", () => {
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
});

describe("GameBoard, receiveAttack function", () => {
  return;
});
