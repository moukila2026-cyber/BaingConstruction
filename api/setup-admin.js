import {sql,initDb,hasDb,json} from './_lib.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
const TOKEN_HASH='eceae0453aebff6af34c0d7855522568dbf0198cf2105ebaf146d0a50928cc3d'
// Bootstrap UNIQUE du premier administrateur : se verrouille dès qu'un admin existe (admins>0 -> 403).
// À supprimer dès la création effectuée.
export default async function handler(req,res){
 if(!hasDb())return json(res,501,{error:'Neon non configuré'})
 const k=(req.query&&req.query.k)||''
 const kh=crypto.createHash('sha256').update(String(k)).digest('hex')
 if(kh!==TOKEN_HASH)return json(res,403,{error:'Clé bootstrap invalide'})
 const s=sql();await initDb(s)
 const c=await s`SELECT COUNT(*)::int AS n FROM admins`
 if(c[0].n>0)return json(res,403,{error:'Administrateur déjà créé — bootstrap verrouillé'})
 const email='admin@baingconstruction.ci'
 const password=crypto.randomBytes(12).toString('base64url')+'A1!'
 const hash=await bcrypt.hash(password,12)
 await s`INSERT INTO admins(email,password_hash) VALUES(${email},${hash})`
 return json(res,201,{ok:true,email,password,note:'Compte créé. Conservez ce mot de passe, puis supprimez api/setup-admin.js et redéployez.'})
}
