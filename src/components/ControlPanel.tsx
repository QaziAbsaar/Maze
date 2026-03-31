// src/components/ControlPanel.tsx
import React, { useState } from 'react';
import { Play, Pause, Trash2, ShieldAlert, Sparkles, SlidersHorizontal, Settings } from 'lucide-react';

interface ControlPanelProps {
  onPlay: () => void;
  onPause: () => void;
  onClearBoard: () => void;
  onClearWalls: () => void;
  onClearPath: () => void;
  onGenerateMaze: (algo: string) => void;
  onSelectAlgorithm: (algo: string) => void;
  onSelectMazeAlgorithm: (algo: string) => void;
  selectedAlgorithm: string;
  selectedMazeAlgorithm: string;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  isRunning: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onPlay,
  onPause,
  onClearBoard,
  onClearWalls,
  onClearPath,
  onGenerateMaze,
  onSelectAlgorithm,
  onSelectMazeAlgorithm,
  selectedAlgorithm,
  selectedMazeAlgorithm,
  animationSpeed,
  setAnimationSpeed,
  isRunning,
}) => {
  return (
    <div className="bg-slate-900 border-b border-cyan-900 shadow-md p-4 text-slate-200 sticky top-0 z-50 flex flex-wrap gap-4 items-center justify-between shadow-cyan-900/10 backdrop-blur-sm bg-opacity-70">
      
      {/* Title */}
      <h1 className="text-xl font-black text-cyan-400 font-mono tracking-tighter shadow-indigo-500/50">
        AI MAZER
      </h1>

      {/* Primary Actions */}
      <div className="flex gap-2">
        <button
          onClick={isRunning ? onPause : onPlay}
          className={`flex items-center gap-1 px-4 py-2 font-bold tracking-widest uppercase rounded bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-lg ${isRunning ? 'animate-pulse' : ''}`}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pause' : 'Visualize'}
        </button>

        <button
          onClick={() => onGenerateMaze(selectedMazeAlgorithm)}
          disabled={isRunning}
          className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-50"
        >
          <Sparkles size={16} />
          Generate Maze
        </button>
      </div>

      {/* Selectors */}
      <div className="flex gap-4">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-slate-500 font-bold mb-1">Pathfinding Algo</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => onSelectAlgorithm(e.target.value)}
            disabled={isRunning}
            className="bg-slate-800 border-slate-700 text-slate-200 rounded p-1.5 focus:border-cyan-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          >
            <option value="astar">A* Search</option>
            <option value="dijkstra">Dijkstra's</option>
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs uppercase text-slate-500 font-bold mb-1">Maze Generator</label>
          <select
            value={selectedMazeAlgorithm}
            onChange={(e) => onSelectMazeAlgorithm(e.target.value)}
            disabled={isRunning}
            className="bg-slate-800 border-slate-700 text-slate-200 rounded p-1.5 focus:border-cyan-500 text-sm disabled:opacity-50"
          >
            <option value="kruskal">Kruskal's Algorithm</option>
            <option value="dfs">Depth-First Search</option>
            <option value="prim">Prim's Algorithm</option>
            <option value="lerw">Loop-Erased Random Walk</option>
            <option value="recursive-division">Recursive Division</option>
            <option value="random">Random Scatter</option>
          </select>
        </div>
      </div>

      {/* Clear Controls */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={onClearPath}
          disabled={isRunning}
          className="flex items-center gap-1 px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-50"
        >
          <Trash2 size={14} /> Clear Path
        </button>
        <button
          onClick={onClearBoard}
          disabled={isRunning}
          className="flex items-center gap-1 px-2 py-1 rounded border border-rose-900 text-rose-400 hover:bg-rose-950 disabled:opacity-50"
        >
          <ShieldAlert size={14} /> Clear Board
        </button>
      </div>

    </div>
  );
};
