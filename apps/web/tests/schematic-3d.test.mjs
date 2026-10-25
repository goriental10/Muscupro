import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../public/exercises-illustrated/catalog.mjs';
import { illustrations } from '../public/exercises-illustrated/illustrations.mjs';
import { schematics, schematicDuration, poseForExercise, phaseAmount, skeletonConnections, projectPoint, drawSchematic } from '../public/exercises-illustrated/schematic-3d.mjs';
import { anatomicalZones, anatomicalZoneForId, groupForSchematicId } from '../public/exercises-illustrated/anatomy-zones.mjs';

test('3D schematics are associated to distinct real catalogue exercises',()=>{
 assert.equal(Object.keys(schematics).length,24);
 const groupSet=new Set();
 for(const [id,model] of Object.entries(schematics)){
  const ex=catalogue.find(e=>e.id===id);
  assert.ok(ex, 'unknown exercise: '+id);
  assert.equal(model.label,ex.name);
  assert.equal(illustrations[id],undefined,'do not substitute the original GIF');
  groupSet.add(ex.group);
  assert.equal(groupForSchematicId(id),ex.group);
  assert.ok(anatomicalZoneForId(id)?.label,'Missing region for '+id);
 }
 assert.equal(groupSet.size,12);
 assert.equal(schematicDuration,3600);
});
test('animation produces 3D joint positions and smooth closed cycles',()=>{
 for(const id of Object.keys(schematics)){
  for(let i=0;i<=120;i++){
   const pose=poseForExercise(id,i/120);
   for(const point of Object.values(pose)){
    assert.equal(point.length,3);
    assert.ok(point.every(Number.isFinite),id+' contains invalid 3D coordinates');
    const projected=projectPoint(point,.6);
    assert.ok(Number.isFinite(projected.x)&&Number.isFinite(projected.y));
   }
   for(const [a,b] of skeletonConnections){assert.ok(pose[a]&&pose[b],id+' missing joint '+a+' / '+b);}
  }
  const start=poseForExercise(id,0),end=poseForExercise(id,1);
  for(const key of Object.keys(start))for(let axis=0;axis<3;axis++)assert.ok(Math.abs(start[key][axis]-end[key][axis])<1e-9,id+' has a discontinuous seam');
 }
 assert.equal(phaseAmount(0),0);assert.equal(phaseAmount(.5),1);assert.ok(phaseAmount(.01)<.01);
});

test('each exercise has a changing movement and a loop without discontinuity',()=>{
 const poses=[];
 for(const id of Object.keys(schematics)){
  const first=poseForExercise(id,.25),second=poseForExercise(id,.5);
  assert.notDeepEqual(first,second,'motion must be visible for '+id);
  const atStart=poseForExercise(id,0),beforeSeam=poseForExercise(id,1-1e-5);
  for(const [key,start] of Object.entries(atStart)){
   assert.ok(Math.hypot(...start.map((n,i)=>n-beforeSeam[key][i]))<.01,id+' seam '+key);
  }
  poses.push(JSON.stringify(first));
 }
 assert.equal(new Set(poses).size,24,'every movement should have its own modelled pose');
});

test('all 12 muscle groups provide nonempty illustrative overlays',()=>{
 assert.equal(Object.keys(anatomicalZones).length,12);
 for(const [group,zone] of Object.entries(anatomicalZones)){
  assert.ok(zone.label&&zone.segments.length>0,group);
  for(const segment of zone.segments){assert.ok(segment.length>=3);assert.ok(segment[2]>0);}
 }
});

test('schematics render with and without overlay, without relying on a browser',()=>{
 const gradient=()=>({addColorStop(){}});
 const ctx={save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fill(){},fillText(){},ellipse(){},createLinearGradient:gradient,createRadialGradient:gradient};
 for(const id of Object.keys(schematics)){
  assert.doesNotThrow(()=>drawSchematic(ctx,id,725,.2,{showMuscles:true}),id+' overlay');
  assert.doesNotThrow(()=>drawSchematic(ctx,id,925,-.8,{showMuscles:false}),id+' no overlay');
 }
});
