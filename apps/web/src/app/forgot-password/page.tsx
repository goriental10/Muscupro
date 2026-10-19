import Link from "next/link";
export default function Page() { return <main className="auth"><section className="auth-card"><h1>Récupération du mot de passe</h1><p className="muted">Ce parcours nécessite le service de courriel transactionnel et ses routes serveur. Il reste à mettre en service.</p><Link className="button" href="/profile">Revenir à mon profil</Link></section></main>; }
