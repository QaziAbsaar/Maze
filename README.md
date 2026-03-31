# Maze Solver 🧩

A full-stack interactive maze generator and pathfinding visualization application with real-time performance metrics and algorithm comparison.

## Features

- **Maze Generation**: Generate perfect mazes using DFS (Recursive Backtracker) algorithm with smooth animations
- **Pathfinding Algorithms**: 
  - A* Search (heuristic-based, optimal)
  - Dijkstra's Algorithm (guaranteed shortest path)
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
- **Interactive Grid**: Draw walls manually, drag Start/Target nodes (with constraints to prevent invalid placement)
- **Performance Benchmarking**: Real-time graphs showing:
  - Execution time comparison between algorithms
  - Nodes explored analysis
  - Efficiency scatter plots
  - Performance trends across multiple runs
  - Complete run history table
- **Smooth Animations**: GPU-accelerated CSS transitions for maze carving and pathfinding visualization
- **Optimized Performance**: 60fps animations without lag

## Screenshots & Demo

### Initial Grid State
The application starts with an empty 31×61 grid. The green node at (1,1) marks the start position, and the grid is ready for maze generation or manual wall drawing.

### Maze Generation Animation (DFS Recursive Backtracker)

The maze generation uses a DFS algorithm that carves paths through the grid step by step. Here's what happens during the animation:

**Step 1: Initial State**
```
All cells are walls (black)
Start node fixed at top-left (1,1) - green
```

**Step 2: Carving Process** 
DFS algorithm removes walls progressively, creating a path through the maze:
- White cells = Carved paths (explorable)
- Black cells = Walls
- Animation timing: 5ms per cell for smooth 60fps playback

**Step 3: Completed Maze**
```
Perfect maze generated with guaranteed start-to-target path
Red Target node placed at 70% depth in the carved path
Green Start node at (1,1)
White paths connecting all cells
Black walls forming the maze structure
```

### Pathfinding Visualization

Once a maze is generated, you can run pathfinding algorithms:

**Blue Frontier** - The algorithm exploring the maze:
- Blue cells show nodes being examined
- Expands outward from the start node
- Different patterns for each algorithm (A* is focused, DFS is deep)

**Yellow Solution Path** - The shortest route found:
- Yellow cells show the optimal path from start to target
- Appears after exploration completes
- Visible in real-time as the algorithm solves

### Performance Dashboard

The dashboard displays real-time metrics:

**Current Metrics Box:**
- Algorithm name
- Execution time in milliseconds
- Total nodes explored
- Solution path length

**Performance Graphs:**
1. **Execution Time Chart** - Bar graph comparing algorithm speeds
2. **Nodes Explored Chart** - How many cells each algorithm had to examine
3. **Efficiency Scatter Plot** - Trade-off visualization (time vs exploration)
4. **Performance Trends** - Line chart showing last 10 runs
5. **Run History Table** - Complete log of all executions

## Installation

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/QaziAbsaar/Maze.git
   cd Maze
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up Python backend**
   ```bash
   cd python-server
   python -m venv .venv
   
   # On Windows
   .venv\Scripts\activate
   
   # On macOS/Linux
   source .venv/bin/activate
   
   pip install fastapi uvicorn pydantic
   ```

## Running the Application

### Terminal 1: Start the Frontend
```bash
npm run dev
```
Access the app at **http://localhost:3001**

### Terminal 2: Start the Python Backend
```bash
cd python-server
python -m venv .venv

# Activate virtual environment
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

uvicorn main:app --reload
```
Backend runs on **http://localhost:8000**

## Usage Guide

### 1. **Generate a Maze**
   - Click "Generate Maze" button
   - Watch the DFS algorithm carve paths through the grid
   - See the green Start node at (1,1) and red Target node appear in explorable area
   - Animation shows all wall removal steps (5ms per cell)

### 2. **Run Pathfinding Algorithm**
   - Select an algorithm from dropdown (A*, Dijkstra, BFS, DFS)
   - Click "Run Algorithm"
   - Watch the blue frontier expand as it explores
   - Yellow path highlights the shortest route found
   - Metrics update in the dashboard

### 3. **Manual Wall Drawing**
   - Click and drag on the grid to add/remove walls
   - Cannot place walls on:
     - Start node (green)
     - Target node (red)
     - Grid boundaries

### 4. **View Performance Metrics**
   - **Current Metrics**: Shows algorithm name, execution time, nodes explored, path length
   - **Execution Time Chart**: Bar graph comparing algorithm speeds
   - **Nodes Explored**: Efficiency comparison (fewer nodes = better)
   - **Efficiency Scatter**: Visualizes time vs exploration tradeoffs
   - **Performance Trends**: Line chart tracking last 10 runs
   - **Run History Table**: Detailed log of all runs

### 5. **Clear Options**
   - **Clear Board**: Reset entire grid
   - **Clear Path**: Remove pathfinding visualization (keeps walls)
   - **Clear Walls**: Reset maze (keeps Start/Target)

## Maze Generation Algorithm Visualization

### DFS Recursive Backtracker Process

```
┌─────────────────────────────────────────┐
│ 1. Start with all cells as walls        │
│    (31×61 grid = 1,891 cells)          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. Choose random starting cell (1,1)   │
│    Mark as carved (path)                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. While unvisited neighbors exist:     │
│    - Pick random unvisited cell         │
│    - Remove wall between cells          │
│    - Recursively carve from new cell    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. Backtrack when dead end             │
│    Continue from another branch         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 5. Perfect maze complete!              │
│    - Every cell reachable               │
│    - Exactly one path between points   │
│    - Place target in explored region   │
└─────────────────────────────────────────┘
```

## Algorithm Details

### Maze Generation: DFS Recursive Backtracker
- Generates perfect mazes (one path between any two points)
- Time Complexity: O(rows × cols)
- Space Complexity: O(rows × cols)
- Animated carving process at 5ms per cell

### Pathfinding Algorithms

| Algorithm | Optimal | Speed | Exploration | Color |
|-----------|---------|-------|-------------|-------|
| A* | ✅ Yes | ⚡ Fastest | Minimal | Blue |
| Dijkstra | ✅ Yes | ⚡ Fast | Moderate | Blue |
| BFS | ✅ Yes | 🔶 Medium | Moderate | Blue |
| DFS | ❌ No | 🟠 Slower | Maximal | Blue |

**Animation Timing:**
- Maze carving: 5ms per cell
- Pathfinding exploration: 15ms per cell
- Solution path reveal: 20ms per cell

## Project Structure

```
Maze/
├── src/
│   ├── app/
│   │   └── page.tsx              # Main application logic
│   ├── components/
│   │   ├── Grid.tsx              # Grid rendering component
│   │   ├── ControlPanel.tsx       # UI controls
│   │   └── Dashboard.tsx          # Performance metrics & graphs
│   ├── utils/
│   │   ├── mazeGenerator.ts       # DFS maze generation
│   │   └── gridCoordinates.ts     # Coordinate utilities
│   └── types/
│       └── index.ts              # TypeScript types
├── python-server/
│   ├── main.py                   # FastAPI endpoints
│   ├── algorithms.py             # Pathfinding implementations
│   └── requirements.txt          # Python dependencies
├── public/                       # Static assets
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

## Key Implementation Details

### Safe Target Placement
The target node is selected from nodes actually carved by the DFS algorithm at 70% through the animation, guaranteeing it's always in an explorable (white) region.

```typescript
if (wallsToAnimate.length > 0) {
  const targetIndex = Math.floor(wallsToAnimate.length * 0.7);
  const targetNode = wallsToAnimate[targetIndex];
  finalTargetRow = targetNode.row;
  finalTargetCol = targetNode.col;
}
```

### Performance Optimization
- CPU-accelerated CSS transitions instead of JavaScript animations
- Efficient grid rendering with inline styles
- Backend algorithms use optimized Python with early termination
- Real-time streaming of visited/path nodes

### Grid Constraints
- Start/Target nodes locked to odd coordinates (required for DFS)
- Boundary walls protected (row 0, col 0, last row, last col)
- Maximum grid size: 31×61 = 1,891 cells

## API Endpoints

### POST `/find-path`
Executes pathfinding algorithm
```json
{
  "grid": [...],
  "startNode": {"row": 1, "col": 1},
  "endNode": {"row": 15, "col": 30},
  "algorithm": "astar"
}
```

**Algorithms:** `astar`, `dijkstra`, `bfs`, `dfs`

### Response
```json
{
  "visitedNodes": [...],
  "pathNodes": [...]
}
```

## Performance Metrics

The dashboard automatically tracks and displays:
- **Execution Time**: How long the algorithm took (ms)
- **Nodes Explored**: Total cells examined during search
- **Path Length**: Number of cells in the solution
- **Algorithm**: Which pathfinding method was used

Compare across runs to see which algorithm performs best for different maze configurations!

## Troubleshooting

### "Cannot POST /find-path"
- Ensure Python backend is running on `http://localhost:8000`
- Check CORS middleware is enabled in `main.py`

