/**
 * Procedural three-dimensional educational mannequin meshes.
 * Real triangle surfaces + surface normals; NOT a clinically validated anatomy.
 * Coordinates use metres-ish catalogue units and are NOT measured human bones.
 */
export const meshMaterials=Object.freeze(['ceramique','ardoise']);
const P={
 ceramique:{body:[.77,.73,.71],head:[.85,.81,.78],joints:[.73,.68,.67],shorts:[.24,.29,.40],shoes:[.28,.34,.45],muscle:[.93,.38,.31]},
 ardoise:{body:[.49,.61,.76],head:[.68,.77,.85],joints:[.40,.52,.69],shorts:[.19,.25,.34],shoes:[.22,.32,.43],muscle:[.93,.48,.35]},
};
export function meshPalette(material='ceramique'){return P[material]??P.ceramique;}
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const scale=(v,s)=>v.map(x=>x*s);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const length=a=>Math.hypot(...a);
export const normalize=a=>scale(a,1/(length(a)||1));
const lerp=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const bounded=(n,min,max)=>Math.min(max,Math.max(min,n));
function triangle(out,a,na,b,nb,c,nc,color){
 for(const [p,n] of [[a,na],[b,nb],[c,nc]])out.push(...p,...n,...color);
}
function basis(a,b){
 const forward=normalize(sub(b,a));
 const seed=Math.abs(dot(forward,[0,1,0]))>.95?[0,0,1]:[0,1,0];
 const u=normalize(cross(forward,seed)),v=normalize(cross(forward,u));
 return {forward,u,v};
}
/**
 * Closed tapered surface between two articulated joints.
 * Every ring is in genuine 3D space and has a normal for the lighting shader.
 */
export function addTaperedBone(out,a,b,rA,rB,color,{sides=12,rings=5,flatten=1}={}){
 if(![...a,...b,rA,rB].every(Number.isFinite))throw Error('Invalid mesh bone');
 if(length(sub(a,b))<.0001)return;
 const {u,v}=basis(a,b);
 const ring=(t,j)=>{
  const ang=Math.PI*2*j/sides,along=lerp(a,b,t);
  const rad=(rA+(rB-rA)*t)*(1+.10*Math.sin(Math.PI*t));
  const radial=add(scale(u,Math.cos(ang)),scale(v,Math.sin(ang)*flatten));
  return {p:add(along,scale(radial,rad)),n:normalize(add(scale(u,Math.cos(ang)),scale(v,Math.sin(ang)/flatten)))};
 };
 for(let k=0;k<rings;k++){
  const t0=k/rings,t1=(k+1)/rings;
  for(let j=0;j<sides;j++){
   const q0=ring(t0,j),q1=ring(t1,j),q2=ring(t1,j+1),q3=ring(t0,j+1);
   triangle(out,q0.p,q0.n,q1.p,q1.n,q2.p,q2.n,color);
   triangle(out,q0.p,q0.n,q2.p,q2.n,q3.p,q3.n,color);
  }
 }
}
/** Ellipsoid, independent axis scales, with smooth latitudinal normals. */
export function addEllipsoid(out,origin,radii,color,{slices=14,stacks=10}={}){
 if(![...origin,...radii].every(Number.isFinite)||radii.some(n=>n<=0))throw Error('Invalid ellipsoid');
 const at=(lat,lon)=>{
  const t=Math.PI*lat/stacks,p=2*Math.PI*lon/slices;
  const sphere=[Math.sin(t)*Math.cos(p),Math.cos(t),Math.sin(t)*Math.sin(p)];
  return {pos:add(origin,sphere.map((n,i)=>n*radii[i])),normal:normalize(sphere.map((n,i)=>n/radii[i]))};
 };
 for(let i=0;i<stacks;i++)for(let j=0;j<slices;j++){
  const a=at(i,j),b=at(i+1,j),c=at(i+1,j+1),d=at(i,j+1);
  if(i>0)triangle(out,a.pos,a.normal,b.pos,b.normal,d.pos,d.normal,color);
  if(i<stacks-1)triangle(out,b.pos,b.normal,c.pos,c.normal,d.pos,d.normal,color);
 }
}
/** Smooth torso, using a continuous multi-ring silhouette. */
export function addTorso(out,p,color){
 const pelvis=p.pelvis,neck=p.neck,{u,v}=basis(pelvis,neck);
 const widths=[.34,.39,.31,.45,.50,.31],depths=[.24,.28,.24,.29,.27,.20];
 const sections=widths.length,sides=16;
 const section=(i,j)=>{
  const t=i/(sections-1),c=lerp(pelvis,neck,t),angle=2*Math.PI*j/sides;
  const d=add(scale(u,Math.cos(angle)*widths[i]),scale(v,Math.sin(angle)*depths[i]));
  const normal=normalize(add(scale(u,Math.cos(angle)/widths[i]),scale(v,Math.sin(angle)/depths[i])));
  return {pos:add(c,d),normal};
 };
 for(let i=0;i<sections-1;i++)for(let j=0;j<sides;j++){
  const a=section(i,j),b=section(i+1,j),c=section(i+1,j+1),d=section(i,j+1);
  triangle(out,a.pos,a.normal,b.pos,b.normal,d.pos,d.normal,color);
  triangle(out,d.pos,d.normal,b.pos,b.normal,c.pos,c.normal,color);
 }
}
/**
 * Localized educational muscle regions. These overlays are broad landmarks,
 * NOT anatomical insertions or measurements of muscle activation.
 * Keep base silhouette neutral so only the selected region receives coral.
 */
