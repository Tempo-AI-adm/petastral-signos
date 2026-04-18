'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

const RACAS_CAES = [
  'SRD / Vira-lata','Basset Hound','Beagle','Bichon Frisé','Blue Heeler','Border Collie',
  'Boxer','Bulldog Francês','Bulldog Inglês','Chihuahua','Cocker Spaniel','Corgi','Dachshund / Salsicha',
  'Dálmata','Dobermann','Golden Retriever','Galgo','Husky Siberiano','Jack Russell Terrier',
  'Labrador','Lhasa Apso','Maltês','Pastor Alemão','Pinscher','Pitbull','Poodle',
  'Pug','Rottweiler','Shih Tzu','Spitz Alemão / Lulu','Yorkshire',
]
const RACAS_GATOS = [
  'SRD / Vira-lata','Angorá','Bengal','Maine Coon','Persa','Ragdoll','Siamês','Sphynx',
]
const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]

const ANOS_PET = Array.from({length: 25}, (_, i) => new Date().getFullYear() - i)
const ANOS_TUTOR = Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i)

function calcularSigno(dia: number, mes: number): string {
  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'Áries'
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'Touro'
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'Gêmeos'
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'Câncer'
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'Leão'
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'Virgem'
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'Libra'
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'Escorpião'
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'Sagitário'
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'Capricórnio'
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'Aquário'
  return 'Peixes'
}

const RACAS_PELO_LONGO = new Set([
  'Golden Retriever','Border Collie','Cocker Spaniel','Shih Tzu',
  'Maltês','Yorkshire','Spitz Alemão / Lulu',
  'Maine Coon','Ragdoll','Persa',
])

const CORES = [
  { value: 'preto',    label: 'Preto',    bg: '#1a1a1a' },
  { value: 'marrom',   label: 'Marrom',   bg: '#6b3a2a' },
  { value: 'caramelo', label: 'Caramelo', bg: '#d4956a' },
  { value: 'branco',   label: 'Branco',   bg: '#f0ece4', border: true },
  { value: 'creme',    label: 'Creme',    bg: '#f5e6c8', border: true },
  { value: 'cinza',    label: 'Cinza',    bg: '#8a8a8a' },
]


function DogSilhouette({ height, color }: { height: number; color: string }) {
  const width = Math.round(height * 100 / 75)
  return (
    <svg height={height} width={width} viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M16 40 C8 30 4 14 16 6 C20 3 24 6 21 12 C17 22 20 36 25 40Z" fill={color}/>
      <ellipse cx="43" cy="44" rx="26" ry="14" fill={color}/>
      <ellipse cx="67" cy="37" rx="10" ry="8" fill={color}/>
      <circle cx="71" cy="26" r="13" fill={color}/>
      <ellipse cx="79" cy="15" rx="6" ry="10" transform="rotate(20 79 15)" fill={color}/>
      <ellipse cx="82" cy="32" rx="8" ry="6" fill={color}/>
      <rect x="60" y="54" width="7" height="21" rx="3" fill={color}/>
      <rect x="69" y="54" width="7" height="21" rx="3" fill={color}/>
      <rect x="23" y="54" width="7" height="21" rx="3" fill={color}/>
      <rect x="32" y="54" width="7" height="21" rx="3" fill={color}/>
    </svg>
  )
}

function CatSilhouette({ height, color }: { height: number; color: string }) {
  const width = Math.round(height * 100 / 75)
  return (
    <svg height={height} width={width} viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <path d="M14 42 C4 34 0 16 12 6 C16 2 20 5 18 11 C14 24 17 38 22 42Z" fill={color}/>
      <ellipse cx="42" cy="44" rx="25" ry="14" fill={color}/>
      <ellipse cx="64" cy="37" rx="9" ry="7" fill={color}/>
      <circle cx="68" cy="26" r="13" fill={color}/>
      <polygon points="58,18 52,4 64,13" fill={color}/>
      <polygon points="70,16 76,2 82,14" fill={color}/>
      <ellipse cx="79" cy="32" rx="7" ry="5" fill={color}/>
      <rect x="58" y="54" width="7" height="21" rx="3" fill={color}/>
      <rect x="67" y="54" width="7" height="21" rx="3" fill={color}/>
      <rect x="23" y="54" width="7" height="21" rx="3" fill={color}/>
      <rect x="32" y="54" width="7" height="21" rx="3" fill={color}/>
    </svg>
  )
}

