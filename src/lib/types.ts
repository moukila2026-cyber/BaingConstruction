export type Service={id:string;slug:string;titre:string;description:string;perimetre:string[];image:string;ordre:number;publie:boolean;cta:string}
export type Projet={id:string;titre:string;categorie:'construction'|'renovation'|'travaux-publics'|'electrique';description:string;localisation:string;statut:string;image:string;ordre:number;publie:boolean;illustratif:boolean}
export type StatutDemande='nouvelle'|'en-cours'|'devis-envoye'|'acceptee'|'refusee'|'cloturee'
export type Demande={id:string;nom:string;telephone:string;email?:string;entreprise?:string;prestation:string;lieu:string;description:string;budget?:string;delai?:string;consentement:boolean;statut:StatutDemande;noteInterne?:string;createdAt:string}
export type Settings={telephone:string;whatsapp:string;adresse:string;email:string;horaires:string;zones:string;facebook:string;instagram:string;linkedin:string;seoTitre:string;seoDescription:string;coordonneesVerifiees:boolean}
export const CATEGORIES=[{id:'tous',label:'Tous'},{id:'construction',label:'Construction'},{id:'renovation',label:'Rénovation'},{id:'travaux-publics',label:'Travaux publics'},{id:'electrique',label:'Réseaux électriques'}] as const
