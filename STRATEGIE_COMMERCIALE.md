# Stratégie commerciale — Comment convaincre BAING CONSTRUCTION INC

> Document interne Shopin30. Objectif : transformer la maquette en ligne
> `baing-construction-inc.vercel.app` en client signé, puis en contrat
> d’hébergement, de maintenance et de montée en gamme (ChantierPilot).

---

## 1. Ce qui a été vérifié et corrigé (votre bilan de départ)

### État du site après correction
| Point | Statut |
| --- | --- |
| Accès à l’outil de gestion depuis le pied de page | **Corrigé** : vrai bouton bronze « Espace administration » avec cadenas, bien positionné dans la colonne Contact et toujours cliquable (y compris sur mobile, où un bouton flottant pouvait le masquer). |
| Onglet « Notre équipe » | **Ajouté** : page `/notre-equipe` avec 6 portraits professionnels africains (direction, administratif, conduite de travaux, électricité, chef de chantier, métreuse), plus un aperçu de l’équipe sur la page d’accueil. |
| Section « Prestations complémentaires » (inspirée des majors européens) | **Réparée** : elle était écrite dans le code mais jamais affichée ; elle est désormais visible en bas de la page Services. |
| Formulaire de devis | **Fiabilisé** : lecture des paramètres d’URL via React Router (le type de prestation se présélectionne correctement depuis chaque bouton « Demander un devis »). |
| Navigation (desktop + mobile), liens WhatsApp/téléphone, toutes les pages | Testées : 11 routes rendues sans erreur, aucune image manquante, build de production et lint validés. |
| Base de données et administration | Production saine : Neon connecté, administrateur existant, les demandes de devis sont enregistrées en base. |

### Les arguments qui font la différence
1. **Le site existe déjà et fonctionne** — il ne vend du rêve, il démontre.
2. **Il est professionnel, local et mobile-first** — vos clients cherchent « entreprise BTP Daloa » depuis leur téléphone.
3. **Les devis arrivent structurés** dans un espace admin (nom, téléphone, besoin, lieu, budget) — fini les demandes perdues dans WhatsApp.
4. **ChantierPilot** ouvre un second levier : le pilotage des chantiers en FCFA.
5. **Honnêteté intégrée** : les contenus « à confirmer » et les exemples sont assumés, ce qui construit la confiance.

---

## 2. La stratégie en 4 temps

1. **Prendre rendez-vous en personne à Daloa** (ou appel vidéo), 30 minutes, avec le site ouvert sur votre téléphone et un ordinateur. Ne jamais envoyer juste un lien sans rendez-vous.
2. **Faire vivre le site, pas le décrire** : montrer en 10 minutes → accueil, équipe, services, devis que l’on remplit en direct, admin qui reçoit la demande.
3. **Parler argent et organisation, pas technologie** : délais gagnés, devis perdus évités, image auprès des banques/mairies/clients.
4. **Conclure par une décision simple** : valider les coordonnées et les photos réelles ; proposer une offre de lancement à risque limité.

### Offres à présenter (à adapter à vos tarifs)
- **Offre découverte** : mise en ligne officielle avec leurs coordonnées vérifiées, remplacement des photos d’exemple par leurs vraies photos/réalisations, formation à l’administration (1 séance), 1 mois d’essai.
- **Pack présence** : site + nom de domaine `.ci` ou `.com` + e-mail professionnel + hébergement et maintenance annuels.
- **Pack pilotage** : Pack présence + ChantierPilot (suivi des chantiers, dépenses et encaissements en FCFA).

---

## 3. Le script exact — ce que vous devez dire

### A. Pour obtenir le rendez-vous (téléphone / WhatsApp)

> « Bonjour Monsieur/Madame, je vous contacte au sujet de BAING CONSTRUCTION INC.
> Nous avons préparé, pour vous montrer ce que donnerait une présence en ligne
> professionnelle de votre entreprise, un site complet de démonstration : vos
> quatre métiers, vos devis en ligne, et même un espace de gestion des demandes.
> Il est déjà en ligne, je ne vous demande rien pour le voir.
> Puis-je passer 20 minutes avec vous cette semaine pour vous le montrer, et
> vous déciderez ensuite si cela vous sert ou non ? »

S’il demande « combien ça coûte » avant la démo :

