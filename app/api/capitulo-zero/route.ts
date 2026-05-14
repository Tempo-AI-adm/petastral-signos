import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { nome, raca, signo_pet, signo_tutor, tipo, sexo } = await req.json()

    if (!nome || !raca || !signo_pet) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    console.log('[cap-zero API] iniciando:', nome, raca, signo_pet)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'no api key' }, { status: 500 })
    }

    const tipoLabel = tipo === 'cat' ? 'gato' : 'cachorro'
    const sexoLabel = sexo === 'fêmea' ? 'fêmea' : 'macho'

    const SIGNO_ELEMENTO: Record<string, string> = {
      'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
      'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
      'Gêmeos': 'Ar', 'Libra': 'Ar', 'Aquário': 'Ar',
      'Câncer': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
    }
    const elemento_pet = SIGNO_ELEMENTO[signo_pet] ?? 'desconhecido'

    const prompt = `Você é um especialista em comportamento animal e astrologia.
Escreva texto puro, sem markdown, sem ##, sem **, sem listas.
Apenas parágrafos corridos.

Escreva uma análise comportamental de ${nome},
um ${raca} ${sexoLabel} de ${signo_pet} (elemento ${elemento_pet}),
cujo tutor é de ${signo_tutor}.

Tom obrigatório:
- Direto, coloquial, levemente irônico
- PROIBIDO usar: "égide", "inata", "sob a", "exemplar", "notável",
  "posicionamento solar", "diplomata peludo" e qualquer linguagem acadêmica
- Comece diretamente com o que a combinação ${raca} + ${signo_pet} produz
- Cite 2-3 comportamentos concretos com a causa real (raça + signo + elemento)
- Use o nome ${nome} no texto, mas não na primeira frase
- Escreva 3 parágrafos. O terceiro parágrafo deve terminar no meio de uma
  frase que claramente continua — não com conclusão nem resumo

Tom de referência:
"Golden Retriever de Libra é o tipo de cachorro que faz amizade com o
veterinário enquanto leva injeção. A sociabilidade da raça, amplificada
pelo elemento Ar de Libra, produz um animal que literalmente precisa de
aprovação social pra se sentir bem. Isso explica por que [nome] fica
ansioso quando visitas chegam e não o cumprimentam primeiro. O terceiro
fator que pouca gente percebe é..."

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
    console.error('[cap-zero API] erro:', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
