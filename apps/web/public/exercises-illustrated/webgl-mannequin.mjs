import {buildAnatomicalMesh,orbitCamera,perspective} from './webgl-mesh.mjs';
import {poseForExercise,schematicDuration} from './schematic-3d.mjs';
import {groupForSchematicId} from './anatomy-zones.mjs';

const VERTEX=`
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform mat4 uProjection;
uniform mat4 uView;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main(){
 vec4 viewPos=uView*vec4(aPosition,1.0);
 vViewPosition=viewPos.xyz;
 vNormal=mat3(uView)*aNormal;
 vColor=aColor;
 gl_Position=uProjection*viewPos;
}
`;
const FRAGMENT=`
precision mediump float;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main(){
 vec3 n=normalize(vNormal);
 vec3 lightDir=normalize(vec3(-0.40,0.88,0.62));
 float diffuse=max(dot(n,lightDir),0.0);
 vec3 view=normalize(-vViewPosition);
 vec3 halfVec=normalize(lightDir+view);
 float spec=pow(max(dot(n,halfVec),0.0),28.0)*.17;
 float light=0.51+diffuse*.48;
 vec3 col=pow(vColor*light+vec3(spec),vec3(1.0/1.05));
 gl_FragColor=vec4(col,1.0);
}
`;
function compile(gl,type,source){
 const shader=gl.createShader(type);
 if(!shader)throw Error('Impossible de créer le shader WebGL');
 gl.shaderSource(shader,source);gl.compileShader(shader);
 if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
  const log=gl.getShaderInfoLog(shader)||'Compilation WebGL impossible';gl.deleteShader(shader);throw Error(log);
 }
 return shader;
}
function createProgram(gl){
 const vertex=compile(gl,gl.VERTEX_SHADER,VERTEX),fragment=compile(gl,gl.FRAGMENT_SHADER,FRAGMENT);
 const program=gl.createProgram();
 if(!program){gl.deleteShader(vertex);gl.deleteShader(fragment);throw Error('Programme WebGL non disponible');}
 gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 gl.deleteShader(vertex);gl.deleteShader(fragment);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
  const log=gl.getProgramInfoLog(program)||'Édition des liens WebGL impossible';gl.deleteProgram(program);throw Error(log);
 }
 return program;
}
/**
 * Live three-dimensional geometry in a dedicated WebGL canvas layered above
 * the original illustration canvas. No external CDN, library or GLTF dependency.
 * Canvas 2D remains available if WebGL cannot initialize.
 */
export class WebGLMannequinLayer {
 constructor(baseCanvas,{onContextLost=()=>{}}={}){
  const layer=document.createElement('canvas');
  layer.className='webgl-mannequin-layer';
  layer.setAttribute('aria-hidden','true');
  layer.hidden=true;
  baseCanvas.insertAdjacentElement('afterend',layer);
  this.canvas=layer;this.onContextLost=onContextLost;this.disposed=false;this.lost=false;
  this.preventLoss=e=>{e.preventDefault();this.lost=true;this.setVisible(false);this.onContextLost();};
  layer.addEventListener('webglcontextlost',this.preventLoss);
  const gl=layer.getContext('webgl',{alpha:false,antialias:true,depth:true,preserveDrawingBuffer:false});
  if(!gl){this.dispose();throw Error('WebGL indisponible sur cet appareil');}
  this.gl=gl;
  try{
   this.program=createProgram(gl);
   this.buffer=gl.createBuffer();if(!this.buffer)throw Error('Mémoire graphique indisponible');
   this.positions={
    aPosition:gl.getAttribLocation(this.program,'aPosition'),
    aNormal:gl.getAttribLocation(this.program,'aNormal'),
    aColor:gl.getAttribLocation(this.program,'aColor'),
    uProjection:gl.getUniformLocation(this.program,'uProjection'),
    uView:gl.getUniformLocation(this.program,'uView')
   };
   if(Object.values(this.positions).some(x=>x===-1||x===null))throw Error('Variables WebGL manquantes');
   gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
   gl.disable(gl.CULL_FACE);gl.clearColor(.97,.98,.995,1);
  }catch(error){this.dispose();throw error;}
 }
 setVisible(visible){if(this.canvas)this.canvas.hidden=!visible;}
 render(id,elapsed,{yaw=-.48,pitch=.11,zoom=1,material='ceramique',showMuscles=true}={}){
  if(this.disposed||this.lost)return false;
  const gl=this.gl,canvas=this.canvas;
  const base=canvas.previousElementSibling;
  const rect=base.getBoundingClientRect();
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  gl.viewport(0,0,w,h);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const joints=poseForExercise(id,elapsed/schematicDuration);
  const mesh=buildAnatomicalMesh(joints,{material,showMuscles,group:groupForSchematicId(id)});
  const camera=orbitCamera(yaw,pitch,7.15/Math.max(.7,zoom));
  const projection=perspective(Math.PI/4.0,w/h,.1,100);
  gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
  gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.DYNAMIC_DRAW);
  for(const [name,offset] of [['aPosition',0],['aNormal',12],['aColor',24]]){
   const attr=this.positions[name];gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,3,gl.FLOAT,false,36,offset);
  }
  gl.uniformMatrix4fv(this.positions.uProjection,false,projection);
  gl.uniformMatrix4fv(this.positions.uView,false,camera.view);
  gl.drawArrays(gl.TRIANGLES,0,mesh.length/9);
  this.setVisible(true);return true;
 }
 dispose(){
  if(this.disposed)return;this.disposed=true;
  if(this.canvas)this.canvas.removeEventListener('webglcontextlost',this.preventLoss);
  if(this.gl&&!this.lost){if(this.buffer)this.gl.deleteBuffer(this.buffer);if(this.program)this.gl.deleteProgram(this.program);}
  this.canvas?.remove();
 }
}
