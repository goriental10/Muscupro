import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogue } from '../public/exercises-illustrated/catalog.mjs';
import { illustrations } from '../public/exercises-illustrated/illustrations.mjs';
import { schematics, schematicDuration, poseForExercise, phaseAmount, skeletonConnections, projectPoint, drawSchematic } from '../public/exercises-illustrated/schematic-3d.mjs';
import { anatomicalZones, anatomicalZoneForId, groupForSchematicId } from '../public/exercises-illustrated/anatomy-zones.mjs';
import { extraSchematics,applyExtraMotion } from '../public/exercises-illustrated/schematic-extra-motions.mjs';
import { fourthSchematics,applyFourthMotion } from '../public/exercises-illustrated/schematic-fourth-motions.mjs';
import {fifthSchematics,applyFifthMotion} from '../public/exercises-illustrated/schematic-fifth-motions.mjs';
import { figureStyles,segmentGradientStops } from '../public/exercises-illustrated/figure-surface.mjs';
import {mannequinMaterials,mannequinPalette,drawMannequin,drawTaperedLimb,drawMannequinTrunk} from '../public/exercises-illustrated/mannequin-renderer.mjs';

test('3D schematics are associated to distinct real catalogue exercises',()=>{
 assert.equal(Object.keys(schematics).length,60);
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
 assert.equal(new Set(poses).size,60,'every movement should have its own modelled pose');
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
 const ctx={save(){},restore(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},bezierCurveTo(){},quadraticCurveTo(){},stroke(){},arc(){},fill(){},fillText(){},ellipse(){},createLinearGradient:gradient,createRadialGradient:gradient};
 for(const id of Object.keys(schematics)){
  assert.doesNotThrow(()=>drawSchematic(ctx,id,725,.2,{showMuscles:true,figureStyle:'mannequin',material:'ceramique'}),id+' styled mannequin');
  assert.doesNotThrow(()=>drawSchematic(ctx,id,725,.2,{showMuscles:true,figureStyle:'mannequin',material:'ardoise'}),id+' alternate mannequin surface');
  assert.doesNotThrow(()=>drawSchematic(ctx,id,725,.2,{showMuscles:true,figureStyle:'relief'}),id+' shaded overlay');
  assert.doesNotThrow(()=>drawSchematic(ctx,id,925,-.8,{showMuscles:false,figureStyle:'structure'}),id+' original structure');
 }
});

test('12 additional movements have distinct IDs and one model per catalogue group',()=>{
 assert.equal(Object.keys(extraSchematics).length,12);
 const groups=new Set();
 for(const [id,spec] of Object.entries(extraSchematics)){
  const matching=catalogue.find(item=>item.id===id);
  assert.ok(matching,id);
  assert.equal(matching.name,spec.label);
  groups.add(matching.group);
  assert.doesNotThrow(()=>poseForExercise(id,.37));
 }
 assert.equal(groups.size,12);
 assert.equal(new Set(Object.values(extraSchematics).map(m=>m.motion)).size,12);
 assert.throws(()=>applyExtraMotion('unknown',0,{}));
});
test('relief visual style offers multiple depth-shading palettes',()=>{
 assert.deepEqual([...figureStyles],['relief','structure']);
 for(const zone of ['torso','head','arms','legs']){
  assert.equal(segmentGradientStops(zone).length,4);
  assert.equal(segmentGradientStops(zone,true).length,4);
 }
});

test('fourth motion batch contains 12 original movement types and one new exercise per group',()=>{
 const ids=Object.keys(fourthSchematics);
 assert.equal(ids.length,12);
 const groups=new Set();
 const types=new Set(Object.values(fourthSchematics).map(x=>x.motion));
 assert.equal(types.size,12);
 for(const [id,spec] of Object.entries(fourthSchematics)){
  const exercise=catalogue.find(x=>x.id===id);
  assert.ok(exercise,'exercise not in catalogue: '+id);
  assert.equal(exercise.name,spec.label);
  assert.equal(illustrations[id],undefined,'original GIF must stay exercise-specific');
  assert.equal(extraSchematics[id],undefined,'third batch must stay separate');
  groups.add(exercise.group);
  assert.ok(anatomicalZoneForId(id));
  assert.notDeepEqual(poseForExercise(id,.25),poseForExercise(id,.5),'must animate '+id);
 }
 assert.equal(groups.size,12);
 assert.throws(()=>applyFourthMotion('unknown',0,{}));
 assert.throws(()=>applyFourthMotion('kneePushup',Number.NaN,{}));
});
test('all 48 schematic animations and the original form 49 distinct media associations',()=>{
 const illustrated=new Set(Object.keys(illustrations));
 const animated=new Set([...illustrated,...Object.keys(schematics)]);
 assert.equal(animated.size,61);
 assert.equal(catalogue.length,141);
 for(const id of animated)assert.ok(catalogue.some(e=>e.id===id),id);
 assert.equal(catalogue.length-animated.size,80);
});

test('mannequin has two independent material palettes and organic silhouette',()=>{
 assert.deepEqual([...mannequinMaterials],['ceramique','ardoise']);
 assert.notDeepEqual(mannequinPalette('ceramique'),mannequinPalette('ardoise'));
 assert.deepEqual(mannequinPalette('invalid'),mannequinPalette('ceramique'));
 const calls={bezier:0,quadratic:0,ellipse:0};
 const gradient=()=>({addColorStop(){}});
 const ctx={save(){},restore(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},bezierCurveTo(){calls.bezier++},quadraticCurveTo(){calls.quadratic++},stroke(){},arc(){},fill(){},fillText(){},ellipse(){calls.ellipse++},createLinearGradient:gradient,createRadialGradient:gradient};
 const points=poseForExercise('quadriceps-squat',.36);
 const projected=Object.fromEntries(Object.entries(points).map(([key,value])=>[key,projectPoint(value)]));
 drawTaperedLimb(ctx,projected.lHip,projected.lKnee,22,16,mannequinPalette());
 drawMannequinTrunk(ctx,projected,mannequinPalette());
 drawMannequin(ctx,projected,'ceramique');
 assert.ok(calls.bezier>20,'smooth, tapered transitions are drawn');
 assert.ok(calls.quadratic>20,'torso and limb curves are drawn');
 assert.ok(calls.ellipse>10,'head, hands, feet and joints are rendered');
});

test('fifth set has 12 unique exercise-specific loops in all groups',()=>{
 assert.equal(Object.keys(fifthSchematics).length,12);
 const groups=new Set(),types=new Set();
 for(const [id,spec] of Object.entries(fifthSchematics)){
  const exercise=catalogue.find(x=>x.id===id);
  assert.ok(exercise,'missing exercise: '+id);
  assert.equal(exercise.name,spec.label);
  assert.ok(!illustrations[id]&&!extraSchematics[id]&&!fourthSchematics[id]);
  groups.add(exercise.group);types.add(spec.motion);
  const before=poseForExercise(id,1-1e-5),atStart=poseForExercise(id,0);
  for(const key of Object.keys(before)){
   assert.ok(Math.hypot(...before[key].map((x,i)=>x-atStart[key][i]))<.015,id+' discontinuous movement: '+key);
  }
  assert.notDeepEqual(poseForExercise(id,.24),poseForExercise(id,.50));
 }
 assert.equal(groups.size,12);assert.equal(types.size,12);
 assert.throws(()=>applyFifthMotion('invalid',0,{}));
 assert.throws(()=>applyFifthMotion('floorPress',Number.NaN,{}));
});
