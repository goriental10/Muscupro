/**
 * Lightweight depth-shaded 2D rasterization of 3D joint links.
 * It produces a sculpted mannequin-like rendering from existing skeleton
 * segments. It does NOT create anatomical meshes or motion-capture data.
 */
export const figureStyles=Object.freeze(['relief','structure']);
export function segmentGradientStops(zone,selected=false){
 const palettes={
  torso:['#42516b','#bdc8df','#8392b0','#3c4b67'],
  head:['#46556e','#d3d9e6','#8799b8','#4a5a75'],
  arms:['#455a7a','#cfdbed','#8c9fbf','#405474'],
  legs:['#3e536f','#becae1','#8194b4','#374967'],
 };
 if(selected)return ['#403076','#d2b6ff','#9c80ec','#4b327e'];
 return palettes[zone]??palettes.torso;
}
export function drawReliefSegment(ctx,segment,highlighted=false){
 const {a,b,width,zone}=segment;
 const len=Math.hypot(b.x-a.x,b.y-a.y);
 if(!Number.isFinite(len)||len<1e-8)return;
 const normalX=-(b.y-a.y)/len,normalY=(b.x-a.x)/len;
 const radius=width/2;
 const outlineWidth=width+4;
 const gradient=ctx.createLinearGradient(
  (a.x+b.x)/2-normalX*radius,(a.y+b.y)/2-normalY*radius,
  (a.x+b.x)/2+normalX*radius,(a.y+b.y)/2+normalY*radius
 );
 const colors=segmentGradientStops(zone,highlighted);
 for(let i=0;i<colors.length;i++)gradient.addColorStop(i/(colors.length-1),colors[i]);
 ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
 ctx.strokeStyle='rgba(40,53,78,.88)';ctx.lineWidth=outlineWidth;ctx.stroke();
 ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
 ctx.strokeStyle=gradient;ctx.lineWidth=width;ctx.stroke();
 // Narrow reflected highlight, restrained enough not to imply a real surface scan.
 ctx.beginPath();
 ctx.moveTo(a.x-normalX*radius*.38,a.y-normalY*radius*.38);
 ctx.lineTo(b.x-normalX*radius*.38,b.y-normalY*radius*.38);
 ctx.strokeStyle='rgba(255,255,255,.18)';
 ctx.lineWidth=Math.max(1,width*.14);ctx.stroke();
}
/** Two depths for head/joints add consistent separation when the camera turns. */
export function jointShade(ctx,name,point,radius){
 const g=ctx.createRadialGradient(point.x-radius*.22,point.y-radius*.33,1,point.x,point.y,radius);
 g.addColorStop(0,name==='head'?'#e2e4ef':'#d0c6eb');
 g.addColorStop(.62,name==='head'?'#9eacc7':'#98a6c2');
 g.addColorStop(1,name==='head'?'#5a6884':'#5d6085');
 return g;
}
