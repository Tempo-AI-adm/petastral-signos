// Frases base: signo × grupo comportamental × 3 variantes
export const FRASES_BASE: Record<string, Record<string, [string, string, string]>> = {
  'Áries': {
    energetico: [
      'nasceu achando que o mundo é um parquinho só dele.',
      'acorda já no máximo. não existe modo econômico.',
      'tem pressa pra tudo, inclusive pra nada.',
    ],
    carente: [
      'te ama com a mesma intensidade que destrói as coisas.',
      'quer atenção agora. não daqui a pouco. agora.',
      'se amor fosse esporte, seria campeão por nocaute.',
    ],
    independente: [
      'não precisa de você. mas permite que você fique.',
      'tem opinião própria sobre tudo. inclusive sobre a sua.',
      'segue as próprias regras. e as regras mudam quando convém.',
    ],
    dondoca: [
      'merece o melhor e sabe que vai conseguir.',
      'olha pra ração barata com o mesmo desprezo que olha pra visita.',
      'exigente não — seletivo. tem diferença.',
    ],
    preguicoso: [
      'descansa com a mesma dedicação que outros usam pra correr.',
      'a meta é não ter meta. e tá cumprindo.',
      'se esforço queimasse caloria, estaria em forma negativa.',
    ],
    intenso: [
      'leva tudo a sério. inclusive a hora de brincar.',
      'quando foca em algo, esquece que o resto do mundo existe.',
      'não faz nada pela metade. ou é 100% ou é caos.',
    ],
    caos: [
      'não causa problema. problema é consequência.',
      'destruição não é hobby — é vocação.',
      'quando tá quieto, é pior. significa que tá planejando.',
    ],
  },
  'Touro': {
    energetico: [
      'tem energia, mas só gasta quando a recompensa vale a pena.',
      'corre quando quer. e quer muito raramente.',
      'parece calmo até alguém mexer na comida dele.',
    ],
    carente: [
      'se pudesse, ficava no colo 24h. e acha pouco.',
      'quer carinho constante. sem surpresas, sem mudanças.',
      'leal até demais. já elegeu um humano e não aceita devolução.',
    ],
    independente: [
      'decidiu o cantinho dele no primeiro dia e nunca mais saiu.',
      'tem a própria rotina. você só faz parte de alguns horários.',
      'não é antissocial — é seletivo com a agenda.',
    ],
    dondoca: [
      'não é exigente. só quer o melhor de tudo. simples.',
      'nasceu com gosto refinado e não pretende mudar.',
      'conforto não é luxo — é necessidade básica.',
    ],
    preguicoso: [
      'encontrou o melhor lugar da casa antes de todo mundo. e não pretende sair.',
      'domina a arte de fazer absolutamente nada com maestria.',
      'a gravidade puxa mais forte quando o assunto é levantar.',
    ],
    intenso: [
      'teimoso é pouco. determinado é eufemismo.',
      'quando quer algo, o universo que se adapte.',
      'parece tranquilo, mas tem um plano. sempre tem um plano.',
    ],
    caos: [
      'calmo por fora, desastre por dentro. e às vezes por fora também.',
      'tá tudo bem até contrariar. aí boa sorte.',
      'a teimosia virou arte. e ele é o artista.',
    ],
  },
  'Gêmeos': {
    energetico: [
      'muda de interesse a cada 3 minutos. e se diverte com todos.',
      'tem a energia de dois pets num corpo só.',
      'não é hiperativo — é multitarefa.',
    ],
    carente: [
      'quer atenção, mas atenção variada. não vale repetir.',
      'te ama de um jeito diferente a cada dia. literalmente.',
      'carente e independente ao mesmo tempo. depende do horário.',
    ],
    independente: [
      'vive bem sozinho. mas gosta de ter plateia.',
      'não precisa de companhia — precisa de opções.',
      'decide na hora se quer carinho ou distância. sem aviso.',
    ],
    dondoca: [
      'exigente, mas muda de exigência o tempo todo.',
      'hoje quer uma coisa, amanhã outra. e sempre com urgência.',
      'tem gostos refinados. vários. ao mesmo tempo.',
    ],
    preguicoso: [
      'alterna entre energia total e coma profundo sem transição.',
      'descansa agora pra ter energia de não fazer nada depois.',
      'dorme em qualquer lugar. de preferência nos mais inconvenientes.',
    ],
    intenso: [
      'presta atenção em tudo ao mesmo tempo. e lembra de tudo.',
      'vive como se estivesse assistindo cinco novelas ao mesmo tempo.',
      'intenso de um jeito novo a cada semana.',
    ],
    caos: [
      'tem duas personalidades e nenhuma obedece.',
      'previsível é a única coisa que nunca vai ser.',
      'caos com charme. e sabe disso.',
    ],
  },
  'Câncer': {
    energetico: [
      'protege a casa com a energia de um segurança particular.',
      'corre de um lado pro outro conferindo se tá tudo em ordem.',
      'parece agitado, mas é só zelo. muito zelo.',
    ],
    carente: [
      'te supervisiona emocionalmente. acha que você não se cuida.',
      'não é grude — é cuidado extremo sem hora pra acabar.',
      'sente saudade de você enquanto você tá ali do lado.',
    ],
    independente: [
      'independente entre quatro paredes. lá fora é outra história.',
      'quer espaço, mas perto de você. de preferência no mesmo cômodo.',
      'faz as coisas sozinho. mas precisa que você veja.',
    ],
    dondoca: [
      'quer colo, cobertor e a sensação de que o mundo é seguro.',
      'conforto emocional é tão importante quanto o físico.',
      'se sentir protegido é prioridade. o resto é detalhe.',
    ],
    preguicoso: [
      'não é preguiça — é senso de preservação altamente desenvolvido.',
      'prefere ficar em casa. sempre. sem exceção.',
      'a cama é o lugar seguro. sair dela é arriscado.',
    ],
    intenso: [
      'sente tudo com uma intensidade que cansa até quem tá perto.',
      'leva qualquer mudança de rotina como traição pessoal.',
      'parece que carrega o peso emocional da casa inteira.',
    ],
    caos: [
      'oscila entre carinho extremo e drama absoluto sem aviso.',
      'tudo é pessoal. inclusive quando não é.',
      'o humor muda com o clima. literalmente com o clima.',
    ],
  },
  'Leão': {
    energetico: [
      'entra num cômodo como se fosse uma apresentação.',
      'tem energia pra chamar atenção o dia inteiro. e chama.',
      'brilha mais quando tem plateia. e sempre acha que tem.',
    ],
    carente: [
      'não quer carinho — quer adoração. e acha que merece.',
      'te ama, mas espera aplausos em troca.',
      'leal e dramático na mesma proporção.',
    ],
    independente: [
      'vive no próprio reino. você é um convidado frequente.',
      'não precisa de aprovação. mas gosta muito de receber.',
      'faz o que quer e espera que você admire a decisão.',
    ],
    dondoca: [
      'não entra num cômodo. faz uma entrada.',
      'merece o melhor e realmente acredita nisso. com razão.',
      'tratamento VIP não é pedido — é esperado.',
    ],
    preguicoso: [
      'descansa com a dignidade de um rei entre batalhas.',
      'não é preguiça — é conservar energia pra brilhar depois.',
      'deitado, bonito e no controle. sempre no controle.',
    ],
    intenso: [
      'quando olha fixo pra você, parece que tá lendo a alma.',
      'leva a própria existência muito a sério. e espera o mesmo.',
      'intenso e orgulhoso. pedir desculpa não tá no vocabulário.',
    ],
    caos: [
      'drama é o idioma nativo. e é fluente.',
      'exagera em tudo. e acha que tá sendo comedido.',
      'quando decide que algo é importante, o mundo para.',
    ],
  },
  'Virgem': {
    energetico: [
      'gasta energia organizando coisas que ninguém pediu.',
      'fica inquieto quando algo sai do lugar. qualquer coisa.',
      'parece que tá sempre conferindo se o mundo tá funcionando.',
    ],
    carente: [
      'te ama nos detalhes. nos pequenos gestos que ninguém percebe.',
      'quer rotina e previsibilidade. surpresas não, obrigado.',
      'carente de forma discreta. mas nota se você não notou.',
    ],
    independente: [
      'funciona perfeitamente sozinho. talvez melhor do que com gente.',
      'tem o próprio sistema. e o sistema funciona.',
      'organizado demais pra depender de alguém.',
    ],
    dondoca: [
      'tem padrões altos. e julga silenciosamente quem não tem.',
      'sabe a diferença entre aceitável e excelente. exige o segundo.',
      'refinado de um jeito que parece julgamento. porque é.',
    ],
    preguicoso: [
      'otimizou o descanso. não é preguiça, é eficiência.',
      'se não vale o esforço, não levanta. simples.',
      'descansa com a consciência limpa de quem já fez o mínimo.',
    ],
    intenso: [
      'te julga em silêncio. você não sabe pelo quê, mas sabe que é verdade.',
      'percebe cada detalhe. e guarda todos. pra uso futuro.',
      'exigente com o mundo. mais exigente consigo mesmo.',
    ],
    caos: [
      'ansioso e organizado ao mesmo tempo. sim, é possível.',
      'o caos interno não aparece. mas tá lá. sempre tá lá.',
      'tenta controlar tudo. e surta elegantemente quando não consegue.',
    ],
  },
  'Libra': {
    energetico: [
      'gasta energia mantendo a paz. é um trabalho de tempo integral.',
      'sociável com tudo que se move. e com algumas coisas que não.',
      'parece que tá sempre buscando aprovação. e geralmente consegue.',
    ],
    carente: [
      'quer harmonia e carinho. de preferência ao mesmo tempo.',
      'não gosta de ficar sozinho. nem um pouco. nem por um segundo.',
      'precisa de companhia como precisa de água.',
    ],
    independente: [
      'independente, mas sempre de olho em como os outros reagem.',
      'faz as próprias escolhas. depois confere se você aprovou.',
      'parece que não liga. mas nota tudo.',
    ],
    dondoca: [
      'gosta das coisas bonitas. e acha que merece todas.',
      'estética importa. conforto importa. harmonia é obrigatória.',
      'elegante sem esforço. pelo menos é o que parece.',
    ],
    preguicoso: [
      'não é preguiça — é apreciação do momento presente.',
      'descansa com graça. até dormindo é fotogênico.',
      'se tivesse que escolher entre agir e observar, observava.',
    ],
    intenso: [
      'sente o clima da casa antes de qualquer pessoa.',
      'percebe quando algo tá errado. e fica incomodado até resolver.',
      'equilíbrio é sagrado. qualquer desequilíbrio é crise.',
    ],
    caos: [
      'indeciso sobre tudo. inclusive sobre ser indeciso.',
      'muda de opinião três vezes antes do café da manhã.',
      'paz e caos ao mesmo tempo. e não vê contradição.',
    ],
  },
  'Escorpião': {
    energetico: [
      'tem uma energia silenciosa que intimida. e ele sabe.',
      'quando resolve agir, ninguém vê. só vê o resultado.',
      'calmo por fora. por dentro, calculando tudo.',
    ],
    carente: [
      'te escolheu. e agora é pra sempre. sem opção.',
      'ama de um jeito intenso que beira a possessividade.',
      'leal até o fim. mas esquece um vacilo? nunca.',
    ],
    independente: [
      'carinho é no horário dele. e se não for, você que tá errado.',
      'vive bem sem atenção. mas aceita. nos termos dele.',
      'não é difícil. é seletivo com quem merece acesso.',
    ],
    dondoca: [
      'exigente e misterioso. não pede — espera que você adivinhe.',
      'tem gostos específicos e não aceita substituição.',
      'quer conforto, mas no estilo dele. sem sugestões.',
    ],
    preguicoso: [
      'conserva energia pra quando realmente importa. e raramente importa.',
      'parece que tá dormindo. tá observando.',
      'descansa com a intensidade de quem tá tramando algo.',
    ],
    intenso: [
      'sente tudo mais forte que os outros. e guarda tudo.',
      'o olhar diz mais do que qualquer latido ou miado.',
      'não perdoa fácil. mas quando perdoa, é de verdade.',
    ],
    caos: [
      'entre a calma e a explosão tem exatamente zero aviso.',
      'misterioso por escolha. imprevisível por natureza.',
      'parece que vive num suspense particular. e é o protagonista.',
    ],
  },
  'Sagitário': {
    energetico: [
      'acha que a coleira é sugestão e que toda porta aberta é convite.',
      'qualquer passeio vira expedição. qualquer expedição vira aventura.',
      'tem a energia de quem acabou de descobrir que o mundo é grande.',
    ],
    carente: [
      'te ama. mas te ama mais quando pode ir e voltar.',
      'carinhoso do jeitão dele — meio estabanado, meio irresistível.',
      'quer estar perto, mas sem perder a liberdade de sair correndo.',
    ],
    independente: [
      'vive como se todo dia fosse uma aventura nova. inclusive terça.',
      'não segue regras — segue instintos. e geralmente dá certo.',
      'liberdade é inegociável. o resto é conversável.',
    ],
    dondoca: [
      'quer o bom e o melhor. mas também quer variedade.',
      'exigente, mas de um jeito simpático que é difícil recusar.',
      'gosta de novidade. inclusive na ração.',
    ],
    preguicoso: [
      'alterna entre explorar o mundo e fingir que o mundo não existe.',
      'quando para, para de verdade. recarrega como um filósofo.',
      'não é preguiça — é sabedoria pós-aventura.',
    ],
    intenso: [
      'leva cada passeio como se fosse o último. e volta inteiro.',
      'tudo é intenso, tudo é agora, tudo é a melhor coisa que já aconteceu.',
      'entusiasmado com tudo. inclusive com coisas que não existem.',
    ],
    caos: [
      'não planejou nenhum dos desastres. simplesmente aconteceram.',
      'onde ele vai, a confusão segue. mas com simpatia.',
      'um furacão com boas intenções.',
    ],
  },
  'Capricórnio': {
    energetico: [
      'gasta energia só com o que dá retorno. nada de esforço à toa.',
      'trabalha duro por comida. e só por comida.',
      'parece que tá sempre com um objetivo. mesmo andando em círculos.',
    ],
    carente: [
      'não demonstra muito, mas quando quer colo, é lei.',
      'te ama de um jeito sério e constante. sem drama.',
      'carente? só quando ninguém tá vendo.',
    ],
    independente: [
      'se vira sozinho e acha que você deveria fazer o mesmo.',
      'não precisa de ajuda. mas aceita comida.',
      'autossuficiente com orgulho.',
    ],
    dondoca: [
      'tem gostos simples. mas inflexíveis.',
      'não é exigente — é decidido. e não muda de ideia.',
      'sabe o que quer. e espera com paciência até conseguir.',
    ],
    preguicoso: [
      'calculou o menor esforço pra conseguir comida. e funciona toda vez.',
      'otimizou a preguiça como estratégia de vida.',
      'se esforça o mínimo. mas o mínimo dele é eficiente.',
    ],
    intenso: [
      'sério sobre tudo. inclusive sobre coisas que não são sérias.',
      'parece mais velho do que é. e age como se soubesse mais.',
      'quando decide algo, acabou a discussão.',
    ],
    caos: [
      'tenta manter o controle. e quando perde, ninguém esperava.',
      'a teimosia dele é lendária. e não vai mudar. nunca.',
      'parece estável. é a versão mais contida do caos.',
    ],
  },
  'Aquário': {
    energetico: [
      'tem uma energia que ninguém entende, incluindo ele mesmo.',
      'faz coisas estranhas com uma convicção admirável.',
      'parece que tá sempre num mundo paralelo. e se diverte lá.',
    ],
    carente: [
      'te ama do jeito dele. e o jeito dele é diferente de tudo.',
      'quer carinho, mas de um jeito que só ele sabe qual é.',
      'aparece quando você menos espera. e some igual.',
    ],
    independente: [
      'vive tão bem sozinho que às vezes você esquece que ele existe.',
      'não é antissocial — é seletivamente social.',
      'segue regras próprias que nem ele sabe explicar.',
    ],
    dondoca: [
      'tem gostos excêntricos e não pede desculpa por nenhum.',
      'quer coisas incomuns. e olha pra você como se fosse óbvio.',
      'o padrão dele é único. literalmente.',
    ],
    preguicoso: [
      'não é preguiça — é contemplação do universo.',
      'parece desligado. tá processando coisas que você nem percebeu.',
      'descansa de um jeito que parece proposital.',
    ],
    intenso: [
      'percebe coisas que ninguém percebe. e reage a coisas que ninguém viu.',
      'vive no próprio mundo. e lá dentro é bem intenso.',
      'diferente de todos. e totalmente ok com isso.',
    ],
    caos: [
      'imprevisível por natureza. e não pretende mudar.',
      'faz coisas sem explicação. e a explicação é pior.',
      'o caos dele tem estilo. é quase artístico.',
    ],
  },
  'Peixes': {
    energetico: [
      'tem uma energia meio sonhadora. corre, mas olhando pro nada.',
      'se empolga com coisas imaginárias e se cansa de coisas reais.',
      'parece que vive num mundo à parte. e de vez em quando volta.',
    ],
    carente: [
      'te olha com aqueles olhos e pronto — você já perdeu a discussão.',
      'sente o que você sente. e fica do seu lado sem perguntar.',
      'carente de um jeito que não dá pra recusar.',
    ],
    independente: [
      'vive no próprio mundo. e o mundo dele é bonito.',
      'independente, mas de um jeito sensível que confunde todo mundo.',
      'parece distante. tá só pensando em coisas que você não entenderia.',
    ],
    dondoca: [
      'quer conforto e paz. de preferência ao mesmo tempo.',
      'sensível a tudo — barulho, textura, energia da casa.',
      'precisa de um ambiente calmo. e de um colo disponível.',
    ],
    preguicoso: [
      'não dorme — medita. pelo menos é o que parece.',
      'a linha entre descanso e reflexão existencial é tênue.',
      'flutua pela casa como se a gravidade fosse sugestão.',
    ],
    intenso: [
      'sente tudo tão forte que às vezes cansa só de existir.',
      'o olhar conta uma história inteira. triste ou feliz, depende do minuto.',
      'vive emoções grandes num corpo pequeno.',
    ],
    caos: [
      'sonha acordado e tropeça nas próprias patas.',
      'entre a realidade e a fantasia, escolheu a fantasia.',
      'caos gentil. atrapalha tudo com a melhor das intenções.',
    ],
  },
}

// Tempero de cor — só 3 cores têm tempero
export const TEMPERO_COR: Record<string, [string, string, string]> = {
  laranja: [
    'como bom laranja, opera com uma célula cerebral.',
    'o gene laranja não falha — zero neurônio, máximo carisma.',
    'laranja que é laranja nasce com personalidade e sem juízo.',
  ],
  preto: [
    'o pelo preto dá esse ar de quem sabe demais.',
    'preto, elegante e com certeza tramando algo.',
    'o preto combina com o mistério. e mistério é o que não falta.',
  ],
  caramelo: [
    'caramelo clássico — bonito e sem noção.',
    'o caramelo dá aquela cara de quem nunca fez nada. mentira.',
    'pelo caramelo e coração de ouro. mas a cabeça é de vento.',
  ],
}

// Mapeamento raça → grupo comportamental (copiado de poderEspecial.ts)
export const RACA_GRUPO: Record<string, string> = {
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

export const SRD_CACHORRO_GRUPOS: string[] = ['energetico', 'carente', 'independente', 'dondoca', 'preguicoso', 'intenso', 'caos']
export const SRD_GATO_GRUPOS: string[] = ['independente', 'dondoca', 'preguicoso', 'intenso', 'caos']
