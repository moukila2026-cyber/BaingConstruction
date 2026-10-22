# Procédure de mise en ligne — BAING CONSTRUCTION INC (Neon + Vercel)
### Zéro mauvaise surprise : suivez l'ordre exact, cochez chaque ✅ avant de passer à la suite.

> **Architecture** : le site (React/Vite) est hébergé sur **Vercel** ; les données (services, réalisations, demandes de devis, administrateurs) vivent dans **Neon (PostgreSQL)**. Le navigateur ne parle jamais directement à Neon : il passe par les fonctions `/api/*` de Vercel. `DATABASE_URL` et `JWT_SECRET` restent **côté serveur, invisibles au public**.

> **Deux voies possibles**
> - **Voie A — Démo pour demain (10 min, sans Neon)** : le site est en ligne avec contenus et formulaire fonctionnels *dans le navigateur du visiteur* (mode local). Suffisant pour présenter au dirigeant.
> - **Voie B — Production complète (45 min, avec Neon)** : demandes centralisées, administration réelle multi-postes. **C'est la voie à retenir avant toute communication publique.**

---

## ÉTAPE 0 — Prérequis (5 min)
- [ ] Un compte **GitHub** (celui qui détient le code)
- [ ] Un compte **Vercel** (https://vercel.com — « Continue with GitHub »)
- [ ] Un compte **Neon** (https://console.neon.tech — gratuit pour démarrer)
- [ ] Le code sur GitHub : soit le dépôt actuel (branche `arena/0adb2d60-baingconstruction`), soit le nouveau dépôt distinct `baing-construction-inc` (création manuelle : https://github.com/new?name=baing-construction-inc puis `git push <remote> arena/0adb2d60-baingconstruction:main`)
- ✅ **Contrôle** : vous voyez les fichiers `api/`, `db/`, `src/`, `vercel.json` dans le dépôt GitHub choisi.

## ÉTAPE 1 — Créer la base Neon (5 min)
1. https://console.neon.tech → **New Project**
2. Nom : `baing-construction` · Région : **AWS Europe — Frankfurt (eu-central-1)** (la plus proche de l'Europe/Afrique de l'Ouest) · PostgreSQL 16+
3. **Create project** → Neon affiche une *connection string* du type :
   `postgres://neondb_owner:xxxxx@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`
4. **Copiez-la dans un endroit sûr** (gestionnaire de mots de passe). ⚠️ Préférez l'hôte avec **`-pooler`** (connexions mutualisées, idéal pour Vercel serverless) et vérifiez la présence de **`?sslmode=require`**.
- ✅ **Contrôle** : le tableau de bord Neon montre le projet `baing-construction` en état *Active*.
- ℹ️ Rien d'autre à faire dans Neon : les tables sont créées automatiquement par le site (`db/schema.sql`, non destructif), et le contenu initial est inséré automatiquement au premier appel si les tables sont vides.

## ÉTAPE 2 — Générer le secret de session (1 min)
Sur votre ordinateur, dans un terminal :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copiez la chaîne obtenue (64 caractères) : ce sera `JWT_SECRET`. **Ne la partagez jamais, ne la mettez jamais dans le code ni dans Git.**

## ÉTAPE 3 — Créer le projet Vercel (5 min)
1. https://vercel.com/new → **Import** du dépôt GitHub du site → **Import**
2. *Project Name* : `baing-construction-inc` (l'URL sera `baing-construction-inc.vercel.app` — distincte de ChantierPilot ✅)
3. *Framework Preset* : **Vite** (détecté automatiquement) · *Root Directory* : `./` · *Build Command* : `npm run build` · *Output Directory* : `dist` · *Install Command* : `npm install` — **ne changez rien si ces valeurs sont déjà là**
4. **Ne cliquez pas encore sur Deploy** si vous faites la Voie B → passez à l'Étape 4, puis déployez. (Voie A : cliquez sur Deploy maintenant, passez à l'Étape 6.)

## ÉTAPE 4 — Brancher Neon sur Vercel (3 min) — Voie B uniquement
Dans le projet Vercel → **Settings → Environment Variables** → ajoutez, pour l'environnement **Production** (et Preview si vous voulez tester les branches) :
| Name | Value |
|---|---|
| `DATABASE_URL` | la connection string Neon de l'Étape 1 |
| `JWT_SECRET` | la chaîne générée à l'Étape 2 |
⚠️ **Interdits** : ne préfixez **jamais** ces noms par `VITE_` (cela les exposerait publiquement dans le navigateur). Vérifiez l'orthographe exacte.
- ✅ **Contrôle** : les 2 variables apparaissent dans la liste, environnement *Production* coché.

## ÉTAPE 5 — Déployer (2 min)
- **Deploy** (premier déploiement) ou, si le projet existait déjà : **Deployments → ⋯ → Redeploy**.
- ⚠️ **Règle d'or** : toute modification de variable d'environnement exige un **Redeploy** pour prendre effet.
- ✅ **Contrôle** : le déploiement passe en statut **Ready** (coche verte). Cliquez sur l'URL `baing-construction-inc.vercel.app` : la page d'accueil s'affiche.

## ÉTAPE 6 — Vérification santé (2 min) ⭐ l'étape anti-surprise
Ouvrez dans le navigateur : **`https://baing-construction-inc.vercel.app/api/health`**
| Résultat affiché | Signification | Action |
|---|---|---|
| `{"site":"ok","neon":"connecté","tables":{...},"jwt":"présent",...}` | 🎉 Tout est branché | Continuez |
| `"neon":"non configuré…"` | `DATABASE_URL` absente ou mal nommée | Retour Étape 4 + Redeploy |
| `"neon":"ERREUR de connexion"` | Mauvaise connection string | Recopiez-la depuis Neon (hôte `-pooler`, `sslmode=require`) + Redeploy |
| `"jwt":"MANQUANT…"` | `JWT_SECRET` absent → connexion admin impossible | Retour Étape 4 + Redeploy |
| `"admins":0` dans les tables | Normal à ce stade | Étape 7 |
| La page renvoie du HTML au lieu de JSON | Les fonctions `/api` ne tournent pas (mauvais dépôt/projet) | Vérifiez que le dépôt contient bien le dossier `api/` à la racine |

## ÉTAPE 7 — Créer le compte administrateur (5 min) — Voie B uniquement
**Aucun compte par défaut n'existe** (volontaire, pour la sécurité). Sur votre ordinateur :
```bash
git clone <URL-du-dépôt-du-site> && cd <dossier>
npm install
DATABASE_URL="postgres://…votre-connection-string…" ADMIN_EMAIL="admin@votredomaine.ci" ADMIN_PASSWORD="UnMotDePasseFort-12!" npm run create-admin
```
- ✅ **Contrôle** : le terminal affiche `Administrateur créé/mis à jour : admin@votredomaine.ci`
- Relancez `/api/health` : `"admins":1` doit apparaître.
- ⚠️ Ne commitez **jamais** ces valeurs dans Git (`.env` est déjà ignoré par `.gitignore`).

## ÉTAPE 8 — Tests de réception obligatoires (10 min)
Sur l'URL publique, dans cet ordre :
1. [ ] **Navigation** : Accueil, À propos, Services, Réalisations, Contact — aucune page blanche, images affichées
2. [ ] **Lien profond** : ouvrez directement `…/realisations` dans un nouvel onglet → la galerie s'affiche (pas d'erreur 404)
3. [ ] **Filtres** : cliquez « Rénovation », « Travaux publics » → la galerie se filtre
4. [ ] **Formulaire** : `/devis` → envoyez une demande de test (nom, téléphone, description, consentement coché) → message « Demande bien reçue »
5. [ ] **Administration** : `/admin/login` → connectez-vous → la demande de test apparaît dans **Demandes de devis**, avec le bon statut « Nouvelle »
6. [ ] **Modification réelle** : modifiez le titre d'un projet → Enregistrer → rechargez la page publique → le changement est visible (persistance Neon confirmée)
7. [ ] **Boutons d'appel** : sur mobile (ou vue réduite), touchez le bouton téléphone et le bouton WhatsApp vert → ils ouvrent le bon numéro
8. [ ] **Signature** : en bas de page, « Conçu par Shopin30 » + bouton WhatsApp → ouvre `wa.me/2250501303343`
- ✅ **Contrôle final** : les 8 points passent → le site est **fonctionnel en production**.

## ÉTAPE 9 — Personnalisation avant annonce publique (avec le dirigeant)
1. `/admin/parametres` : téléphone/WhatsApp/adresse/e-mail/horaires **confirmés par l'entreprise**, puis cochez « Coordonnées vérifiées »
2. `/admin/projets` : remplacez les 5 « Exemples de présentation » par les réalisations réelles (photos du téléphone acceptées), décochez « Exemple »
3. Domaine personnalisé (optionnel) : Vercel → **Settings → Domains** → ajoutez le domaine (ex. `baingconstruction.ci`) et suivez les DNS indiqués ; Neon n'a rien à changer
4. Faites valider les pages **Mentions légales** et **Confidentialité**

## 🔧 Dépannage express
| Symptôme | Cause probable | Solution |
|---|---|---|
| Site en ligne mais « Démonstration locale » en pied de page | APIs injoignables ou `DATABASE_URL` absent | `/api/health`, puis Étapes 4–5 |
| Connexion admin : « Identifiants incorrects » | Compte non créé ou mauvais mot de passe | Refaites l'Étape 7 (elle met à jour le mot de passe) |
| Connexion admin : erreur 500 | `JWT_SECRET` manquant | Étape 4 + Redeploy |
| Page blanche après déploiement | Échec de build | Vercel → Deployments → *Build Logs* ; en local : `npm run build` doit passer |
| 404 en rafraîchissant `/services` | Ancien déploiement sans `vercel.json` | Redéployez la dernière version du code |
| Les demandes n'arrivent pas dans l'admin | Mode local actif (navigateur différent) | Vérifiez `/api/health` → `"neon":"connecté"` |
| `DATABASE_URL` divulguée par erreur | — | Neon → **Reset password** du rôle, mettez à jour Vercel, Redeploy |

## 🔁 Retour arrière
Vercel → **Deployments** → choisissez le déploiement précédent → **⋯ → Promote to Production**. Les données Neon ne sont jamais touchées par un redéploiement du site.

## 💰 Coûts indicatifs
Plans gratuits Neon + Vercel suffisants pour démarrer (site vitrine, trafic local). Prévoir leur passage payant uniquement si le trafic ou les besoins augmentent — décision à prendre avec le dirigeant, aucun engagement pris par ce déploiement.
