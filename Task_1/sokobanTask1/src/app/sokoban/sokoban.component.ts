import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

/**
 * BaseTile represents static grid elements:
 * - ' ' : Empty space
 * - '#' : Wall
 * - 'G' : Goal position
 */
type BaseTile = ' ' | '#' | 'G';

/**
 * EntityTile represents dynamic entities on the grid:
 * - ' ' : Empty space
 * - 'P' : Player
 * - 'B' : Box
 * - '*' : Box on a Goal
 */
type EntityTile = ' ' | 'P' | 'B' | '*';

@Component({
  selector: 'app-sokoban',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sokoban.component.html',
  styleUrls: ['./sokoban.component.css'],
})
export class SokobanComponent implements OnInit {
  // Static layer of the board (walls, goals)
  baseGrid: BaseTile[][] = [];

  // Dynamic layer of the board (player, boxes)
  entityGrid: EntityTile[][] = [];

  readonly size = 10; // Board dimensions (size x size)
  readonly boxCount = 3; // Number of boxes and goals

  playerX = 0; // Player's current X position
  playerY = 0; // Player's current Y position
  winMessage = ''; // Message shown upon winning

  ngOnInit(): void {
    this.resetLevel();
  }

  /**
   * Initializes or resets the level by:
   * - Clearing grids
   * - Adding border walls and random inner walls
   * - Placing goals, boxes, and the player in valid positions
   */
  resetLevel(): void {
    this.winMessage = '';
    this.initializeEmptyGrid();
    this.placeBorderWalls();
    this.placeInnerWalls();
    this.placeGoalsBoxesAndPlayer();
  }

  /** Helper to initialize empty grids for base and entity layers */
  private initializeEmptyGrid(): void {
    this.baseGrid = [];
    this.entityGrid = [];
    for (let y = 0; y < this.size; y++) {
      this.baseGrid[y] = Array(this.size).fill(' ');
      this.entityGrid[y] = Array(this.size).fill(' ');
    }
  }

  /** Places walls around the border edges of the grid */
  private placeBorderWalls(): void {
    for (let i = 0; i < this.size; i++) {
      this.baseGrid[0][i] = '#';
      this.baseGrid[this.size - 1][i] = '#';
      this.baseGrid[i][0] = '#';
      this.baseGrid[i][this.size - 1] = '#';
    }
  }

  /** Places random inner walls (~15% of grid), avoiding critical corners */
  private placeInnerWalls(): void {
    const wallCount = Math.floor(this.size * this.size * 0.15);
    const innerPositions: [number, number][] = [];

    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        innerPositions.push([x, y]);
      }
    }

    this.shuffleArray(innerPositions);

    let wallsPlaced = 0;
    while (wallsPlaced < wallCount && innerPositions.length > 0) {
      const [x, y] = innerPositions.pop()!;

      // Avoid placing walls in corners that might block gameplay
      const isCriticalCorner =
        (x === 1 && y === 1) ||
        (x === this.size - 2 && y === 1) ||
        (x === 1 && y === this.size - 2) ||
        (x === this.size - 2 && y === this.size - 2);

      if (isCriticalCorner) continue;

      this.baseGrid[y][x] = '#';
      wallsPlaced++;
    }
  }

  /**
   * Identifies valid empty positions to place goals, boxes, and the player,
   * ensuring they have enough empty space around for movement.
   * Then randomly places these entities on the grid.
   */
  private placeGoalsBoxesAndPlayer(): void {
    const candidates: [number, number][] = [];

    // Find empty tiles surrounded by empty spaces suitable for gameplay
    for (let y = 2; y < this.size - 2; y++) {
      for (let x = 2; x < this.size - 2; x++) {
        if (this.baseGrid[y][x] !== ' ') continue;

        const up = this.baseGrid[y - 1][x];
        const down = this.baseGrid[y + 1][x];
        const left = this.baseGrid[y][x - 1];
        const right = this.baseGrid[y][x + 1];

        const canMoveVert = up === ' ' && down === ' ';
        const canMoveHorz = left === ' ' && right === ' ';

        if (canMoveVert || canMoveHorz) {
          candidates.push([x, y]);
        }
      }
    }

    this.shuffleArray(candidates);

    // Place goals on the base layer
    for (let i = 0; i < this.boxCount; i++) {
      const [gx, gy] = candidates.pop()!;
      this.baseGrid[gy][gx] = 'G';
    }

    // Place boxes on the entity layer
    for (let i = 0; i < this.boxCount; i++) {
      const [bx, by] = candidates.pop()!;
      this.entityGrid[by][bx] = 'B';
    }

    // Place the player on the entity layer
    const [px, py] = candidates.pop()!;
    this.entityGrid[py][px] = 'P';
    this.playerX = px;
    this.playerY = py;
  }

  /**
   * Shuffles an array in-place using Fisher-Yates algorithm.
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Handles keyboard arrow key events to move the player and push boxes.
   * Movement blocked by walls or grid boundaries.
   */
  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent): void {
    const directions: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };

    const dir = directions[event.key];
    if (!dir) return;

    const [dx, dy] = dir;
    const targetX = this.playerX + dx;
    const targetY = this.playerY + dy;

    const entityAtTarget = this.entityGrid[targetY]?.[targetX];
    const baseAtTarget = this.baseGrid[targetY]?.[targetX];

    // Prevent movement outside bounds or into walls
    if (!entityAtTarget || baseAtTarget === '#') return;

    // Handle pushing a box if present
    if (entityAtTarget === 'B' || entityAtTarget === '*') {
      const boxTargetX = targetX + dx;
      const boxTargetY = targetY + dy;
      const entityBeyondBox = this.entityGrid[boxTargetY]?.[boxTargetX];
      const baseBeyondBox = this.baseGrid[boxTargetY]?.[boxTargetX];

      // Block push if next tile is wall, occupied, or out of bounds
      if (!entityBeyondBox || baseBeyondBox === '#' || entityBeyondBox !== ' ')
        return;

      // Move the box forward and update its state (on goal or normal)
      this.entityGrid[boxTargetY][boxTargetX] =
        baseBeyondBox === 'G' ? '*' : 'B';
      this.entityGrid[targetY][targetX] = ' ';
    }

    // Move player to the target tile
    this.entityGrid[this.playerY][this.playerX] = ' ';
    this.entityGrid[targetY][targetX] = 'P';
    this.playerX = targetX;
    this.playerY = targetY;

    // Check if the player has won after this move
    if (this.checkWin()) {
      this.winMessage = '🎉 You Win!';
    }
  }

  /**
   * Returns the emoji representation for the tile at (x, y),
   * combining base and entity layers.
   */
  getTileDisplay(x: number, y: number): string {
    const base = this.baseGrid[y][x];
    const entity = this.entityGrid[y][x];

    switch (entity) {
      case 'P':
        return '🧍‍♂️';
      case 'B':
        return '📦';
      case '*':
        return '✅';
    }

    switch (base) {
      case 'G':
        return '🎯';
      case '#':
        return '🧱';
      default:
        return '⬜';
    }
  }

  /**
   * Checks if all goals ('G') are covered by boxes on goals ('*').
   * Returns true if player has won.
   */
  checkWin(): boolean {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.baseGrid[y][x] === 'G' && this.entityGrid[y][x] !== '*') {
          return false;
        }
      }
    }
    return true;
  }
}