// ── Avatar helpers (used for prefetch during loading) ─────────────────────────

function getSRDAvatar(tipo: string, porte: string, corArr: string[], pelo: string): string {
  if (tipo === 'cat') {
    const longo = pelo === 'longo'
    if (longo) {
      if (corArr.includes('preto') && corArr.includes('marrom') && corArr.includes('branco')) return 'gato-srd-longo-mesclado-escuro'
      if (corArr.includes('preto'))  return 'gato-srd-longo-preto'
      if (corArr.includes('cinza'))  return 'gato-srd-longo-cinza'
      if (corArr.includes('branco')) return 'gato-srd-longo-branco'
      if (corArr.includes('laranja') || corArr.includes('caramelo')) return 'persa-laranja'
      return 'gato-srd-longo-mesclado'
    }
    const temPreto = corArr.includes('preto'), temMarrom = corArr.includes('marrom')
    const temBranco = corArr.includes('branco'), temCaramelo = corArr.includes('caramelo')
    const temCreme = corArr.includes('creme'), temCinza = corArr.includes('cinza')
    const temLaranja = corArr.includes('laranja')
    if (temPreto && temMarrom && temBranco)    return 'gato-srd-curto-mesclado-escuro'
    if (temPreto && temCaramelo && temBranco)  return 'gato-srd-tigrado-marrom-branco'
    if (temPreto && temCaramelo && temCreme)   return 'gato-srd-tigrado-marrom-branco'
    if (temBranco && temMarrom && temCaramelo) return 'gato-srd-tigrado-marrom-branco'
    if (temBranco && temMarrom && temCreme)    return 'gato-srd-tigrado-marrom-branco'
    if (temPreto && temMarrom) return 'gato-srd-tartaruga'
    if (temPreto && temCreme)  return 'gato-srd-tartaruga'
    if (temBranco && temCinza) return 'gato-srd-curto-cinza-branco'
    if (temPreto && temBranco) return 'gato-srd-preto-branco'
    if (temPreto && temCinza && temBranco) return 'gato-srd-tigrado-cinza'
    if (temCreme && temMarrom) return 'gato-srd-tigrado-marrom'
    if (temMarrom)   return 'gato-srd-tigrado-marrom'
    if (temLaranja)  return 'gato-srd-laranja'
    if (temCaramelo) return 'gato-srd-caramelo'
    if (temCinza)    return 'gato-srd-cinza'
    if (temPreto)    return 'gato-srd-preto'
    if (temBranco)   return 'gato-srd-branco'
    if (temCreme)    return 'gato-srd-creme'
    return 'gato-srd-tigrado-cinza'
  }
  // Novo sistema — tenta cao-srd-[pelo]-[cor] primeiro
  const cor1 = corArr[0] || ''
  const cor2 = corArr[1] || ''
  const peloKey = pelo === 'longo' ? 'longo' : 'curto'
  const novosArquivos = [
    'cao-srd-curto-preto',
    'cao-srd-curto-branco',
    'cao-srd-curto-caramelo',
    'cao-srd-curto-marrom',
    'cao-srd-curto-cinza',
    'cao-srd-curto-preto-branco',
    'cao-srd-curto-caramelo-branco',
    'cao-srd-curto-preto-marrom',
    'cao-srd-longo-preto',
    'cao-srd-longo-branco',
    'cao-srd-longo-caramelo',
    'cao-srd-longo-marrom',
    'cao-srd-longo-preto-branco',
    'cao-srd-branco',
  ]
  if (cor1 && cor2) {
    const tentativa = `cao-srd-${peloKey}-${cor1}-${cor2}`
    if (novosArquivos.includes(tentativa)) return tentativa
    const tentativa2 = `cao-srd-${peloKey}-${cor1}`
    if (novosArquivos.includes(tentativa2)) return tentativa2
  } else if (cor1) {
    const tentativa = `cao-srd-${peloKey}-${cor1}`
    if (novosArquivos.includes(tentativa)) return tentativa
  }

  // Sistema antigo (fallback)
  if (porte === 'medio') {
    if (corArr.includes('branco') && corArr.includes('preto'))    return 'srd-medio-branco-preto'
    if (corArr.includes('branco') && corArr.includes('marrom'))   return 'srd-medio-branco-marrom'
    if (corArr.includes('branco') && corArr.includes('caramelo')) return 'srd-medio-caramelo-branco'
    if (corArr.includes('preto')  && corArr.includes('marrom'))   return 'srd-medio-preto-marrom'
  }
  const dark = corArr.some(c => ['preto', 'marrom'].includes(c))
  const shade = corArr.length > 1 ? 'mesclado' : corArr.includes('creme') ? 'creme' : 'claro'
  const prefix = porte === 'pequeno'
    ? (pelo === 'longo' ? 'cao-pequeno-longo' : 'cao-pequeno-curto')
    : porte === 'grande' ? 'srd-grande' : 'srd-medio'
  return `${prefix}-${shade}`
}

