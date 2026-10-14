import { tilesIn, type Tile, type Wall, type Door } from "./grid";
export type ObjectType = "bed" | "incubator" | "patient_monitor" | "infusion_pump" | "ventilator" | "workstation" | "imaging_system" | "operating_table" | "router" | "gateway" | "desk" | "cabinet" | "staff" | "chair";
export interface Room { id: string; name: string; wardId?: string; x: number; y: number; width: number; height: number; tone: string; tiles: Tile[]; walls: Wall[]; doors: Door[] }
function room(id: string,name: string,x: number,y: number,width: number,height: number,tone: string,wardId?: string): Room {
  const doorX=x+Math.floor(width/2);
  return {id,name,x,y,width,height,tone,...(wardId ? {wardId} : {}),tiles:tilesIn(x,y,width,height),
    walls:[{from:{gx:x,gy:y},to:{gx:x+width,gy:y},height:37},{from:{gx:x,gy:y},to:{gx:x,gy:y+height},height:37}],
    doors:[{at:{gx:doorX,gy:y+height},axis:"x"},{at:{gx:x+width,gy:y+Math.floor(height/2)},axis:"y"}]};
}
export const rooms: Room[] = [
  room("icu","Intensive care",0,0,8,7,"blue","icu"),
  room("theatre","Operating theatre",10,0,7,7,"green","theatre"),
  room("radiology","Radiology",19,0,7,7,"blue","radiology"),
  room("emergency","Emergency & triage",0,10,8,7,"pink","emergency"),
  room("neonatal","Neonatal care",0,20,8,7,"pink","neonatal"),
  room("general","General ward",10,20,8,7,"green","general"),
  room("admin","Administration",20,20,7,7,"neutral","admin"),
  room("station","Nurses' station",11,11,6,5,"neutral"),
  room("waiting","Waiting area",20,10,7,5,"neutral"),
  room("utility","Network utility",20,16,7,3,"neutral"),
];
export const corridorTiles = [ ...tilesIn(0,7,28,3), ...tilesIn(8,0,2,28), ...tilesIn(0,17,20,3), ...tilesIn(18,10,2,18), ...tilesIn(10,16,10,1), ...tilesIn(17,0,2,7), ...tilesIn(27,10,1,18) ];
export interface SceneObject extends Tile { id: string; type: ObjectType; roomId: string; }
const objects: SceneObject[]=[];
function add(roomId:string,type:ObjectType,gx:number,gy:number) {objects.push({id:`${roomId}-${type}-${objects.length}`,roomId,type,gx,gy});}
for (const r of rooms.filter(r=>r.wardId)) {
  if (r.wardId === "admin") {
    for(let i=0;i<4;i++) add(r.id,"desk",r.x+1+(i%2)*3,r.y+1+Math.floor(i/2)*3);
  } else if(r.wardId === "radiology") {
    add(r.id,"imaging_system",r.x+2,r.y+2); add(r.id,"imaging_system",r.x+4,r.y+4);
  } else {
    const type = r.wardId === "neonatal" ? "incubator" : r.wardId === "theatre" ? "operating_table" : "bed";
    for(let i=0;i<(r.wardId === "theatre" ? 3 : 6);i++) add(r.id,type,r.x+1+(i%3)*2.1,r.y+1+Math.floor(i/3)*3);
  }
  add(r.id,"cabinet",r.x+0.5,r.y+0.5); add(r.id,"cabinet",r.x+r.width-1,r.y+0.5);
}
for(let i=0;i<3;i++) {add("station","desk",12+i*1.6,12);add("station","workstation",12+i*1.6,12);}
for(let i=0;i<8;i++) add("waiting","chair",21+(i%4)*1.3,11+Math.floor(i/4)*2);
for(let i=0;i<4;i++) add("utility","cabinet",21+i*1.3,16.3);
for(const [gx,gy] of [[9,9],[13,9],[19,13],[9,18],[16,18],[23,19],[4,8]]) add("corridor","staff",gx ?? 0,gy ?? 0);
export const furniture = objects;