export const regionLabels=Object.freeze({
 'Pectoraux':'Poitrine', 'Dos':'Haut du dos', 'Épaules':'Épaules',
 'Biceps':'Avant du bras', 'Triceps':'Arrière du bras',
 'Quadriceps':'Avant des cuisses', 'Ischio-jambiers':'Arrière des cuisses',
 'Fessiers':'Bassin', 'Mollets':'Bas des jambes',
 'Abdominaux':'Tronc', 'Cardio':'Repères de mouvement', 'Mobilité':'Articulations mobiles'
});
export function addAnatomicalRegionMeshes(out,pose,group,color){
 if(!regionLabels[group])return;
 const marker=(p,r)=>addEllipsoid(out,p,r,color,{slices:10,stacks:7});
 const blend=(a,b,t)=>lerp(a,b,t);
 const shiftZ=(p,d)=>[p[0],p[1],p[2]+d];
 const points=['l','r'];
 switch(group){
 case 'Pectoraux':
  for(const side of points){
   const center=blend(pose[side+'Shoulder'],pose.pelvis,.28);
   marker(shiftZ(center,.25),[.21,.17,.085]);
  }break;
 case 'Dos':
  for(const side of points){
   const center=blend(pose[side+'Shoulder'],pose.pelvis,.45);
   marker(shiftZ(center,-.22),[.17,.26,.075]);
  }break;
 case 'Épaules':
 case 'Mobilité':
  for(const side of points)marker(pose[side+'Shoulder'],[.185,.16,.16]);
  break;
 case 'Biceps':
 case 'Triceps':
  for(const side of points){
   const center=blend(pose[side+'Shoulder'],pose[side+'Elbow'],.47);
   marker(shiftZ(center,group==='Triceps'?-.13:.12),[.12,.21,.09]);
  }break;
 case 'Quadriceps':
 case 'Ischio-jambiers':
  for(const side of points){
   const center=blend(pose[side+'Hip'],pose[side+'Knee'],.45);
   marker(shiftZ(center,group==='Quadriceps'?.15:-.16),[.16,.23,.10]);
  }break;
 case 'Fessiers':
  for(const side of points)marker(shiftZ(pose[side+'Hip'],-.13),[.19,.20,.12]);
  break;
 case 'Mollets':
  for(const side of points){
   const center=blend(pose[side+'Knee'],pose[side+'Ankle'],.35);
   marker(shiftZ(center,-.12),[.13,.22,.09]);
  }break;
 case 'Abdominaux':
  for(const side of points){
   const center=blend(pose.pelvis,pose.neck,.44);
   marker([center[0]+(side==='l'?-.11:.11),center[1],center[2]+.24],[.12,.28,.08]);
  }break;
 case 'Cardio':
  // No single cardio muscle: subtle paired movement markers.
  for(const side of points){
   marker(pose[side+'Shoulder'],[.11,.11,.11]);
   marker(blend(pose[side+'Hip'],pose[side+'Knee'],.55),[.12,.13,.11]);
  }break;
 }
}
/** Complete mesh, regenerable at each frame from the same moving joint map. */
export function buildAnatomicalMesh(pose,{material='ceramique',showMuscles=true,group=''}={}){
 const out=[],palette=meshPalette(material);
 for(const key of ['pelvis','neck','head',...['l','r'].flatMap(s=>['Shoulder','Elbow','Wrist','Hip','Knee','Ankle','Toe'].map(v=>s+v))]){
  const point=pose[key];if(!point||point.length!==3||point.some(n=>!Number.isFinite(n)))throw Error('Invalid pose joint: '+key);
 }
 // Ground below the feet: real 3D triangles, subtle lighting and perspective.
 const floor=[[-3,-.06,-3],[3,-.06,-3],[3,-.06,3],[-3,-.06,3]],n=[0,1,0],fc=[.93,.95,.98];
 triangle(out,floor[0],n,floor[2],n,floor[1],n,fc);
 triangle(out,floor[0],n,floor[3],n,floor[2],n,fc);
 addTorso(out,pose,palette.body);
 addEllipsoid(out,pose.pelvis,[.39,.28,.26],palette.shorts);
 addTaperedBone(out,pose.neck,pose.head,.15,.105,palette.body,{flatten:.83});
 addEllipsoid(out,pose.head,[.245,.285,.228],palette.head);
 for(const side of ['l','r']){
  const [hip,knee,ankle,toe,shoulder,elbow,wrist]=['Hip','Knee','Ankle','Toe','Shoulder','Elbow','Wrist'].map(part=>pose[side+part]);
  addTaperedBone(out,hip,knee,.235,.17,palette.body,{flatten:.83});
  addTaperedBone(out,knee,ankle,.164,.107,palette.body,{flatten:.87});
  addEllipsoid(out,knee,[.16,.16,.16],palette.joints);
  addTaperedBone(out,ankle,toe,.095,.13,palette.shoes,{flatten:.73});
  addEllipsoid(out,toe,[.16,.075,.20],palette.shoes);
  addTaperedBone(out,shoulder,elbow,.178,.125,palette.body,{flatten:.95});
  addTaperedBone(out,elbow,wrist,.123,.088,palette.body,{flatten:.92});
  addEllipsoid(out,shoulder,[.19,.19,.18],palette.joints);
  addEllipsoid(out,elbow,[.126,.13,.13],palette.joints);
  addEllipsoid(out,wrist,[.103,.155,.095],palette.body);
 }
 if(showMuscles)addAnatomicalRegionMeshes(out,pose,group,palette.muscle);
 return new Float32Array(out);
}
/** Column-major matrices suitable for WebGL. */
export function perspective(fov,aspect,near=.1,far=100){
 const f=1/Math.tan(fov/2),nf=1/(near-far);
 return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);
}
export function lookAt(eye,target,up=[0,1,0]){
 const z=normalize(sub(eye,target)),x=normalize(cross(up,z)),y=cross(z,x);
 return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
}
export function orbitCamera(yaw,pitch,distance){
 const elevation=bounded(pitch,-1.2,1.2),d=bounded(distance,3.7,18);
 const target=[0,1.47,0],eye=[Math.sin(yaw)*Math.cos(elevation)*d,1.47+Math.sin(elevation)*d,Math.cos(yaw)*Math.cos(elevation)*d];
 return {eye,target,view:lookAt(eye,target)};
}
