"use client";import{useEffect,useState}from"react";
type Workout={id:string;name:string;scheduledAt:string|null;completedAt:string|null;durationMinutes:number|null;totalVolumeKg:number;createdAt:string};
export function WorkoutsHub(){
  const[workouts,setWorkouts]=useState<Workout[]|null>(null);
  const[error,setError]=useState("");
  const[name,setName]=useState("");
  const[creating,setCreating]=useState(false);
  useEffect(()=>{fetch("/api/workouts").then(r=>r.json()).then(d=>setWorkouts(d.items??[])).catch(()=>setError("Impossible de charger les entraînements."))},[]);
  async function createWorkout(e:React.FormEvent){e.preventDefault();if(!name.trim())return;setCreating(true);const r=await fetch("/api/workouts",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:name.trim()})});const d=await r.json();setCreating(false);if(r.ok){setWorkouts(prev=>[d.workout,...(prev??[])]);setName("")}else setError(d.error??"Erreur lors de la création.")}
  async function markComplete(id:string){const r=await fetch(`/api/workouts/${id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({completedAt:new Date().toISOString()})});if(r.ok){const d=await r.json();setWorkouts(prev=>prev?.map(w=>w.id===id?d.workout:w)??null)}}
  async function deleteWorkout(id:string){const r=await fetch(`/api/workouts/${id}`,{method:"DELETE"});if(r.ok||r.status===204)setWorkouts(prev=>prev?.filter(w=>w.id!==id)??null)}
  return <section className="module-grid">
    <article className="card module-card" style={{gridColumn:"1/-1"}}>
      <p className="eyebrow">Nouvelle séance</p>
      <form onSubmit={createWorkout} style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
        <input className="field" style={{flex:1,minWidth:"12rem"}} placeholder="Nom de la séance" value={name} onChange={e=>setName(e.target.value)} required/>
        <button className="button" type="submit" disabled={creating}>{creating?"Création…":"Créer"}</button>
      </form>
      {error?<p role="alert" style={{color:"#ff9d9d",marginTop:"0.5rem"}}>{error}</p>:null}
    </article>
    {workouts===null?<p className="muted">Chargement…</p>:workouts.length===0?<p className="muted">Aucune séance pour l'instant.</p>:workouts.map(w=><article className="card module-card" key={w.id}>
      <p className="eyebrow">{w.completedAt?"Terminée":"En attente"}</p>
      <h2>{w.name}</h2>
      {w.durationMinutes?<p className="muted">{w.durationMinutes} min</p>:null}
      {w.totalVolumeKg>0?<p className="muted">{w.totalVolumeKg.toLocaleString("fr-CA")} kg</p>:null}
      <div style={{display:"flex",gap:"0.5rem",marginTop:"0.75rem"}}>
        {!w.completedAt?<button className="button" type="button" onClick={()=>markComplete(w.id)}>Terminer</button>:null}
        <button className="button" type="button" style={{background:"transparent",border:"1px solid #ff9d9d",color:"#ff9d9d"}} onClick={()=>deleteWorkout(w.id)}>Supprimer</button>
      </div>
    </article>)}
  </section>
}
