# Battleship

https://www.theodinproject.com/lessons/node-path-javascript-battleship

An implementation of the classic Battleship game using JavaScript, with a PvE (against the computer) and two-player PvP (with a pass-device screen) mode.

[Live Demo](https://rlechuong.github.io/battleship)

## Features

- **Two Game Modes**
  - Player vs Computer against computer AI
  - Player vs Player with pass-device screen
- **Ship Placement**
  - Drag-and-drop placement with rotation
  - Random placement option
  - Manual coordinate input
- **Basic Computer AI**
  - Targets adjacent squares after hits
  - Locks onto ship direction when detected
- **Modern UI**
  - Visual feedback for hits, misses, and ship placement
  - Dark theme with Material Design colors

## Technologies Used

- **JavaScript (ES6+)** - Core game logic
- **HTML5/CSS3** - UI and styling
- **Jest** - Unit testing
- **Webpack** - Module bundling and transpilation
- **ESLint & Prettier** - Code quality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository

```
git clone https://github.com/rlechuong/battleship.git
cd battleship
```

2. Install dependencies

```
npm install
```

3. Start development server

```
npm run dev
```

4. Open your browser to http://localhost:8080

## Running Tests

```
npm test
```

## Building for Production

```
npm run build
```

## How to Play

1. Select Game Mode - Choose Player vs Computer or Player vs Player
2. Place Your Ships - Drag ships onto boards, use random placement, or enter coordinates manually
3. Battle - Take turns attacking your opponent's board
4. Win - Sink all of your opponent's ships to win!

### Player vs Player Mode

After each turn, a pass-device screen ensures players don't see each other's ship positions.
Click "Continue" when ready to let the other player look at the screen.

## Project Structure

```
battleship/
├── src/
│   ├── Game.js                      # Core game logic
│   ├── GameBoard.js                 # Board state management
│   ├── GameController.js            # UI controller
│   ├── index.js                     # Entry point
│   ├── Player.js                    # Player class with AI
│   ├── Renderer.js                  # DOM rendering
│   ├── Ship.js                      # Ship class
│   ├── ShipPlacementController.js   # UI controller for ship placement
│   ├── styles.css                   # UI styling
│   └── template.html                # UI layout
├── dist/                            # Production build
```

## Development Process

This project was built as part of The Odin Project curriculum, focusing on:

- Object-oriented programming principles
- Test-driven development with Jest
- DOM manipulation and event handling
- Game state management
- UI/UX design patterns

## What I Learned

- Implementing game logic with multiple interacting classes
- Using test driven development
- Managing state across different game phases
- Creating drag-and-drop interactions
- Building AI behavior with targeting
- Handling turn-based multiplayer logic

## Future Potential Enhancements

- Labeling for board coordinates
- Toggle to hide boards during PvP ship placement
- Animations and sound effects
- Mobile-responsive design
- Game statistics and history
- Online multiplayer

## License

This project is open source and available under the MIT License.

## Acknowledgments

- The Odin Project for the project requirements and guidance
- Material Design for UI theme
