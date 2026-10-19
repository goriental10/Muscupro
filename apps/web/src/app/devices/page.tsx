import { IntegrationHub } from "@/components/integration-hub";
export default function Page() { return <IntegrationHub title="Appareils connectés" description="Préparation des connexions Apple Santé et Health Connect." requirements={["Reconstruire puis signer les applications natives.", "Configurer les permissions et tester une synchronisation sur un appareil réel."]} />; }
