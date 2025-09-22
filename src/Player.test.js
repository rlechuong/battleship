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

  describe("computerAttack()", () => {
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

    test("should attack from computerAttackQueue when coordinates available", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      computerPlayer.computerAttackQueue = [
        [3, 3],
        [4, 4],
        [5, 5],
      ];

      const attackInfo = computerPlayer.computerAttack(realPlayer.gameBoard);

      expect(attackInfo.coordinates).toEqual([3, 3]);
      expect(computerPlayer.computerAttackQueue).toHaveLength(2);
      expect(computerPlayer.computerAttackQueue).not.toContain([3, 3]);
    });

    test("should skip already-attacked coordinates when attacking from the queue", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      realPlayer.gameBoard.receiveAttack([3, 3]);

      computerPlayer.computerAttackQueue = [
        [3, 3],
        [4, 4],
        [5, 5],
      ];

      const attackInfo = computerPlayer.computerAttack(realPlayer.gameBoard);

      expect(attackInfo.coordinates).toEqual([4, 4]);
      expect(computerPlayer.computerAttackQueue).toHaveLength(1);
      expect(computerPlayer.computerAttackQueue).toContainEqual([5, 5]);
    });
  });

  describe("updateComputerAttackStrategy()", () => {
    test("computerAttackMode should change to target on hit", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      expect(computerPlayer.computerAttackMode).toBe("random");
      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 3],
        realPlayer.gameBoard,
      );
      expect(computerPlayer.computerAttackMode).toBe("target");
    });

    test("computerAttackMode and computerLockedDirection should change on two successive horizontal hits", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      expect(computerPlayer.computerAttackMode).toBe("random");
      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 3],
        realPlayer.gameBoard,
      );
      expect(computerPlayer.computerAttackMode).toBe("target");
      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 4],
        realPlayer.gameBoard,
      );
      expect(computerPlayer.computerAttackMode).toBe("locked");
      expect(computerPlayer.computerLockedDirection).toBe("horizontal");
    });

    test("computerAttackMode and computerLockedDirection should change on two successive vertical hits", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      expect(computerPlayer.computerAttackMode).toBe("random");
      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 3],
        realPlayer.gameBoard,
      );
      expect(computerPlayer.computerAttackMode).toBe("target");
      computerPlayer.updateComputerAttackStrategy(
        true,
        [4, 3],
        realPlayer.gameBoard,
      );
      expect(computerPlayer.computerAttackMode).toBe("locked");
      expect(computerPlayer.computerLockedDirection).toBe("vertical");
    });

    test("should fill computerAttackQueue with adjacent squares on hit", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      expect(computerPlayer.computerAttackQueue).toHaveLength(0);

      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 3],
        realPlayer.gameBoard,
      );

      expect(computerPlayer.computerAttackQueue).toHaveLength(4);
      expect(computerPlayer.computerAttackQueue).toContainEqual([2, 3]);
      expect(computerPlayer.computerAttackQueue).toContainEqual([4, 3]);
      expect(computerPlayer.computerAttackQueue).toContainEqual([3, 2]);
      expect(computerPlayer.computerAttackQueue).toContainEqual([3, 4]);
    });

    test("should clear computerAttackQueue and add horizontal coordinates on two successive horizontal hits", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      computerPlayer.computerAttackQueue = [
        [0, 0],
        [1, 1],
      ];

      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 3],
        realPlayer.gameBoard,
      );
      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 4],
        realPlayer.gameBoard,
      );

      expect(computerPlayer.computerAttackMode).toBe("locked");
      expect(computerPlayer.computerLockedDirection).toBe("horizontal");
      expect(computerPlayer.computerAttackQueue).toHaveLength(2);
      expect(computerPlayer.computerAttackQueue).toContainEqual([3, 2]);
      expect(computerPlayer.computerAttackQueue).toContainEqual([3, 5]);
    });

    test("should clear computerAttackQueue and add vertical coordinates on two successive vertical hits", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      computerPlayer.computerAttackQueue = [
        [0, 0],
        [1, 1],
      ];

      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 3],
        realPlayer.gameBoard,
      );
      computerPlayer.updateComputerAttackStrategy(
        true,
        [4, 3],
        realPlayer.gameBoard,
      );

      expect(computerPlayer.computerAttackMode).toBe("locked");
      expect(computerPlayer.computerLockedDirection).toBe("vertical");
      expect(computerPlayer.computerAttackQueue).toHaveLength(2);
      expect(computerPlayer.computerAttackQueue).toContainEqual([2, 3]);
      expect(computerPlayer.computerAttackQueue).toContainEqual([5, 3]);
    });

    test("should reset computer attack strategy when sinking a ship", () => {
      const realPlayer = new Player("real");
      const computerPlayer = new Player("computer");

      const ship = new Ship(2);
      realPlayer.gameBoard.placeShip(ship, [3, 3], "horizontal");

      realPlayer.gameBoard.receiveAttack([3, 3]);
      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 3],
        realPlayer.gameBoard,
      );

      realPlayer.gameBoard.receiveAttack([3, 4]);
      computerPlayer.updateComputerAttackStrategy(
        true,
        [3, 4],
        realPlayer.gameBoard,
      );

      expect(computerPlayer.computerAttackQueue).toHaveLength(0);
      expect(computerPlayer.computerAttackMode).toBe("random");
      expect(computerPlayer.computerLockedDirection).toBe("");
      expect(computerPlayer.computerCurrentTargetHits).toHaveLength(0);
    });
  });
});
