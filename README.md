# arcade-galaxy

Monorepo Vite + TypeScript pour un hub de mini-jeux déployable sur GitHub Pages. Le hub, la progression (XP/levels), les achievements et les jeux sont pilotés par des JSON.
Jeux inclus : Dodge Rush, Pixel Shooter, Mini Quest, Tetris Mini, Neon Drive.

## Prérequis
- Node 18+
- npm 10+

## Installation
```bash
npm install
```

## Développement
```bash
npm run dev
```
Le hub est accessible sur `/apps/hub/`. Les pages jeux sont générées automatiquement à partir de `configs/games.registry.json`.

## Build
```bash
npm run build
```
`BASE_PATH` ou `VITE_BASE_PATH` peut définir un sous-dossier (par défaut `/` pour GitHub Pages utilisateur).

## Ajouter un jeu (contrat)
1) Copier `apps/games/_template` vers `apps/games/<id>`.
2) Ajouter l'entrée dans `configs/games.registry.json`.
3) Créer `configs/games/<id>.config.json` (tu peux partir de `_template.config.json`).
4) Optionnel : ajouter un thème `configs/themes/<themeId>.json`.
5) Aucune autre modification du code n'est nécessaire (hub et routing se basent sur les JSON).

## Structure
- `apps/home/` : page d'accueil.
- `apps/hub/` et `apps/hub_de_jeux/` : hub (profil rapide, XP, achievements, save manager, grille de jeux).
- `apps/profil/` : profil autonome (modif pseudo/avatar, import/export, reset).
- `apps/games/*` : jeux canvas 2D (dodge, shooter, quest + template).
- `packages/core` : loop, input, audio, event bus, utils.
- `packages/storage` : schéma de sauvegarde, migrations, import/export.
- `packages/progression` : moteur XP + achievements data-driven.
- `packages/config` : loaders/validation des JSON.
- `configs/` : registre des jeux, progression, achievements, thèmes, configs par jeu.
- `scripts/new-game.ts` : bootstrap automatisé d'un jeu.

## Sauvegarde & progression
- `localStorage` (`nintendo-hub-save`) avec `schemaVersion` global + `saveSchemaVersion` par jeu.
- Import/export JSON (validation), reset global ou par jeu.
- Progression XP/levels et achievements réagissent aux events émis par les jeux (`packages/core/events`).
- Compteur de temps global et par jeu (enregistré dans la save, visible dans le hub).
- Synchronisation cloud (optionnelle) via Supabase :
  - Crée un projet Supabase (Spark gratuit), active Auth (email/password).
  - Ajoute une table `saves` (user_id uuid PK FK auth.users, save jsonb, updated_at timestamptz).
  - Règles RLS : `user_id = auth.uid()`.
  - Renseigne `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (voir `.env.example`), puis utilise le hub ou la page Profil pour login/register et sync.

## Déploiement GitHub Pages
- Build MPA dans `dist/` (hub + pages jeux).
- Workflow `.github/workflows/deploy.yml` pour Pages.

## Contributions
Voir `CONTRIBUTING.md`.