> « Justement, je préfère vous montrer d’abord, parce que le prix n’a de sens
> que si l’outil vous rend service. La démonstration ne vous engage à rien. »

### B. Ouverture de la réunion (2 minutes) — poser le cadre

> « Merci de m’accueillir. Je vais être direct : vous n’avez rien commandé,
> et je ne vous demanderai de signer quoi que ce soit aujourd’hui.
> Je veux simplement vous montrer ce que vos clients voient quand ils cherchent
> une entreprise de construction à Daloa, et vous laisser juger.
> Je vous présente 10 minutes, puis vous me dites ce qui vous parle. »

### C. Les questions de découverte (3 minutes) — avant de montrer l’écran

Posez ces questions, et notez les réponses :

1. « Aujourd’hui, comment un nouveau client vous trouve-t-il ? »
2. « Quand quelqu’un vous demande vos références ou un exemple de chantier, vous faites comment ? »
3. « Combien de demandes arrivez-vous à suivre sur WhatsApp sans en perdre une ? »
4. « Vous répondez aux appels d’offres, aux banques, aux mairies ? On vous demande une plaquette ou un site ? »
5. « Qui établit les devis aujourd’hui, et combien de temps ça prend ? »

### D. La démonstration (10 minutes) — le scénario pas à pas

**1. La page d’accueil (2 min)**

> « Regardez : dès qu’on ouvre la page, on voit votre cœur de métier,
> votre ville, et deux boutons : demander un devis, ou vous appeler directement.
> Un client qui vous cherche sur Google tombe sur ça, sur son téléphone,
> en trois secondes. C’est la première impression que vous donnez avant même
> la première poignée de main. »

**2. L’onglet Notre équipe (2 min)**

> « Ici, vos futurs clients voient une équipe : un directeur, une responsable
> administrative, un conducteur de travaux, une ingénieure électricité,
> un chef de chantier, une métreuse. Les visages sont des visuels professionnels
> pour l’instant ; le jour où vous validez, on remplace par les vrais membres
> de votre équipe en une journée. Un client n’achète pas seulement des murs,
> il achète la confiance dans les gens qui les construisent. »

**3. Les services et la méthode (2 min)**

> « Vos quatre métiers sont présentés chacun avec un périmètre clair :
> ce qui est inclus, ce que vous savez faire. Et en bas, la méthode en
> 4 étapes, de la visite du site à la livraison. Ça répond exactement à la
> peur numéro un des clients de BTP : “est-ce que cette entreprise est sérieuse
> et organisée ?” »

**4. Le devis en ligne, en direct (2 min) — le moment clé**

Remplissez le formulaire avec lui, sous ses yeux, puis validez :

> « Votre client peut vous envoyer sa demande à 23 heures, depuis son canapé,
> avec le lieu, la description, même son budget. Le lendemain matin, vous ouvrez
> votre espace administration — tenez, je vous montre — et la demande est là,
> classée, avec le numéro de téléphone pour rappeler. Plus de demande noyée
> dans WhatsApp, plus de papier perdu. Vous pouvez changer son statut
> (“devise envoyé”, “accepté”, “clôturé”) et exporter la liste. »

Connectez-vous à l’admin et montrez la demande qui vient d’arriver.

**5. Le pied de page et l’espace administration (1 min)**

> « Tout est prévu pour que vous gardiez la main : le bouton “Espace
> administration” est en bas de chaque page, discret pour vos visiteurs,
> toujours accessible pour vous. »

**6. ChantierPilot (1 min) — la vente additionnelle, sans forcer**

> « Et quand vous voudrez aller plus loin, il existe un second outil, séparé,
> pour piloter vos chantiers : budgets, dépenses, encaissements en FCFA,
> pointage des ouvriers, photos d’avancement. On en parle quand vous serez
> prêt ; aujourd’hui, concentrons-nous sur le site. »

### E. La conclusion (3 minutes) — demander la décision

> « Voilà ce qui existe déjà. Maintenant, ma question est simple :
> qu’est-ce qui, dans ce que vous venez de voir, serait utile à BAING
> CONSTRUCTION INC dès le mois prochain ? »

*(Laissez-le répondre. Ensuite :)*

