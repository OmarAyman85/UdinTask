import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { doc, Firestore, increment, updateDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

/**
 * BaseTile defines the static structure of each grid cell.
 * - ' ' : Empty space
 * - '#' : Wall
 * - 'G' : Goal position
 */
type BaseTile = ' ' | '#' | 'G';

/**
 * EntityTile defines the dynamic entities that move or change over time.
 * - ' ' : Empty
 * - 'P' : Player
 * - 'B' : Box
 * - '*' : Box on a Goal
 */
type EntityTile = ' ' | 'P' | 'B' | '*';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // 2D arrays representing the game board layers
  baseGrid: BaseTile[][] = []; // static layer (walls, goals)
  entityGrid: EntityTile[][] = []; // dynamic layer (player, boxes)

  size = 10; // Grid size (10x10)
  boxCount = 3; // Number of boxes and goals
  playerX = 0; // Player's X-coordinate
  playerY = 0; // Player's Y-coordinate
  winMessage: string = ''; // Message to display upon winning

  ngOnInit(): void {
    this.resetLevel(); // Initialize the game when component loads
  }

  /**
   * Resets the game by generating a new board:
   * - Clears the grids
   * - Creates walls (borders + random inner)
   * - Randomly places goals, boxes, and player
   */
  resetLevel(): void {
    this.winMessage = '';
    this.baseGrid = [];
    this.entityGrid = [];

    // Initialize both layers as empty
    for (let y = 0; y < this.size; y++) {
      const baseRow: BaseTile[] = [];
      const entityRow: EntityTile[] = [];

      for (let x = 0; x < this.size; x++) {
        baseRow.push(' ');
        entityRow.push(' ');
      }

      this.baseGrid.push(baseRow);
      this.entityGrid.push(entityRow);
    }

    // Create border walls around the edges
    for (let i = 0; i < this.size; i++) {
      this.baseGrid[0][i] = '#';
      this.baseGrid[this.size - 1][i] = '#';
      this.baseGrid[i][0] = '#';
      this.baseGrid[i][this.size - 1] = '#';
    }

    // Add randomly placed inner walls (approx. 15% of the grid)
    const wallCount = Math.floor(this.size * this.size * 0.15);
    const allInnerPositions: [number, number][] = [];

    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        allInnerPositions.push([x, y]);
      }
    }

    const shuffle = <T>(arr: T[]) => arr.sort(() => Math.random() - 0.5);
    const shuffled = shuffle(allInnerPositions);

    let wallsPlaced = 0;
    while (wallsPlaced < wallCount && shuffled.length) {
      const [x, y] = shuffled.pop()!;
      // Avoid placing walls in critical corners
      if (
        (x === 1 && y === 1) ||
        (x === this.size - 2 && y === 1) ||
        (x === 1 && y === this.size - 2) ||
        (x === this.size - 2 && y === this.size - 2)
      )
        continue;

      this.baseGrid[y][x] = '#';
      wallsPlaced++;
    }

    // Identify safe positions for placing goals, boxes, and player
    const candidates: [number, number][] = [];
    for (let y = 2; y < this.size - 2; y++) {
      for (let x = 2; x < this.size - 2; x++) {
        if (this.baseGrid[y][x] !== ' ') continue;

        const up = this.baseGrid[y - 1][x];
        const down = this.baseGrid[y + 1][x];
        const left = this.baseGrid[y][x - 1];
        const right = this.baseGrid[y][x + 1];

        const canMoveVert = up === ' ' && down === ' ';
        const canMoveHorz = left === ' ' && right === ' ';

        // Only include positions that can allow horizontal or vertical pushes
        if (canMoveVert || canMoveHorz) {
          candidates.push([x, y]);
        }
      }
    }

    const shuffledCandidates = shuffle([...candidates]);

    // Randomly place goals on baseGrid
    for (let i = 0; i < this.boxCount; i++) {
      const [gx, gy] = shuffledCandidates.pop()!;
      this.baseGrid[gy][gx] = 'G';
    }

    // Randomly place boxes on entityGrid
    for (let i = 0; i < this.boxCount; i++) {
      const [bx, by] = shuffledCandidates.pop()!;
      this.entityGrid[by][bx] = 'B';
    }

    // Randomly place the player
    const [px, py] = shuffledCandidates.pop()!;
    this.entityGrid[py][px] = 'P';
    this.playerX = px;
    this.playerY = py;
  }

  /**
   * Handles keyboard input for moving the player and pushing boxes.
   * Arrow keys are used to control movement.
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
    const x1 = this.playerX + dx;
    const y1 = this.playerY + dy;

    const entity1 = this.entityGrid[y1]?.[x1];
    const base1 = this.baseGrid[y1]?.[x1];

    // Block movement if outside bounds or hitting a wall
    if (!entity1 || base1 === '#') return;

    // Handle box push
    if (entity1 === 'B' || entity1 === '*') {
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      const entity2 = this.entityGrid[y2]?.[x2];
      const base2 = this.baseGrid[y2]?.[x2];

      // Check that box can be pushed into an empty or goal tile
      if (!entity2 || base2 === '#' || entity2 !== ' ') return;

      // Push box forward
      this.entityGrid[y2][x2] = this.baseGrid[y2][x2] === 'G' ? '*' : 'B';
      this.entityGrid[y1][x1] = ' ';
    }

    // Move player into target tile
    this.entityGrid[this.playerY][this.playerX] = ' ';
    this.entityGrid[y1][x1] = 'P';
    this.playerX = x1;
    this.playerY = y1;

    // Check win condition after each move
    if (this.checkWin()) {
      this.winMessage = '🎉 You Win!';
      this.incrementUserScore();
    }
  }

  /**
   * Returns the emoji representation of the tile at a given coordinate.
   * Combines both base and entity layers.
   */
  getTileDisplay(x: number, y: number): string {
    const base = this.baseGrid[y][x];
    const entity = this.entityGrid[y][x];

    if (entity === 'P') return '🧍‍♂️';
    if (entity === 'B') return '📦';
    if (entity === '*') return '✅';
    if (base === 'G') return '🎯';
    if (base === '#') return '🧱';
    return '⬜';
  }

  /**
   * Win condition is met when all goals are occupied by boxes ('*').
   */
  checkWin(): boolean {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.baseGrid[y][x] === 'G' && this.entityGrid[y][x] !== '*') {
          return false; // at least one goal not covered
        }
      }
    }
    return true; // all goals have boxes
  }

  async incrementUserScore() {
    const user = this.auth.currentUser;
    if (!user) {
      console.warn('No authenticated user found.');
      return;
    }

    const userDocRef = doc(this.firestore, `users/${user.uid}`);

    try {
      await updateDoc(userDocRef, {
        score: increment(1),
      });
    } catch (error) {
      console.error('Failed to increment score:', error);
    }
  }
}
