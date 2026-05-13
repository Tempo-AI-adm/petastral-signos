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

    const SIGNO_ELEMENTO: Record<string, string> = {
      'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
      'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
      'Gêmeos': 'Ar', 'Libra': 'Ar', 'Aquário': 'Ar',
      'Câncer': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
    }
    const elemento_pet = SIGNO_ELEMENTO[signo_pet] ?? 'desconhecido'

    const prompt = `Você é um especialista em comportamento animal e astrologia. Escreva texto puro, sem markdown, sem títulos, sem ##, sem **, sem listas. Apenas parágrafos corridos.

Escreva uma análise comportamental de ${nome}, um ${raca} ${sexoLabel} de ${signo_pet} (elemento ${elemento_pet}), cujo tutor é de ${signo_tutor}.

Estilo obrigatório:
- Linguagem técnica, direta e levemente irônica — nunca vaga ou genérica
- NÃO comece com o nome do pet nem com frases como "que X seja de Y, isso já se nota"
- Comece diretamente com a combinação ${raca} + ${signo_pet} e o que ela produz comportamentalmente
- Mencione o elemento ${elemento_pet} e como ele amplifica ou contraria a biologia da raça
- Cite 2-3 comportamentos concretos que o tutor já observou mas nunca soube explicar — com a causa real
- Use o nome ${nome} ao longo do texto, mas não na primeira frase
- Termine no meio de uma ideia — como se houvesse mais a dizer

Tom de referência (adapte para a raça e signo do pet):
"A combinação de Border Collie com Escorpião não é para tutores que buscam um pet relaxado. O instinto de pastoreio da raça, amplificado pela intensidade emocional do signo, resulta em um animal que monitora cada movimento da casa como se fosse responsável pelo rebanho. Não é ansiedade — é programação. O elemento Água aprofunda isso: Border Collies de Escorpião tendem a..."

Escreva exatamente entre 200 e 250 palavras.`

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

    return NextResponse.json({ texto: textoLimpo })

  } catch (e) {
    console.error('[capitulo-zero]', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
