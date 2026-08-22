import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { api } from "../../src/lib/api";

type DashboardData = {
  workouts: { completedThisWeek: number; volumeThisWeek: number };
  wellbeing: { lastSyncAt: string | null };
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<DashboardData>("/api/v1/dashboard").then(setData).catch((cause: Error) => setError(cause.message));
  }, []);

  return (
    <Screen>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!data && !error ? <ActivityIndicator color="#a78bfa" /> : null}
      <Card title="Cette semaine">
        <Text style={styles.value}>{data?.workouts.completedThisWeek ?? "—"} séances terminées</Text>
        <Text style={styles.muted}>Volume enregistré : {data?.workouts.volumeThisWeek?.toLocaleString("fr-CA") ?? "—"} kg</Text>
      </Card>
      <Card title="Récupération">
        <Text style={styles.value}>Régularité avant intensité</Text>
        <Text style={styles.muted}>Pensez au sommeil, à l’hydratation et aux jours de récupération.</Text>
      </Card>
      <Card title="Données santé">
        <Text style={styles.value}>{data?.wellbeing.lastSyncAt ? "Synchronisées" : "Non synchronisées"}</Text>
        <Text style={styles.muted}>Vous gardez le contrôle sur les données partagées depuis votre appareil.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  value: { color: "white", fontSize: 22, fontWeight: "800" },
  muted: { color: "#94a3b8", lineHeight: 20 },
  error: { color: "#fb7185" }
});
