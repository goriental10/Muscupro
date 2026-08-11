# Déploiement Railway + Vercel

## Railway — API et PostgreSQL

1. Créer un service PostgreSQL privé et un service API depuis ce dépôt.
2. Définir `DATABASE_URL`, `JWT_SECRET`, `WEB_ORIGIN`, `NODE_ENV=production` et `PORT=4000`.
3. Déployer avec `apps/api/Dockerfile`; le démarrage applique `prisma migrate deploy`.
4. Vérifier `/health/live` puis `/health/ready` avant d’autoriser le trafic.
5. Activer les sauvegardes PostgreSQL avant toute migration ultérieure. PostgreSQL ne doit pas être exposé publiquement.

## Vercel — application Web

1. Configurer le dossier racine `apps/web`.
2. Définir uniquement `API_URL` et `AUTH_SECRET` comme variables serveur.
3. Déployer, puis définir `WEB_ORIGIN` sur l’URL HTTPS exacte de Vercel dans Railway.
4. Tester inscription, connexion, renouvellement après 15 minutes, déconnexion et chargement des entraînements.

## Retour arrière

Conserver le déploiement précédent et une sauvegarde PostgreSQL. En cas d’échec, restaurer l’image précédente avant toute migration incompatible.
