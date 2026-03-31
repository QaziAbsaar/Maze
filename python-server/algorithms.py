import math
import random
import heapq
from collections import deque

# ============================================================================
# MAZE GENERATION ALGORITHMS (Using 2N+1 Grid Representation)
# ============================================================================

def initialize_maze_grid(rows, cols, start_pos, end_pos):
    """
    Initialize a grid completely filled with walls.
    Carve out odd-coordinate cells as vertices (path cells).
    """
    grid = []
    for r in range(rows):
        row = []
        for c in range(cols):
            # Odd coordinates are vertices (carved out as paths)
            is_path = (r % 2 == 1) and (c % 2 == 1)
            
            node = {
                'row': r, 'col': c,
                'isStart': (r, c) == start_pos,
                'isEnd': (r, c) == end_pos,
                'isWall': not is_path,
                'isVisited': False,
                'isPath': False,
                'isFrontier': False,
                'distance': float('inf'),
                'previousNode': None,
                'weight': 1
            }
            row.append(node)
        grid.append(row)
    return grid

def get_vertices(rows, cols):
    """Get all vertex positions (odd coordinates)."""
    vertices = []
    for r in range(1, rows, 2):
        for c in range(1, cols, 2):
            vertices.append((r, c))
    return vertices

def get_neighbors(r, c, rows, cols):
    """Get the 4 neighbors of a vertex at distance 2."""
    neighbors = []
    # Up
    if r - 2 >= 1:
        neighbors.append((r - 2, c))
    # Down
    if r + 2 < rows:
        neighbors.append((r + 2, c))
    # Left
    if c - 2 >= 1:
        neighbors.append((r, c - 2))
    # Right
    if c + 2 < cols:
        neighbors.append((r, c + 2))
    return neighbors

def get_wall_between(r1, c1, r2, c2):
    """Get the wall position between two vertices."""
    mr = (r1 + r2) // 2
    mc = (c1 + c2) // 2
    return (mr, mc)

def carve_wall(grid, r, c):
    """Mark a wall cell as a path."""
    if 0 <= r < len(grid) and 0 <= c < len(grid[0]):
        grid[r][c]['isWall'] = False

def generate_kruskal_maze(grid, rows, cols, start_pos, end_pos):
    """
    Generate a perfect maze using Kruskal's algorithm.
    Returns list of walls carved in sequence for animation.
    """
    # Initialize grid with all walls, odd-coordinates as vertices
    vertices = get_vertices(rows, cols)
    
    # Build edge list
    edges = []
    for r, c in vertices:
        for nr, nc in get_neighbors(r, c, rows, cols):
            if (r, c) < (nr, nc):  # Avoid duplicates
                wall_pos = get_wall_between(r, c, nr, nc)
                edges.append(((r, c), (nr, nc), wall_pos))
    
    random.shuffle(edges)
    
    # Union-Find
    parent = {v: v for v in vertices}
    
    def find(v):
        if parent[v] != v:
            parent[v] = find(parent[v])
        return parent[v]
    
    def union(u, v):
        pu, pv = find(u), find(v)
        if pu != pv:
            parent[pu] = pv
            return True
        return False
    
    walls_carved = []
    
    for (u, v, wall_pos) in edges:
        if union(u, v):
            # Carve this wall
            carve_wall(grid, wall_pos[0], wall_pos[1])
            walls_carved.append({'row': wall_pos[0], 'col': wall_pos[1]})
    
    # Ensure start and end are properly marked
    grid[start_pos[0]][start_pos[1]]['isStart'] = True
    grid[start_pos[0]][start_pos[1]]['isEnd'] = False
    grid[end_pos[0]][end_pos[1]]['isEnd'] = True
    grid[end_pos[0]][end_pos[1]]['isStart'] = False
    
    return walls_carved

def generate_dfs_maze(grid, rows, cols, start_pos, end_pos):
    """
    Generate a perfect maze using Depth-First Search (Recursive Backtracking).
    Returns list of walls carved in sequence for animation.
    """
    vertices = get_vertices(rows, cols)
    vertex_set = set(vertices)
    
    visited = set()
    walls_carved = []
    
    def dfs(r, c):
        visited.add((r, c))
        neighbors = get_neighbors(r, c, rows, cols)
        random.shuffle(neighbors)
        
        for nr, nc in neighbors:
            if (nr, nc) in vertex_set and (nr, nc) not in visited:
                # Carve the wall between (r, c) and (nr, nc)
                wall_pos = get_wall_between(r, c, nr, nc)
                carve_wall(grid, wall_pos[0], wall_pos[1])
                walls_carved.append({'row': wall_pos[0], 'col': wall_pos[1]})
                # Recursively visit neighbor
                dfs(nr, nc)
    
    # Start DFS from top-left vertex
    dfs(1, 1)
    
    # Ensure start and end are properly marked
    grid[start_pos[0]][start_pos[1]]['isStart'] = True
    grid[start_pos[0]][start_pos[1]]['isEnd'] = False
    grid[end_pos[0]][end_pos[1]]['isEnd'] = True
    grid[end_pos[0]][end_pos[1]]['isStart'] = False
    
    return walls_carved

