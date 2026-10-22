// Création du PREMIER administrateur (Neon). Aucun compte par défaut dans le site.
// Usage : DATABASE_URL="postgres://..." ADMIN_EMAIL="vous@exemple.ci" ADMIN_PASSWORD="MotDePasseFort!" node scripts/create-admin.mjs
import {neon} from '@neondatabase/serverless';import bcrypt from 'bcryptjs'
const {DATABASE_URL,ADMIN_EMAIL,ADMIN_PASSWORD}=process.env
if(!DATABASE_URL||!ADMIN_EMAIL||!ADMIN_PASSWORD||ADMIN_PASSWORD.length<10){console.error('Définissez DATABASE_URL, ADMIN_EMAIL et ADMIN_PASSWORD (10+ caractères).');process.exit(1)}
const sql=neon(DATABASE_URL)
await sql`CREATE TABLE IF NOT EXISTS admins(id serial PRIMARY KEY,email text UNIQUE NOT NULL,password_hash text NOT NULL,created_at timestamptz DEFAULT now())`
const hash=await bcrypt.hash(ADMIN_PASSWORD,12)
await sql`INSERT INTO admins(email,password_hash) VALUES(${ADMIN_EMAIL},${hash}) ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash`
console.log('Administrateur créé/mis à jour :',ADMIN_EMAIL)
