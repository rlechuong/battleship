import { describe, test, expect } from "@jest/globals";
import { Gameboard } from "./Gameboard.js";
import { Player } from "./Player.js";

describe("Player", () => {
  describe("creation", () => {
    test("should create a real player containing a gameboard", () => {
      const realPlayer = new Player("real");
      expect(realPlayer.type).toBe("real");
      expect(realPlayer).toHaveProperty("gameboard");
      expect(realPlayer.gameboard).toBeInstanceOf(Gameboard);
    });

    test("should create a computer player containing a gameboard", () => {
      const computerPlayer = new Player("computer");
      expect(computerPlayer.type).toBe("computer");
      expect(computerPlayer).toHaveProperty("gameboard");
      expect(computerPlayer.gameboard).toBeInstanceOf(Gameboard);
    });
  });

  describe("computer attack", () => {
    test("computer should attack opponent's board", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      expect(computerPlayer.computerAttack(realPlayer.gameboard)).toBe(true);
    });

    test("computer should attack board if one square remains", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
          realPlayer.gameboard.receiveAttack([i, j]);
        }
      }

      for (let i = 0; i < 9; i++) {
        realPlayer.gameboard.receiveAttack([i, 9]);
      }

      expect(computerPlayer.computerAttack(realPlayer.gameboard)).toBe(true);
    });

    test("computer should fail to attack board if no squares remain", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          realPlayer.gameboard.receiveAttack([i, j]);
        }
      }

      expect(computerPlayer.computerAttack(realPlayer.gameboard)).toBe(false);
    });
  });
});
