import test from 'node:test';
import assert from 'node:assert/strict';
import {catalogue} from '../public/exercises-illustrated/catalog.mjs';
import {illustrations} from '../public/exercises-illustrated/illustrations.mjs';
import {schematics,poseForExercise,schematicDuration} from '../public/exercises-illustrated/schematic-3d.mjs';
import {groupForSchematicId} from '../public/exercises-illustrated/anatomy-zones.mjs';
import {addTaperedBone,addEllipsoid,addTorso,buildAnatomicalMesh,meshMaterials,meshPalette,perspective,lookAt,orbitCamera,regionLabels,addAnatomicalRegionMeshes} from '../public/exercises-illustrated/webgl-mesh.mjs';

test('3D mesh constructs normals, colors, and triangles without dependencies',()=>{
 const out=[];
 addTaperedBone(out,[0,0,0],[0,2,0],.25,.10,[.5,.5,.5]);
 assert.ok(out.length>600);
 assert.equal(out.length%27,0);
 const sphere=[];
 addEllipsoid(sphere,[0,0,0],[.4,.6,.4],[.5,.6,.7]);
 assert.ok(sphere.length>500);
 assert.equal(sphere.length%27,0);
 const pose=poseForExercise('quadriceps-squat',.37),torso=[];
 addTorso(torso,pose,[.3,.4,.5]);
 assert.ok(torso.length>300);
 assert.equal(torso.length%27,0);
 for(const array of [out,sphere,torso])assert.ok(array.every(Number.isFinite));
 assert.throws(()=>addTaperedBone([],[0,0,0],[0,Number.NaN,0],.2,.1,[1,1,1]));
 assert.throws(()=>addEllipsoid([],[0,0,0],[-1,1,1],[1,1,1]));
});
test('WebGL meshes cover all 48 matching exercise motions with finite normals at multiple phases',()=>{
 assert.equal(Object.keys(schematics).length,60);
 assert.equal(catalogue.length,141);
 assert.equal(Object.keys(illustrations).length,1);
 const animatedIds=new Set([...Object.keys(schematics),...Object.keys(illustrations)]);
 assert.equal(animatedIds.size,61);
 assert.equal(catalogue.length-animatedIds.size,80);
 for(const [id] of Object.entries(schematics)){
  const exercise=catalogue.find(item=>item.id===id);
  assert.ok(exercise,id);
  for(const phase of [0,.24,.50,.75,.999999]){
   const pose=poseForExercise(id,phase);
   for(const material of ['ceramique','ardoise']){
    const mesh=buildAnatomicalMesh(pose,{material,group:exercise.group,showMuscles:phase>.25});
    assert.ok(mesh instanceof Float32Array,id);
    assert.ok(mesh.length>2000);
    assert.equal(mesh.length%27,0);
    assert.ok(mesh.every(Number.isFinite),id+' invalid geometry '+phase);
    for(let n=3;n<mesh.length;n+=9){
     const size=Math.hypot(mesh[n],mesh[n+1],mesh[n+2]);
     assert.ok(Math.abs(size-1)<.0001,id+' normal not normalized: '+size);
    }
   }
  }
 }
});
test('3D model viewpoints use finite camera and projection matrices',()=>{
 const projection=perspective(Math.PI/4,1.78);
 assert.equal(projection.length,16);assert.ok(projection.every(Number.isFinite));
 const view=lookAt([4,3,7],[0,1,0]);
 assert.equal(view.length,16);assert.ok(view.every(Number.isFinite));
 const front=orbitCamera(0,.1,7),back=orbitCamera(Math.PI,.1,7);
 assert.notDeepEqual(Array.from(front.view),Array.from(back.view));
 for(const yaw of [-Math.PI,-.6,0,.6,Math.PI]){
  for(const pitch of [-2,-.5,0,.5,2]){
   const {view:camera}=orbitCamera(yaw,pitch,7);
   assert.ok(camera.every(Number.isFinite));
  }
 }
 assert.deepEqual([...meshMaterials],['ceramique','ardoise']);
 assert.notDeepEqual(meshPalette('ceramique'),meshPalette('ardoise'));
 assert.deepEqual(meshPalette('unknown'),meshPalette('ceramique'));
});
test('WebGL renderer shader module imports without requiring DOM when not instantiated',async()=>{
 const {WebGLMannequinLayer}=await import('../public/exercises-illustrated/webgl-mannequin.mjs');
 assert.equal(typeof WebGLMannequinLayer,'function');
});

test('localized 3D muscle landmarks have group-specific geometry without recoloring entire limbs',()=>{
 assert.equal(Object.keys(regionLabels).length,12);
 const pose=poseForExercise('quadriceps-squat',.40),main=[];
 const neutral=buildAnatomicalMesh(pose,{group:'Quadriceps',showMuscles:false});
 for(const group of Object.keys(regionLabels)){
  const out=[];addAnatomicalRegionMeshes(out,pose,group,[.93,.38,.31]);
  assert.ok(out.length>250,group+' missing 3D muscle landmarks');
  assert.equal(out.length%27,0);
  assert.ok(out.every(Number.isFinite),group+' invalid landmark vertices');
  const highlighted=buildAnatomicalMesh(pose,{group,showMuscles:true});
  assert.ok(highlighted.length>neutral.length,group+' not included in displayed mesh');
 }
 const without=buildAnatomicalMesh(pose,{group:'Quadriceps',showMuscles:false});
 assert.equal(neutral.length,without.length);
 assert.equal(main.length,0);
});
