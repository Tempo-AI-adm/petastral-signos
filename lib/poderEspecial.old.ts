const FRASES: Record<string, Record<string, string>> = {
  'Áries': {
    energetico: 'Ódio gratuito e 220v de pura treta.',
    carente: 'Te ama de forma agressiva. Literalmente.',
    independente: 'Faz o que quer e ainda te olha com desprezo.',
    dondoca: 'Nasceu mandando. Você é o assessor.',
    preguicoso: 'Descansando com raiva. O repouso mais intimidador do mundo.',
    intenso: 'Energia de atleta olímpico às 3 da manhã.',
    caos: 'Entrou em modo destruição e não tem previsão de parada.',
  },
  'Touro': {
    energetico: 'Briga por tudo mas esquece em 3 segundos. Próxima.',
    carente: 'Vai te seguir até o banheiro. Sem vergonha nenhuma.',
    independente: 'Só aparece quando tem comida. Consistente, pelo menos.',
    dondoca: 'Exige carinho como se fosse direito constitucional.',
    preguicoso: '99% fome, 1% deitar no seu pé e não sair mais.',
    intenso: 'Determinado a conseguir o petisco. Negocia até cansar.',
    caos: 'Destruição lenta e metódica. Cada coisa no seu tempo.',
  },
  'Gêmeos': {
    energetico: 'Humor instável com CNPJ. Cada hora é uma surpresa.',
    carente: 'Te ama agora. Daqui a 10 min pode mudar.',
    independente: 'Aparece, some, aparece de novo. Ninguém sabe explicar.',
    dondoca: 'Tem dois modos: diva e completamente insuportável.',
    preguicoso: 'Dormindo em paz enquanto o caos acontece ao redor.',
    intenso: 'Mudou de objetivo no meio do caminho. De novo.',
    caos: 'Energia de furacão em trânsito de Mercúrio. Boa sorte.',
  },
  'Câncer': {
    energetico: 'Latiu pra te defender de uma ameaça que não existia.',
    carente: 'Sente sua ausência antes mesmo de você sair de casa.',
    independente: 'Te ignora, mas fica perto o suficiente pra te vigiar.',
    dondoca: 'Dramático com causa. Causa criada por ele mesmo.',
    preguicoso: 'Dormindo no seu canto preferido e não abre mão.',
    intenso: 'Trauma profundo de quando você demorou 10 minutos a mais.',
    caos: 'Sensível por fora, bagunceiro por dentro. Combinação perfeita.',
  },
  'Leão': {
    energetico: 'Quer atenção, faz bagunça, consegue atenção. Sistema perfeito.',
    carente: 'Precisa de aplausos só por existir. E recebe.',
    independente: 'Dono da porra toda. Você mora no território dele.',
    dondoca: 'Se pudesse, colocaria o próprio nome na escritura.',
    preguicoso: 'Descansando com pose de realeza. Orgulho máximo.',
    intenso: 'Performance de Oscar em cada refeição atrasada.',
    caos: 'Caos com presença. Destrói tudo mas continua lindo.',
  },
  'Virgem': {
    energetico: 'Latido crítico sempre que algo sai do padrão dele.',
    carente: 'Te analisa antes de confiar. Processo longo.',
    independente: 'Te julgando em 4K porque você atrasou o sachê 2 minutos.',
    dondoca: 'Higiene pessoal impecável. A sua, ele não garante.',
    preguicoso: 'Organizado até no jeito de ficar parado no mesmo lugar.',
    intenso: 'Checklist mental de tudo que você fez de errado hoje.',
    caos: 'Faz bagunça, lambe a pata, segue em frente sem culpa.',
  },
  'Libra': {
    energetico: 'Quer brincar mas só se você também quiser. Democrático.',
    carente: 'Equilíbrio emocional só quando você está por perto.',
    independente: 'Indiferença elegante. Nem parece que te ama. Mas ama.',
    dondoca: 'Bonito por fora, manipulador por dentro. Combinação fatal.',
    preguicoso: 'Paz interior e exterior. Um mestre do descanso.',
    intenso: 'Indeciso entre correr e deitar. Resolve no meio-tempo.',
    caos: 'Destruição com charme. Você briga mas perdoa na hora.',
  },
  'Escorpião': {
    energetico: 'Rancor de longa duração. Não esquece, não perdoa.',
    carente: 'Amor intenso com prazo de validade desconhecido.',
    independente: 'Aparece do nada no escuro pra te dar um susto.',
    dondoca: 'Mistério com glitter. Ninguém sabe o que ele pensa.',
    preguicoso: 'Dormindo mas de olho. Sempre de olho.',
    intenso: 'Observa tudo em silêncio. Sabe mais do que demonstra.',
    caos: 'Caos estratégico. Nada é por acidente.',
  },
  'Sagitário': {
    energetico: 'Energia que não acaba. Você que se cuide.',
    carente: 'Te ama mas não abre mão da aventura. Parceria intensa.',
    independente: 'Livre por natureza. Coleira é só enfeite.',
    dondoca: 'Otimismo insuportável com visual de revista.',
    preguicoso: 'Filosofia do sofá. Vida boa é vida parada.',
    intenso: 'Comprometido com tudo ao mesmo tempo. Caos produtivo.',
    caos: 'Destrói com entusiasmo. Sem arrependimento nenhum.',
  },
  'Capricórnio': {
    energetico: 'Trabalha duro até ganhar o petisco. Meritocracia animal.',
    carente: 'Afeto calculado. Cada lambida foi planejada.',
    independente: 'Não precisa de você. Mas te tolera com dignidade.',
    dondoca: 'Status importa. Cama boa, ração boa, ou não serve.',
    preguicoso: 'Descansa como quem está acumulando energia pra algo grande.',
    intenso: 'Disciplina de general. Rotina é sagrada.',
    caos: 'Aparentemente calmo. Por dentro, CEO de operação secreta.',
  },
  'Aquário': {
    energetico: 'Comportamento inexplicável com frequência aleatória.',
    carente: 'Te ama do jeito dele. Que é um jeito bem estranho.',
    independente: 'Não segue regras. Nem as da física.',
    dondoca: 'Original demais pra padrão. Referência própria.',
    preguicoso: 'Dormindo enquanto planeja a revolução.',
    intenso: 'Comprometido com causas que só ele entende.',
    caos: 'Caos inovador. Inventa um problema novo todo dia.',
  },
  'Peixes': {
    energetico: 'Surto energético às 2h da manhã. Todo dia.',
    carente: 'Amor incondicional com choro incluído.',
    independente: 'Existe num plano astral diferente. Visita aqui às vezes.',
    dondoca: 'Sensível, delicado e completamente manipulador.',
    preguicoso: 'Sonhando acordado desde que nasceu.',
    intenso: 'Absorve o seu humor e amplifica x10.',
    caos: 'Caos emocional com muita fofura por cima.',
  },
}

