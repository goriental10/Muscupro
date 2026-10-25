/**
 * Approximate highlighted muscle regions for the MuscuPro 3D schematics.
 * These overlays are teaching aids, not patient-specific anatomy, EMG data,
 * biomechanics measurements or evidence of exact muscle activation.
 */
const zones={
 'Pectoraux':{label:'Poitrine · pectoraux',segments:[['lShoulder','neck',16],['rShoulder','neck',16]]},
 'Dos':{label:'Dos · dorsaux',segments:[['lShoulder','pelvis',17],['rShoulder','pelvis',17]]},
 'Épaules':{label:'Épaules · deltoïdes',segments:[['lShoulder','lElbow',19,.18],['rShoulder','rElbow',19,.18]]},
 'Biceps':{label:'Bras · biceps',segments:[['lShoulder','lElbow',15,.45],['rShoulder','rElbow',15,.45]]},
 'Triceps':{label:'Bras · triceps',segments:[['lShoulder','lElbow',16,.60],['rShoulder','rElbow',16,.60]]},
 'Quadriceps':{label:'Cuisses · quadriceps',segments:[['lHip','lKnee',23],['rHip','rKnee',23]]},
 'Ischio-jambiers':{label:'Cuisses · ischio-jambiers',segments:[['lHip','lKnee',21],['rHip','rKnee',21]]},
 'Fessiers':{label:'Bassin · fessiers',segments:[['pelvis','lHip',23],['pelvis','rHip',23]]},
 'Mollets':{label:'Jambes · mollets',segments:[['lKnee','lAnkle',17],['rKnee','rAnkle',17]]},
 'Abdominaux':{label:'Tronc · abdominaux',segments:[['pelvis','neck',22]]},
 'Cardio':{label:'Corps entier · repère de mouvement',segments:[['lHip','lKnee',13],['rHip','rKnee',13],['lShoulder','lElbow',11],['rShoulder','rElbow',11]]},
 'Mobilité':{label:'Épaules · zone mobilisée',segments:[['lShoulder','lElbow',16,.16],['rShoulder','rElbow',16,.16]]},
};
export const anatomicalZones=Object.freeze(Object.fromEntries(Object.entries(zones).map(([key,value])=>[key,Object.freeze({...value,segments:Object.freeze(value.segments.map(item=>Object.freeze(item)) )})])));
export function groupForSchematicId(id){
 const slug=id.split('-')[0];
 const special=id.startsWith('ischio-jambiers-')?'Ischio-jambiers':null;
 return special??Object.keys(anatomicalZones).find(key=>key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')===slug)??null;
}
export function anatomicalZoneForId(id){
 return anatomicalZones[groupForSchematicId(id)]??null;
}
const mix=(a,b,f)=>({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f});
export function drawAnatomyOverlay(ctx,projectedPoints,id){
 const info=anatomicalZoneForId(id);
 if(!info)return;
 ctx.save();ctx.lineCap='round';
 for(const [start,end,radius,position=.5] of info.segments){
  const from=projectedPoints[start],to=projectedPoints[end];if(!from||!to)continue;
  // Partial luminous capsule represents a region; never assert precise insertions.
  const a=mix(from,to,Math.max(.04,position-.16));
  const b=mix(from,to,Math.min(.96,position+.16));
  const gradient=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
  gradient.addColorStop(0,'rgba(245,125,93,.24)');
  gradient.addColorStop(.5,'rgba(250,92,97,.75)');
  gradient.addColorStop(1,'rgba(245,125,93,.24)');
  ctx.strokeStyle=gradient;ctx.lineWidth=radius*1.5;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  ctx.lineWidth=1.4;ctx.strokeStyle='rgba(155,49,66,.48)';
  ctx.beginPath();ctx.ellipse((a.x+b.x)/2,(a.y+b.y)/2,Math.max(6,Math.hypot(b.x-a.x,b.y-a.y)/2),radius*.68,Math.atan2(b.y-a.y,b.x-a.x),0,Math.PI*2);ctx.stroke();
 }
 ctx.textAlign='center';ctx.font='600 12px system-ui';
 ctx.fillStyle='#9e435b';ctx.fillText('ZONE ILLUSTRATIVE : '+info.label.toLocaleUpperCase('fr-CA'),350,34);
 ctx.restore();
}
