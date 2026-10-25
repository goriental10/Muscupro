import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Catalogue d’exercices animés | MuscuPro Global",
  description: "141 exercices, 12 groupes musculaires et un lecteur d’illustrations animées.",
};

export default function ExercisesPage() {
  return (
    <div className="shell">
      <Sidebar />
      <main style={{ minWidth: 0 }}>
        <iframe
          title="Catalogue MuscuPro : exercices illustrés animés"
          src="/exercises-illustrated/index.html?embedded=1"
          style={{ display: "block", width: "100%", height: "100dvh", minHeight: 720, border: 0 }}
        />
        <p style={{ padding: "0 24px" }}>
          <a href="/exercises-illustrated/index.html" target="_blank" rel="noopener noreferrer">
            Ouvrir le catalogue en plein écran ↗
          </a>
        </p>
      </main>
    </div>
  );
}
