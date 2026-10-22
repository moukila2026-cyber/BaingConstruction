// Applique db/schema.sql sur Neon via sql.query (compatible @neondatabase/serverless)
// Usage : DATABASE_URL="postgres://..." node scripts/seed.mjs
// Le contenu initial (services/projets/paramètres) est inséré automatiquement par l'API
// au premier appel si les tables sont vides (ensureSeed) — ce script est donc optionnel.
import {neon} from '@neondatabase/serverless';import {readFileSync} from 'fs'
if(!process.env.DATABASE_URL){console.error('DATABASE_URL manquant');process.exit(1)}
const sql=neon(process.env.DATABASE_URL)
const schema=readFileSync(new URL('../db/schema.sql',import.meta.url),'utf8')
for(const stmt of schema.split(';').map(x=>x.trim()).filter(Boolean)){await sql.query(stmt)}
console.log('Schéma Neon appliqué avec succès (tables créées si absentes, rien d’écrasé).')
