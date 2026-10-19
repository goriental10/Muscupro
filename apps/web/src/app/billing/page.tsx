import { IntegrationHub } from "@/components/integration-hub";
export default function Page() { return <IntegrationHub title="Abonnement & paiements" description="Préparation des paiements Stripe." requirements={["Configurer le compte Stripe, les produits et les tarifs.", "Implémenter puis tester les abonnements et les webhooks signés."]} />; }
