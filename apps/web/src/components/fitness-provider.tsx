"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createInitialState, parseFitnessState, type FitnessState } from "@/lib/fitness";

const KEY = "muscupro.fitness.v2";
type FitnessContext = { state: FitnessState; ready: boolean; error: string; notice: string; update: (fn: (state: FitnessState) => FitnessState) => boolean; restore: (value: unknown) => void; notify: (message: string) => void };
const Context = createContext<FitnessContext | null>(null);
export function FitnessProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FitnessState>(createInitialState);
  const current = useRef(state);
  const blocked = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) { const next = parseFitnessState(JSON.parse(saved)); current.current = next; setState(next); }
    } catch { blocked.current = true; setError("La sauvegarde locale n’a pas pu être chargée. Votre fichier d’origine est conservé. Importez une sauvegarde depuis le profil."); }
    setReady(true);
    function receive(event: StorageEvent) {
      if (event.key !== KEY || !event.newValue) return;
      try { const next = parseFitnessState(JSON.parse(event.newValue)); current.current = next; setState(next); setNotice("Données mises à jour depuis un autre onglet."); } catch { setError("La mise à jour d’un autre onglet n’a pas pu être lue."); }
    }
    window.addEventListener("storage", receive);
    return () => window.removeEventListener("storage", receive);
  }, []);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 5500); return () => clearTimeout(timer); }, [notice]);
  const persist = useCallback((next: FitnessState) => {
    // Commit to memory only after persistent storage succeeds. A full/blocked disk must not look like a saved workout.
    try { const checked = parseFitnessState({ ...next, updatedAt: new Date().toISOString() }); localStorage.setItem(KEY, JSON.stringify(checked)); current.current = checked; setState(checked); blocked.current = false; setError(""); }
    catch (e) { setError(e instanceof Error && e.message.startsWith("Sauvegarde") ? e.message : "Enregistrement impossible sur cet appareil. Libérez de l’espace ou autorisez le stockage avant de réessayer."); throw e; }
  }, []);
  const update = useCallback((fn: (state: FitnessState) => FitnessState) => { if (!ready || blocked.current) return false; try { persist(fn(current.current)); return true; } catch { return false; } }, [persist, ready]);
  const restore = useCallback((value: unknown) => { persist(parseFitnessState(value)); setNotice("Sauvegarde importée et enregistrée sur cet appareil."); }, [persist]);
  return <Context.Provider value={{ state, ready, error, notice, update, restore, notify: setNotice }}>{children}</Context.Provider>;
}
export function useFitness() { const context = useContext(Context); if (!context) throw new Error("FitnessProvider absent"); return context; }
