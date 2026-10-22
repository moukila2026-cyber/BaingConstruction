import {sql,initDb,hasDb,json,mapDemande} from './_lib.js'
export default async function handler(req,res){
 if(!hasDb())return json(res,501,{error:'Neon non configuré (DATABASE_URL manquant) — mode démonstration locale côté client.'})
 const s=sql();await initDb(s)
 if(req.method==='GET'){const services=await s`SELECT * FROM services WHERE publie=true ORDER BY ordre`;const projets=await s`SELECT * FROM projets WHERE publie=true ORDER BY ordre`;const st=await s`SELECT valeur FROM settings WHERE cle='site'`;return json(res,200,{services:services.map(r=>({...r,perimetre:r.perimetre||[]})),projets,settings:st[0]?.valeur||null})}
 if(req.method==='POST'){const d=req.body?.demande||req.body;if(!d?.nom||!/^[+\d][\d\s]{7,}$/.test(d.telephone||'')||(d.description||'').length<10||!d.consentement)return json(res,400,{error:'Données invalides : nom, téléphone valide, description (10+ caractères) et consentement requis.'})
 const id=crypto.randomUUID();await s`INSERT INTO demandes(id,nom,telephone,email,entreprise,prestation,lieu,description,budget,delai,consentement) VALUES(${id},${d.nom},${d.telephone},${d.email||''},${d.entreprise||''},${d.prestation},${d.lieu||''},${d.description},${d.budget||''},${d.delai||''},true)`;return json(res,201,{ok:true,id})}
 return json(res,405,{error:'Méthode non autorisée'})}
