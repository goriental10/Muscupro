import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { api } from "../../src/lib/api";

type Workout = {
  id: string;
  name: string;
  scheduledAt: string | null;
  completedAt: string | null;
  durationMinutes: number | null;
  totalVolumeKg: number;
};

export default function Workouts() {
  const [rows, setRows] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ items: Workout[] }>("/api/v1/workouts?limit=20")
      .then((data) => setRows(data.items))
      .catch((cause: Error) => setError(cause.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen>
      {loading ? <ActivityIndicator color="#a78bfa" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && rows.length === 0 ? <Text style={styles.muted}>Aucune séance chargée.</Text> : null}
      {rows.map((workout) => (
        <Card key={workout.id} title={workout.name}>
          <Text style={styles.text}>{workout.completedAt ? "Terminée" : "Planifiée"}</Text>
          <Text style={styles.muted}>
            {workout.scheduledAt ? new Date(workout.scheduledAt).toLocaleDateString("fr-CA") : "Date à définir"}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { color: "white" },
  muted: { color: "#94a3b8" },
  error: { color: "#fb7185" }
});
