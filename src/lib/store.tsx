import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Service, Projet, Demande, Settings } from './types'
import { seedServices, seedProjets, seedSettings } from './seed'

type Mode = 'neon' | 'local'
type Ctx = {
  mode: Mode
  services: Service[]
  projets: Projet[]
  demandes: Demande[]
  settings: Settings
  token: string | null
  login: (e: string, p: string) => Promise<boolean>
  logout: () => void
  refreshAdmin: () => Promise<void>
  refreshPublic: () => Promise<void>
  saveService: (s: Service) => Promise<void>
  deleteService: (id: string) => Promise<void>
  saveProjet: (p: Projet) => Promise<void>
  deleteProjet: (id: string) => Promise<void>
  addDemande: (d: Omit<Demande, 'id' | 'statut' | 'createdAt'>) => Promise<boolean>
  updateDemande: (id: string, patch: Partial<Demande>) => Promise<void>
  deleteDemande: (id: string) => Promise<void>
  saveSettings: (s: Settings) => Promise<void>
}

const C = createContext<Ctx | null>(null)
const LS = 'baing_demo_v1'

function loadLocal() {
  try {
    const r = localStorage.getItem(LS)
    if (r) return JSON.parse(r)
  } catch {
    /* stockage indisponible : on bascule sur les données de démonstration */
  }
  return { services: seedServices, projets: seedProjets, demandes: [], settings: seedSettings }
}
function persist(d: unknown) {
  localStorage.setItem(LS, JSON.stringify(d))
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const init = loadLocal()
  const [mode, setMode] = useState<Mode>('local')
  const [services, setServices] = useState<Service[]>(init.services)
  const [projets, setProjets] = useState<Projet[]>(init.projets)
  const [demandes, setDemandes] = useState<Demande[]>(init.demandes)
  const [settings, setSettings] = useState<Settings>(init.settings)
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('baing_token'))

  const api = async (path: string, opt: RequestInit = {}) => {
    const r = await fetch(path, {
      ...opt,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
    if (!r.ok) throw new Error(await r.text().catch(() => `Erreur ${r.status}`))
    return r.status === 204 ? null : r.json()
  }

  const isNeonSession = () => mode === 'neon' && !!token && token !== 'demo-local'

  const refreshPublic = async () => {
    try {
      const d = await fetch('/api/public').then((r) => (r.ok ? r.json() : Promise.reject()))
      setMode('neon')
      if (Array.isArray(d.services)) setServices(d.services)
      if (Array.isArray(d.projets)) setProjets(d.projets)
      if (d.settings) setSettings({ ...seedSettings, ...d.settings })
    } catch {
      /* hors ligne ou API absente : on conserve les données courantes */
    }
  }

  const refreshAdmin = async () => {
    if (!token || token === 'demo-local') return
    try {
      const j = await fetch('/api/admin', { headers: { Authorization: `Bearer ${token}` } }).then((r) =>
        r.ok ? r.json() : Promise.reject(),
      )
      if (j) {
        setDemandes(j.demandes || [])
        if (Array.isArray(j.services)) setServices(j.services)
        if (Array.isArray(j.projets)) setProjets(j.projets)
        if (j.settings) setSettings({ ...seedSettings, ...j.settings })
      }
    } catch {
      /* session peut-être expirée : l'utilisateur sera renvoyé à la connexion au prochain appel */
    }
  }

  // Chargement initial des données publiques
  useEffect(() => {
    refreshPublic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persistance du mode démonstration locale
  useEffect(() => {
    if (mode === 'local') persist({ services, projets, demandes, settings })
  }, [services, projets, demandes, settings, mode])

  // Données d'administration chargées/rechargées tant qu'une session Neon est active
  useEffect(() => {
    if (mode === 'neon' && token && token !== 'demo-local') refreshAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, token])

  // Temps réel côté public : on resynchronise quand l'internaute revient sur l'onglet
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && mode === 'neon') refreshPublic()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const login = async (email: string, password: string) => {
    try {
      const d = await api('/api/auth', { method: 'POST', body: JSON.stringify({ email, password }) })
      setToken(d.token)
      sessionStorage.setItem('baing_token', d.token)
      setMode('neon')
      const a = await fetch('/api/admin', { headers: { Authorization: `Bearer ${d.token}` } })
      if (a.ok) {
        const j = await a.json()
        setDemandes(j.demandes || [])
        if (Array.isArray(j.services)) setServices(j.services)
        if (Array.isArray(j.projets)) setProjets(j.projets)
        if (j.settings) setSettings({ ...seedSettings, ...j.settings })
      }
      return true
    } catch {
      if (email === 'admin@demo.local' && password === 'admin1234') {
        setToken('demo-local')
        sessionStorage.setItem('baing_token', 'demo-local')
        setMode('local')
        return true
      }
      return false
    }
  }

  const logout = () => {
    setToken(null)
    sessionStorage.removeItem('baing_token')
  }

  // En Neon : appel API PUIS resynchronisation immédiate de l'interface (admin + public).
  // En local : mise à jour d'état immédiate, persistée dans localStorage.
  const mutate = async (fn: () => Promise<unknown>, local: () => void) => {
    if (isNeonSession()) {
      await fn()
      await Promise.all([refreshAdmin(), refreshPublic()])
    } else {
      local()
    }
  }

  const saveService = (s: Service) =>
    mutate(
      () => api('/api/admin', { method: 'POST', body: JSON.stringify({ type: 'service', data: s }) }),
      () =>
        setServices((p) => {
          const e = p.find((x) => x.id === s.id)
          return e ? p.map((x) => (x.id === s.id ? s : x)) : [...p, s]
        }),
    )

  const deleteService = (id: string) =>
    mutate(
      () => api('/api/admin', { method: 'DELETE', body: JSON.stringify({ type: 'service', id }) }),
      () => setServices((p) => p.filter((x) => x.id !== id)),
    )

  const saveProjet = (s: Projet) =>
    mutate(
      () => api('/api/admin', { method: 'POST', body: JSON.stringify({ type: 'projet', data: s }) }),
      () =>
        setProjets((p) => {
          const e = p.find((x) => x.id === s.id)
          return e ? p.map((x) => (x.id === s.id ? s : x)) : [...p, s]
        }),
    )

  const deleteProjet = (id: string) =>
    mutate(
      () => api('/api/admin', { method: 'DELETE', body: JSON.stringify({ type: 'projet', id }) }),
      () => setProjets((p) => p.filter((x) => x.id !== id)),
    )

  const addDemande = async (d: Omit<Demande, 'id' | 'statut' | 'createdAt'>) => {
    try {
      if (mode === 'neon') {
        const r = await fetch('/api/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ demande: d }),
        })
        if (!r.ok) throw new Error('api')
      } else {
        setDemandes((p) => [{ ...d, id: crypto.randomUUID(), statut: 'nouvelle', createdAt: new Date().toISOString() }, ...p])
      }
      return true
    } catch {
      // repli local si l'API est indisponible : la demande n'est jamais perdue
      setDemandes((p) => [{ ...d, id: crypto.randomUUID(), statut: 'nouvelle', createdAt: new Date().toISOString() }, ...p])
      return true
    }
  }

  const updateDemande = (id: string, patch: Partial<Demande>) =>
    mutate(
      () => api('/api/admin', { method: 'PATCH', body: JSON.stringify({ type: 'demande', id, patch }) }),
      () => setDemandes((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    )

  const deleteDemande = (id: string) =>
    mutate(
      () => api('/api/admin', { method: 'DELETE', body: JSON.stringify({ type: 'demande', id }) }),
      () => setDemandes((p) => p.filter((x) => x.id !== id)),
    )

  const saveSettings = (s: Settings) =>
    mutate(
      () => api('/api/admin', { method: 'POST', body: JSON.stringify({ type: 'settings', data: s }) }),
      () => setSettings(s),
    )

  return (
    <C.Provider
      value={{
        mode,
        services,
        projets,
        demandes,
        settings,
        token,
        login,
        logout,
        refreshAdmin,
        refreshPublic,
        saveService,
        deleteService,
        saveProjet,
        deleteProjet,
        addDemande,
        updateDemande,
        deleteDemande,
        saveSettings,
      }}
    >
      {children}
    </C.Provider>
  )
}

export function useStore() {
  const c = useContext(C)
  if (!c) throw new Error('store')
  return c
}

export const waLink = (settings: Settings, msg = 'Bonjour BAING CONSTRUCTION INC, je souhaite un devis.') =>
  `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`
export const telLink = (settings: Settings) => `tel:+${settings.whatsapp}`
