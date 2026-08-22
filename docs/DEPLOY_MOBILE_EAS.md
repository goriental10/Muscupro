# Déploiement mobile Expo/EAS

Ce guide lance une version Android de prévisualisation sans exposer de secret dans le dépôt.

## Prérequis

- Un compte Expo autorisé à gérer le projet `muscupro-global`.
- Le projet Expo lié au paquet Android `com.goriental10.muscupro`.
- Une API MuscuPro publique accessible en HTTPS.

## Configuration GitHub

Dans `Settings > Secrets and variables > Actions`, créer les éléments suivants.

### Secrets

- `EXPO_TOKEN` : jeton d'accès Expo utilisé uniquement par GitHub Actions.
- `EXPO_PROJECT_ID` : identifiant UUID du projet EAS.

### Variable

- `EXPO_PUBLIC_API_URL` : origine HTTPS de l'API, sans `/api/v1` à la fin.

Exemple de forme attendue : `https://api.example.com`.

Ne jamais placer la valeur de `EXPO_TOKEN` dans un fichier, une issue, une pull request ou un message.

## Vérification locale

Depuis la racine du monorepo :

```bash
pnpm install --frozen-lockfile
pnpm mobile:eas:check
pnpm --filter @muscupro/mobile typecheck
pnpm --filter @muscupro/mobile test
```

Le contrôle EAS vérifie les identifiants natifs, les profils `development`, `preview` et `production`, la production d'un APK Preview et les garde-fous du workflow.

## Lancer Android Preview

1. Ouvrir l'onglet `Actions` du dépôt GitHub.
2. Sélectionner le workflow `Mobile build`.
3. Choisir `Run workflow` sur la branche de la PR.
4. Sélectionner `profile: preview` et `platform: android`.
5. Ouvrir le lien EAS produit par l'étape `Start EAS build`.

Le workflow refuse de démarrer si le jeton, l'identifiant EAS ou l'URL API publique HTTPS manque.

## Avant la production

- Installer l'APK Preview sur un appareil Android de test.
- Vérifier connexion, navigation, séances, progression et synchronisation Health Connect.
- Confirmer que l'application appelle l'API de production attendue.
- Exécuter la checklist `docs/RELEASE_CHECKLIST.md`.
- Utiliser le profil `production` seulement après validation du Preview.
