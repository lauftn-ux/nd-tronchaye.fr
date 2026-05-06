# Déploiement — GitHub + Vercel + Supabase

Ce guide te fait passer de zéro à site en ligne en 30 minutes environ.
Les trois services sont gratuits dans les quotas qu'on va utiliser.

> ⚠️ Ce projet utilise une **instance Supabase dédiée** (séparée de celle d'Ascenzia).
> Crée bien un nouveau projet Supabase à l'étape 2.

---

## Étape 1 — Pousser le code sur GitHub

1. Sur GitHub, clique sur **New repository**.
   - Nom : `notre-dame-tronchaye` (par exemple)
   - Visibilité : **Private** (contient des références à des comptes admin)
   - Ne coche rien (pas de README, pas de .gitignore — tout est déjà dans le projet)

2. Dans un terminal, depuis le dossier du projet :
   ```bash
   git init                            # si pas déjà fait
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:<ton-user>/notre-dame-tronchaye.git
   git push -u origin main
   ```

---

## Étape 2 — Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com), **New project**.
   - Nom : `notre-dame-tronchaye`
   - Mot de passe DB : **génère-en un long et copie-le** (tu en auras besoin).
   - Région : **Frankfurt (eu-central-1)** ou **Paris (eu-west-3)** — au plus proche de tes visiteurs.
   - Plan : **Free**.

2. Attends ~2 min que le projet soit prêt.

### 2a. Récupérer la chaîne de connexion Postgres

- Menu **Project Settings → Database → Connection string**.
- Choisis l'onglet **URI** sous **Connection pooling** (pas la "Direct connection" — celle-ci ne tient pas la charge en serverless).
- **Mode : Session** (déroulant en haut).
- Copie la chaîne. Elle ressemble à :
  ```
  postgres://postgres.<ref>:<MOT_DE_PASSE>@aws-0-<region>.pooler.supabase.com:5432/postgres
  ```
- Remplace `[YOUR-PASSWORD]` par le mot de passe DB que tu as choisi à l'étape 2.
- Garde-la sous le coude → ce sera `DATABASE_URL`.

### 2b. Créer le bucket pour les photos

- Menu **Storage → New bucket**.
  - Nom : `photos`
  - **Public bucket** : ✅ activé (les photos doivent être lisibles par n'importe qui).
  - Clique **Save**.

### 2c. Récupérer les clés API

- Menu **Project Settings → API**.
- Note les deux valeurs :
  - **Project URL** → ce sera `SUPABASE_URL`
  - Clé `service_role` (sous "Project API keys") → ce sera `SUPABASE_SERVICE_ROLE_KEY`
  - ⚠️ **Ne jamais exposer la clé `service_role` côté client.** Elle reste dans les variables d'environnement Vercel uniquement.

### 2d. Créer les tables

Depuis ta machine, en local, exporte la `DATABASE_URL` et applique le schéma :

```bash
export DATABASE_URL='postgres://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres'
npm install
npm run db:push
```

`drizzle-kit push` crée les tables `users`, `events`, `photos`, etc. dans Supabase. Tu peux vérifier dans **Table Editor** que les tables sont là.

---

## Étape 3 — Préparer les variables d'environnement

Garde sous la main les valeurs suivantes (tu vas les coller dans Vercel à l'étape 4) :

| Variable | Valeur |
|----------|--------|
| `SESSION_SECRET` | Génère avec `openssl rand -hex 32` (chaîne aléatoire de 64 caractères) |
| `DATABASE_URL` | La chaîne Supabase de l'étape 2a |
| `SUPABASE_URL` | L'URL de l'étape 2c |
| `SUPABASE_SERVICE_ROLE_KEY` | La clé service_role de l'étape 2c |
| `SUPABASE_STORAGE_BUCKET` | `photos` |
| `SENDGRID_API_KEY` | (optionnel) Ta clé SendGrid si tu veux activer le formulaire de contact |
| `SENDGRID_VERIFIED_SENDER` | (optionnel) L'adresse vérifiée dans SendGrid |
| `INITIAL_ADMIN_USERNAME` | Ce que tu veux comme login admin (ex: `admin-paroisse`) |
| `INITIAL_ADMIN_PASSWORD` | Un mot de passe long. **Tu le retireras après le 1er déploiement.** |

---

## Étape 4 — Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com), **Sign in with GitHub**.
2. **Add New… → Project**.
3. Sélectionne le repo `notre-dame-tronchaye`.
4. Vercel détecte le `vercel.json` automatiquement. Ne touche pas aux paramètres "Build & Development Settings".
5. Déroule **Environment Variables** et colle TOUTES les variables du tableau de l'étape 3 (clique "Add" pour chacune).
6. Clique **Deploy**. Premier build : ~2 min.

Quand c'est vert, ouvre l'URL `https://<projet>.vercel.app`. Le site doit s'afficher.

---

## Étape 5 — Première connexion admin et nettoyage

1. Va sur `https://<projet>.vercel.app/admin-login`.
2. Connecte-toi avec `INITIAL_ADMIN_USERNAME` / `INITIAL_ADMIN_PASSWORD`.
3. **Important** : retourne dans Vercel → **Settings → Environment Variables**, et **supprime** :
   - `INITIAL_ADMIN_USERNAME`
   - `INITIAL_ADMIN_PASSWORD`
4. Onglet **Deployments → Redeploy** (sans cache) → ça applique la suppression des variables.

À partir de maintenant, le compte admin existe en base mais n'est plus recréé à chaque démarrage.

---

## Étape 6 — Nom de domaine personnalisé (optionnel)

Dans Vercel : **Settings → Domains → Add**.
Suis les instructions DNS (CNAME ou A record selon le registrar).
Le HTTPS est géré automatiquement par Vercel (Let's Encrypt).

---

## Mise à jour du site

Chaque `git push` sur la branche `main` déclenche automatiquement un nouveau déploiement Vercel. C'est tout.

```bash
git add .
git commit -m "Mise à jour des horaires de messe"
git push
```

---

## Quotas & garde-fous

- **Vercel Hobby** : 100 Go bande passante/mois, 100 h compute/mois — **largement** suffisant pour un site de paroisse.
- **Supabase Free** : 500 Mo de base, 1 Go de stockage, 5 Go de bande passante. La base est mise en pause après **7 jours sans activité** — il suffit qu'un visiteur ouvre le site pour la réveiller. Pour éviter ça, configure une tâche cron dans Vercel ou sur [cron-job.org](https://cron-job.org) qui ping `/api/events` une fois par jour.

---

## Si quelque chose ne marche pas

- **Build Vercel échoue** : ouvre l'onglet "Build Logs" du déploiement, regarde l'erreur. Souvent c'est une variable d'env manquante.
- **Page blanche** : vérifie que les fichiers `.webp` sont bien dans `public/` à la racine du repo (et pas dans `client/public/`).
- **Connexion admin échoue** : vérifie que `INITIAL_ADMIN_*` étaient bien définies au premier démarrage. Si tu les as oubliées, recrée-les dans Vercel et redeploy.
- **Upload de photo échoue** : vérifie que le bucket `photos` est bien **public** dans Supabase, et que `SUPABASE_SERVICE_ROLE_KEY` est correctement collée (sans saut de ligne).
- **`drizzle-kit push` échoue avec SSL** : c'est normal en local, ajoute `?sslmode=require` à la fin de la `DATABASE_URL`.

---

## Récap des fichiers ajoutés pour Vercel

- `api/index.ts` — point d'entrée serverless qui ré-exporte l'app Express.
- `vercel.json` — config Vercel (rewrites `/api/*` vers la fonction).
- `server/app.ts` — factory de l'app Express, partagée par dev local et serverless.
- `server/supabaseStorage.ts` — upload des photos vers Supabase Storage.
- `.env.example` — modèle pour `.env.local` (ne commit jamais le `.env` rempli).
