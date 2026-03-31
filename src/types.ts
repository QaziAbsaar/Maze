// src/types.ts
export type NodeType = 'start' | 'end' | 'wall' | 'empty' | 'visited' | 'path' | 'frontier';

export interface NodeData {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  isFrontier: boolean;
  distance: number;
  previousNode: NodeData | null;
  weight: number; 
}

export type Point = { row: number; col: number };
