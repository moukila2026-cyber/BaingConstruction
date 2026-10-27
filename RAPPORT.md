# Rapport de tests & d’audit — BAING CONSTRUCTION INC

## Audit initial (Phase 1)
- Dépôt d’origine quasi vide (README seul, aucun projet existant à préserver). Aucune base, aucun service externe touché. ChantierPilot non modifié, non connecté.
- Informations publiques utilisées avec prudence et marquées « à confirmer » : activités (construction, rénovation, travaux publics, réseaux électriques), localisation Daloa / Tazibouoo Ceinture, téléphone +225 07 89 70 61 23.

## Tests exécutés (résultats réels)
| # | Test | Résultat |
|---|---|---|
|1|Installation dépendances (`npm install`)|✅ Réussi, 0 vulnérabilité signalée|
|2|Build production (`npm run build` : tsc + vite)|✅ Réussi (après correction de 3 erreurs TS d’imports inutiles)|
|3|Lint (`npm run lint`)|⚠️ 0 erreur, 6 warnings (fast-refresh, non bloquants)|
|4|Routes publiques (/, /a-propos, /services, /realisations, /contact, /devis, 404)|✅ Vérifiées via le serveur de prévisualisation|
|5|Filtres galerie + recherche|✅ Logique par catégorie testée dans l’UI|
|6|CRUD projets/services admin (mode démo locale)|✅ Création, modification, publication/dépublication, suppression avec confirmation|
|7|Soumission devis + validation + anti-double-envoi|✅ Erreurs affichées, confirmation après enregistrement|
|8|Persistance après rechargement (localStorage)|✅ Vérifiée en mode démo|
|9|Permissions : /admin sans session → écran protégé ; notes internes non publiques|✅|
|10|API Neon (/api/public, /api/auth, /api/admin)|⏳ Code livré et buildable ; **non testée contre une vraie base** — aucune DATABASE_URL fournie dans l’environnement|
|11|Liens tel:/WhatsApp|✅ Format wa.me/2250789706123 (numéro à confirmer)|
|12|SEO : titres, OG, JSON-LD, sitemap.xml, robots.txt, 404|✅ Présents|
|13|Images manquantes|✅ 7 visuels présents dans public/images|
|14|Données fictives présentées comme réelles|✅ Aucune : exemples étiquetés, bannière démo, pas de témoignages/compteurs inventés|
|15|ChantierPilot modifié|✅ Non — lien externe uniquement|

## Limites honnêtes
- Pas de test navigateur automatisé multi-écrans dans cet environnement ; responsive assuré par Tailwind (mobile-first, boutons ≥ 44 px, pas de débordement prévu).
- Notification e-mail du responsable : non branchée (aucun fournisseur fourni) — les demandes sont visibles dans /admin/demandes dès l’envoi.
- Upload de pièces jointes : redirigé vers WhatsApp en démo (documenté, non simulé).

## À valider avec le dirigeant avant publication officielle
1. Téléphone / WhatsApp exacts et adresse précise (Tazibouoo Ceinture ?). 2. E-mail professionnel. 3. Horaires et zones d’intervention. 4. Raison sociale exacte, RCCM, historique, équipe. 5. Réalisations réelles (photos, lieux, statuts) pour remplacer les exemples. 6. Logo officiel. 7. Validation de la politique de confidentialité et des mentions légales. 8. Choix du domaine et création du projet Vercel + base Neon de production.

## Présentation commerciale (30 secondes)
« Voici une démonstration du site que BAING CONSTRUCTION INC pourrait publier : vos services et réalisations présentés avec exigence, un bouton WhatsApp et un formulaire de devis qui centralise vos demandes dans un espace d’administration privé. Une fois vos vraies photos et coordonnées validées, le site est prêt. Et pour suivre vos chantiers au quotidien — dépenses, encaissements, rapports de terrain — je pourrai vous présenter ChantierPilot, un outil distinct, dans un second temps. »
