# MuscuPro Global — catalogue d’exercices animés

L’entrée **Exercices animés** ouvre `/exercises`. La version autonome est disponible à `/exercises-illustrated/index.html`.

## Couverture des médias

- **141 exercices** dans **12 groupes**.
- **1 illustration d’origine** fournie pour les **élévations latérales avec haltères** : 12 images, GIF inchangé, 700 × 700 px, boucle de 3 secondes.
- **48 mouvements 3D schématiques** : quatre exercices distincts dans chacun des 12 groupes. Chaque entrée possède sa propre trajectoire de points articulaires, en trois dimensions, projetée sur un Canvas 2D orientable.
- **92 exercices** n’ont pas encore d’animation propre : ils restent dans l’onglet « Tous », affichent clairement « À illustrer », sans recycler le média d’un autre exercice.

Les 48 animations sont des **représentations de développement simplifiées**, pas des scans anatomiques 3D, de la capture de mouvements ni des démonstrations biomécaniquement validées. Certaines articulations et trajectoires sont simplifiées. **Aucun de ces schémas ne remplace une instruction personnalisée en entraînement.**

## Exercices disposant d’un modèle 3D schématique

| Groupe | Exercices |
| --- | --- |
| Pectoraux | Pompes classiques ; Pompes inclinées ; Écarté couché avec haltères ; Pompes sur les genoux |
| Dos | Rowing à un bras avec haltère ; Tirage vertical devant ; Tirage bras tendus à la poulie ; Rowing assis à la poulie |
| Épaules | Développé épaules ; Élévations frontales avec haltères ; Oiseau buste penché ; Rotation externe à l'élastique |
| Biceps | Curl marteau ; Curl alterné ; Curl concentré ; Curl pupitre |
| Triceps | Extension triceps à la poulie ; Extension au-dessus de la tête ; Kickback triceps ; Extension triceps à la corde |
| Quadriceps | Squat ; Fentes avant ; Squat goblet ; Step-up sur banc |
| Ischio-jambiers | Soulevé de terre roumain ; Leg curl debout ; Soulevé de terre à une jambe ; Leg curl allongé |
| Fessiers | Pont fessier au sol ; Kickback à quatre pattes ; Marche latérale avec élastique ; Clamshell |
| Mollets | Extensions mollets debout ; Extensions mollets sur une jambe ; Relevés de pointes ; Extensions mollets assis |
| Abdominaux | Crunch abdominal ; Planche latérale ; Bird dog ; Dead bug |
| Cardio | Marche active ; Jumping jack adapté ; Course légère ; Montée de marche |
| Mobilité | Cercles des épaules ; Chat-vache ; Rotation thoracique à quatre pattes ; Balancement de cheville |

Chaque schéma affiche une région du corps liée à son groupe, via l'option **Muscles illustrés**. Ce repère graphique **n’affirme pas une activation musculaire exacte** (pas de mesure EMG ou d’évaluation clinique). Le nom de la région apparaît sous les commandes du lecteur. Le sélecteur **Rendu** propose **Relief ombré** (volumes dessinés et éclairage stylisé) ou **Structure articulée** (ancien tracé). Ce rendu reste en 2D et n'est pas un maillage anatomique 3D. Les contrôles **Vue gauche / Vue droite**, le glissement (sans zoom) et la molette (zoom) permettent l’exploration visuelle. Les schémas peuvent être mis en pause ou parcourus à vitesse ×0,5, ×1, ×1,5 ou ×2.

## Illustration originale

Le GIF `assets/elevations-laterales-exercice-musculation-1.gif` est conservé sans modification et associé exclusivement à la fiche des élévations latérales. Ses douze images ont été compositées dans la planche WebP utilisée par le lecteur. Deux modes d’affichage existent : **GIF d’origine** avec les temporisations fournies et **Mouvement fluide** avec une reconstruction visuelle articulée en 2D (montée 1,45 s, descente 2,05 s, transitions 0,18 et 0,22 s). Cette reconstruction n'est pas non plus un modèle anatomique 3D.

La mise en évidence des épaules présente dans le GIF provient directement du média fourni ; l'interrupteur de zones musculaires ne s'applique qu'aux **48 schémas 3D**, pas à cette illustration.

## Fonctionnalités

Recherche insensible aux accents ; filtrage par groupe musculaire et équipement ; onglets **Tous**, **Animés** et **Favoris** ; favoris stockés localement sous forme d'identifiants ; lien direct vers une fiche ; lecture/pause ; position de lecture ; vitesse ; zoom et recentrage.

Le lecteur respecte `prefers-reduced-motion` à son initialisation, suspend l'animation lorsqu'il quitte l'écran ou que l'onglet est masqué, et libère les observateurs/événements lors de la fermeture. Aucun nouveau service externe, compte, jeton, WebGL, migration ou dépendance tierce n'est requis pour cette étape.

## Architecture

| Fichier dans `apps/web/public/exercises-illustrated/` | Fonction |
| --- | --- |
| `catalog.mjs` | Catalogue de 141 fiches, identifiants stables et filtres |
| `illustrations.mjs` | Lien strict avec le média original et les durées des images |
| `illustration-motion.mjs` | Animation 2D articulée issue du dessin fourni |
| `schematic-3d.mjs` | 48 mouvements 3D schématiques, points articulaires, projection et rendu |
| `schematic-extra-motions.mjs` | 12 mouvements schématiques de la troisième série |
| `schematic-fourth-motions.mjs` | 12 mouvements supplémentaires, un par groupe |
| `figure-surface.mjs` | Effet de relief ombré et palette de surfaces non anatomiques |
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

Les suites Node contrôlent aussi les 48 schémas 3D, les 49 associations de médias et les 92 fiches sans animation. Elles contrôlent les associations d'identifiants, l'intégrité du média original, le cycle de lecture, la continuité de chaque boucle, les coordonnées des articulations, la différenciation des trajectoires et le rendu des zones graphiques activées ou désactivées.

Un aperçu Web est prévu dans les déploiements de branche Vercel. Les tests automatiques et une prévisualisation ne remplacent pas une vérification fonctionnelle sur iPhone/Android ni une expertise en biomécanique. La production et la branche `main` ne sont pas modifiées par cette étape.
