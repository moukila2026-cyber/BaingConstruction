import {createContext,useContext,useEffect,useState,type ReactNode} from 'react'
import type {Service,Projet,Demande,Settings} from './types'
import {seedServices,seedProjets,seedSettings} from './seed'
type Mode='neon'|'local'
type Ctx={mode:Mode;services:Service[];projets:Projet[];demandes:Demande[];settings:Settings;token:string|null;
login:(e:string,p:string)=>Promise<boolean>;logout:()=>void;
saveService:(s:Service)=>Promise<void>;deleteService:(id:string)=>Promise<void>;
saveProjet:(p:Projet)=>Promise<void>;deleteProjet:(id:string)=>Promise<void>;
addDemande:(d:Omit<Demande,'id'|'statut'|'createdAt'>)=>Promise<boolean>;
updateDemande:(id:string,patch:Partial<Demande>)=>Promise<void>;deleteDemande:(id:string)=>Promise<void>;
saveSettings:(s:Settings)=>Promise<void>}
const C=createContext<Ctx|null>(null)
const LS='baing_demo_v1'
function loadLocal(){try{const r=localStorage.getItem(LS);if(r)return JSON.parse(r)}catch{}return{services:seedServices,projets:seedProjets,demandes:[],settings:seedSettings}}
function persist(d:any){localStorage.setItem(LS,JSON.stringify(d))}
export function StoreProvider({children}:{children:ReactNode}){
 const init=loadLocal()
 const [mode,setMode]=useState<Mode>('local');const [services,setServices]=useState<Service[]>(init.services);const [projets,setProjets]=useState<Projet[]>(init.projets);const [demandes,setDemandes]=useState<Demande[]>(init.demandes);const [settings,setSettings]=useState<Settings>(init.settings);const [token,setToken]=useState<string|null>(()=>sessionStorage.getItem('baing_token'))
 useEffect(()=>{fetch('/api/public').then(r=>r.ok?r.json():Promise.reject()).then(d=>{setMode('neon');if(Array.isArray(d.services)&&d.services.length)setServices(d.services);if(Array.isArray(d.projets)&&d.projets.length)setProjets(d.projets);if(d.settings)setSettings({...seedSettings,...d.settings})}).catch(()=>setMode('local'))},[])
 useEffect(()=>{if(mode==='local')persist({services,projets,demandes,settings})},[services,projets,demandes,settings,mode])
 const api=async(path:string,opt:any={})=>{const r=await fetch(path,{...opt,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}});if(!r.ok)throw new Error(await r.text());return r.status===204?null:r.json()}
 const login=async(email:string,password:string)=>{try{const d=await api('/api/auth',{method:'POST',body:JSON.stringify({email,password})});setToken(d.token);sessionStorage.setItem('baing_token',d.token);setMode('neon');const a=await fetch('/api/admin',{headers:{Authorization:`Bearer ${d.token}`}});if(a.ok){const j=await a.json();setDemandes(j.demandes)}return true}catch{if(email==='admin@demo.local'&&password==='admin1234'){setToken('demo-local');sessionStorage.setItem('baing_token','demo-local');setMode('local');return true}return false}}
 const logout=()=>{setToken(null);sessionStorage.removeItem('baing_token')}
 const mutate=async(fn:()=>Promise<any>,local:()=>void)=>{if(mode==='neon'&&token&&token!=='demo-local'){await fn()}else local()}
 const saveService=async(s:Service)=>mutate(()=>api('/api/admin',{method:'POST',body:JSON.stringify({type:'service',data:s})}),()=>setServices(p=>{const e=p.find(x=>x.id===s.id);return e?p.map(x=>x.id===s.id?s:x):[...p,s]}))
 const deleteService=async(id:string)=>mutate(()=>api('/api/admin',{method:'DELETE',body:JSON.stringify({type:'service',id})}),()=>setServices(p=>p.filter(x=>x.id!==id)))
 const saveProjet=async(s:Projet)=>mutate(()=>api('/api/admin',{method:'POST',body:JSON.stringify({type:'projet',data:s})}),()=>setProjets(p=>{const e=p.find(x=>x.id===s.id);return e?p.map(x=>x.id===s.id?s:x):[...p,s]}))
 const deleteProjet=async(id:string)=>mutate(()=>api('/api/admin',{method:'DELETE',body:JSON.stringify({type:'projet',id})}),()=>setProjets(p=>p.filter(x=>x.id!==id)))
 const addDemande=async(d:any)=>{try{if(mode==='neon'){await fetch('/api/public',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({demande:d})}).then(r=>{if(!r.ok)throw 0})}else{setDemandes(p=>[{...d,id:crypto.randomUUID(),statut:'nouvelle',createdAt:new Date().toISOString()},...p])}return true}catch{ // fallback local si API indisponible
 setDemandes(p=>[{...d,id:crypto.randomUUID(),statut:'nouvelle',createdAt:new Date().toISOString()},...p]);return true}}
 const updateDemande=async(id:string,patch:Partial<Demande>)=>mutate(()=>api('/api/admin',{method:'PATCH',body:JSON.stringify({type:'demande',id,patch})}),()=>setDemandes(p=>p.map(x=>x.id===id?{...x,...patch}:x)))
 const deleteDemande=async(id:string)=>mutate(()=>api('/api/admin',{method:'DELETE',body:JSON.stringify({type:'demande',id})}),()=>setDemandes(p=>p.filter(x=>x.id!==id)))
 const saveSettings=async(s:Settings)=>mutate(()=>api('/api/admin',{method:'POST',body:JSON.stringify({type:'settings',data:s})}),()=>setSettings(s))
 // recharger demandes en mode neon si token présent
 useEffect(()=>{if(mode==='neon'&&token&&token!=='demo-local'){fetch('/api/admin',{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.ok?r.json():null).then(j=>{if(j){setDemandes(j.demandes||[]);if(j.services?.length)setServices(j.services);if(j.projets?.length)setProjets(j.projets);if(j.settings)setSettings({...seedSettings,...j.settings})}}).catch(()=>{})}},[mode,token])
 return <C.Provider value={{mode,services,projets,demandes,settings,token,login,logout,saveService,deleteService,saveProjet,deleteProjet,addDemande,updateDemande,deleteDemande,saveSettings}}>{children}</C.Provider>}
export function useStore(){const c=useContext(C);if(!c)throw new Error('store');return c}
export const waLink=(settings:Settings,msg="Bonjour BAING CONSTRUCTION INC, je souhaite un devis.")=>`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`
export const telLink=(settings:Settings)=>`tel:+${settings.whatsapp}`
