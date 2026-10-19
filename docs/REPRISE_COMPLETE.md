# Reprise de MuscuPro Global

Date : 19 octobre 2026. Base du dépôt : `3110e05f2a578c1462910142f4efed1cf6adf1cc`.
Branche : `codex/muscupro-reprise-complete`.

## Pourquoi reprendre

Le dépôt contient une base Next.js/Express et un squelette Expo. L’audit a constaté des statistiques fixes, des boutons sans action, des écrans simulant des services et des commandes mobiles annonçant un succès sans lancer Expo. Les fonctionnalités décrites dans l’ancien README dépassaient celles présentes dans le code.

Cette reprise remplace les parcours principaux par un espace personnel avec des données locales. Elle conserve le dépôt et son historique. Aucun achat, compte externe, publication communautaire ou envoi à un tiers n’est déclenché par cette reprise.

## Toutes les étapes et leurs critères

| Étape | Travail | État de cette branche | Critère de validation |
| --- | --- | --- | --- |
| 1 | Examiner le code et isoler la reprise | Fait | Base et branche identifiées, historique conservé |
| 2 | Reconstruire la navigation et les écrans Web | Implémenté | Essai sur ordinateur et petit écran à compléter |
| 3 | Catalogue et six animations | Implémenté | Recherche, filtres, étapes et pause à essayer dans un navigateur |
| 4 | Démarrer, reprendre et terminer une séance | Implémenté, règles métier testées | Saisir une charge, valider une série, recharger et terminer une séance |
| 5 | Nutrition | Implémenté | Saisir un repas et retrouver les totaux au bon jour |
| 6 | Progression et mesures | Implémenté, calculs testés | Vérifier l’historique, les volumes et la sauvegarde d’une mesure |
| 7 | Calendrier et profil | Implémenté | Planifier, exporter un calendrier et modifier les objectifs |
| 8 | Sauvegarde locale, export et import | Implémenté, format testé | Exporter, vérifier l’aperçu d’import puis restaurer sur un second navigateur |
| 9 | Comptes, PostgreSQL et synchronisation | À mettre en service et à développer | Migrations, essais d’inscription/connexion et isolation de deux comptes ; définir la résolution des conflits |
| 10 | iOS et Android natifs | À reconstruire | Dépendances Expo vérifiées, écrans fonctionnels, EAS configuré et essai sur appareils |
| 11 | Paiements et abonnements | À configurer et à développer | Compte Stripe, tarifs, Checkout et webhooks testés en mode test, droits vérifiés côté serveur |
| 12 | Coach IA | À développer | Fournisseur configuré côté serveur, quotas et réponses vérifiés, consentement au traitement des données |
| 13 | Coachs, messages, communauté et boutique | À développer | Contrôles d’accès, envois, modération et achats réellement testés |
| 14 | Tests et accessibilité | Partiel | Contrôles techniques réussis ; parcours interactifs et essai mobile à terminer |
| 15 | Déploiement et mise en production | Bloqué par l’accès Vercel | Publier une version de revue, faire les essais puis décider du passage en production |

## Ce qui est réellement sauvegardé

Le schéma `muscupro.fitness.v2` contient le profil, la séance en cours, l’historique, les repas, les mesures et les dates planifiées. L’écriture est validée puis enregistrée dans le stockage du navigateur avant la mise à jour de l’interface. Un échec de stockage affiche une erreur et ne doit pas annoncer une réussite. Une sauvegarde locale illisible est préservée et les modifications restent bloquées jusqu’à une restauration valide.

Les séries non validées restent consultables dans une séance partielle mais ne contribuent ni au volume ni aux records. Une séance sans série validée ne peut pas être terminée. Les semaines commencent le lundi, selon le calendrier local. Pour les haltères, le champ de charge représente la charge totale utilisée.

Les valeurs nutritionnelles sont saisies par l’utilisateur ; aucun objectif alimentaire personnalisé n’est calculé. Les animations sont des schémas simplifiés, pas des vidéos certifiant une technique individuelle.

## Vérifications réalisées

- Dix tests métier Web réussis : espace initial vide, volume des seules séries validées, séances partielles, limites de semaine, dates locales et imports invalides.
- Deux tests existants de l’API réussis : identité des JWT et aléa/hachage des jetons de renouvellement.
- Génération du client Prisma et vérification TypeScript de l’API.
- Vérification TypeScript du Web et compilation Next.js de production.
- Gestionnaire pnpm aligné sur la version 11.25.0, avec autorisation explicite des scripts Prisma et esbuild ; le contrôle CI utilise la même version.
- Contrôle des espaces et conflits dans le diff Git.
- Le navigateur distant a affiché la structure de la nouvelle interface. Il est resté sur « Chargement de votre espace… » ; les interactions ne sont donc pas validées. Deux compilateurs de développement ont été essayés, sans changement de ce résultat. Les réglages expérimentaux non concluants ont été retirés.
- L’API Vercel a retourné `403 forbidden` lors de la lecture des déploiements du projet existant. Aucun exécutable Vercel avec une authentification locale n’était disponible. Aucun déploiement ni changement de production n’est déclaré réussi.

Aucune migration de production n’a été appliquée et aucun test de connexion à une base réelle n’a été réalisé.

## Vérification manuelle avant publication

1. Lancer `pnpm dev` puis ouvrir le tableau de bord et vérifier la fin du chargement.
2. Tester le catalogue, chaque filtre et la mise en pause des animations.
3. Démarrer « Jambes & hanches », saisir 20 kg × 10, valider une série, recharger, puis terminer la séance partielle. Vérifier 1 séance, 1 série et 200 kg de volume.
4. Ajouter un repas et une mesure ; naviguer puis recharger et vérifier leur présence.
5. Planifier une séance et ouvrir l’export `.ics` dans un calendrier.
6. Exporter le JSON ; sur un navigateur de test, importer puis vérifier les données restaurées. Vérifier qu’un fichier incorrect ne remplace rien.
7. Refaire les parcours à 390 px de largeur et au clavier ; vérifier les libellés et l’absence de défilement horizontal.
8. Vérifier les comptes sur une API/base de test avant de brancher la synchronisation.
9. Valider une version de revue avant de remplacer la version publique existante.

## Prochaines dépendances concrètes

- Un accès de déploiement au projet Vercel `muscupro-global` dans l’équipe existante.
- Une API et une base PostgreSQL de test utilisables pour les comptes et les futures données synchronisées.
- Un compte Stripe et des tarifs définis pour les paiements.
- Le fournisseur IA choisi, ainsi que les comptes Expo/EAS et les comptes de signature nécessaires aux builds natifs.

Les clés doivent être saisies dans les paramètres sécurisés des services concernés ; elles ne doivent pas être enregistrées dans ce dépôt ni collées dans une conversation.
