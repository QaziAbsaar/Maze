// src/app/page.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { NodeData } from '@/types';
import { Grid } from '@/components/Grid';
import { ControlPanel } from '@/components/ControlPanel';
import { Dashboard } from '@/components/Dashboard';
import { generateDFSMaze } from '@/utils/mazeGenerator';
import { getSafeTargetCoordinates } from '@/utils/gridCoordinates';

const NUM_ROWS = 31;
const NUM_COLS = 61;

// Start is always at the top-left inner path
const START_NODE_ROW = 1;
const START_NODE_COL = 1;

// Target is at the bottom-right inner path (on odd coordinates) - calculated safely
const { r: END_NODE_ROW, c: END_NODE_COL } = getSafeTargetCoordinates(NUM_ROWS, NUM_COLS);

export default function Home() {
  const [grid, setGrid] = useState<NodeData[][]>([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  
  const [selectedAlgo, setSelectedAlgo] = useState('astar');
  const [selectedMaze, setSelectedMaze] = useState('kruskal');
  const [speed, setSpeed] = useState(20);
  
  const [metrics, setMetrics] = useState({
    algorithmUsed: '',
    executionTimeMs: 0,
    nodesExplored: 0,
    pathLength: 0,
  });
  const [history, setHistory] = useState<any[]>([]);
  const startNodeRef = useRef({ row: START_NODE_ROW, col: START_NODE_COL });
  const endNodeRef = useRef({ row: END_NODE_ROW, col: END_NODE_COL });

  const resetGrid = () => {
    // Ensure refs are set to valid inner path coordinates
    startNodeRef.current = { row: START_NODE_ROW, col: START_NODE_COL };
    endNodeRef.current = { row: END_NODE_ROW, col: END_NODE_COL };
    
    const initialGrid = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < NUM_COLS; col++) {
        currentRow.push({
          row, col, 
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isEnd: row === END_NODE_ROW && col === END_NODE_COL,
          isWall: false, isVisited: false, isPath: false,
          isFrontier: false,
          distance: Infinity, previousNode: null, weight: 1
        });
      }
      initialGrid.push(currentRow);
    }
    setGrid(initialGrid);
  };

  useEffect(() => {
    resetGrid();
  }, []);

  const clearPath = () => {
    if (isRunning) return;
    const newGrid = grid.map(row => 
      row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null }))
    );
    setGrid(newGrid);
  };

  const handleRunAlgorithm = async () => {
    if (isRunning) return;
    clearPath();
    setIsRunning(true);
    const startNode = startNodeRef.current;
    const endNode = endNodeRef.current;
    
    let algoName = '';
    if (selectedAlgo === 'astar') algoName = 'A* Search';
    else if (selectedAlgo === 'dijkstra') algoName = "Dijkstra's Algo";
    else if (selectedAlgo === 'bfs') algoName = 'Breadth First Search';
    else if (selectedAlgo === 'dfs') algoName = 'Depth First Search';

    const startTime = performance.now();

    try {
      const response = await fetch('http://localhost:8000/find-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grid: grid.map(row => row.map(node => ({
            row: node.row,
            col: node.col,
            isStart: node.isStart,
            isEnd: node.isEnd,
            isWall: node.isWall
          }))),
          startNode,
          endNode,
          algorithm: selectedAlgo
        })
      });

      const data = await response.json();
      const visitedNodesInOrder = data.visitedNodes;
      const pathNodes = data.pathNodes;
      
      const execTime = Math.round(performance.now() - startTime);
      animateAlgorithm(visitedNodesInOrder, pathNodes, algoName, execTime);
    } catch (error) {
      console.error('API Error:', error);
      setIsRunning(false);
    }
  };

  const animateAlgorithm = (visitedNodes: {row: number, col: number}[], pathNodes: {row: number, col: number}[], algoName: string, execTime: number) => {
    if (visitedNodes.length === 0) {
      setIsRunning(false);
      return;
    }

    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          animateShortestPath(pathNodes, algoName, execTime, visitedNodes.length);
        }, 15 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        if (!node || !grid[node.row] || !grid[node.row][node.col]) return;
        
        if (!grid[node.row][node.col].isStart && !grid[node.row][node.col].isEnd) {
          setGrid(prev => {
            const newGrid = [...prev];
            if (newGrid[node.row] && newGrid[node.row][node.col]) {
              newGrid[node.row][node.col].isVisited = true;
            }
            return newGrid;
          });
        }
      }, 15 * i); // 15ms per cell for smooth pathfinding animation
    }
  };

  const animateShortestPath = (pathNodes: {row: number, col: number}[], algoName: string, execTime: number, nodesExplored: number) => {
    for (let i = 0; i < pathNodes.length; i++) {
        setTimeout(() => {
          const node = pathNodes[i];
          if (!node || !grid[node.row] || !grid[node.row][node.col]) return;
          
          if (!grid[node.row][node.col].isStart && !grid[node.row][node.col].isEnd) {
             setGrid(prev => {
               const newGrid = [...prev];
               if (newGrid[node.row] && newGrid[node.row][node.col]) {
                  newGrid[node.row][node.col].isPath = true;
               }
               return newGrid;
             });
          }
          if (i === pathNodes.length - 1) {
            setIsRunning(false);
            const newMetrics = { algorithmUsed: algoName, executionTimeMs: execTime, nodesExplored, pathLength: pathNodes.length };
            setMetrics(newMetrics);
            setHistory(prev => [newMetrics, ...prev]);
          }
        }, 20 * i); // 20ms per path cell for smooth reveal
    }
    if (pathNodes.length === 0) {
      setIsRunning(false);
      const newMetrics = { algorithmUsed: algoName, executionTimeMs: execTime, nodesExplored, pathLength: 0 };
      setMetrics(newMetrics);
      setHistory(prev => [newMetrics, ...prev]);
    }
  };

  const handleGenerateMaze = () => {
    if (isRunning) return;
    setIsRunning(true);

    // Create a fresh grid copy for maze generation
    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    
    // Clear any existing visited/path nodes from previous runs
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        newGrid[r][c].isVisited = false;
        newGrid[r][c].isPath = false;
        newGrid[r][c].distance = Infinity;
        newGrid[r][c].previousNode = null;
      }
    }

    // Generate maze using DFS (Recursive Backtracker)
    const { wallsToAnimate, startRow, startCol, targetRow, targetCol } = generateDFSMaze(
      newGrid,
      NUM_ROWS,
      NUM_COLS
    );

    // Pick target from actually carved nodes to guarantee it's on white (explorable) region
    // Use a node from the carved path that's well into the maze (not near start)
    let finalTargetRow = targetRow;
    let finalTargetCol = targetCol;
    
    if (wallsToAnimate.length > 0) {
      // Pick a carved node that's at least 2/3 into the animation (deep in the maze)
      const targetIndex = Math.floor(wallsToAnimate.length * 0.7);
      const targetNode = wallsToAnimate[targetIndex];
      finalTargetRow = targetNode.row;
      finalTargetCol = targetNode.col;
    }

    // Update refs to new positions
    startNodeRef.current = { row: startRow, col: startCol };
    endNodeRef.current = { row: finalTargetRow, col: finalTargetCol };

    // Clear all previous start/end markers
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        newGrid[r][c].isStart = false;
        newGrid[r][c].isEnd = false;
      }
    }

    // Set the new guaranteed safe start node
    newGrid[startRow][startCol].isStart = true;
    newGrid[startRow][startCol].isWall = false;

    // Set the target to a node that was definitely carved
    newGrid[finalTargetRow][finalTargetCol].isEnd = true;
    newGrid[finalTargetRow][finalTargetCol].isWall = false;

    // First, set the grid to all-walls state so the animation is visible
    const wallsGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: true,
        isVisited: false,
        isPath: false,
        isStart: node.row === startRow && node.col === startCol,
        isEnd: node.row === finalTargetRow && node.col === finalTargetCol,
      }))
    );
    setGrid(wallsGrid);

    // Animate the wall removal (carving) process - optimized for performance
    for (let i = 0; i < wallsToAnimate.length; i++) {
      setTimeout(() => {
        setGrid(prev => {
          const updatedGrid = prev.map(row => [...row]);
          const node = wallsToAnimate[i];
          
          if (updatedGrid[node.row] && updatedGrid[node.row][node.col]) {
            updatedGrid[node.row][node.col].isWall = false;
          }
          
          return updatedGrid;
        });

        // When animation is complete, finalize the grid state
        if (i === wallsToAnimate.length - 1) {
          setTimeout(() => {
            // Ensure start and end are properly marked
            setGrid(prev => {
              const finalGrid = prev.map(row => [...row]);
              finalGrid[startRow][startCol].isStart = true;
              finalGrid[startRow][startCol].isWall = false;
              finalGrid[finalTargetRow][finalTargetCol].isEnd = true;
              finalGrid[finalTargetRow][finalTargetCol].isWall = false;
              return finalGrid;
            });
            setIsRunning(false);
          }, 30);
        }
      }, 5 * i); // Further optimized: 5ms per cell for smooth 60fps animation
    }

    if (wallsToAnimate.length === 0) {
      setIsRunning(false);
    }
  };


  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    // Prevent wall placement on Start/End nodes or outer boundary
    if ((row === startNodeRef.current.row && col === startNodeRef.current.col) ||
        (row === endNodeRef.current.row && col === endNodeRef.current.col) ||
        row === 0 || col === 0 || row === NUM_ROWS - 1 || col === NUM_COLS - 1) {
      return;
    }
    setIsMousePressed(true);
    // toggle wall
    grid[row][col].isWall = !grid[row][col].isWall;
    setGrid([...grid]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isRunning) return;
    // Prevent wall placement on Start/End nodes or outer boundary
    if ((row === startNodeRef.current.row && col === startNodeRef.current.col) ||
        (row === endNodeRef.current.row && col === endNodeRef.current.col) ||
        row === 0 || col === 0 || row === NUM_ROWS - 1 || col === NUM_COLS - 1) {
      return;
    }
    grid[row][col].isWall = !grid[row][col].isWall;
    setGrid([...grid]);
  };

  const handleMouseUp = () => {
    if (isRunning) return;
    setIsMousePressed(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <ControlPanel 
        onPlay={handleRunAlgorithm}
        onPause={() => {}}
        onClearBoard={resetGrid}
        onClearWalls={resetGrid}
        onClearPath={clearPath}
        onGenerateMaze={handleGenerateMaze}
        onSelectAlgorithm={setSelectedAlgo}
        onSelectMazeAlgorithm={setSelectedMaze}
        selectedAlgorithm={selectedAlgo}
        selectedMazeAlgorithm={selectedMaze}
        animationSpeed={speed}
        setAnimationSpeed={setSpeed}
        isRunning={isRunning}
      />
      <main className="flex-1 flex gap-4 p-4 overflow-hidden flex-col">
        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="flex-1 flex justify-center items-center bg-zinc-900 border border-slate-700 shadow-2xl rounded-2xl p-4 overflow-auto relative">
            <Grid
              grid={grid}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          </div>
          <aside className="w-96 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <h3 className="font-bold text-slate-100 mb-2">Legend</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Start Node</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 bg-red-600 rounded"></div> Target Node</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 bg-gradient-to-tr from-[#024bc0] to-[#e41e26] border border-slate-500"></div> Wall</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 bg-[#f8f9fa] border border-slate-500"></div> Walkable Path</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 border border-blue-200"></div> Explored Area</li>
                <li className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-300"></div> Shortest Path</li>
              </ul>
            </div>
          </aside>
        </div>
        <div className="bg-zinc-900 border border-slate-700 rounded-2xl overflow-auto">
          <Dashboard metrics={metrics} history={history} />
        </div>
      </main>
    </div>
  );
}
