# MuscuPro Global — reprise complète

Reprise du projet existant sur la branche `codex/muscupro-reprise-complete`.
Le cœur Web fonctionne avec des données locales : il ne demande ni compte ni abonnement.
L’ancienne version en ligne n’est pas remplacée par cette branche.

## Démarrer le projet

Prérequis : Node.js 24 et pnpm 11.25.0 (version vérifiée pendant la reprise).

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Ouvrir http://localhost:3000. Aucun fichier de secrets ni serveur PostgreSQL n’est nécessaire pour le cœur Web.

## Parcours implémentés

- Tableau de bord calculé à partir des données réellement enregistrées ; démarrage sans statistiques inventées.
- Catalogue de six exercices avec schémas animés, recherche, filtres, étapes et mise en pause.
- Trois modèles de séance : corps complet, haut du corps, jambes et hanches.
- Saisie des charges totales, répétitions, validation des séries, repos et reprise d’une séance en cours.
- Historique, volumes, charges maximales enregistrées et suivi du poids.
- Journal alimentaire avec calories et macronutriments saisis manuellement.
- Calendrier, export iCalendar, profil et objectifs personnels.
- Sauvegarde locale versionnée, export JSON et import avec aperçu et confirmation.
- Interface adaptée aux petits écrans et navigation mobile.

Les données sont propres au navigateur utilisé. Effacer les données du site peut les supprimer : utiliser l’export JSON pour conserver une copie. Les données locales ne sont pas synchronisées automatiquement avec un compte serveur.

## Vérification

```bash
pnpm typecheck
pnpm test
pnpm build
```

Ces commandes vérifient le Web et l’API. Elles ne prétendent pas compiler l’ancien squelette natif.
Les dix tests métier du Web couvrent les volumes, les frontières de semaine, les séances partielles et la validation des imports ; deux tests de l’API vérifient les jetons.

La compilation de production et les contrôles TypeScript ont réussi pendant la reprise. Les essais interactifs dans le navigateur distant restent non validés : le serveur de développement a affiché la structure de page mais est resté sur l’état de chargement. Un essai réel sur ordinateur et téléphone est nécessaire avant publication.

## API et comptes serveur

L’API Express/Prisma existante est conservée. Elle fournit l’authentification et la lecture des résumés de séances. Elle ne fournit pas encore la synchronisation du nouvel espace local.

Configurer `DATABASE_URL`, `JWT_SECRET`, `WEB_ORIGIN` puis exécuter :

```bash
pnpm db:generate
pnpm db:deploy
pnpm dev:api
```

Le Web utilise `API_URL` côté serveur pour joindre l’API ; sa valeur locale par défaut est `http://localhost:4000`.
Les formulaires de connexion et d’inscription signalent les indisponibilités. Aucun compte de démonstration n’est prérempli.

## Étapes jusqu’à la version complète

La feuille de route et les critères de validation sont dans [docs/REPRISE_COMPLETE.md](docs/REPRISE_COMPLETE.md) et accessibles dans l’application à `/roadmap`.

Les paiements Stripe, le coach IA distant, les fonctions sociales, la synchronisation entre appareils et les builds natifs ne sont pas activés. Les anciens écrans qui en simulaient le fonctionnement indiquent maintenant leur état réel.

Le dépôt `apps/mobile` conserve l’ancien squelette Expo. Ses anciennes commandes qui annonçaient un succès sans compiler ont été remplacées par une erreur explicite. Il faut reconstruire ses dépendances et ses écrans avant de lancer EAS.
