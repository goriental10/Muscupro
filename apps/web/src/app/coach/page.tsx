import { CoachHub } from "@/components/coach-hub";
import { PremiumGuard } from "@/components/premium-guard";

export default function CoachPage() {
  return <PremiumGuard feature="COACH_ATHLETE_MANAGEMENT" title="Gestion Coach ↔ Athlète"><CoachHub /></PremiumGuard>;
}
