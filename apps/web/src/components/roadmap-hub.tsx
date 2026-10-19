"use client";
import Link from "next/link";
import { AppShell } from "./app-shell";
import { Icon } from "./icons";
const stages = [
  ["01", "Audit & reprise du code", "Base vérifiée", "Le dépôt existant a été examiné et la reprise se fait dans une branche dédiée."],
  ["02", "Interface ordinateur & mobile", "Implémenté", "Navigation, tableaux de bord, états vides et formulaires adaptés aux petits écrans."],
  ["03", "Catalogue animé", "Implémenté", "Six schémas animés, recherche, filtres musculaires, étapes et mise en pause."],
  ["04", "Séances & séries", "Implémenté", "Trois modèles, charges, répétitions, validation, repos et reprise d’une séance en cours."],
  ["05", "Nutrition & progression", "Implémenté", "Repas saisis manuellement, calories, macronutriments, mesures et historique réel."],
  ["06", "Calendrier & profil", "Implémenté", "Planification, export iCalendar, objectifs personnels, sauvegarde et import JSON."],
  ["07", "Comptes & base de données", "À mettre en service", "L’API Express et le schéma PostgreSQL sont conservés. Il faut vérifier le serveur, les migrations et la connexion réelle."],
  ["08", "Paiements Stripe", "À configurer", "Nécessite un compte Stripe, des prix, des clés serveur et des webhooks vérifiés."],
  ["09", "Coach IA & fonctions sociales", "À développer", "Assistant distant, messages et communauté nécessitent des services et des contrôles d’accès réels."],
  ["10", "Application native iOS & Android", "À reconstruire", "L’ancienne base Expo est archivée dans le dépôt. Un build EAS et des essais sur appareils restent nécessaires."],
  ["11", "Vérification & mise en ligne", "Voir le rapport de reprise", "Les contrôles de code et les essais réalisés sont consignés dans le dépôt. L’accès Vercel doit autoriser le déploiement."],
];
export function RoadmapHub() { return <AppShell title="Une base claire. Toutes les étapes." eyebrow="Reprise de MuscuPro Global" description="L’avancement distingue les parcours implémentés des services qui restent à connecter." action={<Link className="button" href="/dashboard">Ouvrir mon espace <Icon name="arrow" /></Link>}><div className="roadmap-list">{stages.map(([number, title, status, detail], i) => <article className="card roadmap-item" key={number}><span className="stage-number">{number}</span><div><div className="section-heading"><h2>{title}</h2><span className={`pill ${i < 6 ? "mint" : ""}`}>{status}</span></div><p className="muted">{detail}</p></div></article>)}</div></AppShell>; }
