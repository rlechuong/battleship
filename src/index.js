import "./styles.css";
import { Game } from "./Game.js";
import { GameController } from "./GameController.js";
import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";
import { ShipPlacementController } from "./ShipPlacementController.js";

const realPlayer1 = new Player("real");
const computerPlayer2 = new Player("computer");
const game = new Game(realPlayer1, computerPlayer2);

const renderer = new Renderer();
const gameController = new GameController(game, renderer);
const shipPlacementController = new ShipPlacementController(game, renderer);

shipPlacementController.randomlyPlaceShips(realPlayer1);
shipPlacementController.randomlyPlaceShips(computerPlayer2);

gameController.initializeGame();
