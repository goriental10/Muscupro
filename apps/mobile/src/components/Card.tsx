import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
export function Card({ title, children }: PropsWithChildren<{ title: string }>) {
  return <View style={styles.card}><Text style={styles.title}>{title}</Text>{children}</View>;
}
const styles = StyleSheet.create({ card: { borderRadius: 18, padding: 16, gap: 10, backgroundColor: "#151c31", borderWidth: 1, borderColor: "#27304a" }, title: { color: "white", fontSize: 17, fontWeight: "700" } });
