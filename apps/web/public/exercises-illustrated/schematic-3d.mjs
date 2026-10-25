/**
 * MuscuPro Global: intentionally simplified, rotatable 3D movement schematics.
 * Not a motion-capture recording or anatomically validated training instruction.
 * Each named exercise has its own motion path. Never reuse an unrelated GIF.
 */
import {drawAnatomyOverlay} from './anatomy-zones.mjs';
import {extraSchematics,applyExtraMotion} from './schematic-extra-motions.mjs';
export const schematicDuration=3600;
export const schematics=Object.freeze({
  'pectoraux-pompes-classiques':{motion:'pushup',label:'Pompes classiques'},
  'dos-rowing-a-un-bras-avec-haltere':{motion:'row',label:'Rowing à un bras avec haltère'},
  'epaules-developpe-epaules':{motion:'press',label:'Développé épaules'},
  'biceps-curl-marteau':{motion:'curl',label:'Curl marteau'},
  'triceps-extension-triceps-a-la-poulie':{motion:'triceps',label:'Extension triceps à la poulie'},
  'quadriceps-squat':{motion:'squat',label:'Squat'},
  'ischio-jambiers-souleve-de-terre-roumain':{motion:'hinge',label:'Soulevé de terre roumain'},
  'fessiers-pont-fessier-au-sol':{motion:'bridge',label:'Pont fessier au sol'},
  'mollets-extensions-mollets-debout':{motion:'calf',label:'Extensions mollets debout'},
  'abdominaux-crunch-abdominal':{motion:'crunch',label:'Crunch abdominal'},
  'cardio-marche-active':{motion:'march',label:'Marche active'},
  'mobilite-cercles-des-epaules':{motion:'shoulders',label:'Cercles des épaules'},
  'pectoraux-pompes-inclinees':{motion:'inclinePushup',label:'Pompes inclinées'},
  'dos-tirage-vertical-devant':{motion:'pulldown',label:'Tirage vertical devant'},
  'epaules-elevations-frontales-avec-halteres':{motion:'frontRaise',label:'Élévations frontales avec haltères'},
  'biceps-curl-alterne':{motion:'alternatingCurl',label:'Curl alterné'},
  'triceps-extension-au-dessus-de-la-tete':{motion:'overheadExtension',label:'Extension au-dessus de la tête'},
  'quadriceps-fentes-avant':{motion:'lunge',label:'Fentes avant'},
  'ischio-jambiers-leg-curl-debout':{motion:'standingLegCurl',label:'Leg curl debout'},
  'fessiers-kickback-a-quatre-pattes':{motion:'quadrupedKickback',label:'Kickback à quatre pattes'},
  'mollets-extensions-mollets-sur-une-jambe':{motion:'singleCalf',label:'Extensions mollets sur une jambe'},
  'abdominaux-planche-laterale':{motion:'sidePlank',label:'Planche latérale'},
  'cardio-jumping-jack-adapte':{motion:'stepJack',label:'Jumping jack adapté'},
  'mobilite-chat-vache':{motion:'catCow',label:'Chat-vache'},
  ...extraSchematics,
});
const TAU=2*Math.PI;
const clamp=v=>Math.min(1,Math.max(0,v));
export const phaseAmount=phase=>(1-Math.cos(TAU*(((phase%1)+1)%1)))/2;

