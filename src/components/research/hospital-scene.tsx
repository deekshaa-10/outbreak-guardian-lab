import { useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { hospitalRooms, hospitalEquipment, equipmentPosition, staffPaths } from "@/lib/hospital-layout";
import { connections, getStage, stages, type OutbreakEvent } from "@/lib/research-data";
import hospitalImage from "@/assets/hospital-simulator.jpg";

export type HospitalMode = "hospital" | "network" | "outbreak";
export function HospitalScene({ mode, minute, events, ward, selected, visibleIds, zoom, onWard, onDevice }: {
  mode: HospitalMode; minute: number; events: OutbreakEvent[]; ward: string; selected?: string | undefined;
  visibleIds: Set<string>; zoom: number; onWard: (id: string) => void; onDevice: (id: string) => void;
}) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const recent = events.filter(e => e.minute <= minute && e.minute > minute - 2 && e.destinationId);
  return <div className="sim-viewport" onPointerDown={e => {
    if ((e.target as Element).closest("button, [role=button]")) return;
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }} onPointerMove={e => { const start = drag.current; if (start) setPan({ x: Math.max(-350, Math.min(350, start.px + e.clientX - start.x)), y: Math.max(-220, Math.min(220, start.py + e.clientY - start.y)) }); }} onPointerUp={() => { drag.current = null; }} onDoubleClick={() => setPan({ x: 0, y: 0 })}>
    <div className="sim-map" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
      <img className="sim-artwork" src={hospitalImage} width="1536" height="1024" alt="Fictional isometric hospital with connected clinical rooms, beds, monitors, imaging equipment, operating theatre and reception" draggable={false} />
      <svg className="sim-overlay" viewBox="0 0 1200 800" aria-label="Hospital rooms and synthetic device connections">
        {hospitalRooms.map(room => <polygon key={room.wardId} className={`sim-room ${ward === room.wardId ? "is-selected" : ""}`} points={room.corners.map(p => p.join(",")).join(" ")} role="button" tabIndex={0} aria-label={`Select ${room.label}`} onClick={() => onWard(room.wardId)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onWard(room.wardId); } }} />)}
        {mode !== "hospital" && connections.map(edge => {
          const a = equipmentPosition.get(edge.source), b = equipmentPosition.get(edge.target);
          if (!a || !b || !visibleIds.has(a.device.id) || !visibleIds.has(b.device.id)) return null;
          return <path key={edge.id} className={`sim-network-link ${selected === edge.source || selected === edge.target ? "highlight" : ""}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />;
        })}
        {mode === "outbreak" && recent.map(event => {
          const a = equipmentPosition.get(event.sourceId), b = equipmentPosition.get(event.destinationId ?? "");
          if (!a || !b || !visibleIds.has(a.device.id)) return null;
          return <path key={event.id} className="sim-propagation" d={`M ${a.x} ${a.y} Q ${(a.x + b.x)/2} ${Math.min(a.y,b.y)-45} ${b.x} ${b.y}`} />;
        })}
        {staffPaths.map((staff,i) => <g key={i} className="sim-staff" style={{ "--staff-dx": `${staff.dx}px`, "--staff-dy": `${staff.dy}px`, "--staff-duration": `${staff.duration}s` } as CSSProperties}>
          <g transform={`translate(${staff.x},${staff.y})`}><ellipse className="staff-shadow" cy="7" rx="6" ry="3"/><path className="staff-trousers" d="M-3 0 L-4 7 M2 0 L3 7"/><path className={i%2 ? "staff-coat" : "staff-scrubs"} d="M-4 -12 Q0 -15 4 -12 L5 0 L-4 0 Z"/><circle className="staff-skin" cy="-17" r="4"/><path className="staff-hair" d="M-4 -18 Q0 -24 4 -18"/></g>
        </g>)}
      </svg>
      {hospitalRooms.map(room => <Button key={room.wardId} size="sm" variant="outline" className={`sim-room-label ${ward === room.wardId ? "active" : ""}`} style={{ left: `${room.x/12}%`, top: `${(room.y-35)/8}%` }} onClick={() => onWard(room.wardId)}>{room.label}</Button>)}
      {hospitalEquipment.filter(item => visibleIds.has(item.device.id)).map(item => {
        const stage = getStage(item.device.id, events, minute);
        const infected = stage !== undefined && stages.indexOf(stage) >= 2;
        return <Button key={item.device.id} variant="ghost" size="icon" className={`sim-equipment ${mode === "hospital" ? "normal" : ""} ${mode === "outbreak" ? infected ? "compromised" : stage ? "warning" : "" : ""} ${selected === item.device.id ? "selected" : ""}`} style={{ left: `${item.x/12}%`, top: `${item.y/8}%` }} aria-label={`Inspect ${item.device.id}`} title={`${item.device.id} · ${item.device.type} · ${stage ?? "No recorded activity"}`} onClick={() => onDevice(item.device.id)}><span className="sim-equipment-dot" /></Button>;
      })}
    </div>
  </div>;
}