### 404 Errors on Page Load
- Clear Next.js cache: `rm -r .next`
- Restart dev server: `npm run dev`

### Graphs Not Showing
- Run at least 2 different algorithms to generate comparison data
- Check browser console for errors
- Ensure Recharts is installed: `npm list recharts`

## Future Enhancements

- [ ] More maze generation algorithms (Prim's, Kruskal's)
- [ ] Animated algorithm breakdown (step-by-step visualization)
- [ ] Mobile responsive design
- [ ] Algorithm comparison mode (side-by-side)
- [ ] Difficulty levels (maze size options)
- [ ] Export maze as image
- [ ] Leaderboard for best times
- [ ] Screenshot/recording of maze generation

## License

This project is open source and available under the MIT License.

## Author

Created by Qazi Absaar

## Contributing

Contributions are welcome! Feel free to fork, make changes, and submit pull requests.

---

**Happy Maze Solving!** 🎯

**Frontend:**
- Next.js 14 with TypeScript
- React 18
- Tailwind CSS
- Recharts (data visualization)
- Framer Motion (optional animations)

**Backend:**
- Python FastAPI
- Pydantic (data validation)
- CORS enabled for cross-origin requests

**Grid System:**
- 31×61 dimensions (odd numbers for perfect maze generation)
- Start node: (1, 1) - guaranteed odd coordinate
- Target node: Dynamically selected from carved regions

## Installation

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/QaziAbsaar/Maze.git
   cd Maze
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up Python backend**
   ```bash
   cd python-server
   python -m venv .venv
   
   # On Windows
   .venv\Scripts\activate
   
   # On macOS/Linux
   source .venv/bin/activate
   
   pip install fastapi uvicorn pydantic
   ```

## Running the Application

### Terminal 1: Start the Frontend
```bash
npm run dev
```
Access the app at **http://localhost:3001**

### Terminal 2: Start the Python Backend
```bash
cd python-server
python -m venv .venv

# Activate virtual environment
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

uvicorn main:app --reload
```
Backend runs on **http://localhost:8000**

## Usage Guide

### 1. **Generate a Maze**
   - Click "Generate Maze" button
   - Watch the DFS algorithm carve paths through the grid
   - See the green Start node at (1,1) and red Target node appear in explorable area

### 2. **Run Pathfinding Algorithm**
   - Select an algorithm from dropdown (A*, Dijkstra, BFS, DFS)
   - Click "Run Algorithm"
   - Watch the blue frontier expand as it explores
   - Yellow path highlights the shortest route found

### 3. **Manual Wall Drawing**
   - Click and drag on the grid to add/remove walls
   - Cannot place walls on:
     - Start node (green)
     - Target node (red)
     - Grid boundaries

### 4. **View Performance Metrics**
   - **Current Metrics**: Shows algorithm name, execution time, nodes explored, path length
   - **Execution Time Chart**: Bar graph comparing algorithm speeds
   - **Nodes Explored**: Efficiency comparison (fewer nodes = better)
   - **Efficiency Scatter**: Visualizes time vs exploration tradeoffs
   - **Performance Trends**: Line chart tracking last 10 runs
   - **Run History Table**: Detailed log of all runs

### 5. **Clear Options**
   - **Clear Board**: Reset entire grid
   - **Clear Path**: Remove pathfinding visualization (keeps walls)
   - **Clear Walls**: Reset maze (keeps Start/Target)

## Algorithm Details

