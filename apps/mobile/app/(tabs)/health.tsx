import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";
import { api } from "../../src/lib/api";
import { syncNativeHealth } from "../../src/features/health/sync";
import { rounded, syncLabel, type HealthSummary } from "../../src/features/health/summary";

export default function Health() {
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setSummary(await api<HealthSummary>("/api/v1/health/summary"));
  }, []);

  useEffect(() => {
    load().catch((cause: Error) => setMessage(cause.message));
  }, [load]);

  async function synchronize() {
    setPending(true);
    setMessage("");
    try {
      const result = await syncNativeHealth(7);
      setMessage(`${result.accepted} nouvelle(s) donnée(s) synchronisée(s).`);
      await load();
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Synchronisation impossible");
    } finally {
      setPending(false);
    }
  }

  return (
    <Screen>
      <Card title="Activité des 7 derniers jours">
        <Text style={styles.value}>{rounded(summary?.totals.STEPS)} pas</Text>
        <Text style={styles.muted}>{rounded(summary?.totals.DISTANCE_KM, 1)} km enregistrés</Text>
      </Card>
      <Card title="Dernière donnée">
        <Text style={styles.value}>{syncLabel(summary?.lastRecordedAt ?? null)}</Text>
        <Text style={styles.muted}>{summary?.records ?? 0} mesure(s) reçue(s) cette semaine</Text>
      </Card>
      <Pressable style={styles.button} onPress={synchronize} disabled={pending}>
        {pending ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Synchroniser l’appareil</Text>}
      </Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Text style={styles.notice}>La synchronisation nécessite une version de développement ou de production, et votre autorisation dans Santé/Health Connect.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  value: { color: "white", fontSize: 22, fontWeight: "800" },
  muted: { color: "#94a3b8", lineHeight: 20 },
  button: { backgroundColor: "#7c3aed", padding: 15, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "800" },
  message: { color: "#c4b5fd" },
  notice: { color: "#94a3b8", fontSize: 13, lineHeight: 19 }
});
