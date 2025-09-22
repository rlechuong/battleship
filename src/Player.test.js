import { describe, test, expect } from "@jest/globals";
import { GameBoard } from "./GameBoard.js";
import { Player } from "./Player.js";
import { Ship } from "./Ship.js";

describe("Player", () => {
  describe("creation", () => {
    test("should create a real player containing a gameBoard", () => {
      const realPlayer = new Player("real");
      expect(realPlayer.type).toBe("real");
      expect(realPlayer).toHaveProperty("gameBoard");
      expect(realPlayer.gameBoard).toBeInstanceOf(GameBoard);
    });

    test("should create a computer player containing a gameBoard", () => {
      const computerPlayer = new Player("computer");
      expect(computerPlayer.type).toBe("computer");
      expect(computerPlayer).toHaveProperty("gameBoard");
      expect(computerPlayer.gameBoard).toBeInstanceOf(GameBoard);
    });
  });

  describe("computer attack", () => {
    test("computer should attack opponent's board", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      const attackResult = computerPlayer.computerAttack(
        realPlayer.gameBoard,
      ).result;

      expect([true, false]).toContain(attackResult);
    });

    test("computer should attack board if one square remains", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
          realPlayer.gameBoard.receiveAttack([i, j]);
        }
      }

      for (let i = 0; i < 9; i++) {
        realPlayer.gameBoard.receiveAttack([i, 9]);
      }

      const attackResult = computerPlayer.computerAttack(
        realPlayer.gameBoard,
      ).result;

      expect([true, false]).toContain(attackResult);
    });

    test("computer should fail to attack board if no squares remain", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          realPlayer.gameBoard.receiveAttack([i, j]);
        }
      }

      expect(() => {
        computerPlayer.computerAttack(realPlayer.gameBoard);
      }).toThrow(
        "Cannot Attack: All Squares Attacked. Game Should Have Ended.",
      );
    });
  });

  describe("updateComputerAttackStrategy()", () => {
    test("computerAttackMode should change to target on hit", () => {
      const computerPlayer = new Player("computer");

      expect(computerPlayer.computerAttackMode).toBe("random");
      computerPlayer.updateComputerAttackStrategy(true, [3, 4]);
      expect(computerPlayer.computerAttackMode).toBe("target");
    });
  });
});
