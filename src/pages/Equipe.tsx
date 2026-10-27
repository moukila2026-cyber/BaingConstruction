import {Link} from 'react-router-dom'
import {ArrowRight, MessageCircle, ShieldCheck, Users, Wrench} from 'lucide-react'
import {PageHero, SectionTitle} from './Public'
import {useStore, waLink} from '../lib/store'
import {EQUIPE} from '../data/equipe'

const VALEURS = [
  {icone: ShieldCheck, titre: 'Sécurité d’abord', texte: 'Chaque chantier applique les mêmes règles : équipements de protection, zones balisées et contrôle quotidien des risques.'},
  {icone: Wrench, titre: 'Travail bien fait', texte: 'Des métrés à la livraison, nos équipes tiennent les engagements pris dans le devis : périmètre, coût et délai.'},
  {icone: Users, titre: 'Un interlocuteur identifié', texte: 'Vous savez toujours qui appelle, qui décide et qui répond — du bureau d’études au chef de chantier.'},
]

export default function Equipe() {
  const {settings} = useStore()
  return <>
    <PageHero
      titre="Notre équipe"
      texte="Des femmes et des hommes du métier, basés à Daloa, qui conjuguent expérience du terrain, rigueur d’exécution et sens du service client."
      img="/images/afrique-equipe-chantier.jpg"
    />
    <section className="max-w-7xl mx-auto px-4 py-16">
      <SectionTitle
        kicker="Qui sommes-nous"
        titre="Une équipe complète, du bureau d’études au terrain"
        texte="BAING CONSTRUCTION INC réunit des profils complémentaires — direction, administration, conduite de travaux, électricité, encadrement de chantier et chiffrage — pour prendre en charge votre projet de bout en bout."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {EQUIPE.map((m) => (
          <article key={m.nom} className="card-hover bg-white rounded-3xl overflow-hidden border border-[#D8D9D5]">
            <div className="relative h-80 overflow-hidden bg-[#E9E7E0] img-zoom">
              <img src={m.photo} alt={`${m.nom} — ${m.role} chez BAING CONSTRUCTION INC`} loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#202321]/85 text-white text-[.65rem] font-bold tracking-[.12em] uppercase px-3 py-1.5 rounded-full backdrop-blur">BAING CONSTRUCTION</span>
            </div>
            <div className="p-6">
              <h2 className="font-black text-xl">{m.nom}</h2>
              <p className="text-[#96703E] font-bold text-sm mt-1">{m.role}</p>
              <p className="text-neutral-600 text-sm mt-3 leading-relaxed">{m.accroche}</p>
              <ul className="flex flex-wrap gap-2 mt-4">
                {m.expertises.map((x) => (
                  <li key={x} className="text-xs font-semibold bg-[#F7F6F2] border border-[#D8D9D5] rounded-full px-3 py-1.5 text-[#202321]">{x}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-white border-y border-[#D8D9D5]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SectionTitle kicker="Nos valeurs" titre="Ce qui guide nos équipes sur chaque chantier" />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {VALEURS.map(({icone: Icone, titre, texte}) => (
            <article key={titre} className="bg-[#F7F6F2] rounded-3xl p-7 border border-[#D8D9D5]">
              <span className="w-12 h-12 rounded-2xl bg-[#202321] text-[#B58A52] grid place-items-center"><Icone size={22} /></span>
              <h3 className="font-black text-lg mt-4">{titre}</h3>
              <p className="text-neutral-600 text-sm mt-2 leading-relaxed">{texte}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-[#B58A52] text-white rounded-[2rem] p-8 md:p-12 flex flex-wrap gap-6 justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">Un projet à confier à nos équipes ?</h2>
          <p className="mt-2">Parlez-nous de votre besoin : réponse rapide et devis détaillé, sans engagement.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/devis" className="bg-[#202321] px-6 py-4 rounded-full font-bold inline-flex items-center gap-2">Demander un devis <ArrowRight size={18} /></Link>
          <a href={waLink(settings)} target="_blank" rel="noreferrer" className="bg-white text-[#202321] px-6 py-4 rounded-full font-bold inline-flex gap-2 items-center"><MessageCircle size={18} /> WhatsApp</a>
        </div>
      </div>
    </section>
  </>
}
