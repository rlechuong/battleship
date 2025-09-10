import { describe, test, expect } from "@jest/globals";
import { Ship } from "./Ship.js";

describe("Ship", () => {
  describe("creation", () => {
    test("should create a ship with specified length", () => {
      const ship = new Ship(3);
      expect(ship.length).toBe(3);
    });

    test("should create a ship with a different specified length", () => {
      const ship = new Ship(6);
      expect(ship.length).toBe(6);
    });
  });

  describe("hit", () => {
    test("new ship should start with 0 hits", () => {
      const ship = new Ship(3);
      expect(ship.hits).toBe(0);
    });

    test("hit() should increase hits by 1", () => {
      const ship = new Ship(3);
      expect(ship.hits).toBe(0);
      ship.hit();
      expect(ship.hits).toBe(1);
    });

    test("hit() should increase hits by 1 each call", () => {
      const ship = new Ship(3);
      expect(ship.hits).toBe(0);
      ship.hit();
      expect(ship.hits).toBe(1);
      ship.hit();
      expect(ship.hits).toBe(2);
    });
  });

  describe("isSunk()", () => {
    test("new ship should not be sunk", () => {
      const ship = new Ship(3);
      expect(ship.isSunk()).toBe(false);
    });

    test("ship with less hits than length should not be sunk", () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(false);
    });

    test("ship with equal hits and length should be sunk", () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });

    test("ship with greater hits than length should be sunk", () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
  });
});
