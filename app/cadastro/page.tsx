'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const RACAS_CAES = [
  'SRD / Vira-lata','Beagle','Border Collie','Bulldog Francês',
  'Chihuahua','Cocker Spaniel','Corgi','Dachshund / Salsicha',
  'Dálmata','Golden Retriever','Galgo','Husky Siberiano',
  'Labrador','Maltês','Pastor Alemão','Pinscher','Poodle',
  'Pug','Rottweiler','Shih Tzu','Spitz Alemão / Lulu','Yorkshire',
]
const RACAS_GATOS = [
  'SRD / Vira-lata','Maine Coon','Persa','Ragdoll','Siamês',
]
const SIGNOS = [
  'Áries','Touro','Gêmeos','Câncer','Leão','Virgem',
  'Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes',
]
const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]
const PALAVRAS = [
  'Intenso','Fofo','Selvagem','Sereno','Caótico','Misterioso',
  'Protetor','Livre','Dramático','Leal','Independente','Brincalhão',
  'Ansioso','Corajoso','Preguiçoso','Curioso',
]
const VIBES = [
  { id: 'energia', emoji: '🔥', label: 'Energia total', desc: 'sempre se agitando' },
  { id: 'sofa',    emoji: '🛋️', label: 'Parceiros de sofá', desc: 'tranquilos juntos' },
  { id: 'amorodeio', emoji: '😈', label: 'Amor e ódio', desc: 'ele te ignora mas te ama' },
  { id: 'cumplicidade', emoji: '🌙', label: 'Cumplicidade', desc: 'se entendem sem palavras' },
]

const ANOS = Array.from({length: 25}, (_, i) => new Date().getFullYear() - i)

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
  { value: 'cinza',    label: 'Cinza',    bg: '#8a8a8a' },
]

const COR_AUTOMATICA: Record<string, string[]> = {
  'Beagle':           ['branco', 'caramelo'],
  'Rottweiler':       ['preto', 'marrom'],
  'Dálmata':          ['preto', 'branco'],
  'Border Collie':    ['preto', 'branco'],
  'Husky Siberiano':  ['preto', 'branco'],
  'Pastor Alemão':    ['preto', 'marrom'],
  'Golden Retriever': ['caramelo'],
  'Yorkshire':        ['marrom', 'preto'],
  'Corgi':            ['caramelo', 'branco'],
  'Maltês':           ['branco'],
  'Shih Tzu':         ['branco', 'marrom'],
  'Ragdoll':          ['branco', 'cinza'],
  'Siamês':           ['branco', 'marrom'],
  'Maine Coon':       ['marrom', 'preto'],
  'Persa':            ['branco'],
}

const RACAS_COR_AUTO = Object.keys(COR_AUTOMATICA)

function DogSilhouette({ height }: { height: number }) {
  return (
    <svg height={height} viewBox="0 0 100 75" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Tail curving up from back of body */}
      <path d="M14 42 C6 32 2 16 13 7 C17 3 21 5 19 11 C15 22 18 36 23 42Z" />
      {/* Body */}
      <ellipse cx="43" cy="46" rx="28" ry="17"/>
      {/* Neck */}
      <ellipse cx="68" cy="38" rx="10" ry="8"/>
      {/* Head */}
      <circle cx="72" cy="26" r="14"/>
      {/* Floppy ear */}
      <ellipse cx="80" cy="20" rx="7" ry="11" transform="rotate(25 80 20)"/>
      {/* Snout */}
      <ellipse cx="84" cy="32" rx="8" ry="6"/>
      {/* Front legs */}
      <rect x="61" y="58" width="7" height="17" rx="3"/>
      <rect x="70" y="58" width="7" height="17" rx="3"/>
      {/* Back legs */}
      <rect x="23" y="58" width="7" height="17" rx="3"/>
      <rect x="32" y="58" width="7" height="17" rx="3"/>
    </svg>
  )
}

function CatSilhouette({ height }: { height: number }) {
  return (
    <svg height={height} viewBox="0 0 100 75" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Long tail curving up gracefully */}
      <path d="M14 44 C4 36 0 18 10 7 C14 2 19 5 17 11 C12 24 16 38 20 44Z" />
      {/* Body */}
      <ellipse cx="41" cy="46" rx="26" ry="16"/>
      {/* Neck */}
      <ellipse cx="64" cy="38" rx="9" ry="7"/>
      {/* Head */}
      <circle cx="68" cy="27" r="14"/>
      {/* Left pointed ear */}
      <polygon points="59,18 54,4 65,14"/>
      {/* Right pointed ear */}
      <polygon points="71,16 76,2 82,14"/>
      {/* Snout/muzzle */}
      <ellipse cx="79" cy="32" rx="7" ry="5"/>
      {/* Front legs */}
      <rect x="58" y="58" width="7" height="17" rx="3"/>
      <rect x="67" y="58" width="7" height="17" rx="3"/>
      {/* Back legs */}
      <rect x="22" y="58" width="7" height="17" rx="3"/>
      <rect x="31" y="58" width="7" height="17" rx="3"/>
    </svg>
  )
}

