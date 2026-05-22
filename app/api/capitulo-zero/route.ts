import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { nome, raca, signo_pet, signo_tutor, tipo, sexo } = await req.json()

    if (!nome || !raca || !signo_pet) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'no api key' }, { status: 500 })
    }

    const tipoLabel = tipo === 'cat' ? 'gato' : 'cachorro'
    const sexoLabel = (sexo === 'fêmea' || sexo === 'femea') ? 'fêmea' : 'macho'

    const SIGNO_ELEMENTO: Record<string, string> = {
      'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
      'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
      'Gêmeos': 'Ar', 'Libra': 'Ar', 'Aquário': 'Ar',
      'Câncer': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
    }
    const elemento_pet = SIGNO_ELEMENTO[signo_pet] ?? 'desconhecido'

    const prompt = `Você é a voz de um trio: um veterinário comportamental, um adestrador
experiente e um astrólogo que trabalham juntos. Escrevem para tutores
exigentes que querem entender o pet de verdade.

Escreva texto puro. Sem markdown, sem ##, sem **, sem listas.
Apenas parágrafos corridos.

Escreva a introdução do laudo astral de ${nome},
um ${tipo === 'cat' ? 'gato' : 'cachorro'} da raça ${raca}, ${sexoLabel}, de ${signo_pet} (elemento ${elemento_pet}).
O tutor é de ${signo_tutor}.

OBRIGATÓRIO em algum momento do texto:
- Citar o nome ${nome} pelo menos 2 vezes
- Mencionar a história ou origem da raça ${raca} e como isso afeta o comportamento hoje
- Cruzar explicitamente ${signo_pet} + ${raca} e o que essa combinação produz
- Mencionar o elemento ${elemento_pet} e seu efeito prático no comportamento
- Dar pelo menos 1 exemplo concreto de comportamento que o tutor já observou mas nunca soube explicar
- Terminar com uma frase que claramente introduz o próximo capítulo sem concluir

TOM OBRIGATÓRIO:
- Direto, prático, levemente irônico — como um especialista que respeita o tutor
- PROIBIDO: "exemplar", "notável", "sob a égide", "inata", linguagem acadêmica
- PROIBIDO começar com o nome do pet
- Frases curtas e assertivas, não longas e rebuscadas

EXEMPLO DO TOM CORRETO:
"Ragdoll foi criado nos anos 60 pra ser deliberadamente dócil — selecionado
pra relaxar no colo, literalmente. Mas ${nome} não é só Ragdoll: é um Ragdoll
de Aquário, o que significa que essa docilidade vem com uma cláusula de
independência que o criador Ann Baker provavelmente não previu. O elemento
Ar de Aquário não deixa nenhum Ragdoll ser completamente previsível..."

Escreva exatamente 3 parágrafos, entre 220 e 260 palavras no total.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2000, temperature: 0.8 }
        }),
        signal: AbortSignal.timeout(35000)
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'gemini error' }, { status: 500 })
    }

    const data = await response.json()
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!texto) {
      return NextResponse.json({ error: 'empty response' }, { status: 500 })
    }

    const textoLimpo = texto
      .split('\n')
      .filter((l: string) => !l.trim().startsWith('#'))
      .join('\n')
      .trim()

    const corpo = textoLimpo

    const frases = corpo
      .split(/(?<=\.)\s+/)
      .filter((f: string) => f.length > 40)

    const bloqueado =
      frases[Math.floor(frases.length / 2)]
      ?? frases[1]
      ?? ''

    return NextResponse.json({ corpo, bloqueado })

  } catch (e) {
    console.error('[capitulo-zero]', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
