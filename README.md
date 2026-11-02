# ARCGUIDE — Guide pratique ArcGIS Pro

PWA de référence rapide, hors ligne, en français : commandes ArcGIS Pro, dépannage, SIG minier Madagascar, notes et favoris.

## Fonctionnalités

- Bibliothèque initiale de **40 fiches** (9 catégories), consultables sans réseau après la première ouverture complète.
- Recherche accent-insensible avec synonymes, filtres par catégorie, consultation express/détaillée.
- Favoris, historique et notes persistants dans **IndexedDB**.
- Export et import de sauvegarde JSON, avec validation et confirmation avant remplacement.
- Diagnostic guidé et checklist de carte minière.
- Interface bureau/mobile et modes clair/sombre.

## Architecture

Application statique TypeScript (sans dépendance runtime) + HTML/CSS, service worker et IndexedDB. La PWA peut être publiée sur GitHub Pages sans service cloud et sans Lovable. La première version privilégie la légèreté et l'autonomie. Aucun appel réseau externe n'est requis pour les fonctions essentielles.

## Développement

`tsc -p tsconfig.json` compile `src/*.ts` vers `dist/assets/*.js`. Copier `public/*` et `src/styles.css` dans `dist/` (le script `build.sh` le fait).

```bash
bash build.sh
python -m http.server 8080 -d dist
```

Naviguer sur `http://localhost:8080`. Une PWA n'est installable que sur un contexte sécurisé (localhost ou HTTPS).

## Publication GitHub Pages

Le workflow `.github/workflows/pages.yml` déploie `dist/` lorsque GitHub Pages est configuré avec *Build and deployment → Source: GitHub Actions*. En cas de refus de déploiement, vérifier que Pages est activé sur le dépôt et que le workflow est autorisé.

## Précision du contenu

Les fiches initiales sont marquées « à vérifier » tant que leur contrôle individuel par version/licence n'a pas été effectué. Elles ne sont pas un avis réglementaire. Les systèmes Laborde doivent être identifiés par définition de source fiable, jamais par EPSG supposé.

## Sauvegardes

Les données restent sur l'appareil. L'effacement des données du navigateur peut les supprimer : faire régulièrement un export depuis Paramètres. Les sauvegardes JSON sont examinées avant restauration.