function getAvatar(tipo: string, porte: string, cor: string | string[], raca: string, pelo = '', racaPredominante = ''): string {
  const corArr = Array.isArray(cor) ? cor : (cor ? [cor] : [])
  const has = (c: string) => corArr.includes(c)
  if (raca === 'SRD / Vira-lata' && racaPredominante) {
    const cor1 = corArr[0] || ''
    const cor2 = corArr[1] || ''
    if (cor1 && cor2) return `srd-${racaPredominante}-${cor1}-${cor2}`
    if (cor1) return `srd-${racaPredominante}-${cor1}`
    return `srd-${racaPredominante}`
  }
  if (raca === 'Labrador') { if (has('preto')) return 'labrador-preto'; if (has('marrom')) return 'labrador-chocolate'; if (has('creme') || has('branco')) return 'labrador-claro'; return 'labrador-amarelo' }
  if (raca === 'Pinscher') { if (has('preto') && (has('caramelo') || has('marrom'))) return 'pinscher-preto-fogo'; if (has('preto') || has('cinza') || has('marrom')) return 'pinscher-preto'; return 'pinscher-caramelo' }
  if (raca === 'Poodle') { if (has('preto')) return 'poodle-preto'; if (has('marrom')) return 'poodle-marrom'; if (has('cinza')) return 'poodle-cinza'; if (has('caramelo')) return 'poodle-caramelo'; return 'poodle-branco' }
  if (raca === 'Bulldog Francês') { if (has('preto')) return 'bulldog-frances-preto'; if (has('cinza')) return 'bulldog-frances-cinza'; if (has('branco') && !has('caramelo') && !has('marrom')) return 'bulldog-frances-branco'; return 'bulldog-frances-caramelo' }
  if (raca === 'Chihuahua') { if (has('preto')) return 'chihuahua-preto'; if (has('branco')) return 'chihuahua-branco'; if (has('marrom') || has('cinza')) return 'chihuahua-marrom'; return 'chihuahua-creme' }
  if (raca === 'Cocker Spaniel') { if (has('preto')) return 'cocker-preto'; if (has('marrom')) return 'cocker-marrom'; return 'cocker-caramelo' }
  if (raca === 'Dachshund / Salsicha') { if (has('preto')) return 'dachshund-preto-fogo'; if (has('marrom')) return 'dachshund-marrom'; return 'dachshund-caramelo' }
  if (raca === 'Galgo') { if (has('preto')) return 'galgo-preto'; if (has('branco') || has('creme')) return 'galgo-branco'; if (has('cinza')) return 'galgo-cinza'; return 'galgo-caramelo' }
  if (raca === 'Husky Siberiano') { return (has('caramelo') || has('marrom')) ? 'husky-vermelho-branco' : 'husky-preto-branco' }
  if (raca === 'Pug') { if (has('preto')) return 'pug-preto'; if (has('creme') || has('branco')) return 'pug-creme'; return 'pug-caramelo' }
  if (raca === 'Spitz Alemão / Lulu') { if (has('preto')) return 'spitz-preto'; if (has('cinza')) return 'spitz-cinza'; if (has('branco') || has('creme')) return 'spitz-branco'; return 'spitz-laranja' }
  if (raca === 'Persa') { if (has('preto')) return 'persa-preto'; if (has('laranja') || has('caramelo') || has('marrom')) return 'persa-laranja'; if (has('cinza')) return 'persa-cinza'; return 'persa-branco' }
  if (raca === 'Pitbull') { if (has('cinza')) return 'pitbull-cinza'; if (has('preto')) return 'pitbull-preto'; if (has('marrom')) return 'pitbull-marrom'; if (has('branco') || has('creme')) return 'pitbull-branco'; return 'pitbull-caramelo' }
  if (raca === 'Sphynx') { if (has('preto')) return 'sphynx-preto'; if (has('cinza')) return 'sphynx-cinza'; if (has('caramelo') || has('marrom')) return 'sphynx-rosa'; return 'sphynx-branco' }
  if (raca === 'Lhasa Apso') { return (has('branco') && corArr.length === 1) ? 'lhasa-apso-branco' : 'lhasa-apso' }
  if (raca === 'Jack Russell Terrier') return 'jack-russell'
  if (raca === 'Boxer')        return 'boxer'
  if (raca === 'Bichon Frisé') return 'bichon-frise'
  if (raca === 'Dobermann')    return 'dobermann'
  const racaMap: Record<string, string> = {
    'Golden Retriever':'golden-retriever','Pastor Alemão':'pastor-alemao','Rottweiler':'rottweiler',
    'Dálmata':'dalmata','Beagle':'beagle','Border Collie':'border-collie','Corgi':'corgi',
    'Shih Tzu':'shih-tzu','Yorkshire':'yorkshire','Maltês':'maltes','Basset Hound':'bassethound-mesclado',
    'Blue Heeler':'blueheeler','Siamês':'siames','Maine Coon':'maine-coon',
    'Ragdoll':'ragdoll','Angorá':'angora-branco','Bengal':'bengal-tigrado',
  }
  if (racaMap[raca]) return racaMap[raca]
  return getSRDAvatar(tipo, porte, corArr, pelo)
}

