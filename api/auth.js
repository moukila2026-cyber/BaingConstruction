import {sql,initDb,hasDb,json} from './_lib.js'
import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken'
export default async function handler(req,res){if(req.method!=='POST')return json(res,405,{error:'POST requis'});if(!hasDb())return json(res,501,{error:'Neon non configuré'});if(!process.env.JWT_SECRET)return json(res,500,{error:'JWT_SECRET manquant côté serveur'})
 const s=sql();await initDb(s);const {email,password}=req.body||{};const rows=await s`SELECT * FROM admins WHERE email=${email||''}`;const u=rows[0];if(!u||!(await bcrypt.compare(password||'',u.password_hash)))return json(res,401,{error:'Identifiants incorrects'})
 return json(res,200,{token:jwt.sign({sub:u.id,email:u.email},process.env.JWT_SECRET,{expiresIn:'8h'})})}
