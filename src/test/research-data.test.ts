import { describe, it, expect } from "vitest";
import {
  wards,
  devices,
  connections,
  getEvents,
  getStats,
  getTrend,
  getStage,
  scenarios,
} from "@/lib/research-data";
describe("Synthetic research integrity", () => {
  it("has seven wards and consistent device/connection references", () => {
    expect(wards).toHaveLength(7);
    expect(new Set(devices.map((d) => d.id)).size).toBe(devices.length);
    for (const c of connections) {
      expect(devices.some((d) => d.id === c.source)).toBe(true);
      expect(devices.some((d) => d.id === c.target)).toBe(true);
    }
  });
  for (const s of scenarios) {
    it(`${s.id}: derives coherent deterministic metrics`, () => {
      const events = getEvents(s.id);
      expect(events).toEqual(getEvents(s.id));
      expect(events).toHaveLength(s.infections * 6);
      for (const e of events) {
        expect(devices.find((d) => d.id === e.sourceId)?.wardId).toBe(e.wardId);
        if (e.destinationId) expect(devices.some((d) => d.id === e.destinationId)).toBe(true);
        expect(e.minute).toBeLessThanOrEqual(58);
      }
      const stats = getStats(s.id);
      expect(stats.total).toBe(124);
      expect(stats.infected).toBe(s.infections);
      expect(getStats(s.id, 0).infected).toBe(0);
      expect(wards.reduce((n, w) => n + getStats(s.id, 58, w.id).infected, 0)).toBe(stats.infected);
      expect(wards.reduce((n, w) => n + getStats(s.id, 58, w.id).critical, 0)).toBe(stats.critical);
      expect(getTrend(s.id).at(-1)?.infected).toBe(stats.infected);
      expect(getTrend(s.id).reduce((n, b) => n + b.events, 0)).toBe(events.length);
      expect(getStage(events[0]?.sourceId ?? "", events, 0)).toBeUndefined();
      expect(getStage(events[0]?.sourceId ?? "", events, 58)).toBe("DDoS Activity");
    });
  }
});
