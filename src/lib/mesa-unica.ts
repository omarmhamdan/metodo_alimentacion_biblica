import type { Lang } from "./i18n";

// ─── Guia Mesa Única (upsell 2 — premium) ───────────────────────────────────
// Como toda a família come bem sem desconfiar. Mesma lógica de idioma (ES/PT).

export interface ParTexto {
  nome: string;
  texto: string;
}

export interface Categoria {
  id: string;
  titulo: string;
  desafio: string;
  suaVersao: string;
  versaoFamilia: ParTexto[];
  tecnica: string;
}

export interface MotivoCrianca {
  titulo: string;
  solucao: string;
}

export interface Swap {
  de: string;
  para: string;
}

export interface PratoDomingo {
  titulo: string;
  texto: string;
}

export interface Fase {
  fase: string;
  titulo: string;
  itens: string[];
  texto: string;
}

export interface MesaContent {
  // Chrome
  badge: string;
  unlocked: string;
  title: string;
  author: string;
  subtitle: string;
  back: string;

  // Abertura
  aberturaTitulo: string;
  aberturaTexto: string[];
  compromissos: ParTexto[];
  aberturaAssinatura: string;

  // Lógica — 4 pilares
  secLogica: string;
  logicaIntro: string;
  pilares: ParTexto[];

  // Parte 1 — categorias
  secCategorias: string;
  categoriasSub: string;
  lblDesafio: string;
  lblSuaVersao: string;
  lblVersaoFamilia: string;
  lblTecnica: string;
  categorias: Categoria[];

  // Parte 2 — engana o paladar
  secPaladar: string;
  paladarIntro: string;
  saborTitulo: string;
  truquesSabor: ParTexto[];
  texturaTitulo: string;
  truquesTextura: ParTexto[];
  regraOuroTitulo: string;
  regraOuro: string;

  // Parte 3 — crianças
  secCriancas: string;
  criancasIntro: string;
  motivosTitulo: string;
  motivos: MotivoCrianca[];
  estrategiasTitulo: string;
  estrategias: ParTexto[];
  lancheTitulo: string;
  lancheIntro: string;
  swaps: Swap[];
  lancheRegra: string;

  // Parte 4 — mesa de domingo
  secDomingo: string;
  domingoIntro: string;
  pratos: PratoDomingo[];
  domingoOrientacao: string;

  // Bônus — transição invisível
  secBonus: string;
  bonusVersiculo: string;
  bonusIntro: string;
  fases: Fase[];
  regrasTitulo: string;
  regras: ParTexto[];

  // Palavra final
  secFinal: string;
  finalTexto: string[];
  finalAssinatura: string;

  // Guia chrome
  guiaTitulo: string;
  guiaSub: string;
  voltar: string;
}

