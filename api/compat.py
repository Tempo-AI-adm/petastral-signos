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

FRASES_COMPAT = {
  90:["Eu e você somos WiFi e celular — o mundo para quando um some. 📱✨",
      "Combinação rara. Eu sabia desde o primeiro dia que você era meu humano. 🔥"],
  82:["Eu bagunço, você reclama. Mas sem mim, a casa é um velório. 😂",
      "Eu te entendo antes de você abrir a boca. Assustador, né? 🌀"],
  80:["Eu não falo, mas sei tudo sobre você. Tudo mesmo. 🌙",
      "Quando você está mal, eu apareço. Não é coincidência. ⚖️"],
  78:["A gente briga, mas eu nunca durmo de mal com você. Nunca. 💜",
      "Somos parecidos demais pra se ignorar. Diferentes o suficiente pra se completar. ✨"],
  70:["Você organiza, eu desarrumo. É um sistema. Funciona. 😏",
      "Eu te acalmo sem você perceber. De nada. 🌿"],
  60:["Ainda estou te treinando. Mas você está indo bem. 🚀",
      "A gente não é óbvio. Mas funciona. Sempre surpreende. 🎲"],
  55:["Você é desafiador. Mas eu gosto de desafios. 💪",
      "Somos opostos. A atração é real, a paciência é minha. 🌊🔥"],
  45:["Você me testa todo dia. Mas eu fico. Sempre fico. ❤️",
      "Você me desafia. Eu cresço. No fundo, é o que eu precisava. 🌱"],
}

FRASES_PET = {
  'fogo': {
    'Áries':   'o {tipo} de fogo',
    'Leão':    'o {tipo} que manda',
    'Sagitário':'o {tipo} aventureiro',
  },
  'terra': {
    'Touro':     'o {tipo} da paz',
    'Virgem':    'o {tipo} perfeccionista',
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

def get_frase_compat(score):
  chaves = sorted(FRASES_COMPAT.keys(), reverse=True)
  for k in chaves:
    if score >= k:
      return random.choice(FRASES_COMPAT[k])
  return FRASES_COMPAT[45][0]

def tipo_label(tipo, sexo):
  if tipo == 'dog':
    return 'cachorrinha' if sexo == 'femea' else 'cachorro'
  return 'gatinha' if sexo == 'femea' else 'gato'

class handler(BaseHTTPRequestHandler):
  def do_POST(self):
    length = int(self.headers.get('Content-Length', 0))
    body = json.loads(self.rfile.read(length))

    mes  = body.get('mes', '1')
    dia  = body.get('dia', '')
    tipo = body.get('tipo', 'dog')
    sexo = body.get('sexo', 'macho')
    signo_tutor = body.get('signoTutor', 'Leão')

    signo_pet   = calcular_signo(mes, dia)
    elem_pet    = ELEMENTO.get(signo_pet, 'fogo')
    elem_tutor  = ELEMENTO.get(signo_tutor, 'fogo')

    score_base  = COMPATIBILIDADE.get((elem_pet, elem_tutor), 65)
    variacao    = random.randint(-3, 3)
    score       = max(40, min(99, score_base + variacao))

    tl          = tipo_label(tipo, sexo)
    frase_pet   = FRASES_PET[elem_pet][signo_pet].replace('{tipo}', tl)
    frase_compat= get_frase_compat(score)
    stats       = STATS_ELEMENTO[elem_pet]

    result = {
      'id':          str(uuid.uuid4()),
      'nome':        body.get('nome', ''),
      'tipo':        tipo,
      'raca':        body.get('raca', ''),
      'porte':       body.get('porte', ''),
      'pelo':        body.get('pelo', ''),
      'pelagem':     body.get('pelagem', ''),
      'sexo':        sexo,
      'signo_pet':   signo_pet,
      'elemento':    elem_pet,
      'frase_pet':   frase_pet,
      'signo_tutor': signo_tutor,
      'score':       score,
      'frase_compat':frase_compat,
      'stats':       stats,
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
