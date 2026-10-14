import { devices as fixtureDevices, type Device } from "@/lib/research-data";
import { rooms, type ObjectType } from "@/scene/layout";
export type SceneDevice = Device & { gridX:number; gridY:number; roomId:string; sprite:ObjectType };
const sprites: Record<Device["type"],ObjectType> = {"Patient Monitor":"patient_monitor","Infusion Pump":"infusion_pump","Ventilator":"ventilator","Workstation":"workstation","Imaging System":"imaging_system","Gateway":"gateway"};
const indices = new Map<string,number>();
export const devices: SceneDevice[] = fixtureDevices.map(device => {
  const clinical = rooms.find(r=>r.wardId===device.wardId) ?? rooms[0];
  const location = device.type === "Gateway" ? rooms.find(r=>r.id==="utility") : device.type === "Workstation" && device.wardId!=="admin" ? rooms.find(r=>r.id==="station") : device.type === "Imaging System" ? rooms.find(r=>r.wardId==="radiology") : clinical;
  const r=location ?? {id:"station",x:11,y:11,width:6,height:5};
  const index=indices.get(r.id) ?? 0; indices.set(r.id,index+1);
  // Distinct, reachable slots around bedside bays and department equipment.
  const cols=r.id==="utility" ? 7 : r.id==="radiology" ? 6 : r.id==="station" ? 6 : 6;
  const dx=r.id==="utility" ? .8 : .9;
  return {...device,gridX:r.x+.6+(index%cols)*dx,gridY:r.y+1.15+Math.floor(index/cols)*(r.id==="utility" ? .55 : .85),roomId:r.id,sprite:sprites[device.type]};
});
export const deviceById = new Map(devices.map(d=>[d.id,d]));
