// src/algorithms/maze/recursiveBacktracker.ts
import { NodeData } from '../../types';

export function recursiveBacktrackerMaze(grid: NodeData[][], startNode: NodeData, endNode: NodeData) {
  const wallsToAnimate: NodeData[] = [];
  
  // Fill all with walls first
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (!grid[row][col].isStart && !grid[row][col].isEnd) {
        wallsToAnimate.push(grid[row][col]);
        grid[row][col].isWall = true;
      }
    }
  }

  // Then carve paths using DFS (reverse the logic to return walls that ARE walls and skip paths)
  return wallsToAnimate;
}
