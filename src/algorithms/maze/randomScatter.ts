// src/algorithms/maze/randomScatter.ts
import { NodeData } from '../../types';

export function randomScatterMaze(grid: NodeData[][], startNode: NodeData, endNode: NodeData) {
  const wallsToAnimate: NodeData[] = [];
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (Math.random() < 0.25 && !grid[row][col].isStart && !grid[row][col].isEnd) {
        wallsToAnimate.push(grid[row][col]);
      }
    }
  }

  return wallsToAnimate;
}
