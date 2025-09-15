class ShipPlacementController {
  constructor(game, renderer) {
    this.game = game;
    this.renderer = renderer;
  }

  randomlyPlaceShips(player) {
    while (this.game.getUnplacedShips(player).length > 0) {
      const remainingShips = this.game.getUnplacedShips(player);
      const ship = remainingShips[0];

      let placementResult;
      do {
        const randomRow = Math.floor(Math.random() * 10);
        const randomColumn = Math.floor(Math.random() * 10);
        const coordinates = [randomRow, randomColumn];
        const randomDirection = Math.random() < 0.5 ? "horizontal" : "vertical";
        placementResult = this.game.placePlayerShip(
          player,
          ship,
          coordinates,
          randomDirection,
        );
        console.log(placementResult);
      } while (placementResult !== true);
    }
  }

  resetPlayerShips(player) {
    this.game.resetPlayerShips(player);
  }
}

export { ShipPlacementController };
