/**
 * Represents a ship in the battleship game
 */
class Ship {
  /**
   * Creates a new ship
   * @param {number} length - The length of the ship (number of squares it occupies)
   */
  constructor(length) {
    if (length <= 0) {
      throw new Error("Ship length must be greater than 0");
    }
    this.length = length;
    this.hits = 0;
  }

  /**
   * Records a hit on the ship
   * @returns {void}
   */
  hit() {
    this.hits += 1;
  }

  /**
   * Checks if the ship has been sunk
   * @returns {boolean} True if ship is sunk, false otherwise
   */
  isSunk() {
    return this.hits >= this.length;
  }
}

export { Ship };
