import { devices, type Device } from "@/lib/research-data";

// Coordinates belong to the fictional artwork, not observed hospital telemetry.
export type Point = { x: number; y: number };
export const hospitalRooms = [
  { wardId: "icu", label: "INTENSIVE CARE", x: 285, y: 156, corners: [[120, 185], [325, 65], [435, 148], [240, 275]] },
  { wardId: "theatre", label: "OPERATING THEATRE", x: 594, y: 112, corners: [[450, 145], [601, 42], [733, 135], [582, 234]] },
  { wardId: "admin", label: "ADMINISTRATION", x: 907, y: 163, corners: [[766, 149], [876, 83], [1095, 219], [970, 293]] },
  { wardId: "emergency", label: "EMERGENCY & TRIAGE", x: 205, y: 333, corners: [[44, 350], [224, 247], [355, 334], [176, 442]] },
  { wardId: "radiology", label: "RADIOLOGY", x: 1026, y: 354, corners: [[861, 320], [987, 263], [1161, 370], [1035, 451]] },
  { wardId: "neonatal", label: "NEONATAL CARE", x: 378, y: 531, corners: [[215, 489], [331, 414], [586, 582], [484, 660]] },
  { wardId: "general", label: "GENERAL WARD", x: 795, y: 560, corners: [[629, 586], [817, 440], [1020, 525], [830, 684]] },
] as const;

// Equipment clusters are anchored to bedside bays, workstations and utility areas
// visible in the artwork. They represent modeled inventory, not counted image objects.
const equipmentBays: Record<string, Point[]> = {
  icu: [{x:204,y:194},{x:267,y:160},{x:321,y:132},{x:383,y:196}],
  emergency: [{x:95,y:369},{x:173,y:351},{x:257,y:312},{x:184,y:422}],
  theatre: [{x:595,y:163},{x:522,y:143},{x:649,y:204}],
  admin: [{x:805,y:159},{x:852,y:206},{x:920,y:157}],
  radiology: [{x:996,y:363},{x:943,y:321}],
  neonatal: [{x:310,y:473},{x:357,y:524},{x:416,y:560}],
  general: [{x:737,y:501},{x:800,y:478},{x:738,y:613},{x:886,y:544},{x:848,y:583}],
};
export const hospitalEquipment: (Point & { device: Device; index: number })[] = hospitalRooms.flatMap(room => {
  const scoped = devices.filter(device => device.wardId === room.wardId);
  const bays = equipmentBays[room.wardId] ?? [{ x: room.x, y: room.y }];
  return scoped.map((device, index) => {
    const bay = bays[Math.floor(index / 6) % bays.length] ?? { x: room.x, y: room.y };
    const offset = index % 6;
    return { device, index, x: bay.x + (offset % 3 - 1) * 14, y: bay.y + Math.floor(offset / 3) * 13 - 7 };
  });
});
export const equipmentPosition = new Map(hospitalEquipment.map(item => [item.device.id, item]));
export const staffPaths = [
  { x: 420, y: 356, dx: 54, dy: 38, duration: 15 },
  { x: 665, y: 361, dx: 70, dy: -42, duration: 18 },
  { x: 556, y: 490, dx: -48, dy: -33, duration: 13 },
  { x: 745, y: 456, dx: 40, dy: 26, duration: 17 },
];