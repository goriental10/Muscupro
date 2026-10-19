export type Exercise = { id: string; name: string; muscle: string; equipment: string; cue: string; steps: string[]; animation: string };
export const exercises: Exercise[] = [
  { id: "squat", name: "Squat", muscle: "Jambes", equipment: "Poids du corps", animation: "squat", cue: "Descendez avec contrôle, puis poussez dans le sol.", steps: ["Placez les pieds à une largeur confortable, les talons au sol.", "Fléchissez les hanches et les genoux dans une amplitude confortable.", "Remontez sans rebond, en gardant le buste stable."] },
  { id: "bench", name: "Développé couché", muscle: "Pectoraux", equipment: "Haltères", animation: "bench", cue: "Gardez les omoplates stables et les poignets alignés.", steps: ["Allongez-vous sur un banc stable, pieds au sol.", "Abaissez les haltères de chaque côté de la poitrine avec contrôle.", "Repoussez les haltères sans les entrechoquer."] },
  { id: "row", name: "Tirage buste penché", muscle: "Dos", equipment: "Haltères", animation: "row", cue: "Ramenez les coudes vers les hanches sans arrondir le dos.", steps: ["Reculez les hanches en gardant le dos dans une position stable.", "Tirez les haltères vers le bas des côtes, sans élan.", "Redescendez lentement et respirez régulièrement."] },
  { id: "deadlift", name: "Soulevé de terre roumain", muscle: "Jambes", equipment: "Haltères", animation: "deadlift", cue: "Reculez les hanches et gardez les charges près des jambes.", steps: ["Debout, gardez les genoux légèrement fléchis.", "Reculez les hanches, charges proches du corps, sans forcer l’amplitude.", "Revenez debout en poussant les hanches vers l’avant."] },
  { id: "press", name: "Développé épaules", muscle: "Épaules", equipment: "Haltères", animation: "press", cue: "Poussez vers le haut en gardant le tronc stable.", steps: ["Placez les haltères à hauteur des épaules.", "Développez au-dessus de la tête sans cambrer le bas du dos.", "Revenez lentement à la position de départ."] },
  { id: "curl", name: "Curl biceps", muscle: "Bras", equipment: "Haltères", animation: "curl", cue: "Gardez les coudes près du corps et évitez l’élan.", steps: ["Tenez-vous debout, poignets dans une position confortable.", "Fléchissez les coudes sans balancer le buste.", "Redescendez avec contrôle jusqu’à une extension confortable."] },
];
export type Program = { id: string; name: string; description: string; minutes: number; exerciseIds: string[]; sets: number; reps: number; tag: string };
export const programs: Program[] = [
  { id: "full", name: "Corps complet", description: "Une séance simple pour travailler les principaux groupes musculaires.", minutes: 45, exerciseIds: ["squat", "bench", "row", "deadlift"], sets: 3, reps: 10, tag: "Équilibre" },
  { id: "upper", name: "Haut du corps", description: "Poussées et tirages, puis travail des épaules et des bras.", minutes: 40, exerciseIds: ["bench", "row", "press", "curl"], sets: 3, reps: 10, tag: "Haltères" },
  { id: "lower", name: "Jambes & hanches", description: "Deux mouvements fondamentaux pour une séance courte et contrôlée.", minutes: 25, exerciseIds: ["squat", "deadlift"], sets: 3, reps: 10, tag: "Fondamentaux" },
];
export type WorkoutSet = { id: string; weightKg: number; reps: number; completed: boolean };
export type Workout = { id: string; programId: string; name: string; startedAt: string; completedAt?: string; exercises: { exerciseId: string; sets: WorkoutSet[] }[] };
export type Meal = { id: string; date: string; name: string; category: string; calories: number; protein: number; carbs: number; fat: number };
export type Profile = { name: string; goal: string; weeklyGoal: number; dailyCalories: number };
export type FitnessState = { schemaVersion: 2; profile: Profile; workouts: Workout[]; activeWorkout: Workout | null; meals: Meal[]; measurements: { id: string; date: string; weightKg: number }[]; schedule: { id: string; programId: string; date: string }[]; updatedAt: string };
export const createInitialState = (): FitnessState => ({ schemaVersion: 2, profile: { name: "Georges", goal: "Régularité", weeklyGoal: 3, dailyCalories: 0 }, workouts: [], activeWorkout: null, meals: [], measurements: [], schedule: [], updatedAt: new Date(0).toISOString() });
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const uid = () => typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("");
export function createWorkout(program: Program, id = uid(), now = new Date().toISOString()): Workout {
  return { id, programId: program.id, name: program.name, startedAt: now, exercises: program.exerciseIds.map(exerciseId => ({ exerciseId, sets: Array.from({ length: program.sets }, (_, i) => ({ id: `${exerciseId}-${i}`, weightKg: 0, reps: program.reps, completed: false })) })) };
}
export const workoutVolume = (workout: Workout) => workout.exercises.reduce((sum, exercise) => sum + exercise.sets.reduce((v, set) => v + (set.completed ? set.reps * set.weightKg : 0), 0), 0);
export const completedSets = (workout: Workout) => workout.exercises.flatMap(e => e.sets).filter(s => s.completed).length;
export function finishWorkout(workout: Workout, now = new Date().toISOString()): Workout {
  if (!completedSets(workout)) throw new Error("Validez au moins une série avant de terminer la séance.");
  return { ...workout, completedAt: now };
}
export function weeklyStats(workouts: Workout[], now = new Date()) {
  const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  const end = new Date(start); end.setDate(start.getDate() + 7);
  const week = workouts.filter(w => w.completedAt && new Date(w.completedAt) >= start && new Date(w.completedAt) < end);
  return { count: week.length, volume: week.reduce((sum, w) => sum + workoutVolume(w), 0), sets: week.reduce((sum, w) => sum + completedSets(w), 0), days: Array.from({ length: 7 }, (_, i) => { const day = new Date(start); day.setDate(start.getDate() + i); return { date: localDate(day), volume: week.filter(w => localDate(new Date(w.completedAt!)) === localDate(day)).reduce((sum, w) => sum + workoutVolume(w), 0) }; }) };
}
const object = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const num = (v: unknown, min: number, max: number) => typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const string = (v: unknown, max: number) => typeof v === "string" && v.length > 0 && v.length <= max;
const iso = (v: unknown) => typeof v === "string" && /^\d{4}-\d\d-\d\dT/.test(v) && Number.isFinite(Date.parse(v));
const date = (v: unknown) => typeof v === "string" && /^\d{4}-\d\d-\d\d$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
function validWorkout(w: unknown, finished: boolean): w is Workout {
  return object(w) && string(w.id, 100) && string(w.name, 100) && programs.some(p => p.id === w.programId) && iso(w.startedAt) && (finished ? iso(w.completedAt) && Date.parse(w.completedAt as string) >= Date.parse(w.startedAt as string) : w.completedAt === undefined) && Array.isArray(w.exercises) && w.exercises.length > 0 && w.exercises.length <= 20 && w.exercises.every(e => object(e) && exercises.some(x => x.id === e.exerciseId) && Array.isArray(e.sets) && e.sets.length > 0 && e.sets.length <= 20 && e.sets.every(s => object(s) && string(s.id, 100) && num(s.weightKg, 0, 1000) && num(s.reps, 1, 100) && Number.isInteger(s.reps) && typeof s.completed === "boolean"));
}
export function parseFitnessState(value: unknown): FitnessState {
  const fail = () => { throw new Error("Sauvegarde invalide ou incompatible. Choisissez un export MuscuPro Global version 2."); };
  if (!object(value) || value.schemaVersion !== 2 || !iso(value.updatedAt) || !object(value.profile)) return fail();
  const p = value.profile;
  if (!string(p.name, 80) || !string(p.goal, 80) || !num(p.weeklyGoal, 1, 14) || !Number.isInteger(p.weeklyGoal) || !num(p.dailyCalories, 0, 10000)) return fail();
  if (!Array.isArray(value.workouts) || value.workouts.length > 10000 || !value.workouts.every(w => validWorkout(w, true) && completedSets(w) > 0) || !(value.activeWorkout === null || validWorkout(value.activeWorkout, false))) return fail();
  if (!Array.isArray(value.meals) || value.meals.length > 20000 || !value.meals.every(m => object(m) && string(m.id, 100) && date(m.date) && string(m.name, 120) && ["Petit-déjeuner", "Déjeuner", "Dîner", "Collation"].includes(m.category as string) && num(m.calories, 1, 10000) && [m.protein, m.carbs, m.fat].every(n => num(n, 0, 1000)))) return fail();
  if (!Array.isArray(value.measurements) || value.measurements.length > 10000 || !value.measurements.every(m => object(m) && string(m.id, 100) && date(m.date) && num(m.weightKg, 20, 500))) return fail();
  if (!Array.isArray(value.schedule) || value.schedule.length > 10000 || !value.schedule.every(s => object(s) && string(s.id, 100) && date(s.date) && programs.some(p => p.id === s.programId))) return fail();
  for (const rows of [value.workouts, value.meals, value.measurements, value.schedule]) if (new Set(rows.map(r => (r as { id: string }).id)).size !== rows.length) return fail();
  return { schemaVersion: 2, profile: { name: p.name as string, goal: p.goal as string, weeklyGoal: p.weeklyGoal as number, dailyCalories: p.dailyCalories as number }, workouts: value.workouts as Workout[], activeWorkout: value.activeWorkout as Workout | null, meals: value.meals as Meal[], measurements: value.measurements as FitnessState["measurements"], schedule: value.schedule as FitnessState["schedule"], updatedAt: value.updatedAt as string };
}