const pt: MesaContent = {
  badge: "Guia Premium",
  unlocked: "✦ Você desbloqueou o Guia Mesa Única",
  title: "Guia Mesa Única",
  author: "Por Beatriz Morales — Nutricionista Cristã",
  subtitle: "Como toda a sua família come bem — sem nem desconfiar.",
  back: "Voltar",

  aberturaTitulo: "Querida,",
  aberturaTexto: [
    "Deixa eu adivinhar. Você se empolgou com o Método Alimentação Bíblica, sentiu a diferença no corpo, e veio o pensamento: como fazer a minha família comer assim também? Cozinhar uma coisa pra você e outra pra eles é insustentável.",
    "A verdade que ninguém te conta: seu marido e seus filhos não rejeitam comida saudável porque ela é saudável. Rejeitam porque foi servida de um jeito que entrega o jogo — sem graça, sem sabor. O problema nunca foi o ingrediente. Foi a apresentação, o tempero e a técnica.",
    "Aqui você aprende a levar cada princípio do Método à mesa de um jeito que conquista o paladar mais difícil da casa. Uma comida só. Uma panela só. Uma família inteira comendo a mesma coisa — e só você sabendo o que tem por trás.",
    "Na Bíblia a mesa nunca foi lugar de separação. Em Atos, os cristãos partiam o pão em casa com alegria e singeleza de coração. Este guia devolve isso pra sua mesa.",
  ],
  compromissos: [
    {
      nome: "Não anuncie a mudança",
      texto:
        "Não chegue dizendo \"agora vamos comer saudável\". Isso liga o alarme de todo mundo. Cozinhe — e deixe o sabor falar.",
    },
    {
      nome: "Comece pelo que eles já amam",
      texto:
        "Não imponha pratos novos e estranhos. Pegue os favoritos da casa e melhore por dentro. Mais fácil, funciona melhor.",
    },
    {
      nome: "Seja paciente com o paladar",
      texto:
        "Paladar viciado em ultraprocessado leva semanas pra se reeducar. Vá no ritmo da casa. O bônus secreto é a estratégia pros casos difíceis.",
    },
  ],
  aberturaAssinatura: "Com fé e carinho, Beatriz",

  secLogica: "Por que isto funciona",
  logicaIntro: "Toda a estratégia se apoia em quatro pilares. Entenda o princípio antes das técnicas.",
  pilares: [
    {
      nome: "1 · Comece pela base que eles já aceitam",
      texto:
        "Toda família tem pratos já aprovados (arroz com frango, carne com batata, macarrão de domingo). Em vez de brigar com esse repertório, a Mesa Única melhora ele por dentro. O prato parece o mesmo — mas a versão que vai à mesa é a saudável.",
    },
    {
      nome: "2 · O sabor vem do tempero, não do industrializado",
      texto:
        "Ervas frescas, alho, azeite, limão, especiarias e o tempo de cozimento certo entregam sabor igualmente intenso — e muito mais profundo. Você não serve comida sem graça. Serve comida de verdade, bem temperada.",
    },
    {
      nome: "3 · A textura é metade da batalha",
      texto:
        "Boa parte da rejeição (principalmente das crianças) não é ao sabor — é à textura. Vegetal mole e aguado é rejeitado de cara. O mesmo vegetal crocante e dourado é devorado.",
    },
    {
      nome: "4 · A transição é invisível e gradual",
      texto:
        "Você não muda tudo de uma vez. Troca um ingrediente por semana, sem ninguém perceber. Quando a família se dá conta, já come diferente há um mês — e gostando. É a essência do bônus secreto.",
    },
  ],

  secCategorias: "As 5 adaptações para a família",
  categoriasSub: "Toque numa categoria: a base saudável é a mesma, só muda a forma de servir.",
  lblDesafio: "O desafio",
  lblSuaVersao: "A sua versão",
  lblVersaoFamilia: "A versão da família",
  lblTecnica: "A técnica-chave",
  categorias: [
    {
      id: "lentilhas",
      titulo: "Lentilhas e grãos",
      desafio:
        "Lentilha e grão-de-bico são dos alimentos mais nutritivos e bíblicos que existem — mas servidos como \"sopa marrom sem graça\" são rejeitados de cara.",
      suaVersao: "Lentilha cozida simples, com cebola e ervas, num prato fundo.",
      versaoFamilia: [
        {
          nome: "Vire \"almôndega\" ou hambúrguer",
          texto:
            "Lentilha cozida e escorrida, amassada com temperos, um ovo e farinha de aveia, modelada em bolinhas ou discos e assada até dourar. Criança come com a mão, marido acha que é bolinho de carne.",
        },
        {
          nome: "Esconda no que já é aprovado",
          texto:
            "Lentilha cozida e processada no molho de carne do macarrão. Some na textura, engrossa e dobra o valor nutritivo do prato favorito.",
        },
        {
          nome: "Vire recheio",
          texto:
            "Lentilha com cominho e tomate vira recheio de panqueca, torta, pão sírio. O formato familiar acolhe o ingrediente novo.",
        },
      ],
      tecnica:
        "Sempre doure a cebola lentamente antes. A base de cebola caramelizada disfarça completamente o \"gosto de grão\" que algumas pessoas rejeitam.",
    },
    {
      id: "peixes",
      titulo: "Peixes",
      desafio:
        "Muita família torce o nariz: \"cheiro forte\", \"cheio de espinha\", \"gosto de peixe\". Mas o peixe é uma das proteínas mais anti-inflamatórias que existem.",
      suaVersao: "Filé de peixe assado com azeite, limão e ervas.",
      versaoFamilia: [
        {
          nome: "Empane no forno",
          texto:
            "Peixe no ovo e depois em farinha de rosca integral com queijo ralado e ervas, assado até crocante. Vira \"peixe empanado\" — sem fritura e sem ultraprocessado.",
        },
        {
          nome: "Transforme em isca",
          texto:
            "Corte em tiras, tempere, empane e asse. Sirva com molho de iogurte e limão pra mergulhar. Vira petisco, não \"janta de peixe\".",
        },
        {
          nome: "Disfarce no molho",
          texto:
            "Peixe desfiado em molho de tomate caseiro, sobre macarrão ou arroz, perde a cara de \"peixe puro\".",
        },
      ],
      tecnica:
        "Limão e ervas frescas (endro e salsa) eliminam o cheiro forte. Tempere com antecedência e nunca cozinhe demais — peixe ressecado é o que cria a má fama.",
    },
    {
      id: "legumes",
      titulo: "Legumes e vegetais",
      desafio:
        "O maior campo de batalha, principalmente com crianças. Legume mal preparado é a comida mais rejeitada do mundo.",
      suaVersao: "Legumes no vapor, com azeite e sal.",
      versaoFamilia: [
        {
          nome: "Asse, não cozinhe na água",
          texto:
            "Legumes assados no forno com azeite ficam dourados, crocantes e doces. Cenoura, abobrinha, abóbora e brócolis assados são devorados até por quem \"não come legume\".",
        },
        {
          nome: "Rale e esconda",
          texto:
            "Cenoura, abobrinha e beterraba raladas finas somem em molhos, bolos, panquecas, almôndegas e arroz. A família come vegetal sem ver um pedaço.",
        },
        {
          nome: "Vire creme aveludado",
          texto:
            "Batidos em sopa-creme, finalizados com azeite, perdem a textura que assusta e ganham a cremosidade que conforta.",
        },
        {
          nome: "Transforme em \"palitos\"",
          texto:
            "Abobrinha, cenoura e abóbora em palitos, temperadas e assadas até dourar, viram \"batata da casa\".",
        },
      ],
      tecnica:
        "Dourar é tudo. O legume assado até dourar desenvolve açúcar natural (caramelização) que transforma o sabor. Cozido na água perde cor, sabor e textura.",
    },
    {
      id: "paes",
      titulo: "Pães e fermentação natural",
      desafio:
        "A família é viciada no pão de fábrica, macio e branco. O pão de fermentação natural, mais denso, pode estranhar no começo.",
      suaVersao: "Pão de fermentação natural puro, fatiado.",
      versaoFamilia: [
        {
          nome: "Comece pelo que tem cara de lanche",
          texto:
            "Use o pão pra fazer o que eles já amam: torradas com azeite e ervas, mini pizzas na fatia, pãezinhos recheados. O formato familiar acolhe.",
        },
        {
          nome: "Faça o pãozinho doce da tarde",
          texto:
            "Pão levemente adocicado com mel e canela, servido morno no café da tarde, conquista as crianças e substitui o bolo industrializado.",
        },
        {
          nome: "Transição gradual de cor",
          texto:
            "Comece misturando farinha branca e integral meio a meio, aumentando a integral ao longo das semanas. O paladar se acostuma sem perceber.",
        },
      ],
      tecnica:
        "Pão morno conquista qualquer um. Sirva sempre levemente aquecido, com um bom azeite ou pasta caseira. O calor e o aroma fazem metade do trabalho.",
    },
    {
      id: "sobremesas",
      titulo: "Sobremesas",
      desafio: "A família é viciada em açúcar refinado. Tirar o doce de repente gera revolta.",
      suaVersao: "Frutas com mel, sobremesas adoçadas com tâmara.",
      versaoFamilia: [
        {
          nome: "Use o doce natural na forma que gostam",
          texto:
            "Banana amassada com canela e assada vira sobremesa quente. Maçã assada com mel e nozes tem cara de torta. Frutas batidas e congeladas viram sorvete caseiro.",
        },
        {
          nome: "Esconda o vegetal no doce",
          texto:
            "Bolo de cenoura, bolo de beterraba com cacau, brownie de abóbora — adoçados com mel ou tâmara. A criança come vegetal achando que é sobremesa.",
        },
        {
          nome: "Faça o \"brigadeiro\" da casa",
          texto:
            "Tâmara processada com cacau e pasta de oleaginosa vira docinho enrolado que substitui o brigadeiro industrializado, sem açúcar refinado.",
        },
      ],
      tecnica:
        "Nunca anuncie \"é sem açúcar\". Sirva como sobremesa normal. O doce da fruta e da tâmara satisfaz — mas se avisar que é \"fit\" antes, o cérebro já decide que não vai gostar.",
    },
  ],

  secPaladar: "Engana o Paladar",
  paladarIntro:
    "Sua caixa de ferramentas. Truques de sabor e textura que transformam comida saudável em irresistível. Decore três ou quatro e nunca mais sirva prato sem graça.",
  saborTitulo: "Truques de SABOR",
  truquesSabor: [
    {
      nome: "Cebola e alho dourados lentamente",
      texto:
        "Quase todo prato salgado começa melhor com cebola refogada devagar, em fogo baixo, até dourar e adoçar. Dá profundidade que disfarça qualquer ingrediente \"estranho\". Nunca tenha pressa nessa etapa.",
    },
    {
      nome: "O sal do final é o ácido",
      texto:
        "Quando parece \"faltar algo\", quase nunca é mais sal — é acidez. Um aperto de limão ou fio de vinagre de maçã no final acorda o sabor inteiro.",
    },
    {
      nome: "A camada de umami natural",
      texto:
        "Tomate maduro cozido, cogumelos dourados, queijo curado ralado, alho assado. Adicione uma dessas camadas e o prato ganha o corpo que vicia.",
    },
    {
      nome: "A gordura boa que dá prazer",
      texto:
        "Azeite de oliva cru finalizando o prato entrega o prazer que faz a família querer repetir — e é anti-inflamatório. Não economize no fio final.",
    },
    {
      nome: "Ervas frescas no lugar do tempero pronto",
      texto:
        "Salsa, coentro, hortelã, manjericão e cebolinha frescos no final dão frescor e aroma que nenhum tempero em pó alcança. O segredo mais barato da cozinha.",
    },
    {
      nome: "O doce que equilibra",
      texto:
        "Uma pitada de mel ou cebola caramelizada no molho de tomate corta a acidez e deixa o molho \"redondo\" como o de restaurante.",
    },
  ],
  texturaTitulo: "Truques de TEXTURA",
  truquesTextura: [
    {
      nome: "Dourar para criar crocância",
      texto:
        "Asse legumes, grãos e proteínas até dourarem nas bordas. O contraste entre o crocante de fora e o macio de dentro faz a comida ser devorada.",
    },
    {
      nome: "Processar para esconder",
      texto:
        "Vegetais processados ou ralados bem fino somem em molhos, massas, almôndegas e bolos. Quando a textura some, a rejeição some junto.",
    },
    {
      nome: "Empanar no forno em vez de fritar",
      texto:
        "A casquinha empanada e assada entrega a experiência da fritura sem o óleo inflamatório. Use farinha de rosca integral com queijo e ervas.",
    },
    {
      nome: "O creme que conforta",
      texto:
        "Sopas-creme, purês e molhos acolhem o paladar e disfarçam vegetais que seriam rejeitados em pedaços. Bata bem e finalize com azeite.",
    },
    {
      nome: "O contraste no prato",
      texto:
        "Um prato com uma só textura cansa. Combine cremoso com crocante: purê com sementes tostadas, sopa com croutons de pão de fermentação natural.",
    },
  ],
  regraOuroTitulo: "A regra de ouro",
  regraOuro:
    "Nunca anuncie que a comida é \"saudável\", \"fit\", \"diet\" ou \"sem açúcar\" antes de servir. O cérebro decide se vai gostar antes de provar, baseado no que você fala. Sirva como comida normal e deliciosa. Deixe eles amarem primeiro. O elogio vem antes da revelação.",

  secCriancas: "O Caderno das Crianças",
  criancasIntro:
    "Fazer criança comer comida de verdade não precisa ser guerra. A maior parte da rejeição não é ao alimento — é à forma, à apresentação e à pressão.",
  motivosTitulo: "Por que a criança rejeita (e o que fazer)",
  motivos: [
    {
      titulo: "Rejeição por textura",
      solucao:
        "Crianças são sensíveis a texturas moles e aguadas. Ofereça na forma crocante, sequinha, em palitos ou empanado no forno. O mesmo vegetal que ela cospe cozido, ela come assado.",
    },
    {
      titulo: "Rejeição por aparência",
      solucao:
        "Cor estranha e pedaços visíveis disparam o \"não quero\". Esconda (ralado em molhos e massas) ou torne divertido (formatos, cores vivas, carinhas no prato).",
    },
    {
      titulo: "Rejeição por pressão",
      solucao:
        "Quanto mais você insiste, mais ela associa o alimento a algo ruim. Ofereça sem pressão, repetidas vezes. Pode precisar ver o alimento de 8 a 15 vezes antes de aceitar. Paciência vence.",
    },
  ],
  estrategiasTitulo: "As estratégias práticas",
  estrategias: [
    {
      nome: "Esconda nos favoritos",
      texto:
        "Cenoura e abobrinha no molho do macarrão, lentilha no hambúrguer, couve-flor no purê, espinafre na panqueca (vira \"panqueca do Hulk\").",
    },
    {
      nome: "Deixe a criança participar",
      texto: "Criança come o que ajuda a fazer. Deixe lavar, mexer, montar o prato. Envolvimento derruba a resistência.",
    },
    {
      nome: "Dê nomes divertidos",
      texto: "\"Árvores\" (brócolis), \"palitos mágicos\" (cenoura assada), \"sorvete da fruta\" (banana congelada batida).",
    },
    {
      nome: "Use o molho de mergulhar",
      texto: "Iogurte caseiro, homus suave, molho de tomate — e os legumes em palito viram brincadeira, não obrigação.",
    },
    {
      nome: "Sirva pequeno e sem pressão",
      texto: "Porção pequena ao lado do que ela já come, sem obrigar. A criança experimenta por curiosidade; a aceitação cresce com o tempo.",
    },
    {
      nome: "Seja o exemplo na mesa",
      texto: "A criança copia o que vê. Se você come os vegetais com prazer, ela quer fazer igual. A mesa em família é a melhor sala de aula.",
    },
  ],
  lancheTitulo: "O lanche da escola e da tarde",
  lancheIntro: "O ponto fraco costuma ser o lanche. Substitua aos poucos — nunca tire sem substituir:",
  swaps: [
    { de: "Biscoito recheado", para: "Pão de fermentação natural com pasta caseira, ou bolo de banana" },
    { de: "Suco de caixinha", para: "Fruta picada ou suco natural" },
    { de: "Salgadinho de pacote", para: "Grão-de-bico crocante assado, ou chips de legume assado" },
    { de: "Bala e doce", para: "Tâmara recheada, frutas secas, docinho de cacau com tâmara" },
  ],
  lancheRegra:
    "A regra: nunca tire sem substituir. Toda vez que remover um industrializado, coloque uma versão caseira gostosa no lugar. A criança não sente que perdeu — sente que ganhou.",

  secDomingo: "A Mesa de Domingo",
  domingoIntro:
    "Pratos bíblicos que impressionam até a pessoa mais exigente — e que ninguém imagina que são saudáveis. Mostre, sem dizer uma palavra, que comida de verdade pode ser a mais gostosa da mesa.",
  pratos: [
    {
      titulo: "Cordeiro (ou pernil) assado às ervas do campo",
      texto:
        "A peça central da festa bíblica. Carne assada lentamente com alho, alecrim, tomilho, hortelã e azeite, regada no próprio caldo. A casa se enche do aroma e a carne desmancha. Sirva com legumes assados ao redor. Vão achar que é banquete — e é.",
    },
    {
      titulo: "Frango inteiro dourado com limão e ervas",
      texto:
        "Mais acessível, igualmente impressionante. Temperado com pasta de alho, ervas e azeite, assado até a pele ficar dourada e crocante. Segredo: soltar a pele e temperar por baixo, e deixar descansar antes de cortar. É o prato que faz a sogra pedir a receita.",
    },
    {
      titulo: "Grande tábua de pães, pastas e azeitonas",
      texto:
        "Entrada sofisticada e puro alimento bíblico: pão de fermentação natural, homus, babaganuche, azeite com ervas, azeitonas, tomates, queijo branco. Todos mergulham e partilham. É a mesa de Atos.",
    },
    {
      titulo: "Peixe assado inteiro para a mesa",
      texto:
        "Peixe inteiro assado com limão, ervas e azeite, levado à travessa, tem impacto visual enorme — e é mais fácil do que parece. Símbolo profundo nas Escrituras. Sirva com arroz e legumes coloridos.",
    },
    {
      titulo: "Sobremesa de figos, mel e nozes",
      texto:
        "Encerre com a sobremesa mais bíblica que existe: figos assados com mel e nozes, servidos com iogurte ou creme natural. Parece de restaurante, sai em 15 minutos, sem uma grama de açúcar refinado.",
    },
  ],
  domingoOrientacao:
    "Antes de servir, reúna a família, leia um versículo curto e faça uma oração de gratidão. Transforme o domingo em comunhão, não só comida. É assim que a mesa volta a ser o coração da casa.",

  secBonus: "Bônus Secreto · A Transição Invisível",
  bonusVersiculo:
    "\"Não desprezes os dias dos pequenos começos.\" — inspirado em Zacarias 4:10",
  bonusIntro:
    "Minha estratégia pessoal para o caso mais difícil: o marido (ou filho) que \"não come nada diferente\". O erro de quase toda mulher é mudar tudo de uma vez e gerar revolta. A Transição Invisível faz o contrário: gradual, silenciosa, em 4 fases ao longo de 4 a 6 semanas. Ninguém percebe — até já estar feito.",
  fases: [
    {
      fase: "Semana 1",
      titulo: "A troca invisível dos invisíveis",
      itens: [
        "Óleo de fritura → azeite",
        "Sal comum → sal temperado com ervas",
        "Tempero pronto em cubo → alho, cebola e ervas de verdade",
        "Açúcar do café/suco → reduza pela metade",
      ],
      texto:
        "Ninguém percebe nenhuma troca. Mas o corpo já recebe menos inflamação e o paladar começa, discretamente, a se reeducar.",
    },
    {
      fase: "Semanas 2 e 3",
      titulo: "O acréscimo silencioso",
      itens: [
        "Legume ralado dentro do molho de carne",
        "Lentilha processada dentro do hambúrguer",
        "Meia porção de integral misturada à farinha branca",
        "Salada colorida ao lado do prato de sempre, sem obrigar",
      ],
      texto: "A pessoa continua comendo o que gosta. Você enriquece por dentro e planta o novo ao lado, sem pressão.",
    },
    {
      fase: "Semanas 4 e 5",
      titulo: "A substituição gradual",
      itens: [
        "Peixe empanado no forno no lugar do industrializado",
        "Legumes assados e dourados no lugar da batata frita",
        "Sobremesa de fruta no lugar do doce de pacote",
        "Pão de fermentação natural morno no lugar do pão de fábrica",
      ],
      texto: "Cada substituição mantém o formato familiar (empanado, assado, doce, pão), então a resistência é mínima.",
    },
    {
      fase: "Semana 6 em diante",
      titulo: "A mesa única consolidada",
      itens: [],
      texto:
        "Sem ninguém perceber o processo, a família já come a Mesa Única na maior parte das refeições. O paladar se reeducou. O marido que \"não comia nada diferente\" agora pede o seu peixe empanado e acha que sempre foi assim.",
    },
  ],
  regrasTitulo: "As três regras de ouro",
  regras: [
    {
      nome: "Nunca anuncie",
      texto: "No momento em que você diz \"estou te fazendo comer saudável\", o jogo acaba. Apenas cozinhe. Deixe o sabor convencer.",
    },
    {
      nome: "Nunca volte atrás por uma reclamação isolada",
      texto: "Vai ter um dia em que alguém reclama. Não desmonte tudo. Siga firme e gentil. Uma reclamação não é uma derrota.",
    },
    {
      nome: "Colha o elogio antes de revelar",
      texto:
        "Espere o marido elogiar o prato algumas vezes. Só então, se quiser, conte que é saudável. O elogio já dado não volta atrás — e a revelação vira orgulho, não resistência.",
    },
  ],

  secFinal: "Palavra final",
  finalTexto: [
    "Querida, você agora tem nas mãos o que faltava para o Método Alimentação Bíblica caber na sua vida real. Cuidar de si nunca deveria significar comer sozinha, cozinhar duas vezes ou virar a \"esquisita da família\".",
    "Você não precisa escolher entre a sua saúde e a sua família. Com a Mesa Única é tudo a mesma coisa: uma panela, uma mesa, todos comendo bem — e você no comando silencioso, cuidando de cada um através da comida.",
    "A mulher virtuosa de Provérbios 31 \"dá mantimento à sua casa\". Ela nutria a casa inteira, com sabedoria, com as próprias mãos. É exatamente isso que você está fazendo agora.",
    "Comece devagar, pelo que eles já amam, e deixe o sabor fazer o trabalho. Que Deus abençoe a sua cozinha, a sua mesa e cada pessoa que se senta nela.",
  ],
  finalAssinatura: "Com fé e carinho, Beatriz Morales — Nutricionista Cristã",

  guiaTitulo: "O guia completo",
  guiaSub: "Tudo o que você precisa, organizado para consultar quando quiser.",
  voltar: "Voltar ao início",
};

