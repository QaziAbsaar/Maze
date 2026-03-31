// src/algorithms/maze/recursiveDivision.ts
import { NodeData } from '../../types';

export function recursiveDivisionMaze(grid: NodeData[][], startNode: NodeData, endNode: NodeData) {
  const wallsToAnimate: NodeData[] = [];
  
  // Set boundary walls first
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (row === 0 || row === grid.length - 1 || col === 0 || col === grid[0].length - 1) {
        if (!grid[row][col].isStart && !grid[row][col].isEnd) {
          wallsToAnimate.push(grid[row][col]);
        }
      }
    }
  }

  divide(grid, 1, grid.length - 2, 1, grid[0].length - 2, chooseOrientation(grid[0].length - 2, grid.length - 2), wallsToAnimate);

  return wallsToAnimate;
}

function divide(grid: NodeData[][], rStart: number, rEnd: number, cStart: number, cEnd: number, orientation: 'horizontal' | 'vertical', wallsToAnimate: NodeData[]) {
  if (rEnd < rStart || cEnd < cStart) return;

  const horizontal = orientation === 'horizontal';

  let rNode = rStart;
  let cNode = cStart;
  if (horizontal) {
    if (rStart === rEnd) rNode = rStart;
    else rNode = rStart + Math.floor(Math.random() * (rEnd - rStart) / 2) * 2;
  } else {
    if (cStart === cEnd) cNode = cStart;
    else cNode = cStart + Math.floor(Math.random() * (cEnd - cStart) / 2) * 2;
  }

  const rPassage = rStart + (horizontal ? 0 : Math.floor(Math.random() * (rEnd - rStart + 1) / 2) * 2 + 1);
  const cPassage = cStart + (horizontal ? Math.floor(Math.random() * (cEnd - cStart + 1) / 2) * 2 + 1 : 0);

  const length = horizontal ? cEnd - cStart + 1 : rEnd - rStart + 1;
  const dirR = horizontal ? 0 : 1;
  const dirC = horizontal ? 1 : 0;

  for (let i = 0; i < length; i++) {
    const r = rNode + (i * dirR);
    const c = cNode + (i * dirC);
    
    if (grid[r] && grid[r][c] && (r !== rPassage || c !== cPassage)) {
      if (!grid[r][c].isStart && !grid[r][c].isEnd) {
        wallsToAnimate.push(grid[r][c]);
      }
    }
  }

  if (horizontal) {
    divide(grid, rStart, rNode - 1, cStart, cEnd, chooseOrientation(cEnd - cStart + 1, rNode - rStart), wallsToAnimate);
    divide(grid, rNode + 1, rEnd, cStart, cEnd, chooseOrientation(cEnd - cStart + 1, rEnd - rNode), wallsToAnimate);
  } else {
    divide(grid, rStart, rEnd, cStart, cNode - 1, chooseOrientation(cNode - cStart, rEnd - rStart + 1), wallsToAnimate);
    divide(grid, rStart, rEnd, cNode + 1, cEnd, chooseOrientation(cEnd - cNode, rEnd - rStart + 1), wallsToAnimate);
  }
}

function chooseOrientation(width: number, height: number): 'horizontal' | 'vertical' {
  if (width < height) return 'horizontal';
  if (height < width) return 'vertical';
  return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}
