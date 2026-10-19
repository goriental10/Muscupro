"use client";
import Link from "next/link";
import { AppShell } from "./app-shell";
import { Icon } from "./icons";
export function IntegrationHub({ title, description, requirements, available = "/dashboard", availableLabel = "Retour à mon espace" }: { title: string; description: string; requirements: string[]; available?: string; availableLabel?: string }) {
  return <AppShell title={title} eyebrow="Services complémentaires" description={description}><section className="card"><span className="pill">À connecter</span><h2 className="subsection-title">Ce service n’est pas encore activé.</h2><ul className="integration-requirements">{requirements.map(r => <li key={r}>{r}</li>)}</ul><div className="button-row"><Link className="button" href={available}>{availableLabel}<Icon name="arrow" /></Link><Link className="button secondary" href="/roadmap">Consulter les étapes du projet</Link></div></section></AppShell>;
}
