# Catalogue illustré d’exercices

L’entrée **Exercices animés** ouvre `/exercises`. Le lecteur autonome est disponible à `/exercises-illustrated/index.html`.

## État du contenu

Le catalogue comporte **141 fiches dans 12 groupes musculaires**. Une illustration animée est actuellement fournie : **Élévations latérales avec haltères**. L’onglet **Illustrés** est sélectionné au démarrage pour ouvrir immédiatement ce média. L’onglet **Tous** conserve les autres fiches et affiche « illustration à ajouter » lorsqu’aucun média correspondant n’est disponible.

Les mannequins procéduraux ont été retirés du lecteur. Le GIF des élévations latérales n’est jamais réutilisé pour représenter un squat, un curl ou un autre mouvement. Les appareils et les vues 3D n’apparaissent plus parmi les commandes.

## Illustration fournie

- Fichier original : `elevations-laterales-exercice-musculation-1.gif`, conservé sans modification.
- 700 × 700 pixels, 12 images, boucle de 3 secondes.
- Durées des images en millisecondes : `1000, 100, 100, 100, 100, 100, 1000, 100, 100, 100, 100, 100`.
- Une planche WebP sans perte contient les images compositées du GIF. Chaque image a été comparée pixel par pixel à l’original. Elle permet de contrôler la lecture sans générer ou modifier l’illustration.

Le fichier `illustrations.mjs` associe chaque média à un identifiant précis du catalogue. Ajouter d’autres illustrations demande un fichier et une entrée correspondant à chaque exercice. Aucune validation sportive ou attribution de licence supplémentaire n’est déduite de la présence du fichier fourni.

## Fonctions

Recherche sans accents, filtres par groupe et matériel, onglets Tous/Illustrés/Favoris, favoris conservés localement, lien direct par fragment URL, lecture/pause, vitesse ×0,5 à ×2, parcours manuel du cycle, zoom et recentrage. La mise en évidence des épaules provient du GIF original : elle ne dispose pas d’un interrupteur artificiel.

Le lecteur respecte `prefers-reduced-motion` au démarrage, suspend l’animation hors écran ou lorsque l’onglet est masqué et libère ses événements/observateurs à la fermeture. Le zoom permet de déplacer l’illustration par glissement ou avec les flèches du clavier. Les boutons +/− et le curseur disposent de libellés accessibles.

## Architecture

| Fichier dans `apps/web/public/exercises-illustrated/` | Fonction |
| --- | --- |
| `catalog.mjs` | Les 141 noms, groupes, matériels et les filtres |
| `illustrations.mjs` | Correspondances des médias, durées et calcul de l’image à afficher |
| `illustration-player.mjs` | Lecture des images originales dans Canvas 2D, zoom et cycle de vie |
| `app.mjs` | Sélection, recherche, favoris et commandes |
| `index.html`, `styles.css` | Interface responsive autonome |
| `assets/` | GIF original et planche WebP sans perte |

La page Next.js `src/app/exercises/page.tsx` embarque le lecteur dans une iframe de même origine. Cette isolation conserve les styles du reste de l’application. Aucun WebGL, dépendance supplémentaire, compte, clé API ou migration n’est nécessaire. Ce catalogue est public et ses favoris stockent uniquement des identifiants d’exercices, pas de jetons d’authentification. L’historique des séances n’est pas modifié.

## Lancer et vérifier

Dans l’application : démarrer le workspace Web puis ouvrir `/exercises`.

Sans installer Next.js :

```bash
cd apps/web/public/exercises-illustrated
python3 -m http.server 8000
```

Ouvrir `http://localhost:8000` ; les modules ES doivent être servis en HTTP.

```bash
node --test apps/web/tests/exercises-illustrated.test.mjs
```

Ces tests sont aussi lancés par le script Web `test` en CI. Ils vérifient l’intégrité du GIF original, sa correspondance avec le bon exercice, les temporisations et la boucle, les filtres et quelques régressions de matériel.

Les commandes, le média, l’état « illustration à ajouter », les favoris et une largeur mobile sont vérifiés dans le navigateur. Le test responsive utilise une iframe ; il ne remplace pas un essai tactile sur appareil réel. Le typage et le build de production réussissent avec les dépendances locales disponibles (Next.js 16.2.6, React 19.2.6, TypeScript 5.9.3). Le dépôt déclare Next.js 16.3.0 et React 19.2.8 : ces versions exactes restent à vérifier en CI.
