/** Catalogue de 141 exercices. Les médias sont déclarés séparément dans illustrations.mjs. */
const groups = {
'Pectoraux':`Développé couché|Pompes classiques|Pompes inclinées|Pompes sur les genoux|Pompes mains rapprochées|Pompes mains écartées|Développé assis à la machine|Développé couché à la barre|Développé incliné avec haltères|Développé incliné à la machine|Développé couché au sol|Écarté couché avec haltères|Papillon à la machine|Écarté à la poulie|Écarté à la poulie basse|Développé serré avec haltères`,
'Dos':`Tirage buste penché|Tirage vertical devant|Tirage vertical prise serrée|Tractions assistées|Tractions en pronation|Tractions en supination|Rowing assis à la poulie|Rowing assis à la machine|Rowing à un bras avec haltère|Rowing poitrine appuyée|Rowing inversé|Rowing à l'élastique|Tirage vertical à l'élastique|Tirage bras tendus à la poulie|Face pull à la poulie|Oiseau à la machine|Pull-over avec haltère`,
'Épaules':`Développé épaules|Élévations latérales avec haltères|Élévations latérales à la poulie|Élévations frontales avec haltères|Développé militaire à la barre|Développé assis à la machine|Développé Arnold|Oiseau buste penché|Face pull à l'élastique|Rotation externe à l'élastique|Rotation externe à la poulie|Haussements d'épaules|Y raise sur banc incliné`,
'Biceps':`Curl biceps|Curl marteau|Curl à la barre droite|Curl à la barre EZ|Curl incliné|Curl concentré|Curl pupitre|Curl à la poulie basse|Curl unilatéral à la poulie|Curl inversé|Curl alterné`,
'Triceps':`Extension triceps à la poulie|Extension triceps à la corde|Extension au-dessus de la tête|Extension au-dessus de la tête à la poulie|Kickback triceps|Dips sur banc|Dips assistés|Dips aux barres parallèles|Développé couché prise serrée|Pompes diamant adaptées`,
'Quadriceps':`Squat|Squat goblet|Squat à la barre|Squat à la Smith machine|Presse à cuisses|Hack squat|Fentes avant|Fentes arrière|Fentes marchées|Fentes latérales|Squat bulgare|Step-up sur banc|Extension des jambes à la machine`,
'Ischio-jambiers':`Soulevé de terre roumain|Leg curl allongé|Leg curl assis|Leg curl debout|Soulevé de terre jambes semi-tendues|Good morning léger|Pont ischio-jambiers sur serviette|Leg curl avec ballon|Leg curl à l'élastique|Soulevé de terre à une jambe|Pont à une jambe`,
'Fessiers':`Pont fessier au sol|Hip thrust au banc|Hip thrust à la machine|Abduction de hanche à la machine|Abduction latérale à l'élastique|Clamshell|Kickback à la poulie|Kickback à quatre pattes|Montée latérale sur banc|Marche latérale avec élastique`,
'Mollets':`Extensions mollets debout|Extensions mollets assis|Extensions mollets à la presse|Extensions mollets sur une jambe|Extensions mollets avec haltères|Relevés de pointes`,
'Abdominaux':`Planche sur les avant-bras|Planche latérale|Dead bug|Bird dog|Crunch abdominal|Crunch inversé|Relevés de genoux assis|Pallof press|Pallof press à la poulie|Rotation du buste assise|Mountain climber lent|Gainage sur ballon|Planche bras tendus|Planche avec toucher d'épaule`,
'Cardio':`Marche active|Vélo stationnaire|Elliptique|Rameur|Montée de marche|Danse fitness douce|Jumping jack adapté|Corde à sauter imaginaire|Course légère|Marche inclinée sur tapis`,
'Mobilité':`Cercles des épaules|Chat-vache|Rotation thoracique à quatre pattes|Ouverture des hanches au sol|Balancement de cheville|Fente d'étirement dynamique|Mobilité des poignets|Étirement pectoral au mur|Rotation du cou contrôlée|Flexion-extension des genoux assise`
};
export const normalize = str=>str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const slug=s=>normalize(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function equipment(name){
 const n=normalize(name);
 const named={'Squat goblet':'Haltères','Curl inversé':'Barre','Leg curl allongé':'Machine','Leg curl assis':'Machine','Leg curl debout':'Machine','Tirage vertical devant':'Poulie','Tirage vertical prise serrée':'Poulie','Kickback triceps':'Haltères','Extension au-dessus de la tête':'Haltères','Extension triceps à la corde':'Poulie','Développé Arnold':'Haltères','Rowing poitrine appuyée':'Haltères','Oiseau buste penché':'Haltères',"Haussements d'épaules":'Haltères','Y raise sur banc incliné':'Haltères','Pallof press':'Élastique','Développé couché au sol':'Haltères','Développé couché prise serrée':'Barre'};
 if(named[name])return named[name];
 if(/machine|presse|hack squat|elliptique|\bvelo\b|rameur|tapis/.test(n))return 'Machine';
 if(/halteres?|curl marteau|curl biceps|curl incline|curl concentre|curl alterne/.test(n))return 'Haltères';
 if(/poulie/.test(n))return 'Poulie';
 if(/elastique/.test(n))return 'Élastique';
 if(/ballon/.test(n))return 'Ballon';
 if(/barre|developpe couche$|developpe epaules$|tirage buste penche$|souleve de terre|good morning|curl pupitre/.test(n)&&!/dips|traction/.test(n))return 'Barre';
 return 'Poids du corps';
}
export const catalogue = Object.entries(groups).flatMap(([group,text])=>text.split('|').map(name=>({id:slug(group+'-'+name),name,group,equipment:equipment(name)})));
export const categories=['Toutes',...Object.keys(groups)];
if(catalogue.length!==141 || new Set(catalogue.map(x=>x.id)).size!==141)throw Error('Catalogue invalide : '+catalogue.length);

export const equipmentTypes=['Tous',...new Set(catalogue.map(e=>e.equipment))];
export function filterExercises({query='',group='Toutes',equipment='Tous',favorites=null}={}){
 const words=normalize(query).trim().split(/\s+/).filter(Boolean);
 return catalogue.filter(e=>(group==='Toutes'||e.group===group)&&(equipment==='Tous'||e.equipment===equipment)&&(!favorites||favorites.has(e.id))&&words.every(word=>normalize(`${e.name} ${e.group} ${e.equipment}`).includes(word)));
}
