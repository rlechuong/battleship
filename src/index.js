import "./styles.css";
import { GameController } from "./GameController.js";
import { Renderer } from "./Renderer.js";

const renderer = new Renderer();
const gameController = new GameController(renderer);

gameController.initializeGame();
