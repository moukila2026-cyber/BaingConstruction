import { Link, NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Phone, MessageCircle, MapPin, Clock, Lock } from 'lucide-react'
import { useStore, waLink, telLink } from '../lib/store'

const links: [string, string][] = [
  ['/', 'Accueil'],
  ['/a-propos', 'À propos'],
  ['/notre-equipe', 'Notre équipe'],
  ['/services', 'Nos services'],
  ['/realisations', 'Nos réalisations'],
  ['/contact', 'Contact'],
]

export default function Layout() {
  const { settings, mode } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#202321] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-x-5 gap-y-1 items-center justify-between">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-[#B58A52]" />
            {settings.adresse}
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <Clock size={13} className="text-[#B58A52]" />
            {settings.horaires}
          </span>
          <a className="font-semibold" href={telLink(settings)}>{settings.telephone}</a>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-[#F7F6F2]/90 backdrop-blur border-b border-[#D8D9D5]">
        <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo-mark.svg" alt="Logo BAING CONSTRUCTION INC" className="w-11 h-11 rounded-[10px] shadow" />
            <span className="leading-none">
              <span className="block font-black tracking-tight text-lg font-display">BAING <span className="text-[#B58A52]">CONSTRUCTION</span></span>
              <span className="text-[.65rem] tracking-[.3em] uppercase text-neutral-500">INC — Daloa, Côte d’Ivoire</span>
            </span>
          </Link>
          <nav className="hidden lg:flex gap-6 xl:gap-7 font-medium text-sm">
            {links.map(([to, l]) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'text-[#B58A52]' : 'hover:text-[#B58A52]')}>{l}</NavLink>
            ))}
          </nav>
          <div className="hidden xl:flex gap-2">
            <a href={waLink(settings)} target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-full border-2 border-[#202321] font-semibold text-sm inline-flex gap-2 items-center">
              <MessageCircle size={16} />WhatsApp
            </a>
            <Link to="/devis" className="btn-bronze px-5 py-2.5 rounded-full font-semibold text-sm">Demander un devis</Link>
          </div>
          <button className="lg:hidden p-2" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="lg:hidden border-t border-[#D8D9D5] px-4 py-4 flex flex-col gap-3 font-medium">
            {links.map(([to, l]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}>{l}</Link>
            ))}
            <Link to="/devis" onClick={() => setOpen(false)} className="btn-bronze text-center px-5 py-3 rounded-full font-semibold">Demander un devis</Link>
            <a href={waLink(settings)} target="_blank" rel="noreferrer" className="text-center px-5 py-3 rounded-full border-2 border-[#202321] font-semibold">WhatsApp</a>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <a href={waLink(settings)} target="_blank" rel="noreferrer" aria-label="Discuter sur WhatsApp" className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-xl hover:scale-105 transition">
        <MessageCircle />
      </a>
      <a href={telLink(settings)} aria-label="Appeler" className="fixed bottom-5 left-5 z-50 md:hidden w-14 h-14 rounded-full bg-[#202321] text-white grid place-items-center shadow-xl">
        <Phone />
      </a>

      <footer className="bg-[#202321] text-[#D8D9D5] grain">
        <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img src="/images/logo-baing-light.svg" alt="BAING CONSTRUCTION INC" className="h-14 w-auto max-w-full" />
            <p className="text-sm mt-3">Construction de bâtiments, rénovation, travaux publics et réseaux électriques à Daloa, Côte d’Ivoire.</p>
            <p className="text-xs mt-3 text-neutral-400">Mode données : {mode === 'neon' ? 'Neon (production)' : 'Démonstration locale'}</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Navigation</h3>
            {links.map(([to, l]) => (
              <Link className="block py-1 text-sm hover:text-[#B58A52]" key={to} to={to}>{l}</Link>
            ))}
            <Link className="block py-1 text-sm hover:text-[#B58A52]" to="/devis">Demande de devis</Link>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Services</h3>
            <Link className="block py-1 text-sm hover:text-[#B58A52]" to="/services">Construction de bâtiments</Link>
            <Link className="block py-1 text-sm hover:text-[#B58A52]" to="/services">Rénovation</Link>
            <Link className="block py-1 text-sm hover:text-[#B58A52]" to="/services">Travaux publics</Link>
            <Link className="block py-1 text-sm hover:text-[#B58A52]" to="/services">Réseaux électriques</Link>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Contact</h3>
            <p className="text-sm">{settings.adresse}</p>
            <p className="text-sm mt-2">{settings.telephone}</p>
            <p className="text-sm">{settings.horaires}</p>
            <Link
              to="/admin/login"
              className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#B58A52] hover:bg-[#96703E] text-white font-bold px-5 py-3 rounded-full text-sm transition shadow-lg"
            >
              <Lock size={15} /> Espace administration
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 text-xs flex flex-wrap gap-3 justify-between">
            <span>© {new Date().getFullYear()} BAING CONSTRUCTION INC — Démonstration indépendante, non validée par l’entreprise.</span>
            <span className="flex gap-4 items-center flex-wrap">
              <Link to="/mentions-legales">Mentions légales</Link>
              <Link to="/confidentialite">Confidentialité</Link>
            </span>
          </div>
          <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-6 flex flex-wrap items-center gap-3 justify-between">
            <p className="text-sm text-[#D8D9D5]">Conçu par <strong className="text-white">Shopin30</strong></p>
            <a
              href="https://wa.me/2250501303343?text=Bonjour%20Shopin30%2C%20je%20souhaite%20un%20site%20web%20pour%20mon%20entreprise."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-full text-sm hover:scale-[1.03] transition shadow-lg"
            >
              <MessageCircle size={17} /> Discuter avec Shopin30 sur WhatsApp
            </a>
          </div>
        </div>
        <div className="hazard h-2" />
      </footer>
    </div>
  )
}
