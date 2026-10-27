export type MembreEquipe = {
  nom: string
  role: string
  photo: string
  accroche: string
  expertises: string[]
}

export const EQUIPE: MembreEquipe[] = [
  {
    nom: 'Kouadio Yao Konan',
    role: 'Directeur Général & Fondateur',
    photo: '/images/equipe-directeur-general.jpg',
    accroche:
      'Il fixe le cap de l’entreprise et veille à la qualité des ouvrages livrés, du premier rendez-vous jusqu’à la réception du chantier.',
    expertises: ['Vision & stratégie', 'Relation client', 'Grands ouvrages'],
  },
  {
    nom: 'Aminata Bamba',
    role: 'Directrice Administrative et Financière',
    photo: '/images/equipe-daf.jpg',
    accroche:
      'Elle sécurise la gestion administrative et financière : devis, budgets, facturation et conformité de chaque dossier.',
    expertises: ['Devis & budgets', 'Administration', 'Conformité'],
  },
  {
    nom: 'Issouf Coulibaly',
    role: 'Conducteur de travaux',
    photo: '/images/equipe-conducteur-travaux.jpg',
    accroche:
      'Il organise les plannings, les équipes et les approvisionnements pour tenir les délais et les coûts annoncés.',
    expertises: ['Planning', 'Coordination terrain', 'Gros œuvre'],
  },
  {
    nom: 'Grâce Amani',
    role: 'Ingénieure réseaux électriques',
    photo: '/images/equipe-ingenieure-electricite.jpg',
    accroche:
      'Elle conçoit et supervise les installations électriques, de la distribution basse tension jusqu’à la mise en service.',
    expertises: ['Réseaux électriques', 'Mise en conformité', 'Maintenance'],
  },
  {
    nom: 'Mamadou Diomandé',
    role: 'Chef de chantier',
    photo: '/images/equipe-chef-chantier.jpg',
    accroche:
      'Présent sur le terrain chaque jour, il dirige les équipes, contrôle l’exécution et fait respecter les règles de sécurité.',
    expertises: ['Management des équipes', 'Sécurité', 'Qualité d’exécution'],
  },
  {
    nom: 'Christelle Kouassi',
    role: 'Métreuse — Responsable devis',
    photo: '/images/equipe-metreuse.jpg',
    accroche:
      'Elle chiffre les prestations avec précision, des métrés aux devis détaillés, pour des engagements clairs et sans surprise.',
    expertises: ['Métrés & devis', 'Lecture de plans', 'Estimation des coûts'],
  },
]