> « Parfait. Pour partir proprement, il me faut trois choses de votre côté :
> confirmer l’adresse et les horaires exacts, cinq à dix photos de vos vrais
> chantiers, et les noms et fonctions des membres de votre équipe.
> Je m’occupe du reste. Je vous propose l’offre de lancement : la mise en
> ligne officielle avec vos vraies informations, la formation à l’espace
> administration, et un mois pour éprouver le système. Si ça ne vous apporte
> rien, vous n’êtes pas engagé au-delà. On démarre quand ? »

---

## 4. Réponses exactes aux objections

**« On a déjà WhatsApp, ça suffit. »**
> « WhatsApp, c’est parfait pour discuter — et le site garde les boutons
> WhatsApp et appel bien visibles. Mais WhatsApp ne vous présente pas :
> quand un client hésite entre vous et un concurrent, c’est le site qui fait
> gagner la confiance. Et les demandes du formulaire arrivent structurées,
> au lieu de se mélanger avec 200 messages. Les deux se complètent,
> ils ne se remplacent pas. »

**« Les gens d’ici ne vont pas sur internet. »**
> « Vos clients ne vont peut-être pas sur un ordinateur, mais ils ont tous
> un téléphone dans la poche, et quand ils ont un gros projet — une villa,
> une école, un local — ils demandent à Google ou à leurs contacts.
> Ce qui est certain, c’est que vos concurrents, eux, peuvent y être
> dès demain. Autant que ce soit vous. »

**« Combien ça coûte ? »**
> « Je vais vous donner le chiffre précis, mais regardez-le comme ça :
> un seul chantier gagné grâce à une demande bien reçue paie le site
> pour plusieurs années. L’offre de lancement vous permet de démarrer
> avec un risque minime, et après, c’est un coût annuel plus faible
> qu’une journée de chantier. »

**« Je n’ai pas le temps de m’en occuper. »**
> « C’est justement pour ça que c’est déjà construit. Vous n’avez rien
> à écrire, rien à installer : vous me donnez vos photos et vos coordonnées,
> je fais le reste. Ensuite, gérer une demande prend deux minutes —
> moins de temps qu’un appel raté à rappeler. »

**« Pourquoi vous plutôt qu’un autre ? »**
> « Parce que le travail est déjà fait, chez vous, à Daloa, dans vos
> quatre métiers, et que vous pouvez le toucher tout de suite. Et parce
> que je reste votre interlocuteur après la mise en ligne : corrections,
> formation, évolution vers le pilotage de chantier. Vous n’achetez pas
> un fichier, vous achetez quelqu’un qui répond au téléphone. »

**« Les photos et les noms ne sont pas les nôtres. »**
> « Exact, et c’est assumé : ce sont des visuels professionnels de
> démonstration, rien n’est prétendu réel. Dès votre validation, on
> remplace l’ensemble par vos vrais chantiers et votre vraie équipe —
> c’est prévu dans l’offre, et c’est rapide. »

**« On va réfléchir. »**
> « C’est normal. Pour que votre réflexion soit concrète, je vous propose
> qu’on bloque la séance de photos et la validation des coordonnées
> la semaine prochaine, sans engagement : comme ça, si vous dites oui,
> tout est prêt, et si vous dites non, rien n’est dépensé. »

---

## 5. Message WhatsApp de relance (J+2, s’il n’a pas tranché)

> « Bonjour M./Mme [Nom], merci pour l’échange d’hier. Je remets le lien
> pour montrer le site à vos associés : https://baing-construction-inc.vercel.app
> Les 3 points qui dépendent de vous pour la mise en ligne officielle :
> 1) l’adresse et les horaires exacts, 2) 5 à 10 photos de vos chantiers,
> 3) les noms et postes de votre équipe. Dites-moi un créneau cette semaine,
> je m’occupe du reste. »

---

## 6. Checklist de préparation avant le rendez-vous

- [ ] Tester le site sur votre propre téléphone (4G, pas seulement la Wi-Fi).
- [ ] Ouvrir `/admin/login` et vérifier que vous pouvez vous connecter.
- [ ] Préparer une fiché tarifaire imprimée (offre découverte / présence / pilotage).
- [ ] Avoir le dossier de présentation PDF et un QR code vers le site.
- [ ] Préparer un exemple de demande de devis à saisir en direct.
- [ ] Noter les 5 questions de découverte et les objections par cœur.
- [ ] Prévoir la demande de 3 éléments (coordonnées, photos, équipe) pour conclure.
