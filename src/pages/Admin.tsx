import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Eye, EyeOff, ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'
import { fileToCompressedDataUrl, formatBytes } from '../lib/image'
import type { Projet, Service } from '../lib/types'

const STATUTS = [
  ['nouvelle', 'Nouvelle'],
  ['en-cours', 'En cours'],
  ['devis-envoye', 'Devis envoyé'],
  ['acceptee', 'Acceptée'],
  ['refusee', 'Refusée'],
  ['cloturee', 'Clôturée'],
] as const

export function AdminLogin() {
  const { login, mode } = useStore()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, pw)
    setLoading(false)
    if (ok) nav('/admin')
    else
      setErr(
        'Identifiants incorrects. En production, utilisez le compte créé avec le script create-admin. En démonstration locale : admin@demo.local / admin1234.',
      )
  }
  return (
    <section className="max-w-md mx-auto px-4 py-20">
      <form onSubmit={submit} className="bg-white rounded-[2rem] border border-[#D8D9D5] p-8 shadow-xl">
        <img src="/images/logo-baing.svg" alt="BAING CONSTRUCTION INC" className="h-16 w-auto mb-5" />
        <h1 className="text-3xl font-black">Espace administration</h1>
        <p className="text-sm text-neutral-500 mt-2">
          Accès réservé aux responsables autorisés.{' '}
          {mode === 'neon' ? 'Base Neon connectée.' : 'Mode démonstration locale (données dans ce navigateur uniquement).'}
        </p>
        <label className="block mt-6">
          E-mail
          <input type="email" className="admin-input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="block mt-4">
          Mot de passe
          <span className="relative block mt-1">
            <input
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              className="admin-input w-full pr-12"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              aria-pressed={showPw}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[#96703E] transition"
            >
              {showPw ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </span>
        </label>
        {err && <p className="bg-red-50 text-red-700 rounded-xl p-3 mt-4 text-sm">{err}</p>}
        <button disabled={loading} className="btn-bronze w-full py-3.5 rounded-full font-bold mt-6 disabled:opacity-60">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        <p className="text-xs text-neutral-500 mt-4">
          Aucun mot de passe de production n’est codé dans le site. Voir README : procédure de création du premier administrateur (Neon).
        </p>
      </form>
    </section>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, mode, token, refreshAdmin } = useStore()
  const nav = useNavigate()
  const [syncing, setSyncing] = useState(false)
  if (!token)
    return (
      <section className="max-w-xl mx-auto p-16 text-center">
        <h1 className="text-3xl font-black">Accès protégé</h1>
        <Link to="/admin/login" className="btn-bronze px-6 py-3 rounded-full font-bold inline-block mt-5">
          Aller à la connexion
        </Link>
      </section>
    )
  const doRefresh = async () => {
    setSyncing(true)
    await refreshAdmin()
    setSyncing(false)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-[240px_1fr] gap-8">
      <aside className="bg-[#202321] text-white rounded-3xl p-5 h-max lg:sticky lg:top-24">
        <img src="/images/logo-baing-light.svg" alt="BAING CONSTRUCTION INC" className="h-12 w-auto mb-3" />
        <p className="font-black">Administration</p>
        <p className="text-xs text-[#D8D9D5]">{mode === 'neon' ? 'Neon — production' : 'Démo locale — navigateur'}</p>
        <nav className="flex lg:flex-col gap-2 mt-5 flex-wrap">
          {[
            ['/admin', 'Tableau de bord'],
            ['/admin/projets', 'Réalisations'],
            ['/admin/services', 'Services'],
            ['/admin/demandes', 'Demandes de devis'],
            ['/admin/parametres', 'Paramètres'],
          ].map(([to, l]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-[#B58A52]' : 'hover:bg-white/10'}`}
            >
              {l}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={doRefresh}
          disabled={syncing}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold border border-white/25 rounded-lg px-3 py-2 hover:bg-white/10 disabled:opacity-60"
        >
          {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />} Actualiser les données
        </button>
        <button
          onClick={() => {
            logout()
            nav('/')
          }}
          className="mt-3 text-sm underline"
        >
          Se déconnecter
        </button>
        <Link to="/" className="block mt-2 text-sm underline">
          Voir le site public
        </Link>
      </aside>
      <div>{children}</div>
    </div>
  )
}

type Notice = { type: 'ok' | 'err'; text: string } | null

function NoticeBanner({ notice }: { notice: Notice }) {
  if (!notice) return null
  return (
    <p
      role="status"
      className={`rounded-xl p-3 mt-4 text-sm font-medium ${
        notice.type === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
      }`}
    >
      {notice.text}
    </p>
  )
}

// Téléversement d'une photo réelle : compression automatique dans le navigateur,
// aperçu instantané, et possibilité de coller une URL en alternative.
function ImageInput({ value, onChange, label = 'Photo réelle' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')

  const onFile = async (file?: File | null) => {
    if (!file) return
    setErr('')
    setBusy(true)
    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      onChange(dataUrl)
      setInfo(`Photo compressée et intégrée (${formatBits(dataUrl.length)}).`)
      if (fileRef.current) fileRef.current.value = ''
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur lors du traitement de l’image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="md:col-span-2">
      <span className="font-semibold text-sm">{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#202321] font-bold text-sm disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {busy ? 'Compression en cours…' : 'Téléverser une photo'}
        </button>
        {value.startsWith('data:') && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 underline"
          >
            <Trash2 size={14} /> Retirer la photo
          </button>
        )}
      </div>
      <input
        className="admin-input mt-3"
        value={value.startsWith('data:') ? '' : value}
        placeholder="Ou collez une URL d’image (https://…) — facultatif si vous téléversez une photo"
        onChange={(e) => onChange(e.target.value)}
      />
      {err && <p className="text-red-700 text-sm mt-2 font-medium">{err}</p>}
      {info && !err && <p className="text-green-800 text-sm mt-2 font-medium">{info}</p>}
      {value && (
        <img src={value} alt="Aperçu de la réalisation" className="mt-3 h-44 w-full object-cover rounded-xl border border-[#D8D9D5]" />
      )}
      <p className="text-xs text-neutral-500 mt-2">
        Formats acceptés : JPG, PNG, WebP — 10 Mo maximum. La photo est redimensionnée (1600 px) et compressée automatiquement avant
        enregistrement.
      </p>
    </div>
  )
}

function formatBits(chars: number) {
  return formatBytes(Math.round(chars * 0.75))
}

export function Dashboard() {
  const { demandes, services, projets } = useStore()
  const cards: [string, number][] = [
    ['Demandes reçues', demandes.length],
    ['En attente (nouvelles)', demandes.filter((d) => d.statut === 'nouvelle').length],
    ['Traitées / clôturées', demandes.filter((d) => ['acceptee', 'refusee', 'cloturee'].includes(d.statut)).length],
    ['Services publiés', services.filter((s) => s.publie).length],
    ['Projets publiés', projets.filter((p) => p.publie).length],
  ]
  return (
    <AdminLayout>
      <h1 className="text-3xl font-black">Tableau de bord</h1>
      <p className="text-neutral-500">Statistiques calculées à partir des données réelles enregistrées.</p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {cards.map(([l, v]) => (
          <div key={l} className="bg-white rounded-3xl border border-[#D8D9D5] p-6">
            <p className="text-4xl font-black text-[#B58A52]">{v}</p>
            <p className="font-semibold mt-1">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-6">
        <Link to="/admin/demandes" className="btn-dark px-5 py-3 rounded-full font-bold">
          Gérer les demandes
        </Link>
        <Link to="/admin/projets" className="btn-bronze px-5 py-3 rounded-full font-bold">
          Ajouter une réalisation
        </Link>
      </div>
    </AdminLayout>
  )
}

export function AdminProjets() {
  const { projets, saveProjet, deleteProjet } = useStore()
  const empty: Projet = {
    id: '',
    titre: '',
    categorie: 'construction',
    description: '',
    localisation: 'Daloa',
    statut: 'En cours',
    image: '',
    ordre: 99,
    publie: false,
    illustratif: false,
  }
  const [form, setForm] = useState<Projet | null>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const set = (k: string, v: unknown) => setForm((f) => (f ? { ...f, [k]: v } : f))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setNotice(null)
    try {
      await saveProjet(form)
      setForm(null)
      setNotice({ type: 'ok', text: 'Réalisation enregistrée et publiée sur le site.' })
    } catch {
      setNotice({ type: 'err', text: "L’enregistrement a échoué. Vérifiez votre connexion et réessayez." })
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (p: Projet) => {
    setNotice(null)
    try {
      await saveProjet({ ...p, publie: !p.publie })
      setNotice({ type: 'ok', text: p.publie ? 'Réalisation dépubliée.' : 'Réalisation publiée sur le site.' })
    } catch {
      setNotice({ type: 'err', text: 'Action impossible pour le moment. Réessayez.' })
    }
  }

  const remove = async (p: Projet) => {
    if (!window.confirm(`Supprimer définitivement « ${p.titre} » ? Cette action est irréversible.`)) return
    setNotice(null)
    try {
      await deleteProjet(p.id)
      if (form?.id === p.id) setForm(null)
      setNotice({ type: 'ok', text: 'Réalisation supprimée.' })
    } catch {
      setNotice({ type: 'err', text: 'La suppression a échoué. Réessayez.' })
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-black">Réalisations</h1>
        <button
          onClick={() => {
            setNotice(null)
            setForm({ ...empty, id: crypto.randomUUID() })
          }}
          className="btn-bronze px-5 py-2.5 rounded-full font-bold"
        >
          + Nouveau projet
        </button>
      </div>
      <NoticeBanner notice={notice} />

      {form && (
        <form onSubmit={submit} className="bg-white rounded-3xl border p-6 mt-6 grid md:grid-cols-2 gap-4">
          <label>
            Titre
            <input className="admin-input" value={form.titre} onChange={(e) => set('titre', e.target.value)} required />
          </label>
          <label>
            Catégorie
            <select className="admin-input" value={form.categorie} onChange={(e) => set('categorie', e.target.value)}>
              <option value="construction">Construction</option>
              <option value="renovation">Rénovation</option>
              <option value="travaux-publics">Travaux publics</option>
              <option value="electrique">Réseaux électriques</option>
            </select>
          </label>
          <label>
            Localisation
            <input className="admin-input" value={form.localisation} onChange={(e) => set('localisation', e.target.value)} />
          </label>
          <label>
            Statut
            <input className="admin-input" value={form.statut} onChange={(e) => set('statut', e.target.value)} />
          </label>
          <ImageInput value={form.image} onChange={(v) => set('image', v)} />
          <label>
            Ordre d’affichage
            <input type="number" className="admin-input" value={form.ordre} onChange={(e) => set('ordre', Number(e.target.value))} />
          </label>
          <label className="md:col-span-2">
            Description
            <textarea rows={4} className="admin-input" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </label>
          <label className="flex gap-2">
            <input type="checkbox" checked={form.publie} onChange={(e) => set('publie', e.target.checked)} /> Publié sur le site
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={form.illustratif}
              onChange={(e) => set('illustratif', e.target.checked)}
            />{' '}
            Marquer « Exemple de présentation » (à décocher pour une vraie réalisation)
          </label>
          <div className="flex gap-2 md:col-span-2 flex-wrap">
            <button disabled={saving} className="btn-bronze px-5 py-2.5 rounded-full font-bold disabled:opacity-60 inline-flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button type="button" onClick={() => setForm(null)} className="px-5 py-2.5 rounded-full border font-bold">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 mt-6">
        {[...projets].sort((a, b) => a.ordre - b.ordre).map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border p-4 flex flex-wrap gap-4 items-center">
            {p.image ? (
              <img src={p.image} alt="" className="w-20 h-14 object-cover rounded-lg" />
            ) : (
              <span className="w-20 h-14 rounded-lg bg-[#F7F6F2] grid place-items-center text-neutral-400">
                <ImagePlus size={18} />
              </span>
            )}
            <div className="flex-1 min-w-[200px]">
              <p className="font-bold">{p.titre || 'Projet sans titre'}</p>
              <p className="text-xs text-neutral-500">
                {p.categorie} · {p.publie ? 'Publié' : 'Brouillon'} {p.illustratif ? '· Exemple' : '· Réalisation réelle'}
                {p.image.startsWith('data:') ? ' · photo téléversée' : ''}
              </p>
            </div>
            <button onClick={() => { setNotice(null); setForm(p) }} className="font-bold underline text-sm">
              Modifier
            </button>
            <button onClick={() => togglePublish(p)} className="font-bold underline text-sm">
              {p.publie ? 'Dépublier' : 'Publier'}
            </button>
            <button onClick={() => remove(p)} className="font-bold text-red-600 underline text-sm">
              Supprimer
            </button>
          </div>
        ))}
        {projets.length === 0 && <p className="bg-white rounded-3xl p-8">Aucune réalisation pour le moment. Cliquez sur « Nouveau projet ».</p>}
      </div>
    </AdminLayout>
  )
}

export function AdminServices() {
  const { services, saveService, deleteService } = useStore()
  const [form, setForm] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const set = (k: string, v: unknown) => setForm((f) => (f ? { ...f, [k]: v } : f))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setNotice(null)
    try {
      await saveService(form)
      setForm(null)
      setNotice({ type: 'ok', text: 'Service enregistré et mis à jour sur le site.' })
    } catch {
      setNotice({ type: 'err', text: "L’enregistrement a échoué. Réessayez." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-black">Services</h1>
        <button
          onClick={() => {
            setNotice(null)
            setForm({
              id: crypto.randomUUID(),
              slug: 'nouveau-service',
              titre: '',
              description: '',
              perimetre: [],
              image: '',
              ordre: 99,
              publie: false,
              cta: 'Demander un devis',
            })
          }}
          className="btn-bronze px-5 py-2.5 rounded-full font-bold"
        >
          + Nouveau service
        </button>
      </div>
      <NoticeBanner notice={notice} />

      {form && (
        <form onSubmit={submit} className="bg-white rounded-3xl border p-6 mt-6 grid md:grid-cols-2 gap-4">
          <label>
            Titre
            <input className="admin-input" value={form.titre} onChange={(e) => set('titre', e.target.value)} required />
          </label>
          <label>
            Slug
            <input className="admin-input" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </label>
          <ImageInput value={form.image} onChange={(v) => set('image', v)} />
          <label>
            Ordre d’affichage
            <input type="number" className="admin-input" value={form.ordre} onChange={(e) => set('ordre', Number(e.target.value))} />
          </label>
          <label className="md:col-span-2">
            Description
            <textarea rows={4} className="admin-input" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </label>
          <label className="md:col-span-2">
            Périmètre (une ligne par élément)
            <textarea
              rows={4}
              className="admin-input"
              value={form.perimetre.join('\n')}
              onChange={(e) => set('perimetre', e.target.value.split('\n'))}
            />
          </label>
          <label>
            Texte du bouton
            <input className="admin-input" value={form.cta} onChange={(e) => set('cta', e.target.value)} />
          </label>
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={form.publie} onChange={(e) => set('publie', e.target.checked)} /> Publié
          </label>
          <div className="flex gap-2 md:col-span-2 flex-wrap">
            <button disabled={saving} className="btn-bronze px-5 py-2.5 rounded-full font-bold disabled:opacity-60 inline-flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button type="button" onClick={() => setForm(null)} className="px-5 py-2.5 rounded-full border font-bold">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 mt-6">
        {[...services].sort((a, b) => a.ordre - b.ordre).map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border p-4 flex flex-wrap gap-4 items-center">
            {s.image ? (
              <img src={s.image} alt="" className="w-20 h-14 object-cover rounded-lg" />
            ) : (
              <span className="w-20 h-14 rounded-lg bg-[#F7F6F2] grid place-items-center text-neutral-400">
                <ImagePlus size={18} />
              </span>
            )}
            <div className="flex-1 min-w-[200px]">
              <p className="font-bold">{s.titre}</p>
              <p className="text-xs text-neutral-500">
                {s.publie ? 'Publié' : 'Désactivé'} · ordre {s.ordre}
                {s.image.startsWith('data:') ? ' · photo téléversée' : ''}
              </p>
            </div>
            <button onClick={() => { setNotice(null); setForm(s) }} className="font-bold underline text-sm">
              Modifier
            </button>
            <button
              onClick={async () => {
                setNotice(null)
                try {
                  await saveService({ ...s, publie: !s.publie })
                  setNotice({ type: 'ok', text: s.publie ? 'Service désactivé.' : 'Service activé.' })
                } catch {
                  setNotice({ type: 'err', text: 'Action impossible pour le moment.' })
                }
              }}
              className="font-bold underline text-sm"
            >
              {s.publie ? 'Désactiver' : 'Publier'}
            </button>
            <button
              onClick={async () => {
                if (!window.confirm(`Supprimer le service « ${s.titre} » ?`)) return
                setNotice(null)
                try {
                  await deleteService(s.id)
                  setNotice({ type: 'ok', text: 'Service supprimé.' })
                } catch {
                  setNotice({ type: 'err', text: 'La suppression a échoué. Réessayez.' })
                }
              }}
              className="font-bold text-red-600 underline text-sm"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export function AdminDemandes() {
  const { demandes, updateDemande, deleteDemande } = useStore()
  const [filtre, setFiltre] = useState('toutes')
  const [q, setQ] = useState('')
  const list = useMemo(
    () =>
      demandes
        .filter((d) => (filtre === 'toutes' || d.statut === filtre) && (d.nom + d.telephone + d.prestation).toLowerCase().includes(q.toLowerCase())),
    [demandes, filtre, q],
  )
  const exporter = () => {
    const csv = [
      'nom;telephone;email;prestation;lieu;statut;date',
      ...list.map((d) => [d.nom, d.telephone, d.email || '', d.prestation, d.lieu, d.statut, d.createdAt].join(';')),
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'demandes-devis.csv'
    a.click()
  }
  return (
    <AdminLayout>
      <div className="flex flex-wrap gap-3 justify-between">
        <h1 className="text-3xl font-black">Demandes de devis</h1>
        <button onClick={exporter} className="btn-dark px-5 py-2.5 rounded-full font-bold">
          Exporter CSV
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mt-5">
        <select className="admin-input !w-auto" value={filtre} onChange={(e) => setFiltre(e.target.value)}>
          <option value="toutes">Tous les statuts</option>
          {STATUTS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <input
          className="admin-input !w-72"
          placeholder="Rechercher nom, téléphone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="space-y-4 mt-6">
        {list.length === 0 && <p className="bg-white rounded-3xl p-8">Aucune demande pour ce filtre.</p>}
        {list.map((d) => (
          <article key={d.id} className="bg-white rounded-3xl border p-6">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-black text-xl">
                  {d.nom} <span className="text-sm font-semibold text-neutral-500">— {d.prestation}</span>
                </h2>
                <p className="text-sm">
                  {d.telephone} {d.email ? '· ' + d.email : ''} {d.entreprise ? '· ' + d.entreprise : ''} · {d.lieu} ·{' '}
                  {new Date(d.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <select
                className="admin-input !w-auto"
                value={d.statut}
                onChange={(e) => updateDemande(d.id, { statut: e.target.value as typeof d.statut })}
              >
                {STATUTS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <p className="bg-[#F7F6F2] rounded-xl p-4 mt-4">{d.description}</p>
            <p className="text-sm mt-2">
              {d.budget ? 'Budget : ' + d.budget + ' · ' : ''}
              {d.delai ? 'Délai : ' + d.delai : ''}
            </p>
            <label className="block mt-4 text-sm font-bold">
              Note interne (jamais publique)
              <textarea
                rows={2}
                className="admin-input mt-1"
                defaultValue={d.noteInterne || ''}
                onBlur={(e) => updateDemande(d.id, { noteInterne: e.target.value })}
                placeholder="Note réservée à l’administration…"
              />
            </label>
            <div className="flex gap-3 mt-3">
              <a className="font-bold underline text-sm" href={`tel:${d.telephone}`}>
                Appeler
              </a>
              <button onClick={async () => updateDemande(d.id, { statut: 'cloturee' })} className="font-bold underline text-sm">
                Marquer traitée / clôturer
              </button>
              <button
                onClick={async () => {
                  if (confirm('Supprimer cette demande ?')) await deleteDemande(d.id)
                }}
                className="font-bold text-red-600 underline text-sm"
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminLayout>
  )
}

export function AdminSettings() {
  const { settings, saveSettings, mode } = useStore()
  const [f, setF] = useState(settings)
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }))
  return (
    <AdminLayout>
      <h1 className="text-3xl font-black">Paramètres du site</h1>
      <p className="text-sm text-neutral-500">
        Persistés {mode === 'neon' ? 'dans Neon' : 'localement (démonstration)'}. Cochez « coordonnées vérifiées » uniquement après
        confirmation du dirigeant.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await saveSettings(f)
          alert('Paramètres enregistrés.')
        }}
        className="bg-white rounded-3xl border p-6 mt-6 grid md:grid-cols-2 gap-4"
      >
        {(
          [
            ['telephone', 'Téléphone'],
            ['whatsapp', 'WhatsApp (format international, chiffres)'],
            ['adresse', 'Adresse'],
            ['email', 'E-mail (laisser vide si inconnu)'],
            ['horaires', 'Horaires'],
            ['zones', 'Zones d’intervention'],
            ['facebook', 'Facebook (URL, facultatif)'],
            ['instagram', 'Instagram (URL, facultatif)'],
            ['linkedin', 'LinkedIn (URL, facultatif)'],
            ['seoTitre', 'SEO — titre'],
            ['seoDescription', 'SEO — description'],
          ] as [keyof typeof f, string][]
        ).map(([k, l]) => (
          <label key={k}>
            {l}
            <input className="admin-input mt-1" value={f[k] as string} onChange={(e) => set(k, e.target.value)} />
          </label>
        ))}
        <label className="flex gap-2 md:col-span-2 font-semibold">
          <input type="checkbox" checked={f.coordonneesVerifiees} onChange={(e) => set('coordonneesVerifiees', e.target.checked)} /> Coordonnées
          vérifiées par l’entreprise (masque la bannière de démonstration)
        </label>
        <button className="btn-bronze px-6 py-3 rounded-full font-bold md:col-span-2">Enregistrer les paramètres</button>
      </form>
    </AdminLayout>
  )
}