### Maze Generation: DFS Recursive Backtracker
- Generates perfect mazes (one path between any two points)
- Time Complexity: O(rows × cols)
- Space Complexity: O(rows × cols)
- Animated carving process at 5ms per cell

### Pathfinding Algorithms

| Algorithm | Optimal | Speed | Exploration |
|-----------|---------|-------|-------------|
| A* | ✅ Yes | ⚡ Fastest | Minimal |
| Dijkstra | ✅ Yes | ⚡ Fast | Moderate |
| BFS | ✅ Yes | 🔶 Medium | Moderate |
| DFS | ❌ No | 🟠 Slower | Maximal |

**Animation Timing:**
- Maze carving: 5ms per cell
- Pathfinding exploration: 15ms per cell
- Solution path reveal: 20ms per cell

## Project Structure

```
Maze/
├── src/
│   ├── app/
│   │   └── page.tsx              # Main application logic
│   ├── components/
│   │   ├── Grid.tsx              # Grid rendering component
│   │   ├── ControlPanel.tsx       # UI controls
│   │   └── Dashboard.tsx          # Performance metrics & graphs
│   ├── utils/
│   │   ├── mazeGenerator.ts       # DFS maze generation
│   │   └── gridCoordinates.ts     # Coordinate utilities
│   └── types/
│       └── index.ts              # TypeScript types
├── python-server/
│   ├── main.py                   # FastAPI endpoints
│   ├── algorithms.py             # Pathfinding implementations
│   └── requirements.txt          # Python dependencies
├── public/                       # Static assets
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

## Key Implementation Details

### Safe Target Placement
The target node is selected from nodes actually carved by the DFS algorithm at 70% through the animation, guaranteeing it's always in an explorable (white) region.

```typescript
if (wallsToAnimate.length > 0) {
  const targetIndex = Math.floor(wallsToAnimate.length * 0.7);
  const targetNode = wallsToAnimate[targetIndex];
  finalTargetRow = targetNode.row;
  finalTargetCol = targetNode.col;
}
```

### Performance Optimization
- CPU-accelerated CSS transitions instead of JavaScript animations
- Efficient grid rendering with inline styles
- Backend algorithms use optimized Python with early termination
- Real-time streaming of visited/path nodes

### Grid Constraints
- Start/Target nodes locked to odd coordinates (required for DFS)
- Boundary walls protected (row 0, col 0, last row, last col)
- Maximum grid size: 31×61 = 1,891 cells

## API Endpoints

### POST `/find-path`
Executes pathfinding algorithm
```json
{
  "grid": [...],
  "startNode": {"row": 1, "col": 1},
  "endNode": {"row": 15, "col": 30},
  "algorithm": "astar"
}
```

**Algorithms:** `astar`, `dijkstra`, `bfs`, `dfs`

### Response
```json
{
  "visitedNodes": [...],
  "pathNodes": [...]
}
```

## Performance Metrics

The dashboard automatically tracks and displays:
- **Execution Time**: How long the algorithm took (ms)
- **Nodes Explored**: Total cells examined during search
- **Path Length**: Number of cells in the solution
- **Algorithm**: Which pathfinding method was used

Compare across runs to see which algorithm performs best for different maze configurations!

## Troubleshooting

### "Cannot POST /find-path"
- Ensure Python backend is running on `http://localhost:8000`
- Check CORS middleware is enabled in `main.py`

### 404 Errors on Page Load
- Clear Next.js cache: `rm -r .next`
- Restart dev server: `npm run dev`

### Graphs Not Showing
- Run at least 2 different algorithms to generate comparison data
- Check browser console for errors
- Ensure Recharts is installed: `npm list recharts`

## Future Enhancements

- [ ] More maze generation algorithms (Prim's, Kruskal's)
- [ ] Animated algorithm breakdown (step-by-step visualization)
- [ ] Mobile responsive design
- [ ] Algorithm comparison mode (side-by-side)
- [ ] Difficulty levels (maze size options)
- [ ] Export maze as image
- [ ] Leaderboard for best times

## License

This project is open source and available under the MIT License.

## Author

Created by Qazi Absaar

## Contributing

Contributions are welcome! Feel free to fork, make changes, and submit pull requests.

---

**Happy Maze Solving!** 🎯
