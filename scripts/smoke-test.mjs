// Test de rendu SSR (non embarqué dans le site) : vérifie que chaque route
// principale se rend sans erreur et contient les contenus attendus.
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import React from 'react'

// Minimal browser stubs used by the store during render.
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}
globalThis.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
const { StoreProvider } = await vite.ssrLoadModule('/src/lib/store.tsx')

const checks = [
  ['/', ['Construire durablement', 'Notre équipe', 'Kouadio Yao Konan', 'Espace administration']],
  ['/notre-equipe', ['Notre équipe', 'Aminata Bamba', 'Grâce Amani', 'Christelle Kouassi', 'BAING CONSTRUCTION']],
  ['/services', ['Nos services', 'Prestations complémentaires proposées', 'Inspiré des standards']],
  ['/devis?prestation=renovation-rehabilitation', ['Demande de devis', 'Envoyer ma demande']],
  ['/a-propos', ['À propos de BAING CONSTRUCTION INC']],
  ['/realisations', ['Nos réalisations']],
  ['/contact', ['Contactez-nous']],
  ['/admin/login', ['Espace administration', 'Se connecter']],
  ['/mentions-legales', ['Mentions légales']],
  ['/confidentialite', ['Politique de confidentialité']],
  ['/page-inexistante', ['404', 'Page introuvable']],
]

let failures = 0
for (const [path, expected] of checks) {
  try {
    const html = renderToString(
      React.createElement(
        StoreProvider,
        null,
        React.createElement(StaticRouter, { location: path }, React.createElement(App)),
      ),
    )
    const missing = expected.filter((s) => !html.includes(s))
    if (missing.length) {
      failures++
      console.log(`✗ ${path} — contenu absent : ${missing.join(' | ')}`)
    } else {
      console.log(`✓ ${path} (${html.length} octets HTML)`)
    }
  } catch (e) {
    failures++
    console.log(`✗ ${path} — ERREUR : ${e?.message || e}`)
  }
}

await vite.close()
process.exit(failures ? 1 : 0)
