import {sql,initDb,hasDb,json} from './_lib.js'
// GET /api/health — diagnostic SANS secret : permet de vérifier la mise en ligne étape par étape.
export default async function handler(req,res){
 if(!hasDb())return json(res,200,{site:'ok',neon:'non configuré — le site fonctionne en mode démonstration locale',jwt:process.env.JWT_SECRET?'présent':'MANQUANT (connexion admin impossible)'})
 try{const s=sql();await initDb(s);const t=await s`SELECT (SELECT COUNT(*)::int FROM services) AS services,(SELECT COUNT(*)::int FROM projets) AS projets,(SELECT COUNT(*)::int FROM demandes) AS demandes,(SELECT COUNT(*)::int FROM admins) AS admins`
 return json(res,200,{site:'ok',neon:'connecté',tables:t[0],jwt:process.env.JWT_SECRET?'présent':'MANQUANT (connexion admin impossible)',note:t[0].admins===0?'Aucun administrateur : lancez scripts/create-admin.mjs':'Administrateur présent'})}
 catch(e){return json(res,500,{site:'ok',neon:'ERREUR de connexion',detail:String(e?.message||e).slice(0,200)})}}
