from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Tuple
from algorithms import (
    run_astar, run_bfs, run_dfs, run_dijkstra, run_recursive_division, run_random_scatter,
    initialize_maze_grid, generate_kruskal_maze, generate_dfs_maze, generate_prim_maze,
    generate_spanning_tree_maze
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NodeInput(BaseModel):
    row: int
    col: int
    isStart: bool
    isEnd: bool
    isWall: bool

class PathRequest(BaseModel):
    grid: List[List[NodeInput]]
    startNode: dict
    endNode: dict
    algorithm: str

class MazeRequest(BaseModel):
    grid: List[List[NodeInput]]
    startNode: dict
    endNode: dict
    algorithm: str

def convert_grid_to_dict(grid):
    """Convert Pydantic NodeInput grid to dictionary grid."""
    result = []
    for row in grid:
        dict_row = []
        for node in row:
            dict_row.append({
                'row': node.row,
                'col': node.col,
                'isStart': node.isStart,
                'isEnd': node.isEnd,
                'isWall': node.isWall,
                'isVisited': False,
                'isPath': False,
                'isFrontier': False,
                'distance': float('inf'),
                'previousNode': None,
                'weight': 1
            })
        result.append(dict_row)
    return result

@app.post("/find-path")
def find_path(req: PathRequest):
    # Convert Pydantic grid to dictionary grid for algorithm compatibility
    grid = convert_grid_to_dict(req.grid)
    start = (req.startNode['row'], req.startNode['col'])
    end = (req.endNode['row'], req.endNode['col'])
    
    if req.algorithm == "astar":
        visited, path = run_astar(grid, start, end)
    elif req.algorithm == "dijkstra":
        visited, path = run_dijkstra(grid, start, end)
    elif req.algorithm == "bfs":
        visited, path = run_bfs(grid, start, end)
    elif req.algorithm == "dfs":
        visited, path = run_dfs(grid, start, end)
    else:
        visited, path = [], []
        
    return {"visitedNodes": visited, "pathNodes": path}

@app.post("/generate-maze")
def generate_maze(req: MazeRequest):
    grid = req.grid
    start = (req.startNode['row'], req.startNode['col'])
    end = (req.endNode['row'], req.endNode['col'])
    
    ROWS = len(grid)
    COLS = len(grid[0])
    
    # Initialize fresh maze grid with 2N+1 structure
    maze_grid = initialize_maze_grid(ROWS, COLS, start, end)
    
    # Generate maze based on selected algorithm
    if req.algorithm == "kruskal":
        walls = generate_kruskal_maze(maze_grid, ROWS, COLS, start, end)
    elif req.algorithm == "dfs":
        walls = generate_dfs_maze(maze_grid, ROWS, COLS, start, end)
    elif req.algorithm == "prim":
        walls = generate_prim_maze(maze_grid, ROWS, COLS, start, end)
    elif req.algorithm == "lerw":
        # Use spanning tree for LERW algorithm
        walls = generate_spanning_tree_maze(maze_grid, start, end, "lerw")
    elif req.algorithm == "random":
        walls = run_random_scatter(maze_grid, start, end)
    else:  # recursive-division
        walls = run_recursive_division(maze_grid, start, end)
        
    return {"wallsToAnimate": walls}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
