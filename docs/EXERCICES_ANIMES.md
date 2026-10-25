# MuscuPro Global — catalogue d’exercices animés

L’entrée **Exercices animés** ouvre `/exercises`. La version autonome est disponible à `/exercises-illustrated/index.html`.

## Couverture des médias

- **141 exercices** dans **12 groupes**.
- **1 illustration d’origine** fournie pour les **élévations latérales avec haltères** : 12 images, GIF inchangé, 700 × 700 px, boucle de 3 secondes.
- **60 mouvements 3D schématiques** : cinq exercices distincts dans chacun des 12 groupes. Chaque entrée possède sa propre trajectoire de points articulaires, en trois dimensions, projetée sur un Canvas 2D orientable.
- **80 exercices** n’ont pas encore d’animation propre : ils restent dans l’onglet « Tous », affichent clairement « À illustrer », sans recycler le média d’un autre exercice.

Les 60 animations possèdent maintenant un **mode WebGL avec de véritables surfaces triangulées 3D**, plus un retour au mannequin 2D en cas d’indisponibilité graphique. Les mouvements restent des **simulations simplifiées**, sans capture de mouvements, maillage médical, mesure musculaire ou validation biomécanique. Certaines articulations et trajectoires sont simplifiées. **Aucun de ces schémas ne remplace une instruction personnalisée en entraînement.**

## Exercices disposant d’un modèle 3D schématique

| Groupe | Exercices |
| --- | --- |
| Pectoraux | Pompes classiques ; Pompes inclinées ; Écarté couché avec haltères ; Pompes sur les genoux; Développé couché au sol |
| Dos | Rowing à un bras avec haltère ; Tirage vertical devant ; Tirage bras tendus à la poulie ; Rowing assis à la poulie; Rowing inversé |
| Épaules | Développé épaules ; Élévations frontales avec haltères ; Oiseau buste penché ; Rotation externe à l'élastique; Haussements d'épaules |
| Biceps | Curl marteau ; Curl alterné ; Curl concentré ; Curl pupitre; Curl à la poulie basse |
| Triceps | Extension triceps à la poulie ; Extension au-dessus de la tête ; Kickback triceps ; Extension triceps à la corde; Dips sur banc |
| Quadriceps | Squat ; Fentes avant ; Squat goblet ; Step-up sur banc; Fentes arrière |
| Ischio-jambiers | Soulevé de terre roumain ; Leg curl debout ; Soulevé de terre à une jambe ; Leg curl allongé; Pont à une jambe |
| Fessiers | Pont fessier au sol ; Kickback à quatre pattes ; Marche latérale avec élastique ; Clamshell; Hip thrust au banc |
| Mollets | Extensions mollets debout ; Extensions mollets sur une jambe ; Relevés de pointes ; Extensions mollets assis; Extensions mollets avec haltères |
| Abdominaux | Crunch abdominal ; Planche latérale ; Bird dog ; Dead bug; Planche bras tendus |
| Cardio | Marche active ; Jumping jack adapté ; Course légère ; Montée de marche; Corde à sauter imaginaire |
| Mobilité | Cercles des épaules ; Chat-vache ; Rotation thoracique à quatre pattes ; Balancement de cheville; Mobilité des poignets |

Chaque schéma affiche une région du corps liée à son groupe, via l'option **Muscles illustrés**. Ce repère graphique **n’affirme pas une activation musculaire exacte** (pas de mesure EMG ou d’évaluation clinique). Le nom de la région apparaît sous les commandes du lecteur. Le sélecteur **Rendu** propose désormais **3D interactif (WebGL)** (par défaut), **Mannequin réaliste stylisé** (2D à contours arrondis, torse et membres effilés, tête, mains, pieds et vêtements neutres), **Relief ombré** (ancien volume en capsules) et **Structure articulée** (ancien tracé). Le mode mannequin comporte deux finitions : **Céramique naturelle** et **Ardoise bleutée**, sans assigner d'attributs à une personne réelle. Les 60 animations continuent d'utiliser leurs trajectoires de points 3D. En **WebGL**, ces points construisent des surfaces triangulées (torse, tête, membres et articulations) avec normales, matériaux, éclairage et une caméra qui tourne autour du corps et s'incline. Le moteur ne télécharge aucun modèle ni bibliothèque externe. Les trois rendus plus anciens utilisent une projection sur Canvas 2D. En absence de WebGL ou en cas de perte du contexte graphique, le lecteur bascule vers le mannequin 2D avec un message d'état. Le rendu WebGL est un **maillage procédural approximatif**, pas une anatomie de précision ni une capture de mouvements. Les contrôles **Vue gauche / Vue droite**, le glissement (sans zoom) et la molette (zoom) permettent l’exploration visuelle. Les schémas peuvent être mis en pause ou parcourus à vitesse ×0,5, ×1, ×1,5 ou ×2.

## Illustration originale

