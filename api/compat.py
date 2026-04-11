from http.server import BaseHTTPRequestHandler
import json
import uuid
import random

ELEMENTO = {
  'Áries':'fogo','Leão':'fogo','Sagitário':'fogo',
  'Touro':'terra','Virgem':'terra','Capricórnio':'terra',
  'Gêmeos':'ar','Libra':'ar','Aquário':'ar',
  'Câncer':'água','Escorpião':'água','Peixes':'água',
}

COMPATIBILIDADE = {
  ('fogo','fogo'):82,('fogo','ar'):90,('fogo','terra'):55,('fogo','água'):45,
  ('ar','fogo'):90,('ar','ar'):78,('ar','terra'):60,('ar','água'):70,
  ('terra','terra'):85,('terra','água'):88,('terra','fogo'):55,('terra','ar'):60,
  ('água','água'):80,('água','terra'):88,('água','fogo'):45,('água','ar'):70,
}

FRASES = {
  'dog': {
    'energia': [
      "Você disse 'fica' e saiu. Eu fiquei. 4 horas. Isso tem nome e não é bonito.",
      "Destruí o travesseiro novo. Você comprou outro. Um de nós não aprende.",
      "Latei pro vizinho, pro entregador, pro vento e pra minha sombra. Foi produtivo.",
      "Você chegou em casa e eu agi como se tivesse voltado da guerra. Você foi no mercado.",
      "Pedi pra passear 14 vezes. Na 15ª você cedeu. Persistência tem nome.",
      "Comi o chinelo esquerdo. O direito está como refém.",
    ],
    'sofa': [
      "Você disse que eu não podia subir no sofá em 2019. Isso foi há muito tempo.",
      "Ocupo 80% da cama. Você dobra o corpo todo pra caber no canto. Isso é amor seu.",
      "A gente assistiu a mesma série 3 vezes. Eu não reclamo. Você também não.",
      "Você ronca. Eu finjo não ouvir. Estamos quites.",
    ],
    'amorodeio': [
      "Você disse 'não' com a boca mas seus olhos disseram 'tá bom, pode vir'.",
      "Fui chamado de 'peste' 3 vezes hoje. E de 'amor' 11. Fico com a média.",
      "Você grita meu nome quando faço bagunça. É o único momento que me chama pelo nome completo.",
      "Fingi não ouvir quando você me chamou. Ouvi. Só não queria dar o braço a torcer.",
      "Você me deu banho como se eu tivesse pedido. Não pedi. Nunca vou pedir.",
    ],
    'cumplicidade': [
      "Eu sei quando você vai chorar antes de você saber. Já estou a caminho.",
      "Você fala comigo como se eu entendesse tudo. Entendo.",
      "Chegou em casa de mau humor. Não perguntei nada. Só fiquei perto. Funcionou.",
      "Você pensa que me escolheu. Eu deixei você achar isso.",
    ],
  },
  'cat': {
    'energia': [
      "Derrubei seu copo d'água. Olhei nos seus olhos enquanto fazia isso. Sem arrependimento.",
      "Você arrumou a cama. Deitei em cima na hora. É uma questão de princípio.",
      "Corri pelo apartamento às 3 da manhã. Motivo: classificado.",
      "Joguei seu fone do criado-mudo. Estava no caminho.",
      "Você fecha a porta do banheiro. Fico do lado de fora arranhando. A porta vai ceder antes de mim.",
      "Pedi carinho, recebi carinho, me arrependi do carinho. Saí. Isso é normal.",
    ],
    'sofa': [
      "Fingi que não queria colo por 3 horas. Depois fui. Não precisa comentar.",
      "Você mexe no celular, eu sento em cima. Um de nós tem prioridade.",
      "Durmo 16 horas por dia e mesmo assim pareço cansado. É estética.",
      "Você acha que me escolheu. Eu deixei você achar isso.",
    ],
    'amorodeio': [
      "Morder sua mão faz parte do afeto. Você ainda não entendeu mas vai entender.",
      "Te ignoro na frente de visita. Em particular sou completamente seu. Não conta pra ninguém.",
      "Você me chamou. Eu ouvi. Decidi que não era urgente.",
      "Ronronei no seu colo por 40 minutos e depois fui embora sem motivo. Sou assim.",
      "Você me deu o petisco errado. Comi. Mas registrei.",
      "Me acariciou 3 vezes seguidas. Na 4ª eu mordi. Existe um limite. Você passou.",
    ],
    'cumplicidade': [
      "Apareço quando você está mal. Não pergunto nada. Só fico. É o suficiente.",
      "Você fala sozinho e eu ouço tudo. Sou o segredo mais bem guardado da sua vida.",
      "Toda vez que você chora, eu apareço. Finjo que é coincidência. Não é.",
      "A gente tem um idioma só nosso. Nem você sabe explicar.",
    ],
  },
}

