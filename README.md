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

## Tech Stack

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
