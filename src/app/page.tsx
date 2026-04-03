// src/app/page.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { NodeData } from '@/types';
import { Grid } from '@/components/Grid';
import { ControlPanel } from '@/components/ControlPanel';
import { Dashboard } from '@/components/Dashboard';
import { generateDFSMaze } from '@/utils/mazeGenerator';
import { getSafeTargetCoordinates } from '@/utils/gridCoordinates';
import { astar, getNodesInShortestPathOrder } from '@/algorithms/pathfinding/astar';
import { dijkstra } from '@/algorithms/pathfinding/dijkstra';
import { bfs } from '@/algorithms/pathfinding/bfs';
import { dfs } from '@/algorithms/pathfinding/dfs';

const NUM_ROWS = 31;
const NUM_COLS = 61;

// Start is always at the top-left inner path
const START_NODE_ROW = 1;
const START_NODE_COL = 1;

// Target is at the bottom-right inner path (on odd coordinates) - calculated safely
const { r: END_NODE_ROW, c: END_NODE_COL } = getSafeTargetCoordinates(NUM_ROWS, NUM_COLS);

type NodeCoordinate = { row: number; col: number };

const createInitialGrid = (): NodeData[][] => {
  const initialGrid: NodeData[][] = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow: NodeData[] = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isEnd: row === END_NODE_ROW && col === END_NODE_COL,
        isWall: false,
        isVisited: false,
        isPath: false,
        isFrontier: false,
        distance: Infinity,
        previousNode: null,
        weight: 1,
      });
    }
    initialGrid.push(currentRow);
  }
  return initialGrid;
};