FRASES_PET = {
  'fogo': {
    'Áries':    'o {tipo} de fogo',
    'Leão':     'o {tipo} que manda',
    'Sagitário':'o {tipo} aventureiro',
  },
  'terra': {
    'Touro':      'o {tipo} da paz',
    'Virgem':     'o {tipo} perfeccionista',
    'Capricórnio':'o {tipo} determinado',
  },
  'ar': {
    'Gêmeos': 'o {tipo} curioso',
    'Libra':  'o {tipo} charmoso',
    'Aquário':'o {tipo} do futuro',
  },
  'água': {
    'Câncer':   'o {tipo} protetor',
    'Escorpião':'o {tipo} misterioso',
    'Peixes':   'o {tipo} sonhador',
  },
}

STATS_ELEMENTO = {
  'fogo':  {'Lealdade':4,'Energia':5,'Drama':4},
  'terra': {'Lealdade':5,'Energia':3,'Drama':2},
  'ar':    {'Lealdade':3,'Energia':4,'Drama':3},
  'água':  {'Lealdade':5,'Energia':3,'Drama':5},
}

SIGNO_POR_MES_DIA = [
  (( 3,21),( 4,19),'Áries'),
  (( 4,20),( 5,20),'Touro'),
  (( 5,21),( 6,20),'Gêmeos'),
  (( 6,21),( 7,22),'Câncer'),
  (( 7,23),( 8,22),'Leão'),
  (( 8,23),( 9,22),'Virgem'),
  (( 9,23),(10,22),'Libra'),
  ((10,23),(11,21),'Escorpião'),
  ((11,22),(12,21),'Sagitário'),
  ((12,22),( 1,19),'Capricórnio'),
  (( 1,20),( 2,18),'Aquário'),
  (( 2,19),( 3,20),'Peixes'),
]

def calcular_signo(mes, dia):
  mes, dia = int(mes), int(dia) if dia else 15
  for (m1,d1),(m2,d2),signo in SIGNO_POR_MES_DIA:
    if m1 <= m2:
      if (mes == m1 and dia >= d1) or (mes == m2 and dia <= d2):
        return signo
    else:
      if (mes == m1 and dia >= d1) or (mes == m2 and dia <= d2):
        return signo
  return 'Capricórnio'

def get_frase(tipo, vibe):
  tipo_key = 'cat' if tipo == 'cat' else 'dog'
  vibe_key = vibe if vibe in FRASES[tipo_key] else 'cumplicidade'
  return random.choice(FRASES[tipo_key][vibe_key])

def tipo_label(tipo, sexo):
  if tipo == 'dog':
    return 'cachorrinha' if sexo == 'femea' else 'cachorro'
  return 'gatinha' if sexo == 'femea' else 'gato'

class handler(BaseHTTPRequestHandler):
  def do_POST(self):
    length = int(self.headers.get('Content-Length', 0))
    body = json.loads(self.rfile.read(length))

    mes         = body.get('mes', '1')
    dia         = body.get('dia', '')
    tipo        = body.get('tipo', 'dog')
    sexo        = body.get('sexo', 'macho')
    vibe        = body.get('vibe', 'cumplicidade')
    signo_tutor = body.get('signoTutor', 'Leão')

    signo_pet    = calcular_signo(mes, dia)
    elem_pet     = ELEMENTO.get(signo_pet, 'fogo')
    elem_tutor   = ELEMENTO.get(signo_tutor, 'fogo')

    score_base   = COMPATIBILIDADE.get((elem_pet, elem_tutor), 65)
    variacao     = random.randint(-3, 3)
    score        = max(40, min(99, score_base + variacao))

    tl           = tipo_label(tipo, sexo)
    frase_pet    = FRASES_PET[elem_pet][signo_pet].replace('{tipo}', tl)
    frase_compat = get_frase(tipo, vibe)
    stats        = STATS_ELEMENTO[elem_pet]

    result = {
      'id':           str(uuid.uuid4()),
      'nome':         body.get('nome', ''),
      'tipo':         tipo,
      'raca':         body.get('raca', ''),
      'porte':        body.get('porte', ''),
      'pelo':         body.get('pelo', ''),
      'pelagem':      body.get('pelagem', ''),
      'sexo':         sexo,
      'vibe':         vibe,
      'signo_pet':    signo_pet,
      'elemento':     elem_pet,
      'frase_pet':    frase_pet,
      'signo_tutor':  signo_tutor,
      'score':        score,
      'frase_compat': frase_compat,
      'stats':        stats,
      'cor':          body.get('cor', []),
      'dia':          body.get('dia', ''),
      'cidade':       body.get('cidade', ''),
      'email':        body.get('email', ''),
      'palavras':     body.get('palavras', []),
      'dia_tutor':    body.get('diaTutor', ''),
      'mes_tutor':    body.get('mesTutor', ''),
      'ano_tutor':    body.get('anoTutor', ''),
    }

    self.send_response(200)
    self.send_header('Content-Type','application/json')
    self.send_header('Access-Control-Allow-Origin','*')
    self.end_headers()
    self.wfile.write(json.dumps(result).encode())

  def do_OPTIONS(self):
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin','*')
    self.send_header('Access-Control-Allow-Methods','POST,OPTIONS')
    self.send_header('Access-Control-Allow-Headers','Content-Type')
    self.end_headers()
