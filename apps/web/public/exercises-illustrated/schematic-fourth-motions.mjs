/**
 * Fourth batch of distinct exercise motion diagrams.
 * These use approximate joint paths in 3D projected into a rotatable 2D canvas.
 * They are schematic visual aids, not movement-capture or validated technique.
 */
export const fourthSchematics=Object.freeze({
 'pectoraux-pompes-sur-les-genoux':{motion:'kneePushup',label:'Pompes sur les genoux'},
 'dos-rowing-assis-a-la-poulie':{motion:'seatedRow',label:'Rowing assis à la poulie'},
 'epaules-rotation-externe-a-l-elastique':{motion:'externalRotation',label:"Rotation externe à l'élastique"},
 'biceps-curl-pupitre':{motion:'preacherCurl',label:'Curl pupitre'},
 'triceps-extension-triceps-a-la-corde':{motion:'ropePressdown',label:'Extension triceps à la corde'},
 'quadriceps-step-up-sur-banc':{motion:'stepUp',label:'Step-up sur banc'},
 'ischio-jambiers-leg-curl-allonge':{motion:'proneLegCurl',label:'Leg curl allongé'},
 'fessiers-clamshell':{motion:'clamshell',label:'Clamshell'},
 'mollets-extensions-mollets-assis':{motion:'seatedCalf',label:'Extensions mollets assis'},
 'abdominaux-dead-bug':{motion:'deadBug',label:'Dead bug'},
 'cardio-montee-de-marche':{motion:'stepMarch',label:'Montée de marche'},
 'mobilite-balancement-de-cheville':{motion:'ankleRock',label:'Balancement de cheville'},
});
const TAU=Math.PI*2;
const eased=phase=>(1-Math.cos(TAU*phase))/2;
const put=(p,key,x,y,z)=>{p[key]=[x,y,z];};
const move=(p,names,axis,delta)=>{for(const n of names)p[n][axis]+=delta;};
const upper=['neck','head',...['l','r'].flatMap(side=>[side+'Shoulder',side+'Elbow',side+'Wrist'])];
/** Position the base figure lying horizontally, with legs extending along negative Z. */
function lieBack(p){
 put(p,'pelvis',0,.24,-.18);put(p,'neck',0,.22,.87);put(p,'head',0,.23,1.22);
 for(const [side,k] of [['l',-1],['r',1]]){
  put(p,side+'Shoulder',k*.46,.24,.78);
  put(p,side+'Elbow',k*.70,.22,.63);
  put(p,side+'Wrist',k*.74,.15,.37);
  put(p,side+'Hip',k*.31,.23,-.18);
  put(p,side+'Knee',k*.34,.20,-.85);
  put(p,side+'Ankle',k*.34,.13,-1.40);
  put(p,side+'Toe',k*.34,.05,-1.64);
 }
}
function sit(p){
 put(p,'pelvis',0,.93,-.27);put(p,'neck',0,2.14,-.25);put(p,'head',0,2.46,-.24);
 for(const [side,k] of [['l',-1],['r',1]]){
  put(p,side+'Hip',k*.32,.94,-.27);
  put(p,side+'Knee',k*.38,.93,.65);
  put(p,side+'Ankle',k*.38,.15,.89);
  put(p,side+'Toe',k*.38,.06,1.18);
  put(p,side+'Shoulder',k*.49,2.03,-.23);
  put(p,side+'Elbow',k*.62,1.53,.09);
  put(p,side+'Wrist',k*.65,1.19,.39);
 }
}
export function applyFourthMotion(motion,phase,p){
 if(!Number.isFinite(phase))throw Error('Phase non finie');
 const a=eased(phase),wave=Math.sin(TAU*phase);
 switch(motion){
  case 'kneePushup':{
   put(p,'pelvis',0,.45+.20*a,-.14);
   put(p,'neck',0,.48+.27*a,.87);put(p,'head',0,.54+.27*a,1.21);
   for(const [side,k] of [['l',-1],['r',1]]){
    put(p,side+'Shoulder',k*.48,.47+.27*a,.78);
    put(p,side+'Elbow',k*.76,.29+.10*a,1.06);
    put(p,side+'Wrist',k*.76,.12,1.35);
    put(p,side+'Hip',k*.30,.45+.20*a,-.14);
    put(p,side+'Knee',k*.36,.13,-.73);
    put(p,side+'Ankle',k*.36,.10,-1.11);
    put(p,side+'Toe',k*.36,.06,-1.27);
   }
   break;
  }
  case 'seatedRow':{
   sit(p);
   for(const [side,k] of [['l',-1],['r',1]]){
    put(p,side+'Elbow',k*(.59+.07*a),1.56,-.05+.50*(1-a));
    put(p,side+'Wrist',k*.53,1.45,.22+1.25*(1-a));
   }
   p.neck[2]+=.15*(1-a);p.head[2]+=.17*(1-a);
   break;
  }
  case 'externalRotation':{
   for(const [side,k] of [['l',-1],['r',1]]){
    put(p,side+'Elbow',k*.72,2.10,.16);
    put(p,side+'Wrist',k*(.71+.53*a),2.07,.47-.31*a);
   }
   break;
  }
  case 'preacherCurl':{
   sit(p);
   put(p,'rElbow',.59,1.66,.57);
   put(p,'rWrist',.58-.08*a,1.18+.90*a,.98-.16*a);
   put(p,'lElbow',-.64,1.61,.10);put(p,'lWrist',-.68,1.19,.45);
   break;
  }
  case 'ropePressdown':{
   for(const [side,k] of [['l',-1],['r',1]]){
    put(p,side+'Elbow',k*.61,2.16,.32);
    put(p,side+'Wrist',k*(.45+.27*a),2.08-.85*a,.58-.16*a);
   }
   break;
  }
  case 'stepUp':{
   move(p,['pelvis','lHip','rHip',...upper],1,.46*a);
   move(p,['pelvis','lHip','rHip',...upper],2,.33*a);
   put(p,'rKnee',.36,.92+.28*a,.44+.30*a);
   put(p,'rAnkle',.36,.11+.52*a,.72+.20*a);
   put(p,'rToe',.36,.05+.52*a,1.02+.20*a);
   put(p,'lKnee',-.35,.84+.32*a,.15-.17*a);
   put(p,'lAnkle',-.35,.12+.18*a,.02-.25*a);
   put(p,'lToe',-.35,.04+.18*a,.36-.25*a);
   for(const side of ['l','r'])p[side+'Wrist'][2]+=(side==='l'?.20:-.20)*a;
   break;
  }
  case 'proneLegCurl':{
   lieBack(p);
   // Torso remains low; heels follow an arc toward the hips.
   for(const [side,k] of [['l',-1],['r',1]]){
    put(p,side+'Knee',k*.35,.20,-.88);
    put(p,side+'Ankle',k*.35,.15+.63*a,-1.43+.55*a);
    put(p,side+'Toe',k*.35,.07+.65*a,-1.66+.54*a);
   }
   break;
  }
  case 'clamshell':{
   put(p,'pelvis',0,.26,-.25);put(p,'neck',0,.27,.76);put(p,'head',0,.32,1.12);
   for(const [side,k] of [['l',-1],['r',1]]){
    put(p,side+'Shoulder',k*.34,.27,.66);
    put(p,side+'Elbow',k*.62,.24,.56);put(p,side+'Wrist',k*.67,.15,.34);
    put(p,side+'Hip',k*.15,.25,-.26);
    put(p,side+'Knee',k*.32,.25,-.92);
    put(p,side+'Ankle',k*.16,.14,-1.38);put(p,side+'Toe',k*.16,.05,-1.58);
   }
   put(p,'rKnee',.29+.38*a,.25+.43*a,-.94);
   put(p,'rHip',.14,.25+.15*a,-.27);
   break;
  }
  case 'seatedCalf':{
   sit(p);
   for(const [side,k] of [['l',-1],['r',1]]){
    put(p,side+'Knee',k*.38,.92,.64);
    put(p,side+'Ankle',k*.38,.14+.15*a,.98);
    put(p,side+'Toe',k*.38,.06,1.23);
   }
   break;
  }
  case 'deadBug':{
   lieBack(p);
   for(const [side,k] of [['l',-1],['r',1]]){
    const amount=eased(phase+(side==='r'?.5:0));
    put(p,side+'Shoulder',k*.46,.25,.78);
    put(p,side+'Elbow',k*.52,.77-.18*amount,.78+.39*amount);
    put(p,side+'Wrist',k*.54,1.18-.55*amount,.83+.78*amount);
    // Opposite leg extends when that arm lowers.
    const leg=1-amount;
    put(p,side+'Knee',k*.34,.70-.40*leg,-.82-.12*leg);
    put(p,side+'Ankle',k*.34,.53-.33*leg,-.99-.72*leg);
    put(p,side+'Toe',k*.34,.44-.31*leg,-.94-.80*leg);
   }
   break;
  }
  case 'stepMarch':{
   const raising=Math.max(0,wave);
   move(p,['pelvis','lHip','rHip',...upper],1,.17*raising);
   put(p,'rKnee',.36,.83+.42*raising,.17+.49*raising);
   put(p,'rAnkle',.36,.12+.27*raising,.01+.55*raising);
   put(p,'rToe',.36,.04+.28*raising,.35+.55*raising);
   p.lElbow[2]-=.28*raising;p.lWrist[2]-=.51*raising;
   break;
  }
  case 'ankleRock':{
   for(const [side,k] of [['l',-1],['r',1]]){
    const weight=side==='r'?1:.40;
    put(p,side+'Knee',k*.37,.84-.09*weight*a,.15+.07*a);
    put(p,side+'Ankle',k*.37,.12,.02);
    put(p,side+'Toe',k*.37,.04+.20*weight*a,.36-.09*a);
   }
   break;
  }
  default:throw Error('Mouvement inconnu : '+motion);
 }
 return p;
}
