/**
 * Third batch of MuscuPro Global schematic exercises.
 * These are intentionally simplified 3D keyframes, not validated biomechanics,
 * training instructions, motion capture, or exact muscle activation.
 * Uses the same {x,y,z} joint names as schematic-3d.mjs.
 */
export const extraSchematics=Object.freeze({
 'pectoraux-ecarte-couche-avec-halteres':{motion:'floorFly',label:'Écarté couché avec haltères'},
 'dos-tirage-bras-tendus-a-la-poulie':{motion:'straightPulldown',label:'Tirage bras tendus à la poulie'},
 'epaules-oiseau-buste-penche':{motion:'reverseFly',label:'Oiseau buste penché'},
 'biceps-curl-concentre':{motion:'concentrationCurl',label:'Curl concentré'},
 'triceps-kickback-triceps':{motion:'tricepsKickback',label:'Kickback triceps'},
 'quadriceps-squat-goblet':{motion:'gobletSquat',label:'Squat goblet'},
 'ischio-jambiers-souleve-de-terre-a-une-jambe':{motion:'singleLegHinge',label:'Soulevé de terre à une jambe'},
 'fessiers-marche-laterale-avec-elastique':{motion:'lateralWalk',label:'Marche latérale avec élastique'},
 'mollets-releves-de-pointes':{motion:'toeRaise',label:'Relevés de pointes'},
 'abdominaux-bird-dog':{motion:'birdDog',label:'Bird dog'},
 'cardio-course-legere':{motion:'jog',label:'Course légère'},
 'mobilite-rotation-thoracique-a-quatre-pattes':{motion:'thoracicRotation',label:'Rotation thoracique à quatre pattes'},
});
const TAU=2*Math.PI;
const eased=(phase)=>(1-Math.cos(TAU*phase))/2;
const put=(pose,joint,x,y,z)=>{pose[joint]=[x,y,z];};
const shift=(pose,joints,axis,amount)=>{for(const joint of joints)pose[joint][axis]+=amount;};
const up=['neck','head',...['l','r'].flatMap(s=>[s+'Shoulder',s+'Elbow',s+'Wrist'])];
/** Mutates a fresh skeleton belonging to one exercise, never shared across players. */
export function applyExtraMotion(motion,phase,pose){
 if(!Number.isFinite(phase))throw Error('Invalid animation phase');
 const a=eased(phase),w=Math.sin(TAU*phase);
 switch(motion){
  case 'floorFly':{
   put(pose,'pelvis',0,.20,-.43);put(pose,'neck',0,.23,.76);put(pose,'head',0,.23,1.16);
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Hip',k*.31,.18,-.48);put(pose,s+'Knee',k*.38,.65,-1.09);
    put(pose,s+'Ankle',k*.39,.12,-1.53);put(pose,s+'Toe',k*.39,.05,-1.26);
    put(pose,s+'Shoulder',k*.48,.24,.67);
    put(pose,s+'Elbow',k*(.58+.54*(1-a)),.31+.42*a,.62);
    put(pose,s+'Wrist',k*(.63+.73*(1-a)),.39+.70*a,.62);
   }
   break;
  }
  case 'straightPulldown':{
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Elbow',k*.72,2.63+.54*(1-a),.36+.40*(1-a));
    put(pose,s+'Wrist',k*.74,2.03+1.34*(1-a),.51+.54*(1-a));
   }
   break;
  }
  case 'reverseFly':{
   shift(pose,up,1,-.56);shift(pose,up,2,.88);
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Shoulder',k*.52,2.20,.86);
    put(pose,s+'Elbow',k*(.70+.43*a),1.84+.23*a,1.00);
    put(pose,s+'Wrist',k*(.79+.79*a),1.35+.61*a,1.12);
   }
   break;
  }
  case 'concentrationCurl':{
   shift(pose,['pelvis','lHip','rHip'],1,-.45);
   shift(pose,up,1,-.36);shift(pose,up,2,.43);
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Knee',k*.55,.71,.45);put(pose,s+'Ankle',k*.65,.11,.54);
    put(pose,s+'Toe',k*.65,.05,.88);
   }
   put(pose,'rElbow',.53,1.35,.56);
   put(pose,'rWrist',.50-.12*a,.82+.83*a,.73+.08*a);
   put(pose,'lElbow',-.68,1.83,.34);put(pose,'lWrist',-.78,1.27,.56);
   break;
  }
  case 'tricepsKickback':{
   shift(pose,up,1,-.49);shift(pose,up,2,.75);
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Elbow',k*.66,1.85,1.15);
    put(pose,s+'Wrist',k*.70,1.30+.43*a,1.15-.64*a);
   }
   break;
  }
  case 'gobletSquat':{
   shift(pose,['pelvis','lHip','rHip',...up],1,-.59*a);
   shift(pose,['pelvis','lHip','rHip'],2,-.24*a);
   for(const [s,k] of [['l',-1],['r',1]]){
    pose[s+'Knee'][1]-=.22*a;pose[s+'Knee'][2]+=.47*a;
    put(pose,s+'Elbow',k*.49,2.23-.44*a,.34);
    put(pose,s+'Wrist',k*.21,2.46-.48*a,.56);
   }
   break;
  }
  case 'singleLegHinge':{
   shift(pose,['pelvis','lHip','rHip'],2,-.14*a);
   shift(pose,up,1,-.68*a);shift(pose,up,2,.92*a);
   put(pose,'lKnee',-.38,.86+.10*a,.13-.60*a);
   put(pose,'lAnkle',-.38,.12+.23*a,.01-1.15*a);
   put(pose,'lToe',-.38,.05+.24*a,.34-1.27*a);
   pose.rKnee[1]-=.15*a;pose.rKnee[2]+=.14*a;
   break;
  }
  case 'lateralWalk':{
   const step=Math.sin(TAU*phase),bounce=.08*a;
   shift(pose,['pelvis','lHip','rHip',...up],0,.21*step);
   shift(pose,['pelvis','lHip','rHip',...up],1,-.17-bounce);
   for(const [s,k] of [['l',-1],['r',1]]){
    const direction=k*step;
    put(pose,s+'Knee',k*(.41+.21*a)+.21*step,.70+.06*Math.max(0,direction),.21);
    put(pose,s+'Ankle',k*(.41+.36*a)+.21*step,.12+.12*Math.max(0,direction),.07);
    put(pose,s+'Toe',k*(.41+.36*a)+.21*step,.04+.12*Math.max(0,direction),.38);
   }
   break;
  }
  case 'toeRaise':
   // Body remains mostly still; forefoot moves upward around the ankle.
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Ankle',k*.36,.12,.01);
    put(pose,s+'Toe',k*.36,.04+.22*a,.36-.09*a);
   }
   break;
  case 'birdDog':{
   put(pose,'pelvis',0,.88,-.54);put(pose,'neck',0,.84,.66);put(pose,'head',0,.89,1.00);
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Shoulder',k*.45,.85,.55);
    put(pose,s+'Elbow',k*.49,.45,.78);put(pose,s+'Wrist',k*.49,.12,.81);
    put(pose,s+'Hip',k*.34,.87,-.54);
    put(pose,s+'Knee',k*.39,.13,-.57);put(pose,s+'Ankle',k*.39,.09,-.81);
    put(pose,s+'Toe',k*.39,.06,-1.01);
   }
   // Contralateral arm and leg extend together.
   put(pose,'lElbow',-.49,.45+.25*a,.78+.43*a);
   put(pose,'lWrist',-.49,.12+.61*a,.81+.90*a);
   put(pose,'rKnee',.39,.13+.34*a,-.57-.54*a);
   put(pose,'rAnkle',.39,.09+.68*a,-.81-.90*a);
   put(pose,'rToe',.39,.06+.68*a,-1.01-.90*a);
   break;
  }
  case 'jog':{
   const bob=.07*(1-Math.cos(2*TAU*phase))/2;
   shift(pose,['pelvis','lHip','rHip',...up],1,bob);
   for(const [s,k] of [['l',-1],['r',1]]){
    const step=k*w,heel=Math.max(0,step);
    put(pose,s+'Knee',k*.35,.78+.20*heel,.13+.44*step);
    put(pose,s+'Ankle',k*.35,.12+.24*heel,.03+.67*step);
    put(pose,s+'Toe',k*.35,.04+.23*heel,.35+.67*step);
    put(pose,s+'Elbow',k*.70,2.14+bob,.18-.27*step);
    put(pose,s+'Wrist',k*.74,1.75+bob,.45-.47*step);
   }
   break;
  }
  case 'thoracicRotation':{
   put(pose,'pelvis',0,.88,-.55);put(pose,'neck',0,.85,.66);put(pose,'head',0,.94,1.00);
   for(const [s,k] of [['l',-1],['r',1]]){
    put(pose,s+'Shoulder',k*.46,.85,.54);
    put(pose,s+'Elbow',k*.49,.49,.78);
    put(pose,s+'Wrist',k*.49,.12,.81);
    put(pose,s+'Hip',k*.34,.87,-.55);
    put(pose,s+'Knee',k*.39,.13,-.56);
    put(pose,s+'Ankle',k*.39,.09,-.79);
    put(pose,s+'Toe',k*.39,.06,-1.00);
   }
   put(pose,'rShoulder',.46+.12*a,.85+.07*a,.54-.22*a);
   put(pose,'rElbow',.49+.42*a,.49+.67*a,.78-.49*a);
   put(pose,'rWrist',.49+.65*a,.12+1.08*a,.81-.68*a);
   pose.head[0]+=.13*a;
   break;
  }
  default:throw Error('Unknown schematic motion: '+motion);
 }
 return pose;
}
