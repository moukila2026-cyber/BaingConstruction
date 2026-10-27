import {neon} from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'
export const hasDb=()=>!!process.env.DATABASE_URL
export const sql=()=>neon(process.env.DATABASE_URL)
export async function initDb(s){
await s`CREATE TABLE IF NOT EXISTS services(id text PRIMARY KEY,slug text UNIQUE NOT NULL,titre text NOT NULL,description text DEFAULT '',perimetre jsonb DEFAULT '[]',image text DEFAULT '',ordre int DEFAULT 99,publie boolean DEFAULT false,cta text DEFAULT 'Demander un devis')`;
await s`CREATE TABLE IF NOT EXISTS projets(id text PRIMARY KEY,titre text NOT NULL,categorie text NOT NULL,description text DEFAULT '',localisation text DEFAULT '',statut text DEFAULT '',image text DEFAULT '',ordre int DEFAULT 99,publie boolean DEFAULT false,illustratif boolean DEFAULT true)`;
await s`CREATE TABLE IF NOT EXISTS demandes(id text PRIMARY KEY,nom text NOT NULL,telephone text NOT NULL,email text DEFAULT '',entreprise text DEFAULT '',prestation text NOT NULL,lieu text DEFAULT '',description text NOT NULL,budget text DEFAULT '',delai text DEFAULT '',consentement boolean NOT NULL DEFAULT false,statut text DEFAULT 'nouvelle',note_interne text DEFAULT '',created_at timestamptz DEFAULT now())`;
await s`CREATE TABLE IF NOT EXISTS settings(cle text PRIMARY KEY,valeur jsonb NOT NULL)`;
await s`CREATE TABLE IF NOT EXISTS admins(id serial PRIMARY KEY,email text UNIQUE NOT NULL,password_hash text NOT NULL,created_at timestamptz DEFAULT now())`}
// ---- Contenu initial : inséré UNIQUEMENT si les tables sont vides (jamais d'écrasement) ----
export const DEFAULT_SETTINGS={telephone:'+225 07 89 70 61 23',whatsapp:'2250789706123',adresse:'Tazibouoo Ceinture, Daloa, Côte d’Ivoire (à confirmer)',email:'',horaires:'Lun – Sam : 7h30 – 17h30 (à confirmer)',zones:'Daloa et région du Haut-Sassandra (à confirmer)',facebook:'',instagram:'',linkedin:'',seoTitre:'BAING CONSTRUCTION INC — Daloa',seoDescription:"Construction, rénovation, travaux publics et réseaux électriques à Daloa, Côte d'Ivoire.",coordonneesVerifiees:false}
const SEED_SERVICES=[
['s1','construction-batiments','Construction de bâtiments',"Construction neuve de maisons, villas, immeubles et bâtiments professionnels, du terrassement aux finitions, avec un suivi de chantier structuré.",['Étude et préparation du chantier','Fondations et gros œuvre','Élévation, toiture et menuiseries','Finitions et livraison'],'/images/service-construction.jpg',1,'Demander un devis construction'],
['s2','renovation-rehabilitation','Rénovation & réhabilitation',"Remise en état, extension et modernisation de bâtiments existants : structure, toiture, revêtements, sanitaires et mise aux normes.",['Diagnostic de l’existant','Travaux de structure et toiture','Revêtements, peinture, carrelage','Modernisation des espaces'],'/images/service-renovation.jpg',2,'Demander un devis rénovation'],
['s3','travaux-publics','Travaux publics',"Voirie, terrassement, ouvrages et aménagements extérieurs pour collectivités, entreprises et promoteurs, réalisés avec méthode et sécurité.",['Terrassement et voirie','Ouvrages et aménagements','Drainage et assainissement','Clôtures et plateformes'],'/images/service-travaux-publics.jpg',3,'Demander un devis travaux publics'],
['s4','reseaux-electriques','Réseaux électriques',"Installation et maintenance de réseaux électriques pour bâtiments résidentiels, commerciaux et sites techniques, dans le respect des règles de sécurité.",['Installation électrique neuve','Tableaux et distribution','Maintenance et dépannage','Mise en conformité (selon diagnostic)'],'/images/service-electrique.jpg',4,'Demander un devis électricité']]
const SEED_PROJETS=[
['p1','Villa moderne — exemple de présentation','construction',"Exemple de présentation — à remplacer par une réalisation réelle de BAING CONSTRUCTION INC avant publication officielle.",'Daloa (à confirmer)','Exemple','/images/villa-daloa.jpg',1],
['p2','Chantier de bâtiment — exemple de présentation','construction',"Exemple de présentation — à remplacer par une réalisation réelle de BAING CONSTRUCTION INC avant publication officielle.",'Daloa (à confirmer)','Exemple','/images/chantier-fondations.jpg',2],
['p3','Rénovation intérieure — exemple de présentation','renovation',"Exemple de présentation — à remplacer par une réalisation réelle de BAING CONSTRUCTION INC avant publication officielle.",'À confirmer','Exemple','/images/renovation-maison-africaine.jpg',3],
['p4','Voirie & terrassement — exemple de présentation','travaux-publics',"Exemple de présentation — à remplacer par une réalisation réelle de BAING CONSTRUCTION INC avant publication officielle.",'À confirmer','Exemple','/images/route-daloa.jpg',4],
['p5','Installation électrique — exemple de présentation','electrique',"Exemple de présentation — à remplacer par une réalisation réelle de BAING CONSTRUCTION INC avant publication officielle.",'À confirmer','Exemple','/images/electricien-africain-reseau.jpg',5]]
export async function ensureSeed(s){
 const c=await s`SELECT COUNT(*)::int AS n FROM services`
 if(c[0].n===0){for(const v of SEED_SERVICES){await s`INSERT INTO services(id,slug,titre,description,perimetre,image,ordre,publie,cta) VALUES(${v[0]},${v[1]},${v[2]},${v[3]},${JSON.stringify(v[4])},${v[5]},${v[6]},true,${v[7]}) ON CONFLICT(id) DO NOTHING`}}
 const cp=await s`SELECT COUNT(*)::int AS n FROM projets`
 if(cp[0].n===0){for(const v of SEED_PROJETS){await s`INSERT INTO projets(id,titre,categorie,description,localisation,statut,image,ordre,publie,illustratif) VALUES(${v[0]},${v[1]},${v[2]},${v[3]},${v[4]},${v[5]},${v[6]},${v[7]},true,true) ON CONFLICT(id) DO NOTHING`}}
 await s`INSERT INTO settings(cle,valeur) VALUES('site',${JSON.stringify(DEFAULT_SETTINGS)}) ON CONFLICT(cle) DO NOTHING`}
export const parseArr=v=>Array.isArray(v)?v:(typeof v==='string'?(()=>{try{return JSON.parse(v)}catch{return[]}})():[])
export function auth(req,res){const h=req.headers.authorization||'';const t=h.replace('Bearer ','');if(!t||t==='demo-local'){res.status(401).json({error:'Non autorisé'});return null}try{return jwt.verify(t,process.env.JWT_SECRET||'')}catch{res.status(401).json({error:'Session expirée'});return null}}
export const json=(res,code,data)=>{res.status(code).setHeader('Content-Type','application/json');res.end(JSON.stringify(data))}
export const mapDemande=r=>({id:r.id,nom:r.nom,telephone:r.telephone,email:r.email,entreprise:r.entreprise,prestation:r.prestation,lieu:r.lieu,description:r.description,budget:r.budget,delai:r.delai,consentement:r.consentement,statut:r.statut,noteInterne:r.note_interne,createdAt:r.created_at})
