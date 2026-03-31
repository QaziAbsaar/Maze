/**
 * Calculate safe target coordinates that are guaranteed to be in explorable (white) regions.
 * Places the target deep within the maze interior at odd coordinates.
 * For a 31x61 grid, places it at approximately (27, 57) - deep in the maze but reachable.
 */
export const getSafeTargetCoordinates = (rows: number, cols: number) => {
  // Place target deep in the maze (near bottom-right) at guaranteed odd coordinates
  // Subtracting 4 ensures we're safely interior and the math works for odd coords
  let targetRow = rows - 4;
  let targetCol = cols - 4;
  
  // Ensure both are odd by adjusting if needed
  if (targetRow % 2 === 0) targetRow -= 1;
  if (targetCol % 2 === 0) targetCol -= 1;
  
  // Safety bounds - ensure it's not too close to edges
  targetRow = Math.max(3, Math.min(targetRow, rows - 3));
  targetCol = Math.max(3, Math.min(targetCol, cols - 3));
  
  return { r: targetRow, c: targetCol };
};