const cloneGridForState = (sourceGrid: NodeData[][]): NodeData[][] =>
  sourceGrid.map(row =>
    row.map(node => ({
      ...node,
      previousNode: null,
    }))
  );

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
  const gridRef = useRef<NodeData[][]>([]);
  const drawGridRef = useRef<((nextGrid: NodeData[][]) => void) | null>(null);
  const startNodeRef = useRef({ row: START_NODE_ROW, col: START_NODE_COL });
  const endNodeRef = useRef({ row: END_NODE_ROW, col: END_NODE_COL });

  const resetGrid = () => {
    const initialGrid = createInitialGrid();
    startNodeRef.current = { row: START_NODE_ROW, col: START_NODE_COL };
    endNodeRef.current = { row: END_NODE_ROW, col: END_NODE_COL };
    gridRef.current = initialGrid;
    setGrid(initialGrid);
    drawGridRef.current?.(initialGrid);
  };

  useEffect(() => {
    resetGrid();
  }, []);

  const clearPath = () => {
    if (isRunning) return;
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        const node = gridRef.current[r][c];
        node.isVisited = false;
        node.isPath = false;
        node.distance = Infinity;
        node.previousNode = null;
      }
    }
    drawGridRef.current?.(gridRef.current);
    setGrid(cloneGridForState(gridRef.current));
  };

  const runPathfindingLocally = (
    algorithm: string,
    startNode: NodeCoordinate,
    endNode: NodeCoordinate
  ) => {
    const simulationGrid = cloneGridForState(gridRef.current);

    const start = simulationGrid[startNode.row]?.[startNode.col];
    const end = simulationGrid[endNode.row]?.[endNode.col];

    if (!start || !end) {
      return { visitedNodesInOrder: [], pathNodes: [] };
    }

    let visitedNodesInOrder: NodeData[] = [];
    if (algorithm === 'astar') {
      visitedNodesInOrder = astar(simulationGrid, start, end);
    } else if (algorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(simulationGrid, start, end);
    } else if (algorithm === 'bfs') {
      visitedNodesInOrder = bfs(simulationGrid, start, end);
    } else {
      visitedNodesInOrder = dfs(simulationGrid, start, end);
    }

    const pathNodesInOrder =
      end.previousNode || (start.row === end.row && start.col === end.col)
        ? getNodesInShortestPathOrder(end)
        : [];

    return {
      visitedNodesInOrder: visitedNodesInOrder.map(node => ({ row: node.row, col: node.col })),
      pathNodes: pathNodesInOrder.map(node => ({ row: node.row, col: node.col })),
    };
  };

  const animateNodes = (
    nodes: NodeCoordinate[],
    updateNode: (node: NodeCoordinate) => void,
    nodesPerFrame: number
  ) =>
    new Promise<void>(resolve => {
      if (nodes.length === 0) {
        resolve();
        return;
      }

      let index = 0;

      const frame = () => {
        let processed = 0;
        while (index < nodes.length && processed < nodesPerFrame) {
          updateNode(nodes[index]);
          index += 1;
          processed += 1;
        }

        drawGridRef.current?.(gridRef.current);

        if (index < nodes.length) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(frame);
    });

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
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

    try {
      let visitedNodesInOrder: NodeCoordinate[] = [];
      let pathNodes: NodeCoordinate[] = [];

      if (apiBaseUrl) {
        const response = await fetch(`${apiBaseUrl}/find-path`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grid: gridRef.current.map(row => row.map(node => ({
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

        if (!response.ok) {
          throw new Error(`Path API request failed with status ${response.status}`);
        }

        const data = await response.json();
        visitedNodesInOrder = data.visitedNodes ?? [];
        pathNodes = data.pathNodes ?? [];
      } else {
        const localResult = runPathfindingLocally(selectedAlgo, startNode, endNode);
        visitedNodesInOrder = localResult.visitedNodesInOrder;
        pathNodes = localResult.pathNodes;
      }
      
      const execTime = Math.round(performance.now() - startTime);
      animateAlgorithm(visitedNodesInOrder, pathNodes, algoName, execTime);
    } catch (error) {
      console.warn('Path API unavailable; using local pathfinding fallback.', error);
      const localResult = runPathfindingLocally(selectedAlgo, startNode, endNode);
      const execTime = Math.round(performance.now() - startTime);
      animateAlgorithm(localResult.visitedNodesInOrder, localResult.pathNodes, algoName, execTime);
    }
  };

  const animateAlgorithm = (visitedNodes: {row: number, col: number}[], pathNodes: {row: number, col: number}[], algoName: string, execTime: number) => {
    const run = async () => {
      const visitedBatch = Math.max(4, Math.floor(44 - Math.min(speed, 40)));
      const pathBatch = Math.max(2, Math.floor(28 - Math.min(speed, 20)));

      await animateNodes(
        visitedNodes,
        node => {
          const current = gridRef.current[node.row]?.[node.col];
          if (!current) return;
          if (!current.isStart && !current.isEnd) {
            current.isVisited = true;
          }
        },
        visitedBatch
      );

      await animateShortestPath(pathNodes, algoName, execTime, visitedNodes.length, pathBatch);
    };

    void run();
  };

  const animateShortestPath = async (
    pathNodes: {row: number, col: number}[],
    algoName: string,
    execTime: number,
    nodesExplored: number,
    pathBatch: number
  ) => {
    await animateNodes(
      pathNodes,
      node => {
        const current = gridRef.current[node.row]?.[node.col];
        if (!current) return;
        if (!current.isStart && !current.isEnd) {
          current.isPath = true;
        }
      },
      pathBatch
    );

    setIsRunning(false);
    const newMetrics = {
      algorithmUsed: algoName,
      executionTimeMs: execTime,
      nodesExplored,
      pathLength: pathNodes.length,
    };
    setMetrics(newMetrics);
    setHistory(prev => [newMetrics, ...prev]);
    setGrid(cloneGridForState(gridRef.current));
  };

  const handleGenerateMaze = (_mazeAlgorithm?: string) => {
    if (isRunning) return;
    setIsRunning(true);

    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        const node = gridRef.current[r][c];
        node.isVisited = false;
        node.isPath = false;
        node.distance = Infinity;
        node.previousNode = null;
        node.isStart = false;
        node.isEnd = false;
        node.isWall = true;
      }
    }
    drawGridRef.current?.(gridRef.current);

    const { wallsToAnimate, startRow, startCol, targetRow, targetCol } = generateDFSMaze(
      gridRef.current,
      NUM_ROWS,
      NUM_COLS
    );

    // Pick target from actually carved nodes to guarantee it's on white (explorable) region
    // Use a node from the carved path that's well into the maze (not near start)
    let finalTargetRow = targetRow;
    let finalTargetCol = targetCol;
    
    if (wallsToAnimate.length > 0) {
      const targetIndex = Math.floor(wallsToAnimate.length * 0.7);
      const targetNode = wallsToAnimate[targetIndex];
      finalTargetRow = targetNode.row;
      finalTargetCol = targetNode.col;
    }

    // Update refs to new positions
    startNodeRef.current = { row: startRow, col: startCol };
    endNodeRef.current = { row: finalTargetRow, col: finalTargetCol };

    const finalizeMazeState = () => {
      gridRef.current[startRow][startCol].isStart = true;
      gridRef.current[startRow][startCol].isWall = false;
      gridRef.current[finalTargetRow][finalTargetCol].isEnd = true;
      gridRef.current[finalTargetRow][finalTargetCol].isWall = false;
      drawGridRef.current?.(gridRef.current);
      setGrid(cloneGridForState(gridRef.current));
      setIsRunning(false);
    };

    if (wallsToAnimate.length === 0) {
      finalizeMazeState();
      return;
    }

    let index = 0;
    const wallsPerFrame = Math.max(8, Math.floor(70 - Math.min(speed, 60)));

    const carveFrame = () => {
      let carved = 0;
      while (index < wallsToAnimate.length && carved < wallsPerFrame) {
        const node = wallsToAnimate[index];
        const current = gridRef.current[node.row]?.[node.col];
        if (current) {
          current.isWall = false;
        }
        index += 1;
        carved += 1;
      }

      drawGridRef.current?.(gridRef.current);

      if (index < wallsToAnimate.length) {
        requestAnimationFrame(carveFrame);
      } else {
        finalizeMazeState();
      }
    };

    requestAnimationFrame(carveFrame);
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
    const node = gridRef.current[row]?.[col];
    if (!node) return;
    node.isWall = !node.isWall;
    drawGridRef.current?.(gridRef.current);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || isRunning) return;
    // Prevent wall placement on Start/End nodes or outer boundary
    if ((row === startNodeRef.current.row && col === startNodeRef.current.col) ||
        (row === endNodeRef.current.row && col === endNodeRef.current.col) ||
        row === 0 || col === 0 || row === NUM_ROWS - 1 || col === NUM_COLS - 1) {
      return;
    }
    const node = gridRef.current[row]?.[col];
    if (!node) return;
    node.isWall = !node.isWall;
    drawGridRef.current?.(gridRef.current);
  };

  const handleMouseUp = () => {
    if (isRunning) return;
    setIsMousePressed(false);
    setGrid(cloneGridForState(gridRef.current));
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
              registerRenderer={(renderer) => {
                drawGridRef.current = renderer;
                renderer(gridRef.current);
              }}
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