const RACA_GRUPO: Record<string, string> = {
  'Pinscher': 'energetico',
  'Jack Russell': 'energetico',
  'Chihuahua': 'energetico',
  'Spitz Alemão / Lulu': 'energetico',
  'Golden Retriever': 'carente',
  'Labrador': 'carente',
  'Lhasa Apso': 'carente',
  'Beagle': 'carente',
  'Cocker Spaniel': 'carente',
  'Siamês': 'independente',
  'Maine Coon': 'independente',
  'Ragdoll': 'independente',
  'Angora': 'independente',
  'Husky Siberiano': 'independente',
  'Akita': 'independente',
  'Shih Tzu': 'dondoca',
  'Poodle': 'dondoca',
  'Yorkshire': 'dondoca',
  'Maltês': 'dondoca',
  'Bichon Frisé': 'dondoca',
  'Persa': 'dondoca',
  'Bulldog Inglês': 'preguicoso',
  'Bulldog Francês': 'preguicoso',
  'Basset Hound': 'preguicoso',
  'Pug': 'preguicoso',
  'Shar-Pei': 'preguicoso',
  'Dachshund / Salsicha': 'preguicoso',
  'Border Collie': 'intenso',
  'Pastor Alemão': 'intenso',
  'Dálmata': 'intenso',
  'Dobermann': 'intenso',
  'Blue Heeler': 'intenso',
  'Rottweiler': 'caos',
  'Pitbull': 'caos',
  'Boxer': 'caos',
  'Fila Brasileiro': 'caos',
  'Corgi': 'caos',
  'Galgo': 'caos',
  'Sphynx': 'caos',
  'Bengal': 'caos',
}

const SRD_CACHORRO_GRUPOS = ['energetico', 'carente', 'independente', 'dondoca', 'preguicoso', 'intenso', 'caos']
const SRD_GATO_GRUPOS = ['independente', 'dondoca', 'preguicoso', 'intenso', 'caos']

function sortear(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getGrupo(raca: string, tipo: string, sessionKey: string): string {
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

export function getPoder(
  raca: string,
  signo: string,
  tipo: string,
  sessionKey: string
): string {
  const grupo = getGrupo(raca, tipo, sessionKey)
  const frases = FRASES[signo?.trim()]
  if (!frases) return '✨ Um mistério cósmico ainda por revelar.'
  return frases[grupo] || frases['caos'] || '✨ Um mistério cósmico ainda por revelar.'
}
