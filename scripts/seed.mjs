// Seed initial Neon (services/projets illustratifs/paramètres) — idempotent (ON CONFLICT DO NOTHING / UPDATE)
// Usage : DATABASE_URL="postgres://..." node scripts/seed.mjs
import {neon} from '@neondatabase/serverless';import {readFileSync} from 'fs'
if(!process.env.DATABASE_URL){console.error('DATABASE_URL manquant');process.exit(1)}
const sql=neon(process.env.DATABASE_URL);await sql(readFileSync(new URL('../db/schema.sql',import.meta.url),'utf8')).catch(async()=>{for(const q of readFileSync(new URL('../db/schema.sql',import.meta.url),'utf8').split(';')){if(q.trim())await sql(q)}})
console.log('Schéma appliqué. Insérez ensuite les contenus via /admin ou adaptez ce script.')
