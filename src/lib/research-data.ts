export const stages = ['Scanning', 'Password Guessing', 'Malware Download', 'Command and Control', 'Spreading', 'DDoS Activity'] as const;
export type Stage = typeof stages[number];
export const deviceTypes = ['Patient Monitor', 'Infusion Pump', 'Ventilator', 'Workstation', 'Imaging System', 'Gateway'] as const;
export type DeviceType = typeof deviceTypes[number];
export interface Ward { id: string; name: string; short: string; count: number }
export const wards: Ward[] = [
  { id: 'icu', name: 'ICU', short: 'ICU', count: 24 }, { id: 'emergency', name: 'Emergency', short: 'ED', count: 20 },
  { id: 'neonatal', name: 'Neonatal', short: 'NICU', count: 14 }, { id: 'general', name: 'General Ward', short: 'GEN', count: 28 },
  { id: 'theatre', name: 'Operating Theatre', short: 'OR', count: 16 }, { id: 'radiology', name: 'Radiology', short: 'RAD', count: 12 },
  { id: 'admin', name: 'Hospital Administration', short: 'ADM', count: 10 },
];
export interface Device { id: string; name: string; wardId: string; type: DeviceType; critical: boolean; synthetic: true; address: string }
export const devices: Device[] = wards.flatMap((ward, wi) => Array.from({ length: ward.count }, (_, i) => ({
  id: `${ward.short}-${String(i + 1).padStart(3, '0')}`, name: `${deviceTypes[(i + wi) % deviceTypes.length]} ${String(i + 1).padStart(2, '0')}`,
  wardId: ward.id, type: deviceTypes[(i + wi) % deviceTypes.length], critical: (i + wi) % 6 === 1 || (i + wi) % 6 === 2,
  synthetic: true, address: `10.42.${wi + 1}.${i + 10}`,
})));
export const connections = devices.slice(1).map((device, i) => ({ id: `edge-${i}`, source: devices[i].id, target: device.id, relationship: 'synthetic adjacency' as const, synthetic: true }));
export const scenarios = [
  { id: 'baseline', name: 'Mirai · Baseline outbreak', short: 'Baseline outbreak', description: 'Uncontained lateral propagation across seven modeled wards.', seed: 0, infections: 38, provenance: 'Deterministic synthetic fixtures' },
  { id: 'localized', name: 'Mirai · Localized outbreak', short: 'Localized outbreak', description: 'A smaller outbreak seeded in emergency care; no policy intervention is modeled.', seed: 1, infections: 23, provenance: 'Deterministic synthetic fixtures' },
] as const;
export type ScenarioId = typeof scenarios[number]['id'];
export interface OutbreakEvent { id: string; minute: number; stage: Stage; sourceId: string; destinationId?: string; wardId: string; severity: 'High' | 'Medium' | 'Low'; synthetic: true }
export function getEvents(scenarioId: ScenarioId): OutbreakEvent[] {
  const scenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  return Array.from({ length: scenario.infections }, (_, i) => {
    const device = devices[(i * 17 + scenario.seed * 25) % devices.length];
    const start = Math.floor(i * 49 / scenario.infections) + 1;
    return stages.map((stage, si) => ({ id: `${scenarioId}-${i}-${si}`, minute: Math.min(58, start + si * 2), stage,
      sourceId: device.id, destinationId: si === 0 || si === 4 ? devices[((i + 1) * 17 + scenario.seed * 25) % devices.length].id : undefined,
      wardId: device.wardId, severity: (si >= 3 ? 'High' : si >= 1 ? 'Medium' : 'Low') as OutbreakEvent['severity'], synthetic: true as const }));
  }).flat().sort((a, b) => a.minute - b.minute || a.id.localeCompare(b.id));
}
export function getStage(deviceId: string, events: OutbreakEvent[], minute: number): Stage | undefined {
  return events.filter(e => e.sourceId === deviceId && e.minute <= minute).at(-1)?.stage;
}
export function getStats(scenario: ScenarioId, minute = 58, wardId = 'all') {
  const scoped = devices.filter(d => wardId === 'all' || d.wardId === wardId);
  const events = getEvents(scenario).filter(e => e.minute <= minute && (wardId === 'all' || e.wardId === wardId));
  return { total: scoped.length, infected: new Set(events.filter(e => e.stage === 'Malware Download').map(e => e.sourceId)).size, events: events.length, critical: scoped.filter(d => d.critical).length };
}
export function getTrend(scenario: ScenarioId, wardId = 'all') {
  const events = getEvents(scenario).filter(e => wardId === 'all' || e.wardId === wardId);
  return Array.from({ length: 30 }, (_, i) => {
    const minute = i * 2;
    return { minute, infected: new Set(events.filter(e => e.minute <= minute && e.stage === 'Malware Download').map(e => e.sourceId)).size,
      events: events.filter(e => e.minute > minute - 2 && e.minute <= minute).length };
  });
}
export const clock = (minute: number) => `${String(Math.floor(minute)).padStart(2, '0')}:00`;
export const wardName = (id: string) => wards.find(w => w.id === id)?.name ?? id;
export function researchHead(title: string, description: string) { return { meta: [{ title: `${title} | PatientZero` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | PatientZero` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }
