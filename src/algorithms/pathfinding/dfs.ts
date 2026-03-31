// src/algorithms/pathfinding/dfs.ts
import { NodeData } from '../../types';

export function dfs(grid: NodeData[][], startNode: NodeData, endNode: NodeData) {
  const visitedNodesInOrder: NodeData[] = [];
  const stack: NodeData[] = [];
  stack.push(startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (!currentNode || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      neighbor.previousNode = currentNode;
      stack.push(neighbor);
    }
  }

  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node: NodeData, grid: NodeData[][]) {
  const neighbors: NodeData[] = [];
  const { col, row } = node;
  // Push in reverse order for up-right-down-left typical DFS visit
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}
