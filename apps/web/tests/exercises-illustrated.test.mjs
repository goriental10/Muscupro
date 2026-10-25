import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {catalogue,categories,filterExercises} from '../public/exercises-illustrated/catalog.mjs';
import {illustrations,frameAtTime} from '../public/exercises-illustrated/illustrations.mjs';

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
