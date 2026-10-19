import fs from "node:fs";
const report = JSON.parse(fs.readFileSync(new URL("../docs/RELEASE_READINESS.json", import.meta.url), "utf8"));
const blockers = Object.entries(report).filter(([, status]) => status !== "passed");
if (blockers.length) {
 console.error("La reprise n’est pas une version de production finale. Étapes à valider :");
 for (const [stage, status] of blockers) console.error(`- ${stage}: ${status}`);
 console.error("Voir docs/REPRISE_COMPLETE.md et mettre à jour le rapport uniquement après vérification réelle.");
 process.exitCode = 1;
} else {
 console.log("Toutes les étapes déclarées dans le rapport de préparation sont validées. Vérifier aussi le commit et l’environnement avant publication.");
}
