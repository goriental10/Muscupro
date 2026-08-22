import { StyleSheet, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { Card } from "../../src/components/Card";

export default function Nutrition() {
  return (
    <Screen>
      <Card title="Repères simples">
        <Text style={styles.title}>Des repas variés et réguliers</Text>
        <Text style={styles.muted}>Combinez des aliments énergétiques, des sources de protéines, des fruits ou légumes et de l’eau.</Text>
      </Card>
      <Card title="Avant l’entraînement">
        <Text style={styles.title}>Arriver avec de l’énergie</Text>
        <Text style={styles.muted}>Choisissez un repas ou une collation familière et laissez le temps de digérer.</Text>
      </Card>
      <Card title="Après l’entraînement">
        <Text style={styles.title}>Récupérer progressivement</Text>
        <Text style={styles.muted}>Hydratez-vous et reprenez un repas équilibré selon votre horaire et votre faim.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: "white", fontSize: 20, fontWeight: "800" },
  muted: { color: "#94a3b8", lineHeight: 21 }
});
