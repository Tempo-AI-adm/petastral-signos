'use client'
import { useState } from 'react'
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

export default function Cadastro() {
  const router = useRouter()
  const [passo, setPasso] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tipo: '', nome: '', raca: '', porte: '', pelo: '',
    pelagem: '', sexo: '', mes: '', ano: '', dia: '',
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

  const passo1Valido = form.tipo && form.nome && form.raca && form.porte && form.pelo && form.pelagem && form.sexo
  const passo2Valido = form.mes && form.ano
  const passo3Valido = form.signoTutor && form.vibe && form.palavras.length === 3 && form.email

  const enviar = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/compatibility', {
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
                <button key={v} onClick={() => { set('tipo', v); set('raca', '') }}
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

              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">Porte</p>
                <div className="grid grid-cols-3 gap-2">
                  {[['pequeno','Pequeno'],['medio','Médio'],['grande','Grande']].map(([v,l]) => (
                    <button key={v} onClick={() => set('porte', v)}
                      className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.porte === v ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

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

              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-2">Pelagem</p>
                <div className="grid grid-cols-3 gap-2">
                  {[['claro','☀️','Clara'],['escuro','🌑','Escura'],['mesclado','🎨','Mesclada']].map(([v,e,l]) => (
                    <button key={v} onClick={() => set('pelagem', v)}
                      className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.pelagem === v ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600'}`}>
                      <div>{e}</div><div>{l}</div>
                    </button>
                  ))}
                </div>
              </div>

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
