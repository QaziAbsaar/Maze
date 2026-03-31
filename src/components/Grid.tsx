// src/components/Grid.tsx
import React from 'react';
import { NodeData } from '../types';

interface GridProps {
  grid: NodeData[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const Grid: React.FC<GridProps> = ({ grid, onMouseDown, onMouseEnter, onMouseUp }) => {
  const getCellStyle = (node: NodeData) => {
    let bgColor = '#f8f9fa'; // Default: white path
    let boxShadow = 'none';

    if (node.isWall) {
      bgColor = 'transparent'; // Gradient shines through
    } else if (node.isStart) {
      bgColor = '#22c55e'; // Green start
      boxShadow = '0 0 8px rgba(34, 197, 94, 0.6)';
    } else if (node.isEnd) {
      bgColor = '#dc2626'; // Red end
      boxShadow = '0 0 8px rgba(220, 38, 38, 0.6)';
    } else if (node.isPath) {
      bgColor = '#fcd34d'; // Yellow path
    } else if (node.isVisited) {
      bgColor = '#bfdbfe'; // Light blue visited
    }

    return { backgroundColor: bgColor, boxShadow };
  };

  return (
    <div 
      className="flex flex-col items-center select-none bg-gradient-to-tr from-[#024bc0] via-[#8a2283] to-[#e41e26] p-1.5 rounded-md shadow-[0_0_40px_rgba(228,30,38,0.2)]" 
      onMouseLeave={onMouseUp}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row">
          {row.map((node) => {
            const { row: nodeRow, col: nodeCol } = node;
            const cellStyle = getCellStyle(node);

            return (
              <div
                key={`${nodeRow}-${nodeCol}`}
                onMouseDown={() => onMouseDown(nodeRow, nodeCol)}
                onMouseEnter={() => onMouseEnter(nodeRow, nodeCol)}
                onMouseUp={() => onMouseUp()}
                style={cellStyle}
                className="w-4 h-4 cursor-pointer rounded-sm border border-slate-700 border-opacity-20 transition-colors duration-100"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
