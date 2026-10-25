import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {catalogue,categories,filterExercises} from '../public/exercises-illustrated/catalog.mjs';
import {illustrations,frameAtTime} from '../public/exercises-illustrated/illustrations.mjs';
import {motionTiming,motionDuration,movementAtTime,armPose,boneTransform} from '../public/exercises-illustrated/illustration-motion.mjs';

const assetRoot=new URL('../public/exercises-illustrated/',import.meta.url);
test('the supplied GIF is unchanged and attached only to its matching exercise',()=>{
 assert.equal(catalogue.length,141);assert.equal(new Set(catalogue.map(e=>e.id)).size,141);assert.equal(categories.length-1,12);
 assert.equal(Object.keys(illustrations).length,1);
 for(const [id,asset] of Object.entries(illustrations)){
  const exercise=catalogue.find(e=>e.id===id);assert.ok(exercise);assert.equal(exercise.name,asset.title);assert.equal(exercise.group,asset.group);
  const gif=readFileSync(new URL(asset.original,assetRoot));
  assert.equal(gif.toString('ascii',0,3),'GIF');assert.equal(gif.readUInt16LE(6),asset.width);assert.equal(gif.readUInt16LE(8),asset.height);
  assert.equal(createHash('sha256').update(gif).digest('hex'),asset.originalSha256);
  assert.ok(existsSync(new URL(asset.atlas,assetRoot)));assert.equal(asset.frames,asset.durations.length);assert.ok(asset.durations.every(duration=>duration>0));
 }
 assert.equal(illustrations[catalogue.find(e=>e.name==='Squat').id],undefined);
});
test('frame playback respects the original holds, frame timings and loop seam',()=>{
 const asset=Object.values(illustrations)[0];assert.equal(asset.durations.reduce((a,b)=>a+b,0),3000);
 for(const [time,expected] of [[0,0],[999,0],[1000,1],[1499,5],[1500,6],[2499,6],[2500,7],[2999,11],[3000,0],[-1,11]])assert.equal(frameAtTime(asset,time),expected);
 const seen=new Set();for(let t=0;t<3000;t+=10){const frame=frameAtTime(asset,t);assert.ok(frame>=0&&frame<asset.frames);seen.add(frame);}assert.equal(seen.size,asset.frames);
});
test('search combines accents, equipment, muscle filters and favorites',()=>{
 const results=filterExercises({query:'elevations halteres',group:'Épaules',equipment:'Haltères'});assert.equal(results.length,2);
 assert.deepEqual(filterExercises({query:'élévations',favorites:new Set([results[0].id])}),[results[0]]);
 assert.deepEqual(filterExercises({favorites:new Set()}),[]);assert.deepEqual(filterExercises({query:'introuvable-xyz'}),[]);
});
test('equipment names are not inferred from accidental substrings',()=>{
 const expected={'Développé couché':'Barre','Développé incliné avec haltères':'Haltères','Développé militaire à la barre':'Barre','Vélo stationnaire':'Machine','Squat goblet':'Haltères','Leg curl assis':'Machine','Tirage vertical devant':'Poulie'};
 for(const [name,equipment] of Object.entries(expected))assert.equal(catalogue.find(e=>e.name===name)?.equipment,equipment,name);
});

test('the articulated cycle lifts continuously, lowers more slowly and joins without a snap',()=>{
 const {lift,top,lower}=motionTiming;
 assert.equal(motionDuration,3900);assert.ok(lower>lift);
 assert.equal(movementAtTime(0).amount,0);assert.equal(movementAtTime(lift).amount,1);
 assert.equal(movementAtTime(lift+top).amount,1);assert.equal(movementAtTime(lift+top+lower).amount,0);
 for(let t=1;t<lift;t+=17)assert.ok(movementAtTime(t).amount>=movementAtTime(t-1).amount);
 for(let t=lift+top+1;t<lift+top+lower;t+=17)assert.ok(movementAtTime(t).amount<=movementAtTime(t-1).amount);
 // No pose or velocity discontinuity at a hold or the loop seam.
 for(const boundary of [0,lift,lift+top,lift+top+lower,motionDuration]){
  assert.ok(Math.abs(movementAtTime(boundary-1).amount-movementAtTime(boundary+1).amount)<1e-7);
 }
 for(const time of [-1950,0,725,1450,2200,3899])assert.ok(Math.abs(movementAtTime(time).amount-movementAtTime(time+motionDuration).amount)<1e-12);
});

test('projected arm movement keeps bone lengths and continuous joint connections',()=>{
 const distance=(a,b)=>Math.hypot(...a.map((value,index)=>value-b[index]));
 for(const side of ['far','near']){
  let previousWrist;
  for(let i=0;i<=200;i++){
   const pose=armPose(side,i/200);
   assert.ok(Math.abs(distance(pose.shoulder,pose.elbow)-pose.upperLength)<1e-10);
   assert.ok(Math.abs(distance(pose.elbow,pose.wrist)-pose.lowerLength)<1e-10);
   assert.ok(pose.shoulder.concat(pose.elbow,pose.wrist).every(Number.isFinite));
   assert.ok(pose.wrist[0]>60&&pose.wrist[0]<640&&pose.wrist[1]>100&&pose.wrist[1]<400);
   if(previousWrist)assert.ok(distance(previousWrist,pose.wrist)<2);
   previousWrist=pose.wrist;
  }
 }
});

test('cutout transforms put both ends of each segment exactly on its joints',()=>{
 const source=[[414,171],[429,261],[419,348]];
 const map=([a,b,c,d,e,f],[x,y])=>[a*x+c*y+e,b*x+d*y+f];
 for(const amount of [0,.25,.5,.75,1]){
  const pose=armPose('near',amount),target=[pose.shoulder,pose.elbow,pose.wrist];
  for(let index=0;index<2;index++){
   const matrix=boneTransform(source[index],source[index+1],target[index],target[index+1]);
   for(const end of [index,index+1])assert.ok(Math.hypot(...map(matrix,source[end]).map((n,k)=>n-target[end][k]))<1e-10);
   assert.ok(matrix[0]*matrix[3]-matrix[1]*matrix[2]>0,'limbs cannot flip inside out');
  }
 }
});
