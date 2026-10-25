# MuscuPro Global — catalogue d’exercices animés

L’entrée **Exercices animés** ouvre `/exercises`. La version autonome est disponible à `/exercises-illustrated/index.html`.

## Couverture des médias

- **141 exercices** dans **12 groupes**.
- **1 illustration d’origine** fournie pour les **élévations latérales avec haltères** : 12 images, GIF inchangé, 700 × 700 px, boucle de 3 secondes.
- **24 mouvements 3D schématiques** : deux exercices distincts dans chacun des 12 groupes. Chaque entrée possède sa propre trajectoire de points articulaires, en trois dimensions, projetée sur un Canvas 2D orientable.
- **116 exercices** n’ont pas encore d’animation propre : ils restent dans l’onglet « Tous », affichent clairement « À illustrer », sans recycler le média d’un autre exercice.

Les 24 animations sont des **représentations de développement simplifiées**, pas des scans anatomiques 3D, de la capture de mouvements ni des démonstrations biomécaniquement validées. Certaines articulations et trajectoires sont simplifiées. **Aucun de ces schémas ne remplace une instruction personnalisée en entraînement.**

## Exercices disposant d’un modèle 3D schématique

| Groupe | Exercices |
| --- | --- |
| Pectoraux | Pompes classiques ; Pompes inclinées |
| Dos | Rowing à un bras avec haltère ; Tirage vertical devant |
| Épaules | Développé épaules ; Élévations frontales avec haltères |
| Biceps | Curl marteau ; Curl alterné |
| Triceps | Extension triceps à la poulie ; Extension au-dessus de la tête |
| Quadriceps | Squat ; Fentes avant |
| Ischio-jambiers | Soulevé de terre roumain ; Leg curl debout |
| Fessiers | Pont fessier au sol ; Kickback à quatre pattes |
| Mollets | Extensions mollets debout ; Extensions mollets sur une jambe |
| Abdominaux | Crunch abdominal ; Planche latérale |
| Cardio | Marche active ; Jumping jack adapté |
| Mobilité | Cercles des épaules ; Chat-vache |

Chaque schéma affiche une région du corps liée à son groupe, via l'option **Muscles illustrés**. Ce repère graphique **n’affirme pas une activation musculaire exacte** (pas de mesure EMG ou d’évaluation clinique). Le nom de la région apparaît sous les commandes du lecteur. Les contrôles **Vue gauche / Vue droite**, le glissement (sans zoom) et la molette (zoom) permettent l’exploration visuelle. Les schémas peuvent être mis en pause ou parcourus à vitesse ×0,5, ×1, ×1,5 ou ×2.

## Illustration originale

Le GIF `assets/elevations-laterales-exercice-musculation-1.gif` est conservé sans modification et associé exclusivement à la fiche des élévations latérales. Ses douze images ont été compositées dans la planche WebP utilisée par le lecteur. Deux modes d’affichage existent : **GIF d’origine** avec les temporisations fournies et **Mouvement fluide** avec une reconstruction visuelle articulée en 2D (montée 1,45 s, descente 2,05 s, transitions 0,18 et 0,22 s). Cette reconstruction n'est pas non plus un modèle anatomique 3D.

La mise en évidence des épaules présente dans le GIF provient directement du média fourni ; l'interrupteur de zones musculaires ne s'applique qu'aux **24 schémas 3D**, pas à cette illustration.

## Fonctionnalités

Recherche insensible aux accents ; filtrage par groupe musculaire et équipement ; onglets **Tous**, **Animés** et **Favoris** ; favoris stockés localement sous forme d'identifiants ; lien direct vers une fiche ; lecture/pause ; position de lecture ; vitesse ; zoom et recentrage.

Le lecteur respecte `prefers-reduced-motion` à son initialisation, suspend l'animation lorsqu'il quitte l'écran ou que l'onglet est masqué, et libère les observateurs/événements lors de la fermeture. Aucun nouveau service externe, compte, jeton, WebGL, migration ou dépendance tierce n'est requis pour cette étape.

## Architecture

| Fichier dans `apps/web/public/exercises-illustrated/` | Fonction |
| --- | --- |
| `catalog.mjs` | Catalogue de 141 fiches, identifiants stables et filtres |
| `illustrations.mjs` | Lien strict avec le média original et les durées des images |
| `illustration-motion.mjs` | Animation 2D articulée issue du dessin fourni |
| `schematic-3d.mjs` | 24 mouvements 3D schématiques, modèles articulaires, projection et rendu |
| `anatomy-zones.mjs` | 12 zones musculaires indicatives et leurs mises en évidence |
| `illustration-player.mjs` | Lecture Canvas, contrôle caméra et visibilité des zones |
| `app.mjs`, `index.html`, `styles.css` | Navigation, commandes, état et interface responsive |

La page Next.js `src/app/exercises/page.tsx` embarque le lecteur dans une iframe de même origine.

## Vérification

Depuis la racine du dépôt :

```bash
pnpm --filter @muscupro/web test
pnpm --filter @muscupro/web typecheck
pnpm --filter @muscupro/web build
```

Les suites Node contrôlent les associations d'identifiants, l'intégrité du média original, le cycle de lecture, la continuité de chaque boucle, les coordonnées des articulations, la différenciation des trajectoires et le rendu des zones graphiques activées ou désactivées.

Un aperçu Web est prévu dans les déploiements de branche Vercel. Les tests automatiques et une prévisualisation ne remplacent pas une vérification fonctionnelle sur iPhone/Android ni une expertise en biomécanique. La production et la branche `main` ne sont pas modifiées par cette étape.
