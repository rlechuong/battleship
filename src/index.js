import "./styles.css";
import { Game } from "./Game.js";
import { Player } from "./Player.js";
import { Renderer } from "./Renderer.js";

const realPlayer1 = new Player("real");
const computerPlayer2 = new Player("computer");
const game = new Game(realPlayer1, computerPlayer2);

game.placePlayerShip(realPlayer1, "Carrier", [2, 1], "horizontal");
game.placePlayerShip(realPlayer1, "Battleship", [6, 3], "vertical");
game.placePlayerShip(realPlayer1, "Cruiser", [4, 6], "horizontal");
game.placePlayerShip(realPlayer1, "Submarine", [1, 8], "vertical");
game.placePlayerShip(realPlayer1, "Destroyer", [9, 0], "horizontal");

game.placePlayerShip(computerPlayer2, "Carrier", [0, 5], "vertical");
game.placePlayerShip(computerPlayer2, "Battleship", [3, 0], "horizontal");
game.placePlayerShip(computerPlayer2, "Cruiser", [7, 7], "vertical");
game.placePlayerShip(computerPlayer2, "Submarine", [5, 2], "horizontal");
game.placePlayerShip(computerPlayer2, "Destroyer", [1, 4], "vertical");

realPlayer1.gameboard.receiveAttack([2, 1]);
realPlayer1.gameboard.receiveAttack([2, 2]);
realPlayer1.gameboard.receiveAttack([0, 0]);

computerPlayer2.gameboard.receiveAttack([0, 5]);
computerPlayer2.gameboard.receiveAttack([1, 5]);
computerPlayer2.gameboard.receiveAttack([9, 9]);

const renderer = new Renderer(game);

const leftGameBoard = renderer.createGameBoard();
const rightGameBoard = renderer.createGameBoard();

const leftBoard = document.querySelector("#left-board");
leftBoard.appendChild(leftGameBoard);

const rightBoard = document.querySelector("#right-board");
rightBoard.appendChild(rightGameBoard);

renderer.updateGameBoard(leftGameBoard, realPlayer1);
renderer.updateGameBoard(rightGameBoard, computerPlayer2);
