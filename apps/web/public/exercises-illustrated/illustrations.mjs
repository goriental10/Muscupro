/** Each asset is bound to the exercise actually shown; missing media stays explicit. */
export const illustrations = {
  'epaules-elevations-laterales-avec-halteres': {
    title: 'Élévations latérales avec haltères',
    group: 'Épaules',
    motion: 'lateral-raise',
    original: 'assets/elevations-laterales-exercice-musculation-1.gif',
    atlas: 'assets/elevations-laterales-frames.webp',
    width: 700, height: 700, columns: 4, frames: 12,
    durations: [1000,100,100,100,100,100,1000,100,100,100,100,100],
    source: 'Illustration fournie par l’utilisateur',
    originalSha256: '6bc1bc41e2f0087c1586b67754f042421be2514ceec78b249e0ccaa8819e7e51',
  },
};

export function frameAtTime(illustration, milliseconds) {
  const total=illustration.durations.reduce((sum,duration)=>sum+duration,0);
  let remaining=((milliseconds%total)+total)%total;
  for(let index=0;index<illustration.frames;index++){
    if(remaining<illustration.durations[index])return index;
    remaining-=illustration.durations[index];
  }
  return illustration.frames-1;
}
