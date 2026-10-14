import { describe, expect, it } from "vitest";
import { devices as fixtures, wards } from "@/lib/research-data";
import { devices } from "@/sim/devices";
import { rooms } from "@/scene/layout";
import { toScreen } from "@/scene/grid";
describe("Data-built isometric hospital",()=>{
 it("uses standard 2:1 projection",()=>{expect(toScreen(1,0)).toEqual({x:24,y:12});expect(toScreen(0,1)).toEqual({x:-24,y:12});});
 it("places every shared fixture once in a real room",()=>{
  expect(devices).toHaveLength(fixtures.length);expect(new Set(devices.map(d=>d.id)).size).toBe(124);
  expect(rooms.filter(r=>r.wardId).map(r=>r.wardId).sort()).toEqual(wards.map(w=>w.id).sort());
  for(const d of devices){const r=rooms.find(r=>r.id===d.roomId);expect(r).toBeDefined();if(!r)continue;expect(d.gridX).toBeGreaterThanOrEqual(r.x);expect(d.gridX).toBeLessThan(r.x+r.width);expect(d.gridY).toBeGreaterThanOrEqual(r.y);expect(d.gridY).toBeLessThan(r.y+r.height);}
 });
});
