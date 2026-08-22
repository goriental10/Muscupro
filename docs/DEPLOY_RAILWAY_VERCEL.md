# Déploiement Railway + Vercel (monorepo pnpm)

## Portée

Ce dépôt déploie en production :
- `apps/api` sur Railway (Dockerfile)
- `apps/web` sur Vercel (Next.js)

`apps/marketing` n’est pas présent dans ce clone.

## 1) Déployer l’API sur Railway

1. Créer un service PostgreSQL privé + un service applicatif depuis ce repo.
2. Utiliser `railway.json` (Dockerfile `apps/api/Dockerfile`, healthcheck `/health/ready`).
3. Variables Railway obligatoires :
   - `DATABASE_URL` (PostgreSQL Railway)
   - `JWT_SECRET` (au moins 32 caractères)
   - `WEB_ORIGIN` (URL HTTPS finale du web Vercel)
   - `NODE_ENV=production`
   - `PORT` (optionnel, défaut API: `4000`, Railway peut l’injecter)
4. Le démarrage exécute `prisma migrate deploy` puis lance l’API.
5. Vérifier `GET /health/live` puis `GET /health/ready`.

## 2) Déployer le web sur Vercel

1. Configurer le projet Vercel avec la racine `apps/web` (le `vercel.json` local gère les commandes monorepo).
2. Variables Vercel obligatoires :
   - `API_URL` (URL publique de l’API Railway, ex: `https://api-xxx.up.railway.app`)
   - `AUTH_SECRET` (secret indépendant, long et aléatoire)
3. Déployer, récupérer l’URL HTTPS Vercel finale, puis la reporter dans `WEB_ORIGIN` côté Railway.
4. Redéployer l’API si `WEB_ORIGIN` a changé.

## 3) Ordre recommandé

1. Railway PostgreSQL
2. Railway API (avec `WEB_ORIGIN` provisoire si nécessaire)
3. Vercel web
4. Mise à jour finale de `WEB_ORIGIN` sur Railway puis redéploiement API

## Vérifications minimales post-déploiement

- Authentification (inscription/connexion/refresh/logout)
- Chargement des entraînements
- Santé API (`/health/live`, `/health/ready`)

## Sécurité

Ne jamais committer de secrets réels dans le dépôt. Utiliser uniquement les variables de plateforme.
