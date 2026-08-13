# Intégration GPT Action (ChatGPT)

Ce guide explique comment connecter MuscuPro à un Custom GPT via OAuth 2.0.

## Aperçu

Le flux utilise OAuth 2.0 Authorization Code Grant :

```
ChatGPT → GET /oauth/authorize (login HTML)
Utilisateur se connecte
API → redirect_uri?code=...
ChatGPT → POST /oauth/token (échange code → access_token + refresh_token)
ChatGPT → appels API avec Authorization: ******
```

## Nouvelles variables d'environnement (Railway API)

| Variable | Description |
|---|---|
| `OAUTH_CLIENT_ID` | ID client arbitraire — vous le choisissez, vous le saisissez dans le GPT editor |
| `OAUTH_CLIENT_SECRET` | Secret client (min 16 caractères) — même chose |
| `OAUTH_REDIRECT_URIS` | URI(s) de redirection autorisées, séparées par des virgules (voir ci-dessous) |
| `API_BASE_URL` | URL publique de l'API Railway, ex: `https://api-xxx.up.railway.app` |

## Étapes de configuration

### 1. Choisir vos credentials OAuth

Générez des valeurs aléatoires solides, par exemple :

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"  # client_id
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # client_secret
```

Ajoutez-les dans Railway comme variables d'environnement.

### 2. Créer le Custom GPT dans le GPT editor

1. Rendez-vous sur [chat.openai.com](https://chat.openai.com) → **Explore GPTs** → **Create**.
2. Dans l'onglet **Configure** → **Actions** → **Create new action**.
3. Dans **Authentication**, choisissez **OAuth**.
4. Remplissez :
   - **Client ID** : la valeur de `OAUTH_CLIENT_ID`
   - **Client Secret** : la valeur de `OAUTH_CLIENT_SECRET`
   - **Authorization URL** : `https://<API_BASE_URL>/oauth/authorize`
   - **Token URL** : `https://<API_BASE_URL>/oauth/token`
   - **Scope** : `workouts profile`
   - **Token Exchange Method** : `POST request body`
5. Cliquez **Save** — ChatGPT vous affiche le **Callback URL** (format `https://chat.openai.com/aip/<PLUGIN_ID>/oauth/callback`).

### 3. Enregistrer le Callback URL

Copiez ce Callback URL et ajoutez-le dans la variable Railway :

```
OAUTH_REDIRECT_URIS=https://chat.openai.com/aip/<PLUGIN_ID>/oauth/callback
```

Redéployez l'API.

### 4. Importer le schéma OpenAPI

Dans le champ **Schema** du GPT editor, collez l'URL :

```
https://<API_BASE_URL>/openapi.json
```

ChatGPT importera automatiquement toutes les opérations disponibles (workouts CRUD + profil).

### 5. Tester

Cliquez **Test** dans le GPT editor → ChatGPT ouvrira la page de login MuscuPro → connectez-vous → les appels d'API fonctionneront.

## Endpoints exposés au GPT

| Opération | Endpoint |
|---|---|
| Profil utilisateur | `GET /api/v1/auth/me` |
| Liste des entraînements | `GET /api/v1/workouts` |
| Créer un entraînement | `POST /api/v1/workouts` |
| Mettre à jour (terminer, durée, volume) | `PATCH /api/v1/workouts/{id}` |
| Supprimer un entraînement | `DELETE /api/v1/workouts/{id}` |

## Manifest de découverte

`GET /.well-known/ai-plugin.json` expose les métadonnées du plugin (utilisé par certains clients IA).

## Sécurité

- Les codes d'autorisation expirent après **5 minutes** et ne peuvent être utilisés qu'une seule fois.
- Les access tokens JWT expirent après **15 minutes**.
- Les refresh tokens durent **30 jours** et sont révoqués à chaque rotation.
- `OAUTH_CLIENT_SECRET` n'est jamais exposé publiquement.
