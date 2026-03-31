// src/algorithms/pathfinding/astar.ts
import { NodeData } from '../../types';

export function astar(grid: NodeData[][], startNode: NodeData, endNode: NodeData) {
  const visitedNodesInOrder: NodeData[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => {
      const aTotal = a.distance + heuristic(a, endNode);
      const bTotal = b.distance + heuristic(b, endNode);
      if (aTotal === bTotal) return a.distance - b.distance;
      return aTotal - bTotal;
    });

    const closestNode = unvisitedNodes.shift();
    if (!closestNode) continue;
    
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === endNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node: NodeData, grid: NodeData[][]) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1; // Assuming weight is always 1 for now
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node: NodeData, grid: NodeData[][]) {
  const neighbors: NodeData[] = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
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

function heuristic(nodeA: NodeData, nodeB: NodeData) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col); // Manhattan
}

export function getNodesInShortestPathOrder(finishNode: NodeData) {
  const nodesInShortestPathOrder = [];
  let currentNode: NodeData | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
