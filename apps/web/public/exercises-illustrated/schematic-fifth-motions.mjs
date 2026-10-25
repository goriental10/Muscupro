/**
 * Fifth set of exercise-specific illustrative motion paths.
 * Curves are approximate and NOT technique / biomechanics certification.
 */
export const fifthSchematics=Object.freeze({
 'pectoraux-developpe-couche-au-sol':{motion:'floorPress',label:'Développé couché au sol'},
 'dos-rowing-inverse':{motion:'invertedRow',label:'Rowing inversé'},
 'epaules-haussements-d-epaules':{motion:'shrug',label:"Haussements d'épaules"},
 'biceps-curl-a-la-poulie-basse':{motion:'cableCurl',label:'Curl à la poulie basse'},
 'triceps-dips-sur-banc':{motion:'benchDip',label:'Dips sur banc'},
 'quadriceps-fentes-arriere':{motion:'reverseLunge',label:'Fentes arrière'},
 'ischio-jambiers-pont-a-une-jambe':{motion:'singleBridge',label:'Pont à une jambe'},
 'fessiers-hip-thrust-au-banc':{motion:'benchHipThrust',label:'Hip thrust au banc'},
 'mollets-extensions-mollets-avec-halteres':{motion:'loadedCalf',label:'Extensions mollets avec haltères'},
 'abdominaux-planche-bras-tendus':{motion:'highPlank',label:'Planche bras tendus'},
 'cardio-corde-a-sauter-imaginaire':{motion:'ropeMime',label:'Corde à sauter imaginaire'},
 'mobilite-mobilite-des-poignets':{motion:'wristMobility',label:'Mobilité des poignets'},
});
const TAU=2*Math.PI;
const smooth=t=>(1-Math.cos(TAU*t))/2;
const put=(p,k,x,y,z)=>{p[k]=[x,y,z];};
const up=['neck','head',...['l','r'].flatMap(s=>['Shoulder','Elbow','Wrist'].map(k=>s+k))];
const move=(p,keys,index,delta)=>{for(const k of keys)p[k][index]+=delta;};
function recline(p,{height=.22,hipZ=-.28,neckZ=.78,kneeY=.76,kneeZ=-1.06}={}){
 put(p,'pelvis',0,height,hipZ);put(p,'neck',0,height+.02,neckZ);put(p,'head',0,height+.04,neckZ+.35);
 for(const [s,k] of [['l',-1],['r',1]]){
  put(p,s+'Shoulder',k*.47,height+.05,neckZ-.14);
  put(p,s+'Elbow',k*.70,height+.11,neckZ-.06);
  put(p,s+'Wrist',k*.74,height+.12,neckZ+.16);
  put(p,s+'Hip',k*.33,height,hipZ);
  put(p,s+'Knee',k*.40,kneeY,kneeZ);
  put(p,s+'Ankle',k*.41,.11,kneeZ-.43);
  put(p,s+'Toe',k*.41,.05,kneeZ-.18);
 }
}
function plank(p,height){
 put(p,'pelvis',0,height-.14,-.24);put(p,'neck',0,height+.09,1.02);put(p,'head',0,height+.13,1.39);
 for(const [s,k] of [['l',-1],['r',1]]){
  put(p,s+'Shoulder',k*.51,height+.04,.88);
  put(p,s+'Elbow',k*.54,height-.30,1.12);
  put(p,s+'Wrist',k*.53,.10,1.30);
  put(p,s+'Hip',k*.32,height-.14,-.24);
  put(p,s+'Knee',k*.32,.29,-.99);put(p,s+'Ankle',k*.32,.10,-1.68);put(p,s+'Toe',k*.32,.06,-1.87);
 }
}
export function applyFifthMotion(motion,phase,pose){
 if(!Number.isFinite(phase))throw Error('Phase non finie');
 const a=smooth(phase),wave=Math.sin(TAU*phase),p=pose;
 switch(motion){
 case 'floorPress':
  recline(p);
  for(const [s,k] of [['l',-1],['r',1]]){
   put(p,s+'Elbow',k*(.94-.22*a),.31+.43*a,.63);
   put(p,s+'Wrist',k*(.95-.24*a),.47+1.07*a,.73);
  }break;
 case 'invertedRow':{
  const h=.45+.31*a;
  plank(p,h+.30);
  put(p,'pelvis',0,.45+.32*a,-.42);
  put(p,'neck',0,.60+.39*a,.90);
  put(p,'head',0,.63+.41*a,1.23);
  for(const [s,k] of [['l',-1],['r',1]]){
   put(p,s+'Shoulder',k*.48,.59+.39*a,.78);
   put(p,s+'Elbow',k*.81,.43+.18*a,.96);
   put(p,s+'Wrist',k*.82,1.33,1.02);
   put(p,s+'Hip',k*.32,.44+.32*a,-.42);
  }
  break;
 }
 case 'shrug':
  for(const [s,k] of [['l',-1],['r',1]]){
   p[s+'Shoulder'][1]+=.24*a;
   p[s+'Elbow'][1]+=.18*a;p[s+'Wrist'][1]+=.16*a;
   p[s+'Elbow'][0]+=k*.06*a;
  }
  break;
 case 'cableCurl':
  for(const [s,k] of [['l',-1],['r',1]]){
   put(p,s+'Elbow',k*.65,2.03,.19);
   put(p,s+'Wrist',k*(.66-.12*a),1.38+1.10*a,.32+.10*a);
  }break;
 case 'benchDip':{
  const y=.99-.46*a;
  put(p,'pelvis',0,y,-.12);put(p,'neck',0,y+1.12,.04);put(p,'head',0,y+1.44,.08);
  for(const [s,k] of [['l',-1],['r',1]]){
   put(p,s+'Shoulder',k*.49,y+1.01,.03);
   put(p,s+'Elbow',k*.71,y+.55-.03*a,-.16);
   put(p,s+'Wrist',k*.74,.86,-.45);
   put(p,s+'Hip',k*.33,y,-.12);put(p,s+'Knee',k*.38,.81,.68);
   put(p,s+'Ankle',k*.38,.11,.91);put(p,s+'Toe',k*.38,.05,1.20);
  }break;
 }
 case 'reverseLunge':
  move(p,['pelvis','lHip','rHip',...up],1,-.50*a);
  for(const [s,k] of [['l',-1],['r',1]]){
   if(s==='r'){
    put(p,s+'Knee',k*.37,.84-.49*a,.11-.48*a);
    put(p,s+'Ankle',k*.37,.11,.02-.78*a);
    put(p,s+'Toe',k*.37,.05,.34-.78*a);
   }else{put(p,s+'Knee',k*.37,.84-.26*a,.14+.23*a);}
  }break;
 case 'singleBridge':
  recline(p,{hipZ:-.30,neckZ:.86,kneeY:.76,kneeZ:-1.08});
  p.pelvis[1]+=.59*a;
  for(const s of ['l','r'])p[s+'Hip'][1]+=.59*a;
  put(p,'lKnee',-.40,.76+.07*a,-1.03-.46*a);
  put(p,'lAnkle',-.42,.12+.35*a,-1.49-.88*a);
  put(p,'lToe',-.42,.05+.38*a,-1.28-.95*a);
  break;
 case 'benchHipThrust':
  recline(p,{height:.60,hipZ:-.30,neckZ:.65,kneeY:.69,kneeZ:-1.10});
  p.pelvis[1]+=.65*a;
  for(const s of ['l','r'])p[s+'Hip'][1]+=.65*a;
  p.neck[1]+=.06*a;p.head[1]+=.06*a;
  break;
 case 'loadedCalf':
  move(p,['pelvis','neck','head',...['l','r'].flatMap(s=>['Shoulder','Elbow','Wrist','Hip','Knee','Ankle'].map(k=>s+k))],1,.20*a);
  for(const [s,k] of [['l',-1],['r',1]]){
   put(p,s+'Toe',k*.36,.04,.37);
   p[s+'Elbow'][0]=k*.70;p[s+'Wrist'][0]=k*.72;
  }
  break;
 case 'highPlank':
  plank(p,.86+.09*a);
  for(const [s,k] of [['l',-1],['r',1]]){
   put(p,s+'Elbow',k*.55,.51+.03*a,1.04);
   put(p,s+'Wrist',k*.54,.11,1.26);
  }
  break;
 case 'ropeMime':{
  const bob=.12*a;
  move(p,['pelvis','neck','head',...['l','r'].flatMap(s=>['Shoulder','Elbow','Wrist','Hip','Knee','Ankle'].map(k=>s+k))],1,bob);
  for(const [s,k] of [['l',-1],['r',1]]){
   const t=TAU*phase+(k===1?0:Math.PI);
   put(p,s+'Elbow',k*.71,2.12+bob,.17);
   put(p,s+'Wrist',k*(.88+.16*Math.cos(t)),1.82+bob+.14*Math.sin(t),.31+.19*Math.sin(t));
   p[s+'Toe'][1]=.05;
  }
  break;
 }
 case 'wristMobility':
  for(const [s,k] of [['l',-1],['r',1]]){
   const t=TAU*phase+(s==='r'?Math.PI/2:0);
   put(p,s+'Elbow',k*.71,2.15,.42);
   put(p,s+'Wrist',k*(.73+.22*Math.cos(t)),2.10+.19*Math.sin(t),.84+.09*Math.cos(t));
  }
  break;
 default:throw Error('Mouvement inconnu : '+motion);
 }
 return p;
}