def generate_prim_maze(grid, rows, cols, start_pos, end_pos):
    """
    Generate a perfect maze using Prim's algorithm.
    Returns list of walls carved in sequence for animation.
    """
    vertices = get_vertices(rows, cols)
    vertex_set = set(vertices)
    
    visited = set()
    frontier = []
    
    # Start from (1, 1)
    start_vertex = (1, 1)
    visited.add(start_vertex)
    
    # Add all neighbors of start to frontier
    for nr, nc in get_neighbors(start_vertex[0], start_vertex[1], rows, cols):
        if (nr, nc) in vertex_set:
            frontier.append((nr, nc))
    
    walls_carved = []
    
    while frontier:
        # Pick a random frontier vertex
        idx = random.randint(0, len(frontier) - 1)
        vertex = frontier[idx]
        frontier[idx] = frontier[-1]
        frontier.pop()
        
        if vertex in visited:
            continue
        
        # Find a visited neighbor
        neighbors = get_neighbors(vertex[0], vertex[1], rows, cols)
        visited_neighbors = [n for n in neighbors if n in visited]
        
        if visited_neighbors:
            # Pick a random visited neighbor
            visited_neighbor = random.choice(visited_neighbors)
            
            # Carve wall between vertex and visited_neighbor
            wall_pos = get_wall_between(vertex[0], vertex[1], visited_neighbor[0], visited_neighbor[1])
            carve_wall(grid, wall_pos[0], wall_pos[1])
            walls_carved.append({'row': wall_pos[0], 'col': wall_pos[1]})
            
            visited.add(vertex)
            
            # Add neighbors of this vertex to frontier
            for nr, nc in get_neighbors(vertex[0], vertex[1], rows, cols):
                if (nr, nc) in vertex_set and (nr, nc) not in visited:
                    frontier.append((nr, nc))
    
    # Ensure start and end are properly marked
    grid[start_pos[0]][start_pos[1]]['isStart'] = True
    grid[start_pos[0]][start_pos[1]]['isEnd'] = False
    grid[end_pos[0]][end_pos[1]]['isEnd'] = True
    grid[end_pos[0]][end_pos[1]]['isStart'] = False
    
    return walls_carved

# ============================================================================
# PATHFINDING ALGORITHMS
# ============================================================================


def get_neighbors_for_pathfinding(node, grid):
    """Get walkable neighbors for pathfinding."""
    r, c = node
    neighbors = []
    if r > 0 and not grid[r - 1][c]['isWall']: 
        neighbors.append((r - 1, c))
    if r < len(grid) - 1 and not grid[r + 1][c]['isWall']: 
        neighbors.append((r + 1, c))
    if c > 0 and not grid[r][c - 1]['isWall']: 
        neighbors.append((r, c - 1))
    if c < len(grid[0]) - 1 and not grid[r][c + 1]['isWall']: 
        neighbors.append((r, c + 1))
    return neighbors

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    path.reverse()
    return path

def run_astar(grid, start, end):
    visited_nodes = []
    
    count = 0
    open_set = []
    heapq.heappush(open_set, (0, count, start))
    came_from = {}
    
    g_score = {}
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            g_score[(r, c)] = float('inf')
    g_score[start] = 0
    
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
        
    f_score = {}
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            f_score[(r, c)] = float('inf')
    f_score[start] = heuristic(start, end)
    
    open_set_hash = {start}
    
    while open_set:
        current = heapq.heappop(open_set)[2]
        open_set_hash.remove(current)
        visited_nodes.append({'row': current[0], 'col': current[1]})
        
        if current == end:
            path = reconstruct_path(came_from, end)
            return visited_nodes, [{'row': p[0], 'col': p[1]} for p in path]
            
        for neighbor in get_neighbors_for_pathfinding(current, grid):
            tentative_g_score = g_score[current] + 1
            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = tentative_g_score + heuristic(neighbor, end)
                if neighbor not in open_set_hash:
                    count += 1
                    heapq.heappush(open_set, (f_score[neighbor], count, neighbor))
                    open_set_hash.add(neighbor)
                    
    return visited_nodes, []