const es: MesaContent = {
  badge: "Guía Premium",
  unlocked: "✦ Has desbloqueado la Guía Mesa Única",
  title: "Guía Mesa Única",
  author: "Por Beatriz Morales — Nutricionista Cristiana",
  subtitle: "Cómo toda tu familia come bien — sin sospechar nada.",
  back: "Volver",

  aberturaTitulo: "Querida,",
  aberturaTexto: [
    "Déjame adivinar. Te entusiasmaste con el Método Alimentación Bíblica, sentiste la diferencia en el cuerpo, y llegó el pensamiento: ¿cómo hago para que mi familia también coma así? Cocinar una cosa para ti y otra para ellos es insostenible.",
    "La verdad que nadie te cuenta: tu esposo y tus hijos no rechazan la comida saludable porque sea saludable. La rechazan porque fue servida de un modo que delata el juego — sin gracia, sin sabor. El problema nunca fue el ingrediente. Fue la presentación, el sazón y la técnica.",
    "Aquí aprendes a llevar cada principio del Método a la mesa de un modo que conquista el paladar más difícil de la casa. Una sola comida. Una sola olla. Una familia entera comiendo lo mismo — y solo tú sabiendo lo que hay detrás.",
    "En la Biblia la mesa nunca fue lugar de separación. En Hechos, los cristianos partían el pan en las casas con alegría y sencillez de corazón. Esta guía le devuelve eso a tu mesa.",
  ],
  compromissos: [
    {
      nome: "No anuncies el cambio",
      texto:
        "No llegues diciendo \"ahora vamos a comer saludable\". Eso activa la alarma de todos. Cocina — y deja que el sabor hable.",
    },
    {
      nome: "Empieza por lo que ya aman",
      texto:
        "No impongas platos nuevos y extraños. Toma los favoritos de la casa y mejóralos por dentro. Más fácil, funciona mejor.",
    },
    {
      nome: "Sé paciente con el paladar",
      texto:
        "Un paladar acostumbrado a lo ultraprocesado tarda semanas en reeducarse. Ve al ritmo de la casa. El bono secreto es la estrategia para los casos difíciles.",
    },
  ],
  aberturaAssinatura: "Con fe y cariño, Beatriz",

  secLogica: "Por qué esto funciona",
  logicaIntro: "Toda la estrategia se apoya en cuatro pilares. Entiende el principio antes de las técnicas.",
  pilares: [
    {
      nome: "1 · Empieza por la base que ya aceptan",
      texto:
        "Toda familia tiene platos ya aprobados (arroz con pollo, carne con papa, pasta del domingo). En vez de pelear con ese repertorio, la Mesa Única lo mejora por dentro. El plato parece el mismo — pero la versión que llega a la mesa es la saludable.",
    },
    {
      nome: "2 · El sabor viene del sazón, no de lo industrializado",
      texto:
        "Hierbas frescas, ajo, aceite de oliva, limón, especias y el tiempo de cocción correcto entregan un sabor igual de intenso — y mucho más profundo. No sirves comida sin gracia. Sirves comida de verdad, bien sazonada.",
    },
    {
      nome: "3 · La textura es la mitad de la batalla",
      texto:
        "Buena parte del rechazo (sobre todo de los niños) no es al sabor — es a la textura. Verdura blanda y aguada se rechaza de inmediato. La misma verdura crocante y dorada se devora.",
    },
    {
      nome: "4 · La transición es invisible y gradual",
      texto:
        "No cambias todo de una vez. Cambias un ingrediente por semana, sin que nadie lo note. Cuando la familia se da cuenta, ya come diferente desde hace un mes — y disfrutándolo. Es la esencia del bono secreto.",
    },
  ],

  secCategorias: "Las 5 adaptaciones para la familia",
  categoriasSub: "Toca una categoría: la base saludable es la misma, solo cambia la forma de servir.",
  lblDesafio: "El desafío",
  lblSuaVersao: "Tu versión",
  lblVersaoFamilia: "La versión de la familia",
  lblTecnica: "La técnica clave",
  categorias: [
    {
      id: "lentilhas",
      titulo: "Lentejas y granos",
      desafio:
        "La lenteja y el garbanzo son de los alimentos más nutritivos y bíblicos que existen — pero servidos como \"sopa marrón sin gracia\" son rechazados de inmediato.",
      suaVersao: "Lenteja cocida simple, con cebolla y hierbas, en un plato hondo.",
      versaoFamilia: [
        {
          nome: "Conviértela en \"albóndiga\" o hamburguesa",
          texto:
            "Lenteja cocida y escurrida, aplastada con condimentos, un huevo y harina de avena, moldeada en bolitas o discos y horneada hasta dorar. El niño come con la mano, el esposo cree que es bolita de carne.",
        },
        {
          nome: "Escóndela en lo ya aprobado",
          texto:
            "Lenteja cocida y procesada en la salsa de carne de la pasta. Desaparece en la textura, espesa y duplica el valor nutritivo del plato favorito.",
        },
        {
          nome: "Hazla relleno",
          texto:
            "Lenteja con comino y tomate se vuelve relleno de panqueca, tarta, pan árabe. El formato familiar acoge el ingrediente nuevo.",
        },
      ],
      tecnica:
        "Siempre dorar la cebolla lentamente antes. La base de cebolla caramelizada disfraza por completo el \"gusto a grano\" que algunas personas rechazan.",
    },
    {
      id: "peixes",
      titulo: "Pescados",
      desafio:
        "Muchas familias arrugan la nariz: \"olor fuerte\", \"lleno de espinas\", \"sabe a pescado\". Pero el pescado es una de las proteínas más antiinflamatorias que existen.",
      suaVersao: "Filete de pescado al horno con aceite, limón y hierbas.",
      versaoFamilia: [
        {
          nome: "Apánalo al horno",
          texto:
            "Pescado pasado por huevo y luego por pan rallado integral con queso y hierbas, horneado hasta crocante. Se vuelve \"pescado apanado\" — sin fritura y sin ultraprocesados.",
        },
        {
          nome: "Conviértelo en dedos",
          texto:
            "Corta en tiras, sazona, apana y hornea. Sirve con salsa de yogur y limón para mojar. Se vuelve picada, no \"cena de pescado\".",
        },
        {
          nome: "Disfrázalo en la salsa",
          texto:
            "Pescado desmechado en salsa de tomate casera, sobre pasta o arroz, pierde la cara de \"pescado puro\".",
        },
      ],
      tecnica:
        "Limón y hierbas frescas (eneldo y perejil) eliminan el olor fuerte. Sazona con anticipación y nunca cocines de más — el pescado reseco crea la mala fama.",
    },
    {
      id: "legumes",
      titulo: "Verduras y vegetales",
      desafio:
        "El mayor campo de batalla, sobre todo con los niños. La verdura mal preparada es la comida más rechazada del mundo.",
      suaVersao: "Verduras al vapor, con aceite y sal.",
      versaoFamilia: [
        {
          nome: "Asa, no hiervas en agua",
          texto:
            "Verduras asadas al horno con aceite quedan doradas, crocantes y dulces. Zanahoria, calabacín, ahuyama y brócoli asados se devoran hasta por quien \"no come verdura\".",
        },
        {
          nome: "Rállalas y escóndelas",
          texto:
            "Zanahoria, calabacín y remolacha ralladas finas desaparecen en salsas, tortas, panquecas, albóndigas y arroz. La familia come vegetal sin ver un pedazo.",
        },
        {
          nome: "Conviértelas en crema aterciopelada",
          texto:
            "Licuadas en sopa-crema, finalizadas con aceite, pierden la textura que asusta y ganan la cremosidad que reconforta.",
        },
        {
          nome: "Transfórmalas en \"palitos\"",
          texto:
            "Calabacín, zanahoria y ahuyama en palitos, sazonados y asados hasta dorar, se vuelven \"las papas de la casa\".",
        },
      ],
      tecnica:
        "Dorar lo es todo. La verdura asada hasta dorar desarrolla azúcar natural (caramelización) que transforma el sabor. Hervida en agua pierde color, sabor y textura.",
    },
    {
      id: "paes",
      titulo: "Panes y masa madre",
      desafio:
        "La familia es adicta al pan de fábrica, suave y blanco. El pan de masa madre, más denso, puede extrañarse al principio.",
      suaVersao: "Pan de masa madre puro, en tajadas.",
      versaoFamilia: [
        {
          nome: "Empieza por lo que tiene cara de antojo",
          texto:
            "Usa el pan para lo que ya aman: tostadas con aceite y hierbas, mini pizzas sobre la tajada, pancitos rellenos. El formato familiar acoge.",
        },
        {
          nome: "Haz el pancito dulce de la tarde",
          texto:
            "Pan levemente endulzado con miel y canela, servido tibio en las onces, conquista a los niños y reemplaza la torta industrializada.",
        },
        {
          nome: "Transición gradual de color",
          texto:
            "Empieza mezclando harina blanca e integral mitad y mitad, aumentando la integral con las semanas. El paladar se acostumbra sin notarlo.",
        },
      ],
      tecnica:
        "El pan tibio conquista a cualquiera. Sírvelo siempre levemente caliente, con un buen aceite o pasta casera. El calor y el aroma hacen la mitad del trabajo.",
    },
    {
      id: "sobremesas",
      titulo: "Postres",
      desafio: "La familia es adicta al azúcar refinada. Quitar el dulce de repente genera rebeldía.",
      suaVersao: "Frutas con miel, postres endulzados con dátil.",
      versaoFamilia: [
        {
          nome: "Usa el dulce natural en la forma que ya les gusta",
          texto:
            "Banano aplastado con canela y horneado se vuelve postre caliente. Manzana asada con miel y nueces tiene cara de tarta. Frutas licuadas y congeladas se vuelven helado casero.",
        },
        {
          nome: "Esconde el vegetal en el dulce",
          texto:
            "Torta de zanahoria, torta de remolacha con cacao, brownie de ahuyama — endulzados con miel o dátil. El niño come vegetal creyendo que es postre.",
        },
        {
          nome: "Haz el \"bombón\" de la casa",
          texto:
            "Dátil procesado con cacao y pasta de fruto seco se vuelve un dulcecito enrollado que reemplaza el bombón industrializado, sin azúcar refinada.",
        },
      ],
      tecnica:
        "Nunca anuncies \"es sin azúcar\". Sírvelo como postre normal. El dulce de la fruta y del dátil satisface — pero si avisas que es \"fit\" antes, el cerebro ya decide que no le va a gustar.",
    },
  ],

  secPaladar: "Engaña al Paladar",
  paladarIntro:
    "Tu caja de herramientas. Trucos de sabor y textura que transforman comida saludable en irresistible. Memoriza tres o cuatro y nunca más servirás un plato sin gracia.",
  saborTitulo: "Trucos de SABOR",
  truquesSabor: [
    {
      nome: "Cebolla y ajo dorados lentamente",
      texto:
        "Casi todo plato salado empieza mejor con cebolla sofrita despacio, a fuego bajo, hasta dorar y endulzar. Da profundidad que disfraza cualquier ingrediente \"extraño\". Nunca tengas prisa en esa etapa.",
    },
    {
      nome: "La sal del final es el ácido",
      texto:
        "Cuando parece que \"le falta algo\", casi nunca es más sal — es acidez. Un apretón de limón o hilo de vinagre de manzana al final despierta el sabor entero.",
    },
    {
      nome: "La capa de umami natural",
      texto:
        "Tomate maduro cocido, champiñones dorados, queso curado rallado, ajo asado. Agrega una de esas capas y el plato gana el cuerpo que engancha.",
    },
    {
      nome: "La grasa buena que da placer",
      texto:
        "Aceite de oliva crudo finalizando el plato entrega el placer que hace que la familia quiera repetir — y es antiinflamatorio. No escatimes en el hilo final.",
    },
    {
      nome: "Hierbas frescas en lugar del condimento en polvo",
      texto:
        "Perejil, cilantro, hierbabuena, albahaca y cebollín frescos al final dan frescor y aroma que ningún condimento en polvo alcanza. El secreto más barato de la cocina.",
    },
    {
      nome: "El dulce que equilibra",
      texto:
        "Una pizca de miel o cebolla caramelizada en la salsa de tomate corta la acidez y deja la salsa \"redonda\" como la de restaurante.",
    },
  ],
  texturaTitulo: "Trucos de TEXTURA",
  truquesTextura: [
    {
      nome: "Dorar para crear lo crocante",
      texto:
        "Asa verduras, granos y proteínas hasta dorarlos en los bordes. El contraste entre lo crocante de afuera y lo blando de adentro hace que la comida se devore.",
    },
    {
      nome: "Procesar para esconder",
      texto:
        "Vegetales procesados o rallados bien finos desaparecen en salsas, masas, albóndigas y tortas. Cuando la textura desaparece, el rechazo desaparece con ella.",
    },
    {
      nome: "Apanar al horno en lugar de freír",
      texto:
        "La costrita apanada y horneada entrega la experiencia de la fritura sin el aceite inflamatorio. Usa pan rallado integral con queso y hierbas.",
    },
    {
      nome: "La crema que reconforta",
      texto:
        "Sopas-crema, purés y salsas acogen el paladar y disfrazan vegetales que serían rechazados en pedazos. Licúa bien y finaliza con aceite.",
    },
    {
      nome: "El contraste en el plato",
      texto:
        "Un plato con una sola textura cansa. Combina lo cremoso con lo crocante: puré con semillas tostadas, sopa con crotones de pan de masa madre.",
    },
  ],
  regraOuroTitulo: "La regla de oro",
  regraOuro:
    "Nunca anuncies que la comida es \"saludable\", \"fit\", \"diet\" o \"sin azúcar\" antes de servir. El cerebro decide si le va a gustar antes de probar, según lo que le dices. Sírvela como comida normal y deliciosa. Deja que la amen primero. El elogio viene antes de la revelación.",

  secCriancas: "El Cuaderno de los Niños",
  criancasIntro:
    "Hacer que un niño coma comida de verdad no tiene que ser guerra. La mayor parte del rechazo no es al alimento — es a la forma, a la presentación y a la presión.",
  motivosTitulo: "Por qué el niño rechaza (y qué hacer)",
  motivos: [
    {
      titulo: "Rechazo por textura",
      solucao:
        "Los niños son sensibles a las texturas blandas y aguadas. Ofrece en su forma crocante, sequita, en palitos o apanado al horno. La misma verdura que escupe cocida, la come asada.",
    },
    {
      titulo: "Rechazo por apariencia",
      solucao:
        "Color extraño y pedazos visibles disparan el \"no quiero\". Esconde (rallado en salsas y masas) o hazlo divertido (formas, colores vivos, caritas en el plato).",
    },
    {
      titulo: "Rechazo por presión",
      solucao:
        "Cuanto más insistes, más asocia el alimento con algo malo. Ofrece sin presión, repetidas veces. Puede necesitar ver el alimento de 8 a 15 veces antes de aceptarlo. La paciencia vence.",
    },
  ],
  estrategiasTitulo: "Las estrategias prácticas",
  estrategias: [
    {
      nome: "Escóndelo en los favoritos",
      texto:
        "Zanahoria y calabacín en la salsa de la pasta, lenteja en la hamburguesa, coliflor en el puré, espinaca en la panqueca (\"panqueca de Hulk\").",
    },
    {
      nome: "Deja que el niño participe",
      texto: "El niño come lo que ayuda a hacer. Déjalo lavar, mezclar, armar el plato. El involucramiento derriba la resistencia.",
    },
    {
      nome: "Dales nombres divertidos",
      texto: "\"Arbolitos\" (brócoli), \"palitos mágicos\" (zanahoria asada), \"helado de fruta\" (banano congelado licuado).",
    },
    {
      nome: "Usa la salsa para mojar",
      texto: "Yogur casero, homus suave, salsa de tomate — y las verduras en palito se vuelven juego, no obligación.",
    },
    {
      nome: "Sirve poco y sin presión",
      texto: "Porción pequeña al lado de lo que ya come, sin obligar. El niño prueba por curiosidad; la aceptación crece con el tiempo.",
    },
    {
      nome: "Sé el ejemplo en la mesa",
      texto: "El niño copia lo que ve. Si comes las verduras con gusto, él quiere hacer igual. La mesa en familia es la mejor aula.",
    },
  ],
  lancheTitulo: "El algo de la tarde y la lonchera",
  lancheIntro: "El punto débil suele ser la lonchera. Sustituye poco a poco — nunca quites sin sustituir:",
  swaps: [
    { de: "Galleta rellena", para: "Pan de masa madre con pasta casera, o torta de banano" },
    { de: "Jugo de cajita", para: "Fruta picada o jugo natural" },
    { de: "Paquete de mecato", para: "Garbanzo crocante asado, o chips de verdura asada" },
    { de: "Dulces y golosinas", para: "Dátil relleno, frutas secas, dulcecito de cacao con dátil" },
  ],
  lancheRegra:
    "La regla: nunca quites sin sustituir. Cada vez que retires un industrializado, pon una versión casera rica en su lugar. El niño no siente que perdió — siente que ganó.",

  secDomingo: "La Mesa de Domingo",
  domingoIntro:
    "Platos bíblicos que impresionan hasta a la persona más exigente — y que nadie imagina que son saludables. Muestra, sin decir una palabra, que la comida de verdad puede ser la más rica de la mesa.",
  pratos: [
    {
      titulo: "Cordero (o pernil) asado a las hierbas del campo",
      texto:
        "La pieza central de la fiesta bíblica. Carne asada lentamente con ajo, romero, tomillo, hierbabuena y aceite, bañada en su propio jugo. La casa se llena del aroma y la carne se deshace. Sírvela con verduras asadas alrededor. Van a pensar que es un banquete — y lo es.",
    },
    {
      titulo: "Pollo entero dorado con limón y hierbas",
      texto:
        "Más accesible, igual de impresionante. Sazonado con pasta de ajo, hierbas y aceite, asado hasta que la piel quede dorada y crocante. Secreto: soltar la piel y sazonar por debajo, y dejarlo reposar antes de cortar. Es el plato que hace que la suegra pida la receta.",
    },
    {
      titulo: "Gran tabla de panes, pastas y aceitunas",
      texto:
        "Entrada sofisticada y puro alimento bíblico: pan de masa madre, homus, babaganoush, aceite con hierbas, aceitunas, tomates, queso blanco. Todos mojan y comparten. Es la mesa de Hechos.",
    },
    {
      titulo: "Pescado asado entero para la mesa",
      texto:
        "Pescado entero asado con limón, hierbas y aceite, llevado en la bandeja, tiene un impacto visual enorme — y es más fácil de lo que parece. Símbolo profundo en las Escrituras. Sírvelo con arroz y verduras coloridas.",
    },
    {
      titulo: "Postre de higos, miel y nueces",
      texto:
        "Cierra con el postre más bíblico que existe: higos asados con miel y nueces, servidos con yogur o crema natural. Parece de restaurante, sale en 15 minutos, sin un solo gramo de azúcar refinada.",
    },
  ],
  domingoOrientacao:
    "Antes de servir, reúne a la familia, lee un versículo corto y haz una oración de gratitud. Convierte el domingo en comunión, no solo comida. Así la mesa vuelve a ser el corazón del hogar.",

  secBonus: "Bono Secreto · La Transición Invisible",
  bonusVersiculo:
    "\"No menosprecies los días de los pequeños comienzos.\" — inspirado en Zacarías 4:10",
  bonusIntro:
    "Mi estrategia personal para el caso más difícil: el esposo (o hijo) que \"no come nada diferente\". El error de casi toda mujer es cambiarlo todo de una vez y generar rebeldía. La Transición Invisible hace lo contrario: gradual, silenciosa, en 4 fases a lo largo de 4 a 6 semanas. Nadie nota que está pasando — hasta que ya está hecho.",
  fases: [
    {
      fase: "Semana 1",
      titulo: "El cambio invisible de lo invisible",
      itens: [
        "Aceite de fritura → aceite de oliva",
        "Sal común → sal sazonada con hierbas",
        "Caldo en cubo → ajo, cebolla y hierbas de verdad",
        "Azúcar del café/jugo → redúcela a la mitad",
      ],
      texto:
        "Nadie nota ningún cambio. Pero el cuerpo ya recibe menos inflamación y el paladar empieza, discretamente, a reeducarse.",
    },
    {
      fase: "Semanas 2 y 3",
      titulo: "El añadido silencioso",
      itens: [
        "Verdura rallada dentro de la salsa de carne",
        "Lenteja procesada dentro de la hamburguesa",
        "Media porción de integral mezclada con la harina blanca",
        "Ensalada colorida al lado del plato de siempre, sin obligar",
      ],
      texto: "La persona sigue comiendo lo que le gusta. Tú enriqueces por dentro y plantas lo nuevo al lado, sin presión.",
    },
    {
      fase: "Semanas 4 y 5",
      titulo: "La sustitución gradual",
      itens: [
        "Pescado apanado al horno en lugar del industrializado",
        "Verduras asadas y doradas en lugar de las papas fritas",
        "Postre de fruta en lugar del dulce de paquete",
        "Pan de masa madre tibio en lugar del pan de fábrica",
      ],
      texto: "Cada sustitución mantiene el formato familiar (apanado, asado, dulce, pan), así la resistencia es mínima.",
    },
    {
      fase: "Semana 6 en adelante",
      titulo: "La mesa única consolidada",
      itens: [],
      texto:
        "Sin que nadie note el proceso, la familia ya come la Mesa Única en la mayoría de las comidas. El paladar se reeducó. El esposo que \"no comía nada diferente\" ahora pide tu pescado apanado y cree que siempre fue así.",
    },
  ],
  regrasTitulo: "Las tres reglas de oro",
  regras: [
    {
      nome: "Nunca anuncies",
      texto: "En el momento en que dices \"te estoy haciendo comer saludable\", el juego se acaba. Solo cocina. Deja que el sabor convenza.",
    },
    {
      nome: "Nunca retrocedas por una queja aislada",
      texto: "Habrá un día en que alguien se queje. No desarmes todo. Sigue firme y gentil. Una queja no es una derrota.",
    },
    {
      nome: "Cosecha el elogio antes de revelar",
      texto:
        "Espera a que el esposo elogie el plato algunas veces. Solo entonces, si quieres, cuéntale que es saludable. El elogio ya dado no se devuelve — y la revelación se vuelve orgullo, no resistencia.",
    },
  ],

  secFinal: "Palabra final",
  finalTexto: [
    "Querida, ahora tienes en las manos lo que faltaba para que el Método Alimentación Bíblica quepa en tu vida real. Cuidar de ti nunca debería significar comer sola, cocinar dos veces o volverte la \"rara de la familia\".",
    "No tienes que elegir entre tu salud y tu familia. Con la Mesa Única es todo lo mismo: una olla, una mesa, todos comiendo bien — y tú al mando silencioso, cuidando de cada uno a través de la comida.",
    "La mujer virtuosa de Proverbios 31 \"da alimento a su casa\". Nutría la casa entera, con sabiduría, con sus propias manos. Es exactamente eso lo que estás haciendo ahora.",
    "Empieza despacio, por lo que ellos ya aman, y deja que el sabor haga el trabajo. Que Dios bendiga tu cocina, tu mesa y a cada persona que se sienta en ella.",
  ],
  finalAssinatura: "Con fe y cariño, Beatriz Morales — Nutricionista Cristiana",

  guiaTitulo: "La guía completa",
  guiaSub: "Todo lo que necesitas, organizado para consultar cuando quieras.",
  voltar: "Volver al inicio",
};

export const mesaContent: Record<Lang, MesaContent> = { pt, es };