export default function Cadastro() {
  const router = useRouter()
  const [passo, setPasso] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tipo: '', nome: '', raca: '', porte: '', pelo: '',
    cor: [] as string[], sexo: '', mes: '', ano: '', dia: '',
    cidade: '', signoTutor: '', vibe: '', palavras: [] as string[],
    email: '',
  })

  const set = (campo: string, valor: any) =>
    setForm(f => ({ ...f, [campo]: valor }))

  const togglePalavra = (p: string) => {
    const atual = form.palavras
    if (atual.includes(p)) set('palavras', atual.filter(x => x !== p))
    else if (atual.length < 3) set('palavras', [...atual, p])
  }

  // Auto-set pelo based on raca (only for non-SRD breeds)
  useEffect(() => {
    if (form.raca && form.raca !== 'SRD / Vira-lata') {
      set('pelo', RACAS_PELO_LONGO.has(form.raca) ? 'longo' : 'curto')
    }
  }, [form.raca])

  // Auto-set or reset cor based on raca
  useEffect(() => {
    if (!form.raca) return
    if (COR_AUTOMATICA[form.raca]) {
      set('cor', COR_AUTOMATICA[form.raca])
    } else {
      set('cor', [])
    }
  }, [form.raca])

  const toggleCor = (v: string) => {
    const atual = form.cor
    if (atual.includes(v)) set('cor', atual.filter(x => x !== v))
    else set('cor', [...atual, v])
  }

  const passo1Valido = form.tipo && form.nome && form.raca && form.porte && form.sexo && form.cor.length > 0
  const passo2Valido = form.mes && form.ano
  const passo3Valido = form.signoTutor && form.vibe && form.palavras.length === 3 && form.email

  const enviar = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/compat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      sessionStorage.setItem(`result_${data.id}`, JSON.stringify(data))
      router.push(`/resultado?id=${data.id}`)
    } catch (e) {
      alert('Erro ao calcular. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-base focus:outline-none focus:border-purple-400 bg-white"
  const selectClass = inputClass
  const btnPrimary = "w-full py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90 disabled:opacity-40"

  const Silhouette = form.tipo === 'cat' ? CatSilhouette : DogSilhouette

  return (
    <main className="min-h-screen bg-white">
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

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[{v:'dog', e:'🐶', l:'Cachorro'},{v:'cat', e:'🐱', l:'Gato'}].map(({v,e,l}) => (
                <button key={v} onClick={() => { set('tipo', v); set('raca', ''); set('pelo', '') }}
                  className={`py-4 rounded-2xl border-2 text-center transition-all ${form.tipo === v ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                  <div className="text-3xl mb-1">{e}</div>
                  <div className="font-semibold text-gray-800">{l}</div>
                </button>
              ))}
            </div>

            {form.tipo && <>
              <input placeholder="Nome do pet" value={form.nome}
                onChange={e => set('nome', e.target.value)}
                className={inputClass + ' mb-3'} />

              <select value={form.raca} onChange={e => set('raca', e.target.value)}
                className={selectClass + ' mb-3'}>
                <option value="">Raça</option>
                {(form.tipo === 'dog' ? RACAS_CAES : RACAS_GATOS).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              {/* PORTE — SVG silhouettes */}
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">Porte</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'pequeno', label: 'Pequeno', h: 32 },
                    { value: 'medio',   label: 'Médio',   h: 44 },
                    { value: 'grande',  label: 'Grande',  h: 56 },
                  ] as const).map(({ value, label, h }) => (
                    <button key={value} onClick={() => set('porte', value)}
                      className={`flex flex-col items-center justify-end gap-2 py-3 px-2 rounded-xl border-2 transition-all ${form.porte === value ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-end justify-center" style={{ height: 64 }}>
                        <Silhouette height={h} />
                      </div>
                      <span className={`text-xs font-semibold ${form.porte === value ? 'text-purple-700' : 'text-gray-600'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* COR — color dot picker (hidden for breeds with auto-color) */}
              {!RACAS_COR_AUTO.includes(form.raca) && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-2">Cor principal</p>
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
              )}

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

              <div className="mb-6">
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

            <div className="grid grid-cols-2 gap-3 mb-3">
              <select value={form.mes} onChange={e => set('mes', e.target.value)} className={selectClass}>
                <option value="">Mês</option>
                {MESES.map((m,i) => <option key={m} value={String(i+1)}>{m}</option>)}
              </select>
              <select value={form.ano} onChange={e => set('ano', e.target.value)} className={selectClass}>
                <option value="">Ano</option>
                {ANOS.map(a => <option key={a} value={String(a)}>{a}</option>)}
              </select>
            </div>

            <select value={form.dia} onChange={e => set('dia', e.target.value)} className={selectClass + ' mb-3'}>
              <option value="">Dia (opcional)</option>
              {Array.from({length:31},(_,i) => <option key={i+1} value={String(i+1)}>{i+1}</option>)}
            </select>

            <input placeholder="Cidade de nascimento (opcional)" value={form.cidade}
              onChange={e => set('cidade', e.target.value)}
              className={inputClass + ' mb-6'} />

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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Vocês dois</h1>
            <p className="text-gray-400 text-sm mb-6">Agora fala sobre você e {form.nome}</p>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Seu signo</p>
              <select value={form.signoTutor} onChange={e => set('signoTutor', e.target.value)} className={selectClass}>
                <option value="">Selecione seu signo</option>
                {SIGNOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Como são vocês dois juntos?</p>
              <div className="grid grid-cols-2 gap-2">
                {VIBES.map(({id,emoji,label,desc}) => (
                  <button key={id} onClick={() => set('vibe', id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${form.vibe === id ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}`}>
                    <div className="text-xl mb-1">{emoji}</div>
                    <div className="text-xs font-semibold text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Escolha 3 palavras que definem vocês <span className="text-purple-500 font-semibold">({form.palavras.length}/3)</span></p>
              <div className="flex flex-wrap gap-2">
                {PALAVRAS.map(p => (
                  <button key={p} onClick={() => togglePalavra(p)}
                    className={`px-3 py-2 rounded-full text-sm border-2 transition-all ${form.palavras.includes(p) ? 'border-purple-400 bg-purple-50 text-purple-700 font-semibold' : 'border-gray-200 text-gray-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
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