def run_dijkstra(grid, start, end):
    visited_nodes = []
    
    g_score = {}
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            g_score[(r, c)] = float('inf')
    g_score[start] = 0
    
    count = 0
    open_set = []
    heapq.heappush(open_set, (0, count, start))
    came_from = {}
    
    open_set_hash = {start}
    
    while open_set:
        current = heapq.heappop(open_set)[2]
        open_set_hash.remove(current)
        visited_nodes.append({'row': current[0], 'col': current[1]})
        
        if current == end:
            path = reconstruct_path(came_from, end)
            return visited_nodes, [{'row': p[0], 'col': p[1]} for p in path]
            
        for neighbor in get_neighbors_for_pathfinding(current, grid):
            tentative_g_score = g_score[current] + 1
            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                if neighbor not in open_set_hash:
                    count += 1
                    heapq.heappush(open_set, (g_score[neighbor], count, neighbor))
                    open_set_hash.add(neighbor)
                    
    return visited_nodes, []

def run_bfs(grid, start, end):
    visited_nodes = []
    queue = deque([start])
    came_from = {}
    visited = {start}
    
    while queue:
        current = queue.popleft()
        visited_nodes.append({'row': current[0], 'col': current[1]})
        
        if current == end:
            path = reconstruct_path(came_from, end)
            return visited_nodes, [{'row': p[0], 'col': p[1]} for p in path]
            
        for neighbor in get_neighbors_for_pathfinding(current, grid):
            if neighbor not in visited:
                came_from[neighbor] = current
                visited.add(neighbor)
                queue.append(neighbor)
                
    return visited_nodes, []

def run_dfs(grid, start, end):
    visited_nodes = []
    stack = [start]
    came_from = {}
    visited = {start}
    
    while stack:
        current = stack.pop()
        visited_nodes.append({'row': current[0], 'col': current[1]})
        
        if current == end:
            path = reconstruct_path(came_from, end)
            return visited_nodes, [{'row': p[0], 'col': p[1]} for p in path]
            
        for neighbor in get_neighbors_for_pathfinding(current, grid):
            if neighbor not in visited:
                came_from[neighbor] = current
                visited.add(neighbor)
                stack.append(neighbor)
                
    return visited_nodes, []

def generate_spanning_tree_maze(grid, start, end, algorithm_name):
    """
    Generate mazes using spanning tree algorithms on an odd-even grid.
    Start with an all-walls grid, carve paths using the algorithm.
    """
    ROWS, COLS = len(grid), len(grid[0])
    
    # Nodes are at odd-odd coordinates
    # For a 31x61 grid: nodes are at (1,1), (1,3), ..., (29,59)
    nodes = []
    node_to_id = {}
    id_to_node = {}
    
    node_count = 0
    for r in range(1, ROWS, 2):
        for c in range(1, COLS, 2):
            nodes.append((r, c))
            node_to_id[(r, c)] = node_count
            id_to_node[node_count] = (r, c)
            node_count += 1
    
    # Build adjacency list with edge positions (the walls that separate nodes)
    adj = {i: [] for i in range(node_count)}
    all_edges = []
    
    for r in range(1, ROWS, 2):
        for c in range(1, COLS, 2):
            u = node_to_id[(r, c)]
            # Right neighbor
            if c + 2 < COLS:
                v = node_to_id[(r, c + 2)]
                wall_between = (r, c + 1)  # Wall at (r, c+1)
                adj[u].append((v, wall_between))
                adj[v].append((u, wall_between))
                all_edges.append((u, v, wall_between))
            # Bottom neighbor
            if r + 2 < ROWS:
                v = node_to_id[(r + 2, c)]
                wall_between = (r + 1, c)  # Wall at (r+1, c)
                adj[u].append((v, wall_between))
                adj[v].append((u, wall_between))
                all_edges.append((u, v, wall_between))
    
    carved_paths = set()  # Cells to keep as paths
    
    # Add all odd-odd nodes as paths
    for r in range(1, ROWS, 2):
        for c in range(1, COLS, 2):
            carved_paths.add((r, c))
    
    spanning_tree = []
    
    if algorithm_name == "kruskal":
        random.shuffle(all_edges)
        parent = list(range(node_count))
        
        def get_parent(i):
            if parent[i] == i:
                return i
            parent[i] = get_parent(parent[i])
            return parent[i]
        
        for u, v, wall_pos in all_edges:
            pu, pv = get_parent(u), get_parent(v)
            if pu != pv:
                parent[pu] = pv
                spanning_tree.append(wall_pos)
                carved_paths.add(wall_pos)
    
    elif algorithm_name == "dfs":
        visited = set([0])
        stack = [0]
        
        while stack:
            u = stack[-1]
            unvisited = [v for v, w in adj[u] if v not in visited]
            
            if unvisited:
                v = random.choice(unvisited)
                # Find the wall between u and v
                wall = next(w for nv, w in adj[u] if nv == v)
                spanning_tree.append(wall)
                carved_paths.add(wall)
                visited.add(v)
                stack.append(v)
            else:
                stack.pop()
    
    elif algorithm_name == "prim":
        visited = set([0])
        frontier = [(v, w) for v, w in adj[0]]
        
        while frontier:
            idx = random.randint(0, len(frontier) - 1)
            v, w = frontier.pop(idx)
            
            if v not in visited:
                visited.add(v)
                spanning_tree.append(w)
                carved_paths.add(w)
                for nxt, nw in adj[v]:
                    if nxt not in visited:
                        frontier.append((nxt, nw))
    
    elif algorithm_name == "lerw":
        in_tree = {0}
        
        for start_node in range(1, node_count):
            if start_node in in_tree:
                continue
            
            curr = start_node
            path = [curr]
            walls_in_path = []
            
            while curr not in in_tree:
                # Random walk
                next_node, wall = random.choice(adj[curr])
                
                # Check if we've looped
                if next_node in path:
                    idx = path.index(next_node)
                    path = path[:idx + 1]
                    walls_in_path = walls_in_path[:idx]
                else:
                    path.append(next_node)
                    walls_in_path.append(wall)
                curr = next_node
            
            in_tree.update(path)
            for w in walls_in_path:
                spanning_tree.append(w)
                carved_paths.add(w)
    
    # Everything that's not a carved path is a wall
    walls_to_animate = []
    for r in range(ROWS):
        for c in range(COLS):
            pos = (r, c)
            # Skip start and end nodes
            if pos == start or pos == end:
                continue
            # If it's not a path, it's a wall
            if pos not in carved_paths:
                walls_to_animate.append({'row': r, 'col': c})
    
    random.shuffle(walls_to_animate)
    return walls_to_animate


