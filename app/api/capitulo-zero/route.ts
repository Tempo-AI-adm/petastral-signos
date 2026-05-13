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
    const sexoLabel = sexo === 'fêmea' ? 'fêmea' : 'macho'

    const prompt = `Escreva apenas texto puro. Sem markdown, sem ##, sem **, sem títulos. Apenas parágrafos corridos.

Escreva o Capítulo 1 do laudo astral de ${nome}, um ${raca} ${sexoLabel} de ${signo_pet}. O tutor é de ${signo_tutor}.

Foco: o que o cruzamento específico entre o signo ${signo_pet} e a raça ${raca} revela sobre o comportamento de ${nome}. Aponte 2-3 padrões comportamentais concretos que o tutor provavelmente já observou mas nunca soube explicar. Mostre que esses padrões são resultado do cruzamento entre astrologia e biologia da raça — não um desses dois isolados.

Regras:
- 250 a 300 palavras
- Tom direto, conversacional, com um toque de ironia
- Use o nome ${nome} ao longo do texto
- Nada de introduções genéricas sobre astrologia
- Comece direto no comportamento
- Escreva em parágrafos, sem listas`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2000, temperature: 0.8 }
        }),
        signal: AbortSignal.timeout(25000)
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

    return NextResponse.json({ texto: textoLimpo })

  } catch (e) {
    console.error('[capitulo-zero]', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
