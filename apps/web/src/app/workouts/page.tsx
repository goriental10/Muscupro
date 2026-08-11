import { Sidebar } from "@/components/sidebar";
import { WorkoutsHub } from "@/components/workouts-hub";

export default function Page() {
  return <div className="shell"><Sidebar/><main><div className="top"><div><h1>Entraînements</h1><p className="muted">Programmes, séances, séries et progression.</p></div></div><WorkoutsHub /></main></div>;
}