Le GIF `assets/elevations-laterales-exercice-musculation-1.gif` est conservé sans modification et associé exclusivement à la fiche des élévations latérales. Ses douze images ont été compositées dans la planche WebP utilisée par le lecteur. Deux modes d’affichage existent : **GIF d’origine** avec les temporisations fournies et **Mouvement fluide** avec une reconstruction visuelle articulée en 2D (montée 1,45 s, descente 2,05 s, transitions 0,18 et 0,22 s). Cette reconstruction n'est pas non plus un modèle anatomique 3D.

La mise en évidence des épaules présente dans le GIF provient directement du média fourni ; l'interrupteur de zones musculaires ne s'applique qu'aux **60 schémas 3D**, pas à cette illustration.

## Fonctionnalités

Recherche insensible aux accents ; filtrage par groupe musculaire et équipement ; onglets **Tous**, **Animés** et **Favoris** ; favoris stockés localement sous forme d'identifiants ; lien direct vers une fiche ; lecture/pause ; position de lecture ; vitesse ; zoom et recentrage.

Le lecteur respecte `prefers-reduced-motion` à son initialisation, suspend l'animation lorsqu'il quitte l'écran ou que l'onglet est masqué, et libère les observateurs/événements lors de la fermeture. Aucun nouveau service externe, compte, jeton, migration ou dépendance tierce n'est requis pour cette étape. **WebGL est optionnel** : la version Canvas 2D reste fonctionnelle lorsque l'appareil ne permet pas le rendu WebGL.

## Architecture

| Fichier dans `apps/web/public/exercises-illustrated/` | Fonction |
| --- | --- |
| `catalog.mjs` | Catalogue de 141 fiches, identifiants stables et filtres |
| `illustrations.mjs` | Lien strict avec le média original et les durées des images |
| `illustration-motion.mjs` | Animation 2D articulée issue du dessin fourni |
| `schematic-3d.mjs` | 60 mouvements 3D schématiques, points articulaires, projection et rendu |
| `schematic-extra-motions.mjs` | 12 mouvements schématiques de la troisième série |
| `schematic-fourth-motions.mjs` | 12 mouvements supplémentaires, un par groupe |
| `schematic-fifth-motions.mjs` | 12 nouveaux cycles articulés distincts, un par groupe |
| `figure-surface.mjs` | Ancien effet de relief ombré et palette de surfaces non anatomiques |
| `mannequin-renderer.mjs` | Mannequin 2D de repli avec formes arrondies et deux finitions |
| `webgl-mesh.mjs` | Surfaces 3D, normales, maillages articulés, caméra et régions musculaires localisées |

| `webgl-mannequin.mjs` | Moteur WebGL temps réel, éclairage, géométrie animée et gestion du contexte |
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

Les suites Node contrôlent aussi les maillages WebGL de 48 mouvements sur plusieurs phases (surfaces triangulées, coordonnées et normales finies, éclairages par région et matrices de caméra), et les silhouettes du mannequin 2D de secours (deux finitions), le maintien des deux rendus précédents, les 60 schémas 3D, les 61 associations de médias et les 80 fiches sans animation. Elles contrôlent les associations d'identifiants, l'intégrité du média original, le cycle de lecture, la continuité de chaque boucle, les coordonnées des articulations, la différenciation des trajectoires et le rendu des zones graphiques activées ou désactivées.

Un aperçu Web est disponible dans les déploiements de branche Vercel. L'exécution de vrais contextes WebGL et les essais de performances / manipulation tactile sur iPhone et Android restent à tester manuellement : les tests Node valident le générateur de géométrie mais ne simulent pas le GPU. Les tests automatiques et une prévisualisation ne remplacent pas une vérification fonctionnelle sur iPhone/Android ni une expertise en biomécanique. La production et la branche `main` ne sont pas modifiées par cette étape.

## Cinquième série et régions musculaires

La cinquième série ajoute 12 trajectoires propres au développé couché au sol, rowing inversé, haussements d’épaules, curl à la poulie basse, dips sur banc, fentes arrière, pont à une jambe, hip thrust au banc, extensions mollets avec haltères, planche bras tendus, corde à sauter imaginaire et mobilité des poignets.

Le mode WebGL présente maintenant des **repères musculaires localisés** par groupe : poitrine, haut du dos, épaules, avant ou arrière du bras, cuisses, bassin, mollets ou tronc. Les groupes cardio et mobilité utilisent des repères indicatifs. Ces volumes sont des superpositions 3D de couleur corail **approximatives** : ils ne représentent ni des insertions anatomiques exactes ni des mesures d'activation musculaire. Le modèle de base reste neutre et les repères peuvent être masqués avec « Muscles illustrés ».

La cinquième série est vérifiée sur ses cycles, la continuité des poses et la correspondance au catalogue. Le test de maillage WebGL contrôle les 60 exercices animés en plusieurs phases et les régions localisées.
