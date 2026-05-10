import { FRASES_BASE, TEMPERO_COR, RACA_GRUPO, SRD_CACHORRO_GRUPOS, SRD_GATO_GRUPOS } from './frasesSuperPoder'

function sortear(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getGrupo(raca: string, tipo: string): string {
  const sessionKey = `${raca}_${tipo}`
  const isGatoSRD = tipo === 'cat' && (!raca || raca === 'SRD' || raca === 'Gato SRD')
  const isSRD = !raca || raca === 'SRD' || raca === 'Vira-lata'

  if (isGatoSRD) {
    const ultimo = sessionStorage.getItem(`lastGrupo_${sessionKey}`)
    let grupo = sortear(SRD_GATO_GRUPOS)
    if (grupo === ultimo && SRD_GATO_GRUPOS.length > 1) {
      grupo = sortear(SRD_GATO_GRUPOS.filter(g => g !== ultimo))
    }
    sessionStorage.setItem(`lastGrupo_${sessionKey}`, grupo)
    return grupo
  }

  if (isSRD) {
    const ultimo = sessionStorage.getItem(`lastGrupo_${sessionKey}`)
    let grupo = sortear(SRD_CACHORRO_GRUPOS)
    if (grupo === ultimo && SRD_CACHORRO_GRUPOS.length > 1) {
      grupo = sortear(SRD_CACHORRO_GRUPOS.filter(g => g !== ultimo))
    }
    sessionStorage.setItem(`lastGrupo_${sessionKey}`, grupo)
    return grupo
  }

  return RACA_GRUPO[raca] || 'caos'
}

function hashEmail(email: string): number {
  let sum = 0
  for (let i = 0; i < email.length; i++) {
    sum += email.charCodeAt(i)
  }
  return sum % 3
}

function getVariante(email: string): number {
  const key = `signopet_pet_count_${email}`
  const count = parseInt(localStorage.getItem(key) || '0', 10)
  const variante = (hashEmail(email) + count) % 3
  localStorage.setItem(key, String(count + 1))
  return variante
}

function aplicarGenero(texto: string, sexo: string): string {
  if (sexo !== 'femea' && sexo !== 'fêmea') return texto
  return texto
    .replace(/ dele\./g, ' dela.')
    .replace(/ dele /g, ' dela ')
    .replace(/ dele,/g, ' dela,')
    .replace(/ ele\./g, ' ela.')
    .replace(/ ele /g, ' ela ')
    .replace(/ ele,/g, ' ela,')
}

export function getPoder(
  raca: string,
  signo: string,
  tipo: string,
  sexo: string,
  cores: string[],
  email: string
): string {
  const grupo = getGrupo(raca, tipo)
  const frases = FRASES_BASE[signo?.trim()]
  if (!frases) return '✨ um mistério cósmico ainda por revelar.'

  const grupoFrases = frases[grupo] || frases['caos']
  if (!grupoFrases) return '✨ um mistério cósmico ainda por revelar.'

  const variante = getVariante(email)
  let fraseBase = grupoFrases[variante] ?? grupoFrases[0]
  fraseBase = aplicarGenero(fraseBase, sexo)

  // Tempero de cor: apenas combinações com estereótipo cultural específico
  const cor = cores.length === 1 ? cores[0] : null
  const isSRD = !raca || raca === 'SRD / Vira-lata' || raca === 'SRD' || raca === 'Vira-lata'
  const deveTemperar =
    cor !== null &&
    TEMPERO_COR[cor] !== undefined &&
    (
      (cor === 'laranja'   && tipo === 'cat') ||
      (cor === 'preto'     && tipo === 'cat') ||
      (cor === 'caramelo'  && tipo === 'dog' && isSRD)
    )

  if (deveTemperar) {
    let tempero = TEMPERO_COR[cor!][variante] ?? TEMPERO_COR[cor!][0]
    tempero = aplicarGenero(tempero, sexo)
    return `${fraseBase} ${tempero}`
  }

  return fraseBase
}
