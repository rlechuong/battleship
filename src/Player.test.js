import { describe, test, expect } from "@jest/globals";
import { Gameboard } from "./Gameboard.js";
import { Ship } from "./Ship.js";
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
});
