# BAING CONSTRUCTION INC — Site vitrine + Administration

Site de **démonstration indépendante** pour BAING CONSTRUCTION INC (Daloa, Côte d’Ivoire) : construction de bâtiments, rénovation, travaux publics, réseaux électriques. Il n’est **ni commandé ni validé** par l’entreprise. Coordonnées et contenus marqués « à confirmer » doivent être validés par le dirigeant avant publication officielle. Aucune donnée n’est partagée avec ChantierPilot.

## Stack
React 19 + Vite + TypeScript + Tailwind CSS 4 · React Router · Lucide · **Neon (PostgreSQL serverless)** via fonctions Vercel (`/api`) · Auth JWT + bcrypt · Déploiement cible : **nouveau projet Vercel distinct**.

## Deux modes de données (honnêtes, jamais simulés)
1. **Production Neon** : si `DATABASE_URL` est présent côté serveur, le site lit/écrit dans Neon via `/api/public`, `/api/auth`, `/api/admin` (JWT requis, contrôles côté serveur).
2. **Démonstration locale** : sans `DATABASE_URL`, l’API renvoie 501 et le site bascule en mode local (données dans `localStorage` du navigateur, bannière visible). Connexion démo **locale uniquement** : `admin@demo.local` / `admin1234` — à ne jamais utiliser en production.

## 🚀 Mise en ligne
**Suivez [DEPLOIEMENT.md](DEPLOIEMENT.md) pas à pas** (Neon → Vercel → création admin → 8 tests de réception). Diagnostic rapide après déploiement : ouvrez `/api/health` sur votre URL Vercel.

## Démarrage local
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vérification production
```

## Configuration Neon (production)
1. Créer une base sur https://neon.tech → copier la connection string.
2. Dans Vercel → Settings → Environment Variables : `DATABASE_URL`, `JWT_SECRET` (32+ caractères). **Jamais** de préfixe `VITE_` (cela exposerait le secret).
3. Appliquer le schéma : `db/schema.sql` dans le SQL Editor Neon (ou premier appel API — les fonctions font `CREATE TABLE IF NOT EXISTS`, non destructif).
4. Créer le premier administrateur (aucun compte par défaut) :
```bash
DATABASE_URL="postgres://…" ADMIN_EMAIL="admin@exemple.ci" ADMIN_PASSWORD="MotDePasseFort!" npm run create-admin
```
5. Se connecter sur `/admin/login`, puis remplir Paramètres (coordonnées vérifiées), Services, Réalisations réelles.

## Déploiement Vercel (projet distinct)
```bash
npm i -g vercel
vercel link   # créer un NOUVEAU projet, ne pas réutiliser ChantierPilot
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel --prod
```
`vercel.json` gère le routage SPA (les `/api/*` ne sont pas réécrits) et les en-têtes de sécurité.

## Remplacer les contenus de démonstration
Images dans `public/images/` (générées pour la maquette) → remplacez-les par les photos réelles depuis l’administration (`/admin/projets` et `/admin/services`, bouton **Téléverser une photo**). Projets seed marqués « Exemple de présentation » (`illustratif`) → modifiez-les en place ou créez les vraies fiches puis supprimez les exemples. Coordonnées : `/admin/parametres` + cocher « vérifiées » après confirmation.

### Photos réelles : téléversement depuis l’admin
- Le fichier choisi est **compressé dans le navigateur** (1600 px max, JPEG qualité 0,82, source ≤ 10 Mo) par `src/lib/image.ts`, puis enregistré dans le champ `image` de Neon (data URL) via l’API existante — aucun service de stockage externe à configurer.
- Création, modification, publication/dépublication et suppression sont appliquées en base, puis l’interface et les données publiques sont **rechargées immédiatement** (resynchronisation automatique après chaque écriture et au retour sur l’onglet).
- Pour un très grand volume de médias, migrer vers un stockage objet (Vercel Blob/S3) : seul `src/lib/image.ts` et le champ `image` seraient à adapter.

## Sécurité
Validation client **et** serveur, JWT 8 h, bcrypt (coût 12), notes internes jamais exposées publiquement, secrets uniquement côté serveur, export CSV réservé à l’admin authentifié. Les images téléversées sont vérifiées (type MIME `image/*`, taille, compression) avant enregistrement ; les pièces jointes des demandes de devis restent volontairement gérées via WhatsApp.

## ChantierPilot
Section « Du site web au suivi opérationnel des chantiers » → lien externe https://chantier-pilot.vercel.app/ . Aucune synchronisation, aucun partage de données.

## À confirmer avant publication (voir RAPPORT.md)
Téléphone/WhatsApp (+225 07 89 70 61 23 — source publique à vérifier), adresse exacte (Tazibouoo Ceinture, Daloa), e-mail, horaires, zones, historique, équipe, réalisations réelles, logo officiel, mentions légales de l’entreprise.
