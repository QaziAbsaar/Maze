// src/components/Grid.tsx
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { NodeData } from '../types';

interface GridProps {
  grid: NodeData[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  registerRenderer?: (renderer: (nextGrid: NodeData[][]) => void) => void;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  registerRenderer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPointerDownRef = useRef(false);
  const lastCellRef = useRef<{ row: number; col: number } | null>(null);
  const cellSize = 16;

  const dimensions = useMemo(() => {
    const rows = grid.length;
    const cols = rows > 0 ? grid[0].length : 0;
    return {
      rows,
      cols,
      width: cols * cellSize,
      height: rows * cellSize,
    };
  }, [grid]);

  const getCellFromPointer = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row < 0 || col < 0 || row >= dimensions.rows || col >= dimensions.cols) {
      return null;
    }

    return { row, col };
  }, [cellSize, dimensions.cols, dimensions.rows]);

  const drawGrid = useCallback((nextGrid: NodeData[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < nextGrid.length; row++) {
      for (let col = 0; col < nextGrid[row].length; col++) {
        const node = nextGrid[row][col];
        if (node.isWall) {
          continue;
        }

        let fill = '#f8f9fa';
        if (node.isStart) {
          fill = '#22c55e';
        } else if (node.isEnd) {
          fill = '#dc2626';
        } else if (node.isPath) {
          fill = '#fcd34d';
        } else if (node.isVisited) {
          fill = '#bfdbfe';
        }

        ctx.fillStyle = fill;
        ctx.fillRect(col * cellSize + 0.5, row * cellSize + 0.5, cellSize - 1, cellSize - 1);
      }
    }
  }, [cellSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGrid(grid);
  }, [dimensions.height, dimensions.width, drawGrid, grid]);

  useEffect(() => {
    drawGrid(grid);
  }, [drawGrid, grid]);

  useEffect(() => {
    if (!registerRenderer) return;
    registerRenderer(drawGrid);
  }, [drawGrid, registerRenderer]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const cell = getCellFromPointer(event);
    if (!cell) return;
    isPointerDownRef.current = true;
    lastCellRef.current = cell;
    onMouseDown(cell.row, cell.col);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    const cell = getCellFromPointer(event);
    if (!cell) return;

    if (lastCellRef.current?.row === cell.row && lastCellRef.current?.col === cell.col) {
      return;
    }

    lastCellRef.current = cell;
    onMouseEnter(cell.row, cell.col);
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    lastCellRef.current = null;
    onMouseUp();
  };

  return (
    <div
      className="select-none bg-gradient-to-tr from-[#024bc0] via-[#8a2283] to-[#e41e26] p-1.5 rounded-md shadow-[0_0_40px_rgba(228,30,38,0.2)]"
      onPointerLeave={handlePointerUp}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="cursor-crosshair rounded-sm touch-none"
      />
    </div>
  );
};
