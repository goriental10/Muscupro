import { catalogue, categories, equipmentTypes, filterExercises } from './catalog.mjs';
import { illustrations } from './illustrations.mjs';
import { IllustrationPlayer } from './illustration-player.mjs';
import { schematics } from './schematic-3d.mjs';
import { anatomicalZoneForId } from './anatomy-zones.mjs';

const $=id=>document.getElementById(id);
const knownIds=new Set(catalogue.map(ex=>ex.id));
const storageKey='muscupro.exercises.favorites.v1';
let favorites=new Set();
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))favorites=new Set(saved.slice(0,catalogue.length).filter(id=>typeof id==='string'&&knownIds.has(id)));}catch{/* Browsing remains available when storage is blocked or invalid. */}
let mode='illustrated',filtered=[],player;
let selected=catalogue.find(ex=>ex.id===location.hash.slice(1))??catalogue.find(ex=>illustrations[ex.id])??catalogue[0];
const initials={Pectoraux:'PE',Dos:'DO','Épaules':'ÉP',Biceps:'BI',Triceps:'TR',Quadriceps:'QU','Ischio-jambiers':'IJ',Fessiers:'FE',Mollets:'MO',Abdominaux:'AB',Cardio:'CA','Mobilité':'MB'};
for(const [id,values] of [['category',categories],['equipment',equipmentTypes]]){
  for(const value of values){const option=document.createElement('option');option.value=value;option.textContent=value;$(id).append(option);}
}
$('total-count').textContent=String(catalogue.length);$('group-count').textContent=String(categories.length-1);$('media-count').textContent=String(Object.keys(illustrations).length+Object.keys(schematics).length);
function showError(message){$('canvas-error').hidden=!message;$('canvas-error-message').textContent=message;}
function updatePlayback(){if(!player)return;$('play').replaceChildren(document.createTextNode(player.playing?'Ⅱ ':'▶ '));const span=document.createElement('span');span.textContent=player.playing?'Pause':'Lecture';$('play').append(span);$('play').setAttribute('aria-pressed',String(!player.playing));}
try{
  player=new IllustrationPlayer($('viewport'),{onPhase:phase=>{$('timeline').value=String(Math.round(phase*1000));$('phase').textContent=`${Math.round(phase*100)} %`;},onStatus:showError,onMovement:label=>{$('movement-phase').textContent=label;},onAvailability:available=>document.querySelectorAll('[data-requires-media]').forEach(control=>{control.disabled=!available;})});
  updatePlayback();
}catch(error){showError(error.message);document.querySelectorAll('[data-requires-media]').forEach(control=>{control.disabled=true;});}
function updateMediaDescription(){
  const media=illustrations[selected.id],schematic=schematics[selected.id],natural=$('motion-mode').value==='natural'&&media?.motion;
  $('motion-mode').disabled=!media;
  for(const control of document.querySelectorAll('[data-schematic]'))control.hidden=!schematic;
  $('anatomy-zone').textContent=schematic?(anatomicalZoneForId(selected.id)?.label??'Zone musculaire illustrative'):'';
  $('family-label').textContent=schematic?'Schéma 3D animé':!media?'Animation à ajouter':natural?'Illustration articulée':'GIF d’origine';
  $('media-description').textContent=schematic?'Démonstration 3D simplifiée et orientable, avec cycle spécifique à cet exercice et mise en évidence optionnelle d’une région musculaire. Schéma indicatif, non validé comme démonstration technique.':!media?'Cette fiche est conservée dans le catalogue. Son illustration correspondant au mouvement reste à fournir.':natural?'Votre illustration animée aux articulations : montée de 1,45 s, descente de 2,05 s. Les bras parcourent le mouvement, le buste et les pieds restent stables.':'Le fichier fourni, avec ses 12 images et ses fondus entre deux poses.';
}
function updateFavorite(){
  const saved=favorites.has(selected.id);$('favorite').textContent=saved?'♥':'♡';$('favorite').setAttribute('aria-pressed',String(saved));$('favorite').setAttribute('aria-label',saved?'Retirer cet exercice des favoris':'Ajouter cet exercice aux favoris');$('favorite-count').textContent=String(favorites.size);
}
function choose(exercise,{syncHash=true}={}){
  selected=exercise;player?.setIllustration(illustrations[exercise.id],exercise);
  $('exercise-name').textContent=exercise.name;$('exercise-meta').textContent=exercise.equipment;$('exercise-category').textContent=exercise.group.toLocaleUpperCase('fr-CA');updateMediaDescription();
  $('exercise-index').textContent=`${String(catalogue.indexOf(exercise)+1).padStart(3,'0')} / ${catalogue.length}`;
  $('viewport').setAttribute('aria-label',`${exercise.name}, démonstration animée. Utiliser les boutons pour zoomer et contrôler la lecture.`);
  if(syncHash)history.replaceState(null,'',`${location.pathname}${location.search}#${exercise.id}`);
  updateFavorite();
  document.querySelectorAll('.exercise').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.id===selected.id)));
}
function renderList(){
  const scroll=$('exercise-list').scrollTop;
  filtered=filterExercises({query:$('query').value,group:$('category').value,equipment:$('equipment').value,favorites:mode==='favorites'?favorites:null}).filter(ex=>mode!=='illustrated'||illustrations[ex.id]||schematics[ex.id]);
  $('result-count').textContent=`${filtered.length} exercice${filtered.length>1?'s':''}`;
  const fragment=document.createDocumentFragment();
  if(!filtered.length){const empty=document.createElement('p');empty.className='empty';empty.textContent=mode==='favorites'?'Aucun favori ne correspond à ces filtres. Ajoutez un exercice avec le cœur.':'Aucun exercice trouvé. Essayez un autre nom ou réinitialisez les filtres.';fragment.append(empty);}
  for(const ex of filtered){
    const button=document.createElement('button');button.type='button';button.className='exercise';button.dataset.id=ex.id;button.setAttribute('aria-pressed',String(ex.id===selected.id));
    const icon=document.createElement('span');icon.className='exercise-icon';icon.textContent=initials[ex.group];icon.setAttribute('aria-hidden','true');
    const content=document.createElement('span');content.className='exercise-text';
    const name=document.createElement('strong');name.textContent=ex.name;
    const meta=document.createElement('small');meta.textContent=`${ex.group} · ${illustrations[ex.id]?'Illustration animée':schematics[ex.id]?'Schéma 3D animé':'À illustrer'}`;content.append(name,meta);
    const arrow=document.createElement('span');arrow.className='exercise-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    button.append(icon,content,arrow);button.addEventListener('click',()=>choose(ex));fragment.append(button);
  }
  $('exercise-list').replaceChildren(fragment);$('exercise-list').scrollTop=scroll;
  $('previous').disabled=filtered.length<2;$('next').disabled=filtered.length<2;
}
function applyFilters(){renderList();$('exercise-list').scrollTop=0;if(filtered.length&&!filtered.some(ex=>ex.id===selected.id))choose(filtered[0]);}
$('query').addEventListener('input',applyFilters);$('category').addEventListener('change',applyFilters);$('equipment').addEventListener('change',applyFilters);
function setMode(value){mode=value;for(const [id,name] of [['all-tab','all'],['illustrated-tab','illustrated'],['favorites-tab','favorites']])$(id).setAttribute('aria-pressed',String(mode===name));applyFilters();}
$('all-tab').addEventListener('click',()=>setMode('all'));$('illustrated-tab').addEventListener('click',()=>setMode('illustrated'));$('favorites-tab').addEventListener('click',()=>setMode('favorites'));
$('clear-filters').addEventListener('click',()=>{$('query').value='';$('category').value='Toutes';$('equipment').value='Tous';setMode('all');});
$('favorite').addEventListener('click',()=>{if(favorites.has(selected.id))favorites.delete(selected.id);else favorites.add(selected.id);try{localStorage.setItem(storageKey,JSON.stringify([...favorites]));}catch{/* Favorites remain available in memory. */}updateFavorite();renderList();});
$('play').addEventListener('click',()=>{if(player){player.setPlaying(!player.playing);updatePlayback();}});
$('timeline').addEventListener('input',()=>{if(player){player.setPlaying(false);player.setPhase(Number($('timeline').value)/1000);updatePlayback();}});
$('speed').addEventListener('change',()=>{if(player)player.speed=Number($('speed').value);});
$('motion-mode').addEventListener('change',()=>{player?.setMode($('motion-mode').value);updateMediaDescription();});
$('reset-view').addEventListener('click',()=>player?.resetView());
$('zoom-in').addEventListener('click',()=>player?.zoom(.25));$('zoom-out').addEventListener('click',()=>player?.zoom(-.25));
$('camera-left').addEventListener('click',()=>player?.rotateCamera(-Math.PI/8));$('camera-right').addEventListener('click',()=>player?.rotateCamera(Math.PI/8));
$('muscle-overlay').addEventListener('change',()=>player?.setMuscleVisibility($('muscle-overlay').checked));
for(const [id,delta] of [['previous',-1],['next',1]])$(id).addEventListener('click',()=>{if(!filtered.length)return;const index=filtered.findIndex(ex=>ex.id===selected.id);choose(filtered[(Math.max(0,index)+delta+filtered.length)%filtered.length]);document.querySelector('.exercise[aria-pressed=true]')?.scrollIntoView({block:'nearest'});});
window.addEventListener('hashchange',()=>{const ex=catalogue.find(ex=>ex.id===location.hash.slice(1));if(ex)choose(ex,{syncHash:false});});
window.addEventListener('pagehide',event=>{if(!event.persisted)player?.dispose();});
if(!illustrations[selected.id]&&!schematics[selected.id]){mode='all';$('all-tab').setAttribute('aria-pressed','true');$('illustrated-tab').setAttribute('aria-pressed','false');}
renderList();choose(selected);