// ─────────────────────────────────────────────────────────────────────────────

function LoadingScreen({ nome }: { nome: string }) {
  const frases = [
    'Calculando a lua...',
    'Conferindo o bafo do pet...',
    'Averiguando nível de preguiça...',
    'Consultando os astros...',
    'Medindo intensidade do olhar julgador...',
    'Calculando compatibilidade...',
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % frases.length), 900)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#f0ebe0', padding: 24, textAlign: 'center'
    }}>
      <img src="/logo.png" alt="SignoPet" width={64} height={64} style={{marginBottom: 24, opacity: 0.9}} />
      <div style={{fontSize: 13, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16}}>
        Calculando o mapa de {nome || 'seu pet'}
      </div>
      <div style={{fontSize: 18, fontWeight: 600, color: '#4b3f6b', minHeight: 32, transition: 'all 0.3s'}}>
        {frases[idx]}
      </div>
      <div style={{marginTop: 32, display: 'flex', gap: 6}}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i === idx % 3 ? '#a855f7' : '#e9d5ff',
            transition: 'background 0.3s'
          }}/>
        ))}
      </div>
    </div>
  )
}

function CadastroInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [passo, setPasso] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tipo: '', nome: '', raca: '', porte: '', pelo: '',
    cor: [] as string[], sexo: '', mes: '', ano: '', dia: '',
    signoTutor: '', vibe: 'cumplicidade',
    email: '', diaTutor: '', mesTutor: '', anoTutor: '',
    racaPredominante: '',
    utmSource: '', utmMedium: '', utmCampaign: '', referrer: '',
  })
  const [loadingScreen, setLoadingScreen] = useState(false)

  const labelAnimal = form.tipo === 'dog' ? 'cachorro' : form.tipo === 'cat' ? 'gato' : 'pet'

  const set = (campo: string, valor: any) =>
    setForm(f => ({ ...f, [campo]: valor }))

  useEffect(() => {
    const tipo = searchParams.get('tipo')
    if (tipo === 'cachorro') set('tipo', 'dog')
    if (tipo === 'gato')     set('tipo', 'cat')
  }, [])

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    set('utmSource', p.get('utm_source') || '')
    set('utmMedium', p.get('utm_medium') || '')
    set('utmCampaign', p.get('utm_campaign') || '')
    set('referrer', document.referrer || '')
  }, [])

  // Auto-set pelo based on raca (only for non-SRD breeds)
  useEffect(() => {
    if (form.raca && form.raca !== 'SRD / Vira-lata') {
      set('pelo', RACAS_PELO_LONGO.has(form.raca) ? 'longo' : 'curto')
    }
  }, [form.raca])


  const toggleCor = (v: string) => {
    const atual = form.cor
    if (atual.includes(v)) set('cor', atual.filter(x => x !== v))
    else set('cor', [...atual, v])
  }

  // Auto-calculate tutor sign when date fields change
  useEffect(() => {
    if (form.mesTutor && form.anoTutor) {
      const dia = form.diaTutor ? parseInt(form.diaTutor) : 15
      const mes = parseInt(form.mesTutor)
      set('signoTutor', calcularSigno(dia, mes))
    } else {
      set('signoTutor', '')
    }
  }, [form.diaTutor, form.mesTutor, form.anoTutor])

  const passo1Valido = form.tipo && form.nome && form.raca && form.cor.length > 0
  const passo2Valido = form.mes && form.ano && form.sexo
  const passo3Valido = form.mesTutor && form.anoTutor && form.diaTutor && form.signoTutor && form.email

  const enviar = async () => {
    // Prefetch do avatar para que a imagem já esteja no cache quando o card abrir
    const avatarKey = getAvatar(form.tipo, form.porte, form.cor, form.raca, form.pelo, form.racaPredominante)
    const preImg = new window.Image()
    preImg.src = `/avatars/${avatarKey}.png`

    setLoadingScreen(true)
    setLoading(true)
    try {
      const inicio = Date.now()
      const res = await fetch('/api/compat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      sessionStorage.setItem(`result_${data.id}`, JSON.stringify(data))
      const elapsed = Date.now() - inicio
      const restante = Math.max(0, 5000 - elapsed)
      if (restante > 0) await new Promise(r => setTimeout(r, restante))
      router.push(`/resultado?id=${data.id}`)
    } catch (e) {
      setLoadingScreen(false)
      alert('Erro ao calcular. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-base focus:outline-none focus:border-purple-400 bg-white"
  const selectClass = inputClass
  const btnPrimary = "w-full py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90 disabled:opacity-40"

  const Silhouette = (form.tipo === 'cat' ? CatSilhouette : DogSilhouette) as (props: { height: number; color: string }) => JSX.Element

  useEffect(() => {
    if (loadingScreen && (!form.nome || !form.tipo)) {
      router.replace('/cadastro')
    }
  }, [loadingScreen, form.nome, form.tipo])

  if (loadingScreen) return <LoadingScreen nome={form.nome} />

  return (
    <main className="min-h-screen bg-white">
      {/* ── Planet section ── */}
      <div style={{ width: "100%", overflow: "hidden", textAlign: "center", marginBottom: "-2px", opacity: 0.65, pointerEvents: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/topo-planeta-signopet.png" alt="" style={{ width: "min(420px,90%)", display: "inline-block" }} />
      </div>
      <div className="max-w-md mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <Image src="/logo.png" alt="SignoPet" width={48} height={48} />
          <div className="flex gap-2">
            {[1,2,3].map(n => (
              <div key={n} className={`h-2 rounded-full transition-all ${passo >= n ? 'w-8' : 'w-2'}`}
                style={{background: passo >= n ? 'linear-gradient(135deg,#a855f7,#ec4899)' : '#e5e7eb'}} />
            ))}
          </div>
        </div>

        {passo === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Seu pet</h1>
            <p className="text-gray-400 text-sm mb-6">Vamos conhecer o protagonista</p>

            {!form.tipo && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[{v:'dog', e:'🐶', l:'Cachorro'},{v:'cat', e:'🐱', l:'Gato'}].map(({v,e,l}) => (
                  <button key={v} onClick={() => { set('tipo', v); set('raca', ''); set('pelo', ''); set('cor', []) }}
                    className={`py-4 rounded-2xl border-2 text-center transition-all ${form.tipo === v ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                    <div className="text-3xl mb-1">{e}</div>
                    <div className="font-semibold text-gray-800">{l}</div>
                  </button>
                ))}
              </div>
            )}

            {form.tipo && <>
              <input placeholder={`Nome do ${labelAnimal}`} value={form.nome}
                onChange={e => set('nome', e.target.value)}
                className={inputClass + ' mb-3'} />

              <select value={form.raca} onChange={e => set('raca', e.target.value)}
                className={selectClass + ' mb-3'}>
                <option value="">Raça</option>
                {(form.tipo === 'dog' ? RACAS_CAES : RACAS_GATOS).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {form.raca === 'SRD / Vira-lata' && form.tipo === 'dog' && (
                <select
                  value={form.racaPredominante}
                  onChange={e => set('racaPredominante', e.target.value)}
                  className={selectClass + ' mb-3'}
                >
                  <option value="">Tem alguma raça predominante? (opcional)</option>
                  <option value="pitbull">Pitbull</option>
                  <option value="bulldog-frances">Bulldog Francês</option>
                  <option value="bulldog-ingles">Bulldog Inglês</option>
                  <option value="pastor">Pastor Alemão</option>
                  <option value="labrador">Labrador</option>
                  <option value="golden">Golden Retriever</option>
                  <option value="rottweiler">Rottweiler</option>
                  <option value="husky">Husky</option>
                  <option value="poodle">Poodle</option>
                  <option value="salsicha">Dachshund / Salsicha</option>
                  <option value="spitz">Spitz</option>
                  <option value="border-collie">Border Collie</option>
                  <option value="beagle">Beagle</option>
                  <option value="boxer">Boxer</option>
                  <option value="dobermann">Dobermann</option>
                  <option value="shih-tzu">Shih Tzu</option>
                  <option value="yorkshire">Yorkshire</option>
                  <option value="pinscher">Pinscher</option>
                  <option value="cocker">Cocker Spaniel</option>
                  <option value="basset">Basset Hound</option>
                  <option value="galgo">Galgo</option>
                  <option value="jack-russell">Jack Russell</option>
                  <option value="corgi">Corgi</option>
                  <option value="blue-heeler">Blue Heeler</option>
                  <option value="akita">Akita</option>
                </select>
              )}

              {/* COR — color dot picker */}
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">Selecione todas as cores do pelo</p>
                <div className="flex flex-wrap gap-3">
                  {CORES.map(({ value, label, bg, border }) => {
                    const selected = form.cor.includes(value)
                    const dotStyle: React.CSSProperties = {
                      background: bg,
                      border: border ? '1px solid #d1d5db' : undefined,
                      boxShadow: selected ? '0 0 0 3px white, 0 0 0 5px #a855f7' : undefined,
                    }
                    return (
                      <button key={value} onClick={() => toggleCor(value)}
                        className="flex flex-col items-center gap-1">
                        <div style={{ width: 36, height: 36, borderRadius: '50%', ...dotStyle }} />
                        <span style={{ fontSize: 8, color: '#9ca3af', whiteSpace: 'nowrap' }}>{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* PELO — only show for SRD */}
              {form.raca === 'SRD / Vira-lata' && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-2">Pelo</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[['curto','Curto'],['longo','Longo']].map(([v,l]) => (
                      <button key={v} onClick={() => set('pelo', v)}
                        className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.pelo === v ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </>}

            <button disabled={!passo1Valido} onClick={() => setPasso(2)}
              className={btnPrimary} style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}>
              Continuar →
            </button>
          </div>
        )}

        {passo === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Nascimento</h1>
            <p className="text-gray-400 text-sm mb-6">Quando {form.nome} veio ao mundo?</p>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Sexo</p>
              <div className="grid grid-cols-2 gap-2">
                {[['macho','♂️','Macho'],['femea','♀️','Fêmea']].map(([v,e,l]) => (
                  <button key={v} onClick={() => set('sexo', v)}
                    className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.sexo === v ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}>
                    {e} {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <select value={form.mes} onChange={e => set('mes', e.target.value)} className={selectClass}>
                <option value="">Mês</option>
                {MESES.map((m,i) => <option key={m} value={String(i+1)}>{m}</option>)}
              </select>
              <select value={form.ano} onChange={e => set('ano', e.target.value)} className={selectClass}>
                <option value="">Ano</option>
                {ANOS_PET.map(a => <option key={a} value={String(a)}>{a}</option>)}
              </select>
            </div>

            <select value={form.dia} onChange={e => set('dia', e.target.value)} className={selectClass + ' mb-6'} style={{color: form.dia ? '#111827' : '#9ca3af'}}>
              <option value="">Dia (opcional)</option>
              {Array.from({length:31},(_,i) => <option key={i+1} value={String(i+1)}>{i+1}</option>)}
            </select>

            <button disabled={!passo2Valido} onClick={() => setPasso(3)}
              className={btnPrimary} style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}>
              Continuar →
            </button>
            <button onClick={() => setPasso(1)} className="w-full py-3 text-gray-400 text-sm mt-2">
              ← Voltar
            </button>
          </div>
        )}

        {passo === 3 && (
          <div>
            <div style={{textAlign:'center', marginBottom:24}}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'linear-gradient(135deg,#a855f7,#ec4899)',
                borderRadius:999, padding:'6px 18px', marginBottom:12,
              }}>
                <span style={{fontSize:16}}>👤</span>
                <span style={{fontSize:12, fontWeight:700, color:'white', letterSpacing:'0.1em', textTransform:'uppercase'}}>
                  Agora é sobre você
                </span>
              </div>
              <div style={{fontSize:22, fontWeight:800, color:'#1a1a2e', lineHeight:1.3}}>
                Sua data de nascimento
              </div>
              <div style={{fontSize:13, color:'#6b7280', marginTop:6}}>
                Para calcular a compatibilidade com {form.nome || 'seu pet'}
              </div>
            </div>

            {/* TUTOR BIRTH DATE */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Sua data de nascimento</p>
              <div className="grid grid-cols-3 gap-2">
                <select value={form.diaTutor} onChange={e => set('diaTutor', e.target.value)} className={selectClass}>
                  <option value="">Dia</option>
                  {Array.from({length:31},(_,i) => <option key={i+1} value={String(i+1)}>{i+1}</option>)}
                </select>
                <select value={form.mesTutor} onChange={e => set('mesTutor', e.target.value)} className={selectClass}>
                  <option value="">Mês</option>
                  {MESES.map((m,i) => <option key={m} value={String(i+1)}>{m}</option>)}
                </select>
                <select value={form.anoTutor} onChange={e => set('anoTutor', e.target.value)} className={selectClass}>
                  <option value="">Ano</option>
                  {ANOS_TUTOR.map(a => <option key={a} value={String(a)}>{a}</option>)}
                </select>
              </div>
              {form.mesTutor && form.anoTutor && !form.diaTutor && (
                <p style={{fontSize:11, color:'#9ca3af', fontStyle:'italic', marginTop:6}}>
                  💡 Sem o dia, calculamos com uma margem de aproximação
                </p>
              )}
              {form.signoTutor && (
                <p className="text-purple-600 font-semibold text-sm mt-3">✦ Você é de {form.signoTutor}</p>
              )}
            </div>

            <input type="email" placeholder="Seu email" value={form.email}
              onChange={e => set('email', e.target.value)}
              className={inputClass + ' mb-6'} />

            <button disabled={!passo3Valido || loading} onClick={enviar}
              className={btnPrimary} style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}>
              {loading ? 'Calculando... ✨' : 'Ver compatibilidade 🔮'}
            </button>
            <button onClick={() => setPasso(2)} className="w-full py-3 text-gray-400 text-sm mt-2">
              ← Voltar
            </button>
          </div>
        )}

      </div>
    </main>
  )
}

export default function Cadastro() {
  return <Suspense><CadastroInner /></Suspense>
}
