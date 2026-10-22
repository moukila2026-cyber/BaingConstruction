import {Routes,Route} from 'react-router-dom'
import Layout from './components/Layout'
import {Home,APropos,Services,Realisations,ProjetDetail,Contact,Devis,Legal,NotFound} from './pages/Public'
import {AdminLogin,Dashboard,AdminProjets,AdminServices,AdminDemandes,AdminSettings} from './pages/Admin'
export default function App(){return <Routes><Route element={<Layout/>}>
<Route index element={<Home/>}/><Route path="a-propos" element={<APropos/>}/><Route path="services" element={<Services/>}/><Route path="realisations" element={<Realisations/>}/><Route path="realisations/:id" element={<ProjetDetail/>}/><Route path="contact" element={<Contact/>}/><Route path="devis" element={<Devis/>}/><Route path="mentions-legales" element={<Legal/>}/><Route path="confidentialite" element={<Legal conf/>}/>
<Route path="admin/login" element={<AdminLogin/>}/><Route path="admin" element={<Dashboard/>}/><Route path="admin/projets" element={<AdminProjets/>}/><Route path="admin/services" element={<AdminServices/>}/><Route path="admin/demandes" element={<AdminDemandes/>}/><Route path="admin/parametres" element={<AdminSettings/>}/>
<Route path="*" element={<NotFound/>}/></Route></Routes>}
