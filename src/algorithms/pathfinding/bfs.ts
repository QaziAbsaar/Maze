// src/algorithms/pathfinding/bfs.ts
import { NodeData } from '../../types';

export function bfs(grid: NodeData[][], startNode: NodeData, endNode: NodeData) {
  const visitedNodesInOrder: NodeData[] = [];
  const queue: NodeData[] = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (!currentNode) continue;

    if (currentNode !== startNode) {
      currentNode.isVisited = true;
    }
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node: NodeData, grid: NodeData[][]) {
  const neighbors: NodeData[] = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}
