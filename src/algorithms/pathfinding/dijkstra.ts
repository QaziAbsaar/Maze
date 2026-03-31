// src/algorithms/pathfinding/dijkstra.ts
import { NodeData } from '../../types';

export function dijkstra(grid: NodeData[][], startNode: NodeData, endNode: NodeData) {
  const visitedNodesInOrder: NodeData[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();
    
    if (!closestNode) continue;
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(closestNode, grid);
    for (const neighbor of neighbors) {
      neighbor.distance = closestNode.distance + 1;
      neighbor.previousNode = closestNode;
    }
  }

  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node: NodeData, grid: NodeData[][]) {
  const neighbors: NodeData[] = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid: NodeData[][]) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
