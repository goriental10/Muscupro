/**
 * MuscuPro Global — anatomically inspired mannequin illustration.
 * Draws smooth, tapered 2D silhouettes around the existing projected 3D joints.
 * This is NOT an anatomical mesh, a clinically accurate model, or motion capture.
 * It requires no external files and leaves each exercise's joint animation intact.
 */
export const mannequinMaterials=Object.freeze(['ceramique','ardoise']);
const colors=Object.freeze({
 ceramique:Object.freeze({edge:'#605e66',dark:'#807b80',mid:'#c2b6ac',light:'#f1e6db',highlight:'#fff8ee',shadow:'#55515a',shorts:'#39435a'}),
 ardoise:Object.freeze({edge:'#29354a',dark:'#445672',mid:'#8398b5',light:'#c7d4e1',highlight:'#f3f6fb',shadow:'#29354a',shorts:'#29344a'})
});
export function mannequinPalette(material='ceramique'){
 return colors[material]??colors.ceramique;
}
const midpoint=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
function unitNormal(a,b){
 const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy);
 if(dist<1e-5)return {nx:0,ny:1,len:0};
 return {nx:-dy/dist,ny:dx/dist,len:dist};
}
function lightGradient(ctx,a,b,r,palette){
 const {nx,ny}=unitNormal(a,b),center=midpoint(a,b);
 const gradient=ctx.createLinearGradient(center.x-nx*r,center.y-ny*r,center.x+nx*r,center.y+ny*r);
 gradient.addColorStop(0,palette.dark);
 gradient.addColorStop(.24,palette.highlight);
 gradient.addColorStop(.55,palette.light);
 gradient.addColorStop(.80,palette.mid);
 gradient.addColorStop(1,palette.edge);
 return gradient;
}
/** Smooth outline with a generous proximal end and tapered distal end. */
export function drawTaperedLimb(ctx,a,b,startRadius,endRadius,palette){
 if(!a||!b||![a.x,a.y,b.x,b.y,startRadius,endRadius].every(Number.isFinite))return;
 const {nx,ny,len}=unitNormal(a,b);
 if(len<.1)return;
 const ax=a.x+nx*startRadius,ay=a.y+ny*startRadius;
 const bx=b.x+nx*endRadius,by=b.y+ny*endRadius;
 const cx=b.x-nx*endRadius,cy=b.y-ny*endRadius;
 const dx=a.x-nx*startRadius,dy=a.y-ny*startRadius;
 ctx.beginPath();ctx.moveTo(ax,ay);
 ctx.bezierCurveTo(ax+(b.x-a.x)*.39,ay+(b.y-a.y)*.39,bx-(b.x-a.x)*.34,by-(b.y-a.y)*.34,bx,by);
 ctx.quadraticCurveTo(b.x+(b.x-a.x)*.045,b.y+(b.y-a.y)*.045,cx,cy);
 ctx.bezierCurveTo(cx-(b.x-a.x)*.34,cy-(b.y-a.y)*.34,dx+(b.x-a.x)*.39,dy+(b.y-a.y)*.39,dx,dy);
 ctx.quadraticCurveTo(a.x-(b.x-a.x)*.05,a.y-(b.y-a.y)*.05,ax,ay);
 ctx.closePath();
 ctx.fillStyle=lightGradient(ctx,a,b,Math.max(startRadius,endRadius),palette);
 ctx.fill();ctx.strokeStyle=palette.edge;ctx.lineWidth=1.3;ctx.stroke();
 // Small reflected highlight enhances shape without hard mechanical joints.
 ctx.strokeStyle='rgba(255,255,255,.22)';
 ctx.lineWidth=Math.max(1,Math.min(startRadius,endRadius)*.20);
 ctx.beginPath();ctx.moveTo(ax-nx*startRadius*.33,ay-ny*startRadius*.33);
 ctx.lineTo(bx-nx*endRadius*.35,by-ny*endRadius*.35);ctx.stroke();
}
function ellipseAt(ctx,point,rx,ry,palette,rotation=0){
 if(!point)return;
 const gradient=ctx.createRadialGradient(point.x-rx*.28,point.y-ry*.33,1,point.x,point.y,Math.max(rx,ry)*1.25);
 gradient.addColorStop(0,palette.highlight);gradient.addColorStop(.48,palette.light);
 gradient.addColorStop(.83,palette.mid);gradient.addColorStop(1,palette.dark);
 ctx.beginPath();ctx.ellipse(point.x,point.y,rx,ry,rotation,0,Math.PI*2);
 ctx.fillStyle=gradient;ctx.fill();ctx.strokeStyle=palette.edge;ctx.lineWidth=1.2;ctx.stroke();
}
const between=(a,b,f)=>({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f});
/** A single organic trunk silhouette rather than disconnected rigid cylinders. */
export function drawMannequinTrunk(ctx,p,palette){
 const {neck,pelvis,lShoulder,rShoulder,lHip,rHip}=p;
 if(![neck,pelvis,lShoulder,rShoulder,lHip,rHip].every(Boolean))return;
 const top=between(neck,midpoint(lShoulder,rShoulder),.40);
 const leftWaist=between(lShoulder,lHip,.70),rightWaist=between(rShoulder,rHip,.70);
 const lUnder=between(lHip,pelvis,.55),rUnder=between(rHip,pelvis,.55);
 ctx.beginPath();ctx.moveTo(top.x,top.y);
 ctx.quadraticCurveTo(lShoulder.x-8,lShoulder.y-11,lShoulder.x,lShoulder.y);
 ctx.bezierCurveTo(lShoulder.x-4,lShoulder.y+24,leftWaist.x-6,leftWaist.y-13,leftWaist.x-4,leftWaist.y);
 ctx.quadraticCurveTo(lHip.x-13,lHip.y-8,lHip.x,lHip.y);
 ctx.quadraticCurveTo(lUnder.x,lUnder.y+19,pelvis.x,pelvis.y+13);
 ctx.quadraticCurveTo(rUnder.x,rUnder.y+19,rHip.x,rHip.y);
 ctx.quadraticCurveTo(rightWaist.x+12,rightWaist.y-10,rightWaist.x+4,rightWaist.y);
 ctx.bezierCurveTo(rightWaist.x+4,rightWaist.y-20,rShoulder.x+8,rShoulder.y+22,rShoulder.x,rShoulder.y);
 ctx.quadraticCurveTo(rShoulder.x+9,rShoulder.y-13,top.x,top.y);ctx.closePath();
 const g=ctx.createLinearGradient(lShoulder.x,lShoulder.y,rShoulder.x,rShoulder.y);
 g.addColorStop(0,palette.dark);g.addColorStop(.28,palette.highlight);g.addColorStop(.67,palette.light);g.addColorStop(1,palette.dark);
 ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=palette.edge;ctx.lineWidth=1.4;ctx.stroke();
 // Subtle sternal and abdominal reference lines, not exaggerated muscle definition.
 const chest=between(top,pelvis,.35),abdomen=between(top,pelvis,.63);
 ctx.strokeStyle='rgba(80,74,76,.15)';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(chest.x,chest.y);ctx.lineTo(abdomen.x,abdomen.y);ctx.stroke();
 const waist=between(top,pelvis,.79);
 ctx.beginPath();ctx.moveTo(waist.x-14,waist.y);ctx.quadraticCurveTo(waist.x,waist.y+6,waist.x+14,waist.y);ctx.stroke();
}
function drawShorts(ctx,p,palette){
 const {pelvis,lHip,rHip,lKnee,rKnee}=p;
 if(![pelvis,lHip,rHip,lKnee,rKnee].every(Boolean))return;
 const l=between(lHip,lKnee,.18),r=between(rHip,rKnee,.18);
 ctx.beginPath();ctx.moveTo(lHip.x-11,lHip.y-8);ctx.lineTo(rHip.x+11,rHip.y-8);
 ctx.lineTo(r.x+12,r.y+7);ctx.lineTo(r.x-12,r.y+9);
 ctx.lineTo(pelvis.x,pelvis.y+20);ctx.lineTo(l.x+12,l.y+9);ctx.lineTo(l.x-12,l.y+7);ctx.closePath();
 ctx.fillStyle=palette.shorts;ctx.fill();
 ctx.strokeStyle='rgba(255,255,255,.24)';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(lHip.x-8,lHip.y-7);ctx.lineTo(rHip.x+8,rHip.y-7);ctx.stroke();
}
function drawHandsFeet(ctx,p,palette){
 for(const side of ['l','r']){
  const wrist=p[side+'Wrist'],elbow=p[side+'Elbow'];
  if(wrist&&elbow){
   const angle=Math.atan2(wrist.y-elbow.y,wrist.x-elbow.x)-Math.PI/2;
   ellipseAt(ctx,wrist,10,16,palette,angle);
  }
  const ankle=p[side+'Ankle'],toe=p[side+'Toe'];
  if(ankle&&toe){
   const m=between(ankle,toe,.58);
   const angle=Math.atan2(toe.y-ankle.y,toe.x-ankle.x);
   ctx.beginPath();ctx.ellipse(m.x,m.y,19,10,angle,0,Math.PI*2);
   ctx.fillStyle=palette.shorts;ctx.fill();
   ctx.strokeStyle=palette.edge;ctx.lineWidth=1.3;ctx.stroke();
  }
 }
}
function drawHead(ctx,p,palette){
 const {head,neck}=p;
 if(!head||!neck)return;
 const angle=Math.atan2(head.y-neck.y,head.x-neck.x)-Math.PI/2;
 const m=between(neck,head,.82);
 ellipseAt(ctx,m,24,32,palette,angle);
 // Thin facial landmark indicates orientation, without a personalized face.
 const fx=m.x+Math.cos(angle)*11,fy=m.y+Math.sin(angle)*11;
 ctx.strokeStyle='rgba(74,67,70,.23)';ctx.lineWidth=1.15;
 ctx.beginPath();ctx.moveTo(fx-7,fy+4);ctx.quadraticCurveTo(fx,fy+8,fx+7,fy+4);ctx.stroke();
}
export function drawMannequin(ctx,points,material='ceramique'){
 const palette=mannequinPalette(material);
 const required=['pelvis','neck','head',...['l','r'].flatMap(s=>['Shoulder','Elbow','Wrist','Hip','Knee','Ankle','Toe'].map(n=>s+n))];
 if(!required.every(key=>points[key]&&Number.isFinite(points[key].x)&&Number.isFinite(points[key].y)))return;
 ctx.save();
 // Draw nearest-looking surfaces in consistent body order. The source pose
 // remains unmodified and rotation keeps coming from projected 3D joints.
 for(const s of ['l','r']){
  drawTaperedLimb(ctx,points[s+'Hip'],points[s+'Knee'],22,16,palette);
  drawTaperedLimb(ctx,points[s+'Knee'],points[s+'Ankle'],16,11,palette);
 }
 drawTaperedLimb(ctx,points.pelvis,points.neck,31,18,palette);
 drawMannequinTrunk(ctx,points,palette);
 drawShorts(ctx,points,palette);
 drawTaperedLimb(ctx,points.neck,points.head,13,10,palette);
 for(const s of ['l','r']){
  drawTaperedLimb(ctx,points[s+'Shoulder'],points[s+'Elbow'],19,14,palette);
  drawTaperedLimb(ctx,points[s+'Elbow'],points[s+'Wrist'],14,10,palette);
  ellipseAt(ctx,points[s+'Shoulder'],19,20,palette);
  ellipseAt(ctx,points[s+'Elbow'],13,14,palette);
  ellipseAt(ctx,points[s+'Knee'],15,16,palette);
 }
 drawHandsFeet(ctx,points,palette);
 drawHead(ctx,points,palette);
 ctx.restore();
}
