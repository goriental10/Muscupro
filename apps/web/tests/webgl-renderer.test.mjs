import test from 'node:test';
import assert from 'node:assert/strict';
import {WebGLMannequinLayer} from '../public/exercises-illustrated/webgl-mannequin.mjs';

function fakeGL(){
 const calls={draws:0,uploads:0,removed:0,viewport:[],dataLength:0,uniforms:0};
 const gl={
  VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,ARRAY_BUFFER:34962,DYNAMIC_DRAW:35048,
  DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,FLOAT:5126,TRIANGLES:4,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
  createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,deleteShader(){},getShaderInfoLog:()=>'',createProgram:()=>({}),
  attachShader(){},linkProgram(){},getProgramParameter:()=>true,getProgramInfoLog:()=>'',deleteProgram(){},
  createBuffer:()=>({}),getAttribLocation:(_program,name)=>({aPosition:0,aNormal:1,aColor:2})[name],
  getUniformLocation:(_program,name)=>({name}),enable(){},depthFunc(){},disable(){},clearColor(){},
  viewport(...args){calls.viewport=args},clear(){},useProgram(){},bindBuffer(){},
  bufferData(_target,data){calls.uploads++;calls.dataLength=data.length;},
  enableVertexAttribArray(){},vertexAttribPointer(){},
  uniformMatrix4fv(){calls.uniforms++;},drawArrays(_type,_offset,count){calls.draws++;calls.lastVertices=count;},
  deleteBuffer(){calls.removed++}
 };
 return {gl,calls};
}
test('3D renderer initializes shaders, uploads real triangles and supports camera orbit without a browser',()=>{
 const {gl,calls}=fakeGL(),listeners={};
 const base={getBoundingClientRect:()=>({width:450,height:350}),insertAdjacentElement(_position,layer){layer.previousElementSibling=this;}};
 const canvas={
  getContext:()=>gl,addEventListener(name,fn){listeners[name]=fn;},removeEventListener(name){delete listeners[name];},
  remove(){this.removed=true;},setAttribute(){},className:'',hidden:false
 };
 const originalDocument=globalThis.document,originalWindow=globalThis.window;
 globalThis.document={createElement:()=>canvas};globalThis.window={devicePixelRatio:1.5};
 try{
  const renderer=new WebGLMannequinLayer(base);
  assert.equal(renderer.canvas,canvas);
  assert.equal(renderer.render('quadriceps-squat',500,{yaw:-.5,pitch:.3,material:'ceramique'}),true);
  assert.ok(calls.draws>0);assert.ok(calls.uploads>0);assert.ok(calls.lastVertices>1000);assert.ok(calls.uniforms>=2);
  assert.deepEqual(calls.viewport,[0,0,675,525]);
  assert.equal(canvas.hidden,false);
  renderer.render('quadriceps-squat',900,{yaw:1.1,pitch:-.25,material:'ardoise',showMuscles:false});
  assert.equal(calls.draws,2);
  renderer.setVisible(false);assert.equal(canvas.hidden,true);
  renderer.dispose();assert.equal(canvas.removed,true);assert.equal(calls.removed,1);
  assert.equal(renderer.render('quadriceps-squat',1500),false);
 }finally{globalThis.document=originalDocument;globalThis.window=originalWindow;}
});
test('WebGL context loss safely triggers graceful fallback',()=>{
 const {gl}=fakeGL(),listeners={};let fallbackCount=0;
 const base={getBoundingClientRect:()=>({width:300,height:300}),insertAdjacentElement(_position,layer){layer.previousElementSibling=this;}};
 const canvas={getContext:()=>gl,addEventListener(name,fn){listeners[name]=fn;},removeEventListener(name){delete listeners[name];},remove(){},setAttribute(){},hidden:false};
 const prevDoc=globalThis.document,prevWin=globalThis.window;
 globalThis.document={createElement:()=>canvas};globalThis.window={devicePixelRatio:1};
 try{
  const renderer=new WebGLMannequinLayer(base,{onContextLost:()=>fallbackCount++});
  let prevented=false;listeners.webglcontextlost({preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.equal(fallbackCount,1);assert.equal(renderer.render('quadriceps-squat',100),false);
  renderer.dispose();
 }finally{globalThis.document=prevDoc;globalThis.window=prevWin;}
});
