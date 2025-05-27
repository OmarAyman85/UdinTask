````markdown
# Sokoban Game - Angular Edition

An interactive Sokoban puzzle game implemented with Angular standalone components.  
Features dynamic grid generation with walls, boxes, goals, and player movement using emoji tiles.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Constraints](#constraints)
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

This project is a Sokoban game clone built using Angular. The gameplay follows the classic Sokoban rules:

- The player can move in all four directions (up, down, left, right).
- The player can **push** blocks but **cannot pull** them.
- Only **one block can be pushed at a time**.

The game grid is dynamically generated with walls, boxes, goals, and a player sprite represented by emoji. The logic ensures the player’s movement and block pushing respects these constraints, creating a challenging puzzle experience.

---

## Features

- Dynamic 10x10 puzzle grid with walls, boxes, goals, and player position
- Player movement in all directions using keyboard arrow keys
- Blocks can only be pushed — pulling is not allowed
- Only one block can be pushed at a time
- Walls (`🧱`) block movement and box pushing
- Win condition when all boxes (`📦`) are placed on goal tiles (`🎯`)
- Responsive and semantic HTML structure with accessibility features
- Clean separation of static (walls, goals) and dynamic (player, boxes) elements
- Reset button to generate a new random puzzle

---

## Constraints

- **Player sprite must be able to move in all directions:** Up, Down, Left, Right
- **Blocks can only be pushed, not pulled**
- **Only one block can be pushed at a time**

These constraints are strictly enforced in the game logic to preserve authentic Sokoban gameplay.

---

## Getting Started

### Prerequisites

- Node.js (v14+) and npm installed
- Angular CLI installed globally (`npm install -g @angular/cli`)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/sokoban-angular.git
cd sokoban-angular
```
````

2. Install dependencies

```bash
npm install
```

3. Serve the app locally

```bash
ng serve
```

4. Open your browser at `http://localhost:4200` to play.

---

## How to Play

- Use **Arrow Keys** (↑, ↓, ←, →) to move the player on the grid
- Push boxes (`📦`) onto goals (`🎯`) to convert them into completed boxes (`✅`)
- Walls (`🧱`) block movement
- Player is represented by `🧍‍♂️` emoji
- When all goals are covered by boxes, you win and see a congratulatory message
- Use the **Reset Puzzle** button to generate a new random puzzle

---

## Project Structure

- **sokoban.component.ts** — Main game logic and grid state
- **sokoban.component.html** — Semantic, accessible grid layout using ARIA roles
- **sokoban.component.css** — Styles for the grid, cells, and controls
- **Types** — `BaseTile` and `EntityTile` define static and dynamic tile types respectively

Key points:

- The game board is represented by two 2D arrays: `baseGrid` for static elements and `entityGrid` for dynamic entities.
- Movement logic handles pushing boxes and prevents invalid moves in accordance with constraints.
- Accessibility is enhanced with roles like `grid`, `row`, and `gridcell` plus proper labeling.

---

## Known Limitations

- Current grid generation is random and does not guarantee solvability of every puzzle
- No undo or hint functionality yet
- The UI is emoji-based, which may render differently across platforms
- No mobile/touch controls (keyboard only)

---

## Future Improvements

- Implement a puzzle generator that ensures solvable levels
- Add undo/redo and move counter
- Support touch controls for mobile devices
- Improve UI with custom SVG or images instead of emojis
- Add sound effects and animations
- Save game progress and high scores

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Made with ❤️ using Angular_

```

```
