import { useRef, useState } from "react";
import { rooms, corridorTiles, furniture } from "@/scene/layout";
import { toScreen, tilePoints } from "@/scene/grid";
import { ObjectSprite } from "@/scene/sprites";
import { devices } from "@/sim/devices";
import { connections, type OutbreakEvent } from "@/lib/research-data";

export type HospitalMode = "hospital" | "network" | "outbreak";
export function HospitalScene({mode,ward,selected,visibleIds,zoom,onZoom,onWard,onDevice}:{
  mode:HospitalMode; minute:number; events:OutbreakEvent[]; ward:string; selected?:string|undefined; visibleIds:Set<string>; zoom:number; onZoom:(zoom:number)=>void; onWard:(id:string)=>void; onDevice:(id:string)=>void;
}) {
  const [pan,setPan]=useState({x:0,y:0});
  const [hovered,setHovered]=useState<string>();
  const [width,setWidth]=useState(1200);
  const pointers=useRef(new Map<number,{x:number;y:number}>());
  const gesture=useRef<{distance:number;zoom:number}|null>(null);
  const svg=useRef<SVGSVGElement>(null);
  const deviceMap=new Map(devices.map(d=>[d.id,d]));
  const drawn=[...furniture.filter(f=>f.type!=="staff"||mode==="hospital").map(f=>({kind:"furniture" as const,gx:f.gx,gy:f.gy,f})),...devices.filter(d=>visibleIds.has(d.id)).map(d=>({kind:"device" as const,gx:d.gridX,gy:d.gridY,d}))].sort((a,b)=>a.gx+a.gy-b.gx-b.gy || a.gx-b.gx);
  const hit=Math.max(34,24*1500/Math.max(width,1)/zoom);
  function distance(){const [a,b]=Array.from(pointers.current.values());return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;}
  return <svg ref={svg} className="tile-hospital-scene" viewBox="-750 -85 1500 870" role="group" aria-label="Interactive isometric hospital" onWheel={e=>{e.preventDefault();onZoom(Math.max(.6,Math.min(2.8,zoom*(e.deltaY<0?1.1:.9))));}} onPointerDown={e=>{
    setWidth(e.currentTarget.getBoundingClientRect().width);
    if((e.target as Element).closest('[data-device-id],[data-room-id]')) return;
    pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId);
    if(pointers.current.size===2) gesture.current={distance:distance(),zoom};
  }} onPointerMove={e=>{
    const previous=pointers.current.get(e.pointerId);if(!previous)return;
    pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.current.size===2&&gesture.current){onZoom(Math.max(.6,Math.min(2.8,gesture.current.zoom*distance()/Math.max(1,gesture.current.distance))));}
    else {const ratio=1500/e.currentTarget.getBoundingClientRect().width;setPan(p=>({x:p.x+(e.clientX-previous.x)*ratio,y:p.y+(e.clientY-previous.y)*ratio}));}
  }} onPointerUp={e=>{pointers.current.delete(e.pointerId);gesture.current=null;}} onPointerCancel={e=>{pointers.current.delete(e.pointerId);gesture.current=null;}} onDoubleClick={()=>{setPan({x:0,y:0});onZoom(1);}}>
    <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
      <g className="iso-foundation"><path d="M0 -12 L705 340 L0 695 L-705 340 Z"/><path className="foundation-edge" d="M-705 340 L0 695 L705 340 V352 L0 707 L-705 352 Z"/></g>
      <g className="iso-corridors">{corridorTiles.map((t,i)=><polygon key={i} points={tilePoints(t.gx,t.gy)}/>)}</g>
      {rooms.map(r=><g key={r.id} className={`iso-room floor-${r.tone} ${ward===r.wardId ? "selected" : ""}`}>
        <g data-room-id={r.id} role="button" tabIndex={0} aria-label={`Select ${r.name}`} onClick={()=>onWard(r.wardId??"all")} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onWard(r.wardId??"all");}}}><title>{r.name}</title>{r.tiles.map(t=><polygon key={`${t.gx}-${t.gy}`} points={tilePoints(t.gx,t.gy)}/>)}
        </g>
        {r.walls.map((wall,i)=>{const a=toScreen(wall.from.gx,wall.from.gy),b=toScreen(wall.to.gx,wall.to.gy);return <g key={i} className={`iso-wall wall-${r.tone}`}><path d={`M${a.x} ${a.y} L${b.x} ${b.y} V${b.y-wall.height} L${a.x} ${a.y-wall.height} Z`}/><path className="wall-cap" d={`M${a.x} ${a.y-wall.height} L${b.x} ${b.y-wall.height} l0 -4 L${a.x} ${a.y-wall.height-4} Z`}/>{Array.from({length:i===0?r.width-1:r.height-1},(_,j)=>{const p=toScreen(wall.from.gx+(i===0?j+1:0),wall.from.gy+(i===1?j+1:0));return <path key={j} className="iso-window" d={i===0?`M${p.x-8} ${p.y-13} l15 7 v-16 l-15 -7 Z`:`M${p.x-8} ${p.y-6} l15 -7 v-16 l-15 7 Z`}/>})}</g>;})}
        {r.doors.map((door,i)=>{const p=toScreen(door.at.gx,door.at.gy);return <path key={i} className="iso-door" d={door.axis==="x"?`M${p.x} ${p.y} l24 12`:`M${p.x} ${p.y} l-24 12`}/>;})}
        {(()=>{const p=toScreen(r.x+r.width/2,r.y+.3);return <g className="iso-room-sign" transform={`translate(${p.x},${p.y-38})`}><rect x="-67" y="-11" width="134" height="22" rx="3"/><text textAnchor="middle" y="3">{r.name.toUpperCase()}</text></g>;})()}
      </g>)}
      {mode!=="hospital"&&<g className="iso-network">{connections.map(c=>{const a=deviceMap.get(c.source),b=deviceMap.get(c.target);if(!a||!b||!visibleIds.has(a.id)||!visibleIds.has(b.id))return null;const p=toScreen(a.gridX,a.gridY),q=toScreen(b.gridX,b.gridY);return <path key={c.id} className={`sim-network-link ${selected===a.id||selected===b.id?"highlight":""}`} d={`M${p.x} ${p.y-12} L${q.x} ${q.y-12}`}/>;})}</g>}
      {drawn.map(obj=>{
        const p=toScreen(obj.gx,obj.gy);
        if(obj.kind==="furniture")return <g key={obj.f.id} transform={`translate(${p.x},${p.y})`} className="iso-furniture"><ObjectSprite type={obj.f.type}/></g>;
        const d=obj.d;
        return <g key={d.id} transform={`translate(${p.x},${p.y})`} data-device-id={d.id} role="button" tabIndex={0} aria-label={`Inspect ${d.id}`} className={`iso-device ${selected===d.id?"selected":""}`} onClick={()=>onDevice(d.id)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onDevice(d.id);}}} onMouseEnter={()=>setHovered(d.id)} onMouseLeave={()=>setHovered(undefined)} onFocus={()=>setHovered(d.id)} onBlur={()=>setHovered(undefined)}>
          <title>{d.id} · {d.type} · {d.wardId}</title><rect className="iso-device-hit" x={-hit/2} y={-hit+8} width={hit} height={hit} rx="4"/><ObjectSprite type={d.sprite}/>{mode!=="hospital"&&<circle className="iso-network-node" cy="-10" r="4"/>}
        </g>;
      })}
      {hovered&&(()=>{const d=deviceMap.get(hovered);if(!d)return null;const p=toScreen(d.gridX,d.gridY);return <g className="iso-tooltip" transform={`translate(${p.x},${p.y-63})`}><rect x="-100" y="-15" width="200" height="32" rx="4"/><text textAnchor="middle" y="-2">{d.id} · {d.type}</text><text className="tooltip-secondary" textAnchor="middle" y="10">Synthetic equipment · {d.wardId.toUpperCase()}</text></g>;})()}
    </g>
  </svg>;
}