def run_random_scatter(grid, start, end):
    walls = []
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if (r, c) != start and (r, c) != end:
                if random.random() < 0.25:
                    walls.append({'row': r, 'col': c})
    return walls

def run_recursive_division(grid, start, end):
    walls = []
    ROWS, COLS = len(grid), len(grid[0])
    
    for r in range(ROWS):
        for c in [0, COLS - 1]:
            if (r, c) != start and (r, c) != end:
                walls.append({'row': r, 'col': c})
    for c in range(COLS):
        for r in [0, ROWS - 1]:
             if (r, c) != start and (r, c) != end:
                walls.append({'row': r, 'col': c})

    def choose_orientation(width, height):
        if width < height: return "horizontal"
        if height < width: return "vertical"
        return "horizontal" if random.random() < 0.5 else "vertical"

    def divide(rStart, rEnd, cStart, cEnd, orientation):
        if rEnd < rStart or cEnd < cStart: return

        horizontal = orientation == "horizontal"

        rNode = rStart if rStart == rEnd else rStart + (random.randint(0, (rEnd - rStart)//2)) * 2
        cNode = cStart if cStart == cEnd else cStart + (random.randint(0, (cEnd - cStart)//2)) * 2

        if horizontal:
            if cStart == cEnd: cNode = cStart

        rPassage = rStart + (random.randint(0, (rEnd - rStart)//2)) * 2 + 1 if not horizontal else rStart
        cPassage = cStart + (random.randint(0, (cEnd - cStart)//2)) * 2 + 1 if horizontal else cStart

        length = cEnd - cStart + 1 if horizontal else rEnd - rStart + 1
        dirR = 0 if horizontal else 1
        dirC = 1 if horizontal else 0

        for i in range(length):
            r = rNode + (i * dirR)
            c = cNode + (i * dirC)
            if (r, c) != start and (r, c) != end and (r != rPassage or c != cPassage):
                 walls.append({'row': r, 'col': c})

        if horizontal:
            divide(rStart, rNode - 1, cStart, cEnd, choose_orientation(cEnd - cStart + 1, rNode - rStart))
            divide(rNode + 1, rEnd, cStart, cEnd, choose_orientation(cEnd - cStart + 1, rEnd - rNode))
        else:
            divide(rStart, rEnd, cStart, cNode - 1, choose_orientation(cNode - cStart, rEnd - rStart + 1))
            divide(rStart, rEnd, cNode + 1, cEnd, choose_orientation(cEnd - cNode, rEnd - rStart + 1))

    divide(1, ROWS - 2, 1, COLS - 2, choose_orientation(COLS - 2, ROWS - 2))
    return walls
