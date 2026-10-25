import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../public/exercises-illustrated/catalog.mjs';
import { illustrations } from '../public/exercises-illustrated/illustrations.mjs';
import { schematics, schematicDuration, poseForExercise, phaseAmount, skeletonConnections, projectPoint } from '../public/exercises-illustrated/schematic-3d.mjs';

test('3D schematics are associated to distinct real catalogue exercises',()=>{
 assert.equal(Object.keys(schematics).length,12);
 const groupSet=new Set();
 for(const [id,model] of Object.entries(schematics)){
  const ex=catalogue.find(e=>e.id===id);
  assert.ok(ex, 'unknown exercise: '+id);
  assert.equal(model.label,ex.name);
  assert.equal(illustrations[id],undefined,'do not substitute the original GIF');
  groupSet.add(ex.group);
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
