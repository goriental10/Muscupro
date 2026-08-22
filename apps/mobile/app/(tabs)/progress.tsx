import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { api } from "../../src/lib/api";

type ProgressData = {
  completedSessions: number;
  totalVolumeKg: number;
  recentSessions: Array<{ id: string; name: string; completedAt: string | null; totalVolumeKg: number }>;
};

export default function Progress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<ProgressData>("/api/v1/progress").then(setData).catch((cause: Error) => setError(cause.message));
  }, []);

  return (
    <Screen>
      {!data && !error ? <ActivityIndicator color="#a78bfa" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Card title="Séances récentes">
        <Text style={styles.value}>{data?.completedSessions ?? "—"}</Text>
        <Text style={styles.muted}>séances terminées dans l’historique récent</Text>
      </Card>
      <Card title="Volume d’entraînement">
        <Text style={styles.value}>{data?.totalVolumeKg?.toLocaleString("fr-CA") ?? "—"} kg</Text>
        <Text style={styles.muted}>Utilisez la tendance avec le ressenti et la récupération, pas comme une obligation quotidienne.</Text>
      </Card>
      {data?.recentSessions.slice(0, 5).map((session) => (
        <Card key={session.id} title={session.name}>
          <Text style={styles.muted}>
            {session.completedAt ? new Date(session.completedAt).toLocaleDateString("fr-CA") : "Date inconnue"}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  value: { color: "white", fontSize: 28, fontWeight: "800" },
  muted: { color: "#94a3b8", lineHeight: 20 },
  error: { color: "#fb7185" }
});
