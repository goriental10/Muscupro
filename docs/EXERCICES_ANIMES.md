# Catalogue illustré d’exercices

L’entrée **Exercices animés** ouvre `/exercises`. Le lecteur autonome est disponible à `/exercises-illustrated/index.html`.

## État du contenu

Le catalogue comporte **141 fiches dans 12 groupes musculaires**. Une illustration animée est actuellement fournie : **Élévations latérales avec haltères**. L’onglet **Illustrés** est sélectionné au démarrage pour ouvrir immédiatement ce média. L’onglet **Tous** conserve les autres fiches et affiche « illustration à ajouter » lorsqu’aucun média correspondant n’est disponible.

Les mannequins procéduraux ont été retirés du lecteur. Le GIF des élévations latérales n’est jamais réutilisé pour représenter un squat, un curl ou un autre mouvement. Les appareils et les vues 3D n’apparaissent plus parmi les commandes.

## Illustration fournie

- Fichier original : `elevations-laterales-exercice-musculation-1.gif`, conservé sans modification.
- 700 × 700 pixels, 12 images, boucle de 3 secondes.
- Durées des images en millisecondes : `1000, 100, 100, 100, 100, 100, 1000, 100, 100, 100, 100, 100`.
- Une planche WebP sans perte contient les images compositées du GIF. Chaque image a été comparée pixel par pixel à l’original. Le mode **GIF d’origine** restitue ces images et leurs durées, sans modification des fichiers.

## Mouvement continu

Le mode **Mouvement fluide**, sélectionné par défaut, remplace les fondus entre les deux poses du GIF par une animation articulée. Le dessin reste celui fourni : le lecteur utilise des découpes des deux poses nettes, sans dessiner de mannequin ni superposer deux positions de bras.

- Montée de 1,45 s, transition haute de 0,18 s, descente de 2,05 s, transition basse de 0,22 s : une boucle de 3,9 s à vitesse ×1.
- Une courbe quintique annule la vitesse et l’accélération aux changements de direction. La descente est plus lente que la montée.
- Les segments des bras gardent une longueur constante dans le calcul spatial ; leur projection produit le raccourcissement visuel. Les épaules se soulèvent légèrement et les coudes restent légèrement fléchis.
- Les mains et les haltères sont des pièces rigides alignées avec les avant-bras. Le buste et les pieds restent fixes.
- Le sélecteur **Animation** permet de comparer avec le GIF d’origine sans perdre la progression, la vitesse ou la pause.

Il s’agit d’une reconstruction visuelle en 2D à partir d’une illustration, avec des angles de vue et des détails limités par la source. Ce n’est pas une capture de mouvement ni un modèle anatomique 3D. Seules les élévations latérales disposent de cette animation ; les autres fiches gardent leur état « illustration à ajouter ».

Le fichier `illustrations.mjs` associe chaque média à un identifiant précis du catalogue. Ajouter d’autres illustrations demande un fichier et une entrée correspondant à chaque exercice. Aucune validation sportive ou attribution de licence supplémentaire n’est déduite de la présence du fichier fourni.

## Fonctions

Recherche sans accents, filtres par groupe et matériel, onglets Tous/Illustrés/Favoris, favoris conservés localement, lien direct par fragment URL, lecture/pause, vitesse ×0,5 à ×2, parcours manuel du cycle, zoom et recentrage. Le mode fluide affiche aussi la phase en cours (montée, descente ou transition). La mise en évidence des épaules provient du GIF original : elle ne dispose pas d’un interrupteur artificiel.

Le lecteur respecte `prefers-reduced-motion` au démarrage, suspend l’animation hors écran ou lorsque l’onglet est masqué et libère ses événements/observateurs à la fermeture. Le zoom permet de déplacer l’illustration par glissement ou avec les flèches du clavier. Les boutons +/− et le curseur disposent de libellés accessibles.

## Architecture

| Fichier dans `apps/web/public/exercises-illustrated/` | Fonction |
| --- | --- |
| `catalog.mjs` | Les 141 noms, groupes, matériels et les filtres |
| `illustrations.mjs` | Correspondances des médias, durées et calcul de l’image à afficher |
| `illustration-player.mjs` | Modes fluide/original dans Canvas 2D, zoom et cycle de vie |
| `illustration-motion.mjs` | Cycle continu, articulations, projection et découpes du dessin |
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

Ces sept tests sont aussi lancés par le script Web `test` en CI. Ils vérifient l’intégrité du GIF original, sa correspondance avec le bon exercice, les temporisations et la boucle du mode original, les filtres et quelques régressions de matériel. Pour le mode fluide, ils contrôlent les transitions, la continuité du cycle, les longueurs des segments, les limites des trajectoires et le raccordement des découpes aux articulations.

Les poses basse, intermédiaire et haute, les deux modes, les commandes, l’état « illustration à ajouter » et une largeur mobile sont vérifiés dans le navigateur. Le test responsive utilise une iframe ; il ne remplace pas un essai tactile sur appareil réel. La CI du dépôt exécute l’installation figée, le typage, les tests et le build avec les versions déclarées dans le lockfile.
