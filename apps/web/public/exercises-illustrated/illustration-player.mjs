import { frameAtTime } from './illustrations.mjs';
import { ArticulatedIllustration, motionDuration, movementAtTime } from './illustration-motion.mjs';
import { schematics, schematicDuration, drawSchematic, motionLabel } from './schematic-3d.mjs';

/** Articulates the supplied illustration; the original GIF remains selectable. */
export class IllustrationPlayer {
  constructor(canvas,{onPhase=()=>{},onStatus=()=>{},onAvailability=()=>{},onMovement=()=>{}}={}) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d');
    if(!this.ctx)throw new Error('Le lecteur d’illustrations ne peut pas démarrer dans ce navigateur.');
    this.onPhase=onPhase;this.onStatus=onStatus;this.onAvailability=onAvailability;
    this.onMovement=onMovement;this.mode='natural';this.motion=null;
    this.abort=new AbortController();this.generation=0;this.elapsed=0;this.speed=1;
    this.playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.disposed=false;this.inView=true;this.visible=!document.hidden;this.raf=0;this.lastTime=0;this.lastReport=0;
    this.zoomLevel=1;this.pan=[0,0];this.media=null;this.image=null;this.schematicId=null;this.cameraYaw=-.48;this.showMuscles=true;this.figureStyle='mannequin';this.mannequinMaterial='ceramique';
    this.bindEvents();
    this.resize=new ResizeObserver(()=>this.requestRender());this.resize.observe(canvas);
    this.intersection=new IntersectionObserver(entries=>{
      this.inView=entries[0].isIntersecting;this.updateVisibility();
    });this.intersection.observe(canvas);
    this.requestRender();
  }
  bindEvents() {
    const c=this.canvas,signal=this.abort.signal;
    c.addEventListener('pointerdown',event=>{this.pointer={id:event.pointerId,x:event.clientX,y:event.clientY};c.setPointerCapture?.(event.pointerId);},{signal});
    c.addEventListener('pointermove',event=>{
      if(!this.pointer||event.pointerId!==this.pointer.id)return;
      if(this.schematicId&&this.zoomLevel<=1){this.cameraYaw+=(event.clientX-this.pointer.x)*.012;}
      else if(this.zoomLevel>1){this.pan[0]+=event.clientX-this.pointer.x;this.pan[1]+=event.clientY-this.pointer.y;}
      this.pointer={id:event.pointerId,x:event.clientX,y:event.clientY};this.requestRender();
    },{signal});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])c.addEventListener(name,()=>{this.pointer=null;},{signal});
    c.addEventListener('wheel',event=>{if(!this.media)return;event.preventDefault();this.zoom(-event.deltaY*.001);},{passive:false,signal});
    c.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(event.key)||!this.media)return;
      event.preventDefault();
      if(['+','='].includes(event.key))this.zoom(.2);
      if(event.key==='-')this.zoom(-.2);
      if(this.schematicId&&this.zoomLevel===1){
        if(event.key==='ArrowLeft')this.cameraYaw-=Math.PI/18;
        if(event.key==='ArrowRight')this.cameraYaw+=Math.PI/18;
      }
      if(this.zoomLevel>1){
        if(event.key==='ArrowLeft')this.pan[0]-=12;if(event.key==='ArrowRight')this.pan[0]+=12;
        if(event.key==='ArrowUp')this.pan[1]-=12;if(event.key==='ArrowDown')this.pan[1]+=12;
      }
      this.requestRender();
    },{signal});
    document.addEventListener('visibilitychange',()=>this.updateVisibility(),{signal});
  }
  updateVisibility(){this.visible=this.inView&&!document.hidden;this.lastTime=0;if(this.visible)this.requestRender();else{cancelAnimationFrame(this.raf);this.raf=0;}}
  async setIllustration(media,exercise=null) {
    const generation=++this.generation;this.media=null;this.image=null;this.motion=null;this.schematicId=null;this.elapsed=0;this.onPhase(0);this.onMovement('');this.resetView();this.onAvailability(false);
    if(!media){
      if(exercise&&schematics[exercise.id]){
        this.schematicId=exercise.id;this.media={width:700,height:700,durations:[schematicDuration]};
        this.total=schematicDuration;this.cameraYaw=-.48;this.onStatus('');this.onAvailability(true);this.requestRender();return;
      }
      this.onStatus('Illustration ou schéma animé à ajouter pour cet exercice.');return;
    }
    this.onStatus('Chargement de votre illustration…');
    try{
      const image=new Image();image.src=media.atlas;await image.decode();
      if(this.disposed||generation!==this.generation)return;
      this.image=image;this.media=media;this.motion=media.motion==='lateral-raise'?new ArticulatedIllustration(image,media):null;this.updateDuration();this.lastTime=0;
      this.onStatus('');this.onAvailability(true);this.requestRender();
    }catch{
      if(generation===this.generation&&!this.disposed)this.onStatus('Impossible de charger cette illustration. Rechargez la page pour réessayer.');
    }
  }
  updateDuration(){if(this.schematicId){this.total=schematicDuration;return;}if(this.media)this.total=this.mode==='natural'&&this.motion?motionDuration:this.media.durations.reduce((sum,n)=>sum+n,0);}
  setMode(mode){if(this.schematicId||!['natural','original'].includes(mode))return;const phase=this.total?this.elapsed/this.total:0;this.mode=mode;this.updateDuration();this.elapsed=phase*(this.total||0);this.lastTime=0;this.requestRender();}
  setPlaying(playing){this.playing=playing;this.lastTime=0;this.requestRender();}
  setPhase(value){if(!this.media)return;this.elapsed=Math.max(0,Math.min(.999,Number(value)||0))*this.total;this.onPhase(this.elapsed/this.total);this.requestRender();}
  resetView(){this.zoomLevel=1;this.pan=[0,0];if(this.schematicId)this.cameraYaw=-.48;this.requestRender();}
  zoom(delta){this.zoomLevel=Math.max(1,Math.min(2.8,this.zoomLevel+delta));if(this.zoomLevel===1)this.pan=[0,0];this.requestRender();}
  rotateCamera(delta){if(!this.schematicId)return;this.cameraYaw+=delta;this.requestRender();}
  setMuscleVisibility(show){this.showMuscles=!!show;this.requestRender();}
  setFigureStyle(style){if(!['mannequin','relief','structure'].includes(style))return;this.figureStyle=style;this.requestRender();}
  setMannequinMaterial(material){if(!['ceramique','ardoise'].includes(material))return;this.mannequinMaterial=material;this.requestRender();}
  requestRender(){if(this.disposed||!this.visible||this.raf)return;this.raf=requestAnimationFrame(time=>this.tick(time));}
  render(){
    const c=this.canvas,ctx=this.ctx,dpr=Math.min(devicePixelRatio||1,2);
    const width=Math.max(2,Math.round(c.clientWidth*dpr)),height=Math.max(2,Math.round(c.clientHeight*dpr));
    if(c.width!==width||c.height!==height){c.width=width;c.height=height;}
    ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
    if(!this.media)return;
    if(!this.image&&!this.schematicId)return;
    const media=this.media,fit=Math.min(width/media.width,height/media.height)*.96*this.zoomLevel;
    const w=media.width*fit,h=media.height*fit;
    // Keep an enlarged image within reach when panning.
    const boundX=Math.max(0,(w-width)/2+width*.25),boundY=Math.max(0,(h-height)/2+height*.25);
    this.pan[0]=Math.max(-boundX/dpr,Math.min(boundX/dpr,this.pan[0]));this.pan[1]=Math.max(-boundY/dpr,Math.min(boundY/dpr,this.pan[1]));
    const x=(width-w)/2+this.pan[0]*dpr,y=(height-h)/2+this.pan[1]*dpr;
    if(this.schematicId){ctx.save();ctx.translate(x,y);ctx.scale(fit,fit);drawSchematic(ctx,this.schematicId,this.elapsed,this.cameraYaw,{showMuscles:this.showMuscles,figureStyle:this.figureStyle,material:this.mannequinMaterial});ctx.restore();}
    else if(this.mode==='natural'&&this.motion){ctx.save();ctx.translate(x,y);ctx.scale(fit,fit);this.motion.render(ctx,this.elapsed);ctx.restore();}
    else{const index=frameAtTime(media,this.elapsed);ctx.drawImage(this.image,(index%media.columns)*media.width,Math.floor(index/media.columns)*media.height,media.width,media.height,x,y,w,h);}
  }
  tick(time){
    this.raf=0;if(this.disposed||!this.visible)return;
    if(this.playing&&this.media&&this.lastTime)this.elapsed=(this.elapsed+Math.min(100,time-this.lastTime)*this.speed)%this.total;
    this.lastTime=time;this.render();
    if(this.media&&(!this.playing||time-this.lastReport>100)){this.lastReport=time;this.onPhase(this.elapsed/this.total);this.onMovement(this.schematicId?motionLabel(this.schematicId,this.elapsed/this.total):this.mode==='natural'&&this.motion?movementAtTime(this.elapsed).label:'GIF d’origine');}
    if(this.playing&&this.media)this.requestRender();
  }
  dispose(){if(this.disposed)return;this.disposed=true;this.generation++;cancelAnimationFrame(this.raf);this.abort.abort();this.resize.disconnect();this.intersection.disconnect();this.image=null;this.motion=null;this.schematicId=null;}
}
