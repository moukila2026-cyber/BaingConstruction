import {neon} from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'
export const hasDb=()=>!!process.env.DATABASE_URL
export const sql=()=>neon(process.env.DATABASE_URL)
export async function initDb(s){await s`CREATE TABLE IF NOT EXISTS services(id text PRIMARY KEY,slug text UNIQUE NOT NULL,titre text NOT NULL,description text DEFAULT '',perimetre jsonb DEFAULT '[]',image text DEFAULT '',ordre int DEFAULT 99,publie boolean DEFAULT false,cta text DEFAULT 'Demander un devis')`;
await s`CREATE TABLE IF NOT EXISTS projets(id text PRIMARY KEY,titre text NOT NULL,categorie text NOT NULL,description text DEFAULT '',localisation text DEFAULT '',statut text DEFAULT '',image text DEFAULT '',ordre int DEFAULT 99,publie boolean DEFAULT false,illustratif boolean DEFAULT true)`;
await s`CREATE TABLE IF NOT EXISTS demandes(id text PRIMARY KEY,nom text NOT NULL,telephone text NOT NULL,email text DEFAULT '',entreprise text DEFAULT '',prestation text NOT NULL,lieu text DEFAULT '',description text NOT NULL,budget text DEFAULT '',delai text DEFAULT '',consentement boolean NOT NULL DEFAULT false,statut text DEFAULT 'nouvelle',note_interne text DEFAULT '',created_at timestamptz DEFAULT now())`;
await s`CREATE TABLE IF NOT EXISTS settings(cle text PRIMARY KEY,valeur jsonb NOT NULL)`;
await s`CREATE TABLE IF NOT EXISTS admins(id serial PRIMARY KEY,email text UNIQUE NOT NULL,password_hash text NOT NULL,created_at timestamptz DEFAULT now())`}
export function auth(req,res){const h=req.headers.authorization||'';const t=h.replace('Bearer ','');if(!t||t==='demo-local'){res.status(401).json({error:'Non autorisé'});return null}try{return jwt.verify(t,process.env.JWT_SECRET||'')}catch{res.status(401).json({error:'Session expirée'});return null}}
export const json=(res,code,data)=>{res.status(code).setHeader('Content-Type','application/json');res.end(JSON.stringify(data))}
export const mapDemande=r=>({id:r.id,nom:r.nom,telephone:r.telephone,email:r.email,entreprise:r.entreprise,prestation:r.prestation,lieu:r.lieu,description:r.description,budget:r.budget,delai:r.delai,consentement:r.consentement,statut:r.statut,noteInterne:r.note_interne,createdAt:r.created_at})