const standing=()=>{
 const p={pelvis:[0,1.53,0],neck:[0,2.89,0],head:[0,3.25,0]};
 for(const [side,s] of [['l',-1],['r',1]]){
  p[side+'Shoulder']=[s*.52,2.77,0];p[side+'Elbow']=[s*.76,2.08,.04];
  p[side+'Wrist']=[s*.78,1.43,.14];p[side+'Hip']=[s*.33,1.53,0];
  p[side+'Knee']=[s*.36,.84,.12];p[side+'Ankle']=[s*.36,.12,.01];p[side+'Toe']=[s*.36,.04,.36];
 }
 return p;
};
const move=(p,keys,axis,offset)=>{for(const k of keys)p[k][axis]+=offset;};
const upper=['neck','head','lShoulder','rShoulder','lElbow','rElbow','lWrist','rWrist'];
const all=['pelvis','neck','head',...['l','r'].flatMap(s=>['Shoulder','Elbow','Wrist','Hip','Knee','Ankle'].map(part=>s+part))];
const set=(p,name,x,y,z)=>{p[name]=[x,y,z];};
export function poseForExercise(id,phase=0){
 const spec=schematics[id];
 if(!spec)throw Error('Schéma 3D indisponible pour cet exercice');
 const p=standing(),a=phaseAmount(phase);
 if(Object.hasOwn(extraSchematics,id))return applyExtraMotion(spec.motion,phase,p);
 switch(spec.motion){
 case 'squat':
  move(p,['pelvis','lHip','rHip',...upper],1,-.63*a);
  move(p,['pelvis','lHip','rHip'],2,-.26*a);
  for(const s of ['l','r']){
   p[s+'Knee'][1]-=.24*a;p[s+'Knee'][2]+=.49*a;
   p[s+'Elbow'][1]+=.19*a;p[s+'Wrist'][1]+=.38*a;p[s+'Wrist'][2]+=.51*a;
  }
  break;
 case 'press':
  for(const s of ['l','r']){
   const sign=s==='l'?-1:1;
   set(p,s+'Elbow',sign*(.80-.13*a),2.48+.40*a,.15);
   set(p,s+'Wrist',sign*(.80-.25*a),2.61+.89*a,.23-.20*a);
  }break;
 case 'curl':
  for(const s of ['l','r']){
   const sign=s==='l'?-1:1;
   set(p,s+'Elbow',sign*.68,2.04,.14);
   set(p,s+'Wrist',sign*(.68-.16*a),1.41+1.06*a,.25+.15*a);
  }break;
 case 'triceps':
  for(const s of ['l','r']){
   const sign=s==='l'?-1:1;
   set(p,s+'Elbow',sign*.64,2.14,.22);
   set(p,s+'Wrist',sign*.66,2.10-.72*a,.48-.15*a);
  }break;
 case 'hinge':
  move(p,['pelvis','lHip','rHip'],2,-.23*a);
  move(p,upper,1,-.72*a);move(p,upper,2,1.03*a);
  for(const s of ['l','r']){p[s+'Knee'][1]-=.12*a;p[s+'Knee'][2]+=.19*a;}
  break;
 case 'calf':
  move(p,all,1,.21*a);
  for(const s of ['l','r']){p[s+'Ankle'][1]-=.06*a;p[s+'Toe'][1]=.04;}
  break;
 case 'row':
  move(p,upper,1,-.52);move(p,upper,2,.82);
  set(p,'rElbow',.86,1.47+.23*a,.70-.45*a);
  set(p,'rWrist',.90,1.06+.62*a,1.03-.56*a);
  set(p,'lWrist',-.83,.78,1.16);
  break;
 case 'pushup':{
  const h=.32+.28*a;
  set(p,'pelvis',0,.38+.28*a,-.18);
  set(p,'neck',0,h+.17,1.05);set(p,'head',0,h+.18,1.38);
  for(const [s,k] of [['l',-1],['r',1]]){
   set(p,s+'Shoulder',k*.53,h+.12,.92);
   set(p,s+'Elbow',k*.77,.20+.11*a,1.25);
   set(p,s+'Wrist',k*.80,.10,1.45);
   set(p,s+'Hip',k*.32,.35+.27*a,-.23);
   set(p,s+'Knee',k*.33,.22,-1.02);
   set(p,s+'Ankle',k*.32,.10,-1.68);
   set(p,s+'Toe',k*.32,.07,-1.85);
  }break;
 }
 case 'bridge':
  set(p,'pelvis',0,.26+.67*a,-.10);
  set(p,'neck',0,.17,.89);set(p,'head',0,.18,1.19);
  for(const [s,k] of [['l',-1],['r',1]]){
   set(p,s+'Shoulder',k*.45,.18,.72);set(p,s+'Elbow',k*.73,.13,.55);
   set(p,s+'Wrist',k*.77,.10,.17);set(p,s+'Hip',k*.34,.26+.67*a,-.10);
   set(p,s+'Knee',k*.38,.79,-.83);set(p,s+'Ankle',k*.39,.10,-1.25);set(p,s+'Toe',k*.39,.05,-.92);
  }break;
 case 'crunch':
  set(p,'pelvis',0,.21,-.25);set(p,'neck',0,.23+.42*a,.66-.15*a);
  set(p,'head',0,.29+.45*a,.98-.24*a);
  for(const [s,k] of [['l',-1],['r',1]]){
   set(p,s+'Shoulder',k*.46,.25+.34*a,.50-.12*a);
   set(p,s+'Elbow',k*.72,.42+.31*a,.72-.10*a);
   set(p,s+'Wrist',k*.43,.45+.32*a,1.00-.18*a);
   set(p,s+'Hip',k*.30,.21,-.25);set(p,s+'Knee',k*.40,.70,-.78);
   set(p,s+'Ankle',k*.40,.10,-1.19);set(p,s+'Toe',k*.40,.04,-.98);
  }break;
 case 'march':{
  const wave=Math.sin(TAU*phase);
  for(const [s,k] of [['l',-1],['r',1]]){
   const w=k*wave;
   p[s+'Knee'][1]+=.29*Math.max(0,w);
   p[s+'Knee'][2]+=.34*w;
   p[s+'Ankle'][1]+=.18*Math.max(0,w);
   p[s+'Ankle'][2]+=.44*w;
   p[s+'Toe'][1]+=.18*Math.max(0,w);
   p[s+'Toe'][2]+=.44*w;
   p[s+'Elbow'][2]-=.36*w;
   p[s+'Wrist'][2]-=.48*w;
  }break;
 }
 case 'inclinePushup':{
  const h=.70+.29*a;
  set(p,'pelvis',0,.55+.30*a,-.22);
  set(p,'neck',0,h+.18,1.02);set(p,'head',0,h+.18,1.36);
  for(const [side,k] of [['l',-1],['r',1]]){
   set(p,side+'Shoulder',k*.53,h+.13,.86);
   set(p,side+'Elbow',k*.80,.56+.22*a,1.20);
   set(p,side+'Wrist',k*.80,1.03,1.51);
   set(p,side+'Hip',k*.32,.55+.30*a,-.22);
   set(p,side+'Knee',k*.32,.29,-1.02);
   set(p,side+'Ankle',k*.32,.10,-1.55);
   set(p,side+'Toe',k*.32,.06,-1.77);
  }break;
 }
 case 'pulldown':
  move(p,['pelvis','lHip','rHip'],1,-.30);
  for(const [side,k] of [['l',-1],['r',1]]){
   set(p,side+'Elbow',k*(1.04-.26*a),3.20-.68*a,.12+.22*a);
   set(p,side+'Wrist',k*(1.12-.39*a),3.73-1.00*a,.12+.29*a);
  }break;
 case 'frontRaise':
  for(const [side,k] of [['l',-1],['r',1]]){
   set(p,side+'Elbow',k*.67,2.06+.30*a,.18+.39*a);
   set(p,side+'Wrist',k*.66,1.44+1.10*a,.22+.93*a);
  }break;
 case 'alternatingCurl':
  for(const [side,k] of [['l',-1],['r',1]]){
   const wave=phaseAmount(phase+(side==='r'?.5:0));
   set(p,side+'Elbow',k*.70,2.04,.14);
   set(p,side+'Wrist',k*(.70-.14*wave),1.41+1.03*wave,.25+.17*wave);
  }break;
 case 'overheadExtension':
  for(const [side,k] of [['l',-1],['r',1]]){
   set(p,side+'Elbow',k*.42,3.12,-.16);
   set(p,side+'Wrist',k*.39,2.68+.82*a,-.32-.13*a);
  }break;
 case 'lunge':
  move(p,['pelvis','lHip','rHip',...upper],1,-.53*a);
  for(const side of ['l','r']){
   if(side==='r'){
    set(p,'rKnee',.39,.82-.28*a,.17+.61*a);
    set(p,'rAnkle',.39,.12,.01+.86*a);
    set(p,'rToe',.39,.04,.36+.86*a);
   }else{set(p,'lKnee',-.38,.84-.52*a,.12-.22*a);}
  }break;
 case 'standingLegCurl':
  set(p,'rKnee',.37,.88,.10+.09*a);
  set(p,'rAnkle',.37,.11+.78*a,.02-.59*a);
  set(p,'rToe',.37,.05+.79*a,.37-.69*a);
  break;
 case 'quadrupedKickback':
 case 'catCow':
  set(p,'pelvis',0,.88,-.55);set(p,'neck',0,.88,.65);set(p,'head',0,.94,1.00);
  for(const [side,k] of [['l',-1],['r',1]]){
   set(p,side+'Shoulder',k*.45,.85,.55);
   set(p,side+'Elbow',k*.49,.49,.78);set(p,side+'Wrist',k*.49,.12,.81);
   set(p,side+'Hip',k*.34,.87,-.54);
   set(p,side+'Knee',k*.39,.13,-.57);
   set(p,side+'Ankle',k*.39,.09,-.81);
   set(p,side+'Toe',k*.39,.06,-1.01);
  }
  if(spec.motion==='quadrupedKickback'){
   set(p,'rKnee',.40,.14+.43*a,-.57-.56*a);
   set(p,'rAnkle',.41,.09+.59*a,-.81-.72*a);
   set(p,'rToe',.41,.07+.60*a,-1.01-.77*a);
  }else{
   p.neck[1]+=.13*a;p.head[1]+=.18*a;p.head[2]+=.08*a;
   p.pelvis[1]-=.11*a;
  }break;
 case 'singleCalf':
  move(p,all,1,.18*a);
  set(p,'lKnee',-.36,1.17+.18*a,.45);
  set(p,'lAnkle',-.37,.71+.18*a,.62);
  set(p,'lToe',-.37,.66+.18*a,.78);
  p.rAnkle[1]=.12+.06*a;p.rToe[1]=.04;
  break;
 case 'sidePlank':{
  set(p,'pelvis',0,.46+.07*a,-.15);set(p,'neck',0,.71+.07*a,1.03);
  set(p,'head',0,.82+.07*a,1.43);
  for(const [side,k] of [['l',-1],['r',1]]){
   set(p,side+'Shoulder',k*.28,.68+.07*a,1.02);
   set(p,side+'Elbow',k*.33,side==='l'?.22:1.12,1.18);
   set(p,side+'Wrist',k*.35,side==='l'?.08:1.59,1.33);
   set(p,side+'Hip',k*.23,.44+.07*a,-.18);
   set(p,side+'Knee',k*.21,.28,-1.14);
   set(p,side+'Ankle',k*.21,.13,-1.79);
   set(p,side+'Toe',k*.21,.07,-1.94);
  }break;
 }
 case 'stepJack':
  for(const [side,k] of [['l',-1],['r',1]]){
   const wave=phaseAmount(phase+(side==='r'?.5:0));
   set(p,side+'Knee',k*(.36+.40*wave),.84,.12);
   set(p,side+'Ankle',k*(.36+.62*wave),.12,.02);
   set(p,side+'Toe',k*(.36+.62*wave),.04,.37);
   set(p,side+'Elbow',k*(.77+.19*wave),2.18+.62*wave,.03);
   set(p,side+'Wrist',k*(.79+.12*wave),1.44+1.84*wave,.14);
  }break;
 case 'shoulders':
  for(const [s,k] of [['l',-1],['r',1]]){
   const t=TAU*phase+(k===1?0:Math.PI);
   set(p,s+'Elbow',k*(.72+.24*Math.cos(t)),2.32+.30*Math.sin(t),.20+.22*Math.sin(t));
   set(p,s+'Wrist',k*(.85+.35*Math.cos(t)),1.96+.42*Math.sin(t),.34+.22*Math.sin(t));
  }break;
 }
 return p;
}
export function motionLabel(id,phase){
 const spec=schematics[id];if(!spec)return '';
 if(['march','shoulders','alternatingCurl','stepJack','jog','lateralWalk'].includes(spec.motion))return 'Cycle alterné';
 if(spec.motion==='sidePlank')return 'Maintien dynamique';
 return (((phase%1)+1)%1)<.5?'Phase aller':'Phase retour';
}
const connections=[
 ['pelvis','neck',37,'torso'],['neck','head',17,'head'],
 ['lShoulder','rShoulder',28,'torso'],['lHip','rHip',32,'torso'],
 ...['l','r'].flatMap(s=>[
  ['neck',s+'Shoulder',27,'torso'],
  [s+'Shoulder',s+'Elbow',23,'arms'],
  [s+'Elbow',s+'Wrist',17,'arms'],
  ['pelvis',s+'Hip',29,'torso'],
  [s+'Hip',s+'Knee',31,'legs'],
  [s+'Knee',s+'Ankle',22,'legs'],
  [s+'Ankle',s+'Toe',15,'legs'],
 ])
];
export const skeletonConnections=connections.map(x=>Object.freeze(x));
export function projectPoint(point,yaw=-.48){
 const [x,y,z]=point,c=Math.cos(yaw),s=Math.sin(yaw);
 const rotatedX=x*c-z*s,depth=x*s+z*c;
 return {x:350+rotatedX*116,y:574-y*116+depth*23,depth};
}
export function drawSchematic(ctx,id,elapsed,yaw=-.48,{showMuscles=true}={}){
 const spec=schematics[id];if(!spec)return;
 const p=poseForExercise(id,elapsed/schematicDuration);
 const points=Object.fromEntries(Object.entries(p).map(([key,value])=>[key,projectPoint(value,yaw)]));
 ctx.save();
 // Reference floor grid conveys camera orientation, not a measured 3D space.
 ctx.strokeStyle='#e1e7f1';ctx.lineWidth=1;
 for(let i=-4;i<=4;i++){
  const a=projectPoint([i*.48,0,-2.2],yaw),b=projectPoint([i*.48,0,2.2],yaw);
  const c=projectPoint([-2,0,i*.5],yaw),d=projectPoint([2,0,i*.5],yaw);
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.stroke();
 }
 const highlight=spec.motion==='squat'?'legs':spec.motion==='hinge'?'legs':
  spec.motion==='pushup'||spec.motion==='row'||spec.motion==='press'||spec.motion==='curl'||spec.motion==='triceps'||spec.motion==='shoulders'?'arms':
  spec.motion==='bridge'||spec.motion==='crunch'?'torso':'legs';
 const colors={torso:'#7988a8',arms:'#8094b3',legs:'#687d9f',head:'#7a88a9'};
 const projected=connections.map(([a,b,width,zone])=>({a:points[a],b:points[b],width,zone,depth:(points[a].depth+points[b].depth)/2})).sort((a,b)=>b.depth-a.depth);
 for(const seg of projected){
  const {a,b,width,zone}=seg;
  ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
  ctx.strokeStyle='#354763';ctx.lineWidth=width+5;ctx.stroke();
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=zone===highlight?'#9671e8':colors[zone];ctx.lineWidth=width;ctx.stroke();
  ctx.beginPath();ctx.moveTo(a.x-3,a.y-3);ctx.lineTo(b.x-3,b.y-3);ctx.strokeStyle='rgba(255,255,255,.24)';ctx.lineWidth=Math.max(3,width*.20);ctx.stroke();
 }
 const joints=Object.entries(points).sort((a,b)=>b[1].depth-a[1].depth);
 for(const [name,pt] of joints){
  const radius=name==='head'?27:name==='pelvis'?19:name.endsWith('Shoulder')||name.endsWith('Hip')?14:9;
  const grad=ctx.createRadialGradient(pt.x-5,pt.y-7,2,pt.x,pt.y,radius+3);
  grad.addColorStop(0,'#c6c4f0');grad.addColorStop(1,name==='head'?'#607293':'#6c579f');
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(pt.x,pt.y,radius,0,TAU);ctx.fill();
 }
 if(showMuscles)drawAnatomyOverlay(ctx,points,id);
 ctx.font='600 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#66738b';
 ctx.fillText('SCHÉMA 3D SIMPLIFIÉ · MOUVEMENT INDICATIF',350,665);
 ctx.restore();
}
