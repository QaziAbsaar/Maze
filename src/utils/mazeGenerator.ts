import { NodeData } from '@/types';
import { getSafeTargetCoordinates } from './gridCoordinates';

export function generateDFSMaze(grid: NodeData[][], rows: number, cols: number) {
  const wallsToAnimate: NodeData[] = [];

  // Step 1: Make everything a wall first
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c].isWall = true;
      grid[r][c].isStart = false;
      grid[r][c].isEnd = false;
    }
  }

  // Step 2: Ensure start and end points are always on odd coordinates
  const startRow = 1;
  const startCol = 1;
  // Use the utility function to guarantee safe target coordinates
  const { r: targetRow, c: targetCol } = getSafeTargetCoordinates(rows, cols);

  // Set Start and Target nodes
  grid[startRow][startCol].isStart = true;
  grid[startRow][startCol].isWall = false;
  grid[targetRow][targetCol].isEnd = true;
  grid[targetRow][targetCol].isWall = false;

  // Directions: [row_move, col_move] - jumping by 2 to move node-to-node
  const directions = [
    [-2, 0], // Up
    [2, 0],  // Down
    [0, -2], // Left
    [0, 2]   // Right
  ];

  // Helper to shuffle directions (for random maze paths)
  const shuffle = (array: number[][]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Step 3: DFS Carving
  const carvePath = (r: number, c: number) => {
    grid[r][c].isWall = false;
    wallsToAnimate.push(grid[r][c]); // Animate removing this wall

    let shuffledDirs = [...directions];
    shuffle(shuffledDirs);

    for (let [dr, dc] of shuffledDirs) {
      const nextR = r + dr;
      const nextC = c + dc;

      // Check if next node is within bounds and is still a wall (unvisited)
      if (
        nextR > 0 &&
        nextR < rows - 1 &&
        nextC > 0 &&
        nextC < cols - 1 &&
        grid[nextR][nextC].isWall
      ) {
        // Carve the edge (the cell between current and next)
        const edgeR = r + dr / 2;
        const edgeC = c + dc / 2;
        grid[edgeR][edgeC].isWall = false;
        wallsToAnimate.push(grid[edgeR][edgeC]);

        // Recursively carve the next node
        carvePath(nextR, nextC);
      }
    }
  };

  // Start carving from the start node
  carvePath(startRow, startCol);

  // Return both the grid and the animation sequence
  return {
    wallsToAnimate,
    startRow,
    startCol,
    targetRow,
    targetCol,
  };
}
