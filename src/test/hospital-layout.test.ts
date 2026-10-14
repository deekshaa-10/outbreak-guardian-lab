import { describe, expect, it } from "vitest";
import { devices, connections, wards } from "@/lib/research-data";
import { hospitalEquipment, hospitalRooms, equipmentPosition } from "@/lib/hospital-layout";

describe("Fictional hospital spatial mapping", () => {
  it("places every fixture device exactly once in its ward", () => {
    expect(hospitalEquipment).toHaveLength(devices.length);
    expect(equipmentPosition.size).toBe(devices.length);
    expect(hospitalRooms.map(room => room.wardId).sort()).toEqual(wards.map(ward => ward.id).sort());
    for (const item of hospitalEquipment) {
      expect(hospitalRooms.some(room => room.wardId === item.device.wardId)).toBe(true);
      expect(item.x).toBeGreaterThan(0);
      expect(item.x).toBeLessThan(1200);
      expect(item.y).toBeGreaterThan(0);
      expect(item.y).toBeLessThan(800);
    }
  });
  it("resolves both ends of every existing synthetic adjacency", () => {
    for (const link of connections) {
      expect(equipmentPosition.has(link.source)).toBe(true);
      expect(equipmentPosition.has(link.target)).toBe(true);
    }
  });
});