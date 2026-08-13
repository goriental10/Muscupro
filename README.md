# MuscuPro Global v1.0.0 Beta

Cette version ajoute les **notifications avancées**, les rappels de séances, les préférences utilisateur, le calendrier interne et l'export iCalendar `.ics`.

Voir `docs/NOTIFICATIONS_CALENDAR.md`.

# MuscuPro Global

Monorepo bêta réunissant :

- `apps/marketing` : site vitrine original fourni par l’utilisateur ;
- `apps/web` : application Next.js ;
- `apps/api` : API Express + Prisma ;
- `packages/shared` : contrats TypeScript partagés.

## Démarrage local

```bash
cp .env.example .env
corepack enable
pnpm install
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm dev
```

- Application : http://localhost:3000
- API : http://localhost:4000
- Santé API : http://localhost:4000/health/live
- Vitrine statique : ouvrir `apps/marketing/index.html` ou utiliser son Dockerfile.

## Important

Les clés Stripe et autres secrets doivent rester dans `.env` et ne jamais être commités.

## Authentification

L'étape d'authentification complète est incluse : inscription, connexion, JWT court, refresh token en cookie HttpOnly, rotation de session, déconnexion et protection des entraînements. Voir `docs/AUTHENTICATION.md`.

## Profil et sécurité (v0.13)

Cette version ajoute la modification du profil, le changement de mot de passe, la vérification du courriel et la récupération du mot de passe. En développement, les endpoints de courriel peuvent retourner un `devToken` pour permettre les tests sans fournisseur SMTP. En production, ces jetons ne sont jamais retournés au navigateur et doivent être envoyés par un service de courriel transactionnel.

## Courriels transactionnels

Voir `docs/TRANSACTIONAL_EMAIL.md` pour la configuration du fournisseur, les modèles et les règles de sécurité.

## Module Entraînements v0.14

Cette version ajoute le domaine d’entraînement complet : bibliothèque d’exercices, programmes, séances modèles, séances exécutées, séries (charge/répétitions/RPE), historique, volume total et records personnels estimés.

Routes principales :
- `GET/POST /api/v1/workouts/exercises`
- `GET/POST /api/v1/workouts/programs`
- `POST /api/v1/workouts/programs/:programId/workouts`
- `POST /api/v1/workouts/program-workouts/:programWorkoutId/exercises`
- `GET/POST /api/v1/workouts`
- `GET /api/v1/workouts/:workoutId`
- `PATCH /api/v1/workouts/:workoutId/status`
- `POST /api/v1/workouts/:workoutId/exercises`
- `POST /api/v1/workouts/:workoutId/exercises/:workoutExerciseId/sets`
- `GET /api/v1/workouts/progress/summary`


## Nutrition v0.16
Voir `docs/NUTRITION.md`.

## Progression & statistiques

La v0.16 ajoute les mensurations, objectifs, records estimés et tendances hebdomadaires sous `/progress`. Voir `docs/PROGRESSION.md`.

## v0.21 Beta — Paiements Stripe

- Stripe Checkout et abonnements
- Portail client Stripe
- Webhooks signés et dédupliqués
- Synchronisation du statut d’abonnement
- Interface Billing complète

Voir `docs/BILLING.md`.

## v0.21 Beta — Coach IA

Conversation contextuelle, générateur de programmes prudent, mémoire de conversation et fournisseur local/distant configurable. Voir `docs/AI_COACH.md`.


## v0.21 Premium

Voir `docs/PREMIUM_ENTITLEMENTS.md` pour la matrice des droits, les quotas et les protections serveur.


## v0.21 — Coach ↔ Athlète

Invitations, portefeuille d’athlètes, suivi et attribution de programmes avec quotas selon le forfait.


## v0.24 — Messagerie Coach ↔ Athlète

Conversations sécurisées, messages, lecture/non-lu, notifications internes et polling incrémental. Voir `docs/MESSAGING.md`.


## Communauté v0.24
Fil d’actualité, commentaires, réactions et défis sportifs via `/community`.


## Marketplace v0.24
Catalogue de programmes, ventes par coach, achats Stripe et bibliothèque utilisateur.


## Administration v0.25

La version v0.25 ajoute la supervision administrateur, la gestion contrôlée des rôles/sessions, la modération communautaire et un journal d’audit. Voir `docs/ADMINISTRATION.md`.

## Santé & appareils (v1.0.0)

La couche de synchronisation santé est disponible dans `/api/v1/health` et l’écran Web dans `/devices`. Voir `docs/HEALTH_DEVICES.md`.


## Application mobile native (v1.0.0)
Le workspace `apps/mobile` ajoute une application Expo/React Native avec authentification, dashboard, entraînements, nutrition, progression et synchronisation HealthKit/Health Connect. Voir `docs/MOBILE_NATIVE.md`.


## Stabilisation v1.0.0
- Release gate GitHub Actions
- EAS mobile build workflow
- Release checklist and E2E test plan
- Static release secret scan


## Final release

This source package is tagged as **MuscuPro Global v1.0.0**. Run `pnpm final:validate` after installing dependencies and before deployment.

## Déploiement production (API + Web)

- Guide concis Railway (API) + Vercel (Web) : `docs/DEPLOY_RAILWAY_VERCEL.md`
- Vérification avant release : `pnpm release:check`
