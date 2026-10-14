export const TILE_WIDTH = 48;
export const TILE_HEIGHT = 24;
export type Tile = { gx: number; gy: number };
export type Wall = { from: Tile; to: Tile; height: number };
export type Door = { at: Tile; axis: "x" | "y" };
export function toScreen(gx: number, gy: number) {
  return { x: (gx - gy) * TILE_WIDTH / 2, y: (gx + gy) * TILE_HEIGHT / 2 };
}
export function tilePoints(gx: number, gy: number) {
  return [[gx,gy],[gx+1,gy],[gx+1,gy+1],[gx,gy+1]].map(([x,y]) => {
    const p = toScreen(x ?? 0,y ?? 0); return `${p.x},${p.y}`;
  }).join(" ");
}
export function tilesIn(x: number,y: number,width: number,height: number): Tile[] {
  return Array.from({length:width*height},(_,i)=>({gx:x+i%width,gy:y+Math.floor(i/width)}));
}
