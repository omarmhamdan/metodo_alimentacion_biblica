import type { Lang } from "./i18n";

// ─── Protocolo Anti-Inflamação de 7 Dias (upsell) ───────────────────────────
// Conteúdo completo do e-book, estruturado por idioma. Mesma lógica de idioma
// do resto do app (toggle ES/PT no canto superior direito).

export interface Refeicao {
  rotulo: string; // "Café da manhã" / "Almoço" / "Ceia"
  titulo: string;
  rendimento?: string;
  tempo?: string;
  ingredientes: string[];
  preparo: string[];
  substituicoes?: string;
  nota?: string;
}

export interface Dia {
  numero: number;
  nome: string;
  versiculo: string;
  versiculoRef: string;
  intro: string;
  aoAcordar: string;
  refeicoes: Refeicao[];
  hidratacao: string;
  ritual?: boolean;
}

export interface ItemFreio {
  nome: string;
  texto: string;
}

export interface SecaoCompras {
  titulo: string;
  itens: string[];
}

export interface FaseEspera {
  titulo: string;
  texto: string;
}

export interface Pergunta {
  q: string;
  a: string;
}

export interface ProtocoloContent {
  // Chrome
  nav: string;
  badge: string;
  unlocked: string;
  title: string;
  author: string;
  subtitle: string;
  back: string;
  diasTitulo: string;
  diasSub: string;
  guiaTitulo: string;
  guiaSub: string;
  voltarDias: string;
  comecarDia1: string;
  lerMais: string;
  lerMenos: string;

  // Seções (rótulos)
  secAbertura: string;
  secComoFunciona: string;
  secAguaJordao: string;
  secDias: string;
  secCompras: string;
  secGuia: string;
  secRitual: string;
  secEsperar: string;
  secErros: string;
  secFaq: string;
  secFinal: string;
  diaLabel: string;

  // Rótulos internos
  lblIngredientes: string;
  lblPreparo: string;
  lblSubstituicoes: string;
  lblAoAcordar: string;
  lblHidratacao: string;
  lblPorque: string;
  lblDicaBeatriz: string;

  // Abertura
  aberturaTitulo: string;
  aberturaTexto: string[];
  compromissos: { titulo: string; texto: string }[];
  aberturaAviso: string;
  aberturaAssinatura: string;

  // Como funciona
  comoFuncionaTexto: string[];
  fases: { titulo: string; texto: string }[];
  estrutura: { rotulo: string; texto: string }[];

  // Água do Jordão
  aguaVersiculo: string;
  aguaVersiculoRef: string;
  aguaTexto: string;
  aguaRendimento: string;
  aguaIngredientes: string[];
  aguaPreparo: string[];
  aguaPorque: string;
  aguaDica: string;

  // Dias
  dias: Dia[];

  // Lista de compras
  comprasIntro: string;
  comprasSecoes: SecaoCompras[];
  comprasDica: string;

  // Guia de alimentos
  guiaSoltamTitulo: string;
  guiaSoltam: ItemFreio[];
  guiaTravamTitulo: string;
  guiaTravam: ItemFreio[];
  guiaDica: string;

  // Ritual de drenagem
  ritualVersiculo: string;
  ritualVersiculoRef: string;
  ritualIntro: string;
  ritualPartes: {
    titulo: string;
    intro?: string;
    ingredientes?: string[];
    passos?: string[];
    fecho?: string;
  }[];
  ritualImportante: string;

  // O que esperar
  esperarFases: FaseEspera[];

  // Erros
  erros: ItemFreio[];

  // FAQ
  faq: Pergunta[];

  // Palavra final
  finalTexto: string[];
  finalAssinatura: string;
}

const pt: ProtocoloContent = {
  nav: "Anti-Inflam.",
  badge: "Exclusivo",
  unlocked: "✦ Você desbloqueou este bônus",
  title: "Protocolo Anti-Inflamação de 7 Dias",
  author: "Por Beatriz Morales — Nutricionista Cristã",
  subtitle: "Os sete dias que destravam a resposta do seu corpo.",
  back: "Voltar",
  diasTitulo: "Seus 7 dias",
  diasSub: "Toque em um dia para ver o cardápio completo.",
  guiaTitulo: "Guia completo",
  guiaSub: "Tudo o que você precisa saber, quando precisar.",
  voltarDias: "Todos os dias",
  comecarDia1: "Começar pelo Dia 1 →",
  lerMais: "Ler mais",
  lerMenos: "Ler menos",

  secAbertura: "Leia antes de começar",
  secComoFunciona: "Como o protocolo funciona",
  secAguaJordao: "A Água do Jordão",
  secDias: "Os 7 dias",
  secCompras: "Lista de compras",
  secGuia: "Guia dos alimentos",
  secRitual: "Bônus secreto · Ritual de Drenagem",
  secEsperar: "O que esperar em cada fase",
  secErros: "Erros que travam o protocolo",
  secFaq: "Perguntas que toda mulher faz",
  secFinal: "Palavra final",
  diaLabel: "Dia",

  lblIngredientes: "Ingredientes",
  lblPreparo: "Modo de preparo",
  lblSubstituicoes: "Substituições",
  lblAoAcordar: "Ao acordar",
  lblHidratacao: "Hidratação e movimento",
  lblPorque: "Por que funciona",
  lblDicaBeatriz: "Dica da Beatriz",

  aberturaTitulo: "Querida,",
  aberturaTexto: [
    "Se você está lendo isto, é porque decidiu não esperar. Decidiu que o seu corpo merece responder agora — não daqui a três meses.",
    'Este protocolo não é uma dieta da moda. Não é sacrifício. Não é passar fome. É um período curto e intencional em que você vai dar ao seu corpo exatamente aquilo de que ele precisa para soltar o "freio de mão" da inflamação acumulada — aquela que se instala depois de anos comendo o que a indústria inventou e que nenhuma quantidade de força de vontade, sozinha, consegue vencer.',
    "Pense em Naamã, o general que mergulhou sete vezes no rio Jordão. Não foram trinta mergulhos. Não foi um. Foram sete, na ordem certa, com obediência. E a carne dele se renovou como a de uma criança. Estes são os seus sete mergulhos.",
  ],
  compromissos: [
    {
      titulo: "Siga a ordem dos dias",
      texto:
        "Cada dia foi pensado para preparar o seguinte. Os primeiros limpam, os do meio drenam, os últimos estabilizam. Não pule, não embaralhe, não tente adiantar.",
    },
    {
      titulo: "Comece com a Água do Jordão",
      texto:
        "Toda manhã. É o gesto que abre o dia e ativa todo o resto. Esse passo nunca se pula.",
    },
    {
      titulo: "Beba água o dia inteiro",
      texto:
        "Muita. Parece contraditório, mas o corpo só solta o líquido retido quando recebe líquido limpo em abundância. Quem bebe pouco, incha mais.",
    },
    {
      titulo: "Seja gentil consigo mesma",
      texto:
        "Vão ter dias mais fáceis e dias em que o corpo reclama um pouco. Isso é normal e eu te explico o porquê em cada dia. Confie no processo.",
    },
  ],
  aberturaAviso:
    "Um lembrete de cuidado: este protocolo usa apenas alimentos naturais e seguros, em quantidades equilibradas. Mas se você tem alguma condição de saúde, é diabética, hipertensa, está grávida, amamentando, ou toma medicação contínua, converse com o seu médico antes de começar. Este material é um guia alimentar, não substitui orientação médica individual.",
  aberturaAssinatura: "Com fé e carinho, Beatriz",

  comoFuncionaTexto: [
    'Quando você entende o "porquê", você não desiste no meio. A inflamação crônica acumulada funciona como um freio de mão puxado no seu corpo: prende líquido nos tecidos (o inchaço no rosto, nos tornozelos, na barriga), trava as articulações e rouba a sua energia, porque o corpo gasta recursos tentando apagar um incêndio silencioso que nunca cessa.',
    "Estes sete dias atacam isso em três fases:",
  ],
  fases: [
    {
      titulo: "Fase 1 — Preparo e limpeza (Dias 1 e 2)",
      texto:
        "O corpo para de receber o que o inflama e começa a abrir as comportas. Você vai ao banheiro mais vezes. É o líquido retido começando a sair.",
    },
    {
      titulo: "Fase 2 — Drenagem intensa (Dias 3 e 4)",
      texto:
        "O auge. É quando o corpo solta de verdade. O Dia 3 traz o Ritual de Drenagem (seu bônus) para potencializar esse momento. É aqui que você vê a primeira mudança real no espelho.",
    },
    {
      titulo: "Fase 3 — Estabilização (Dias 5, 6 e 7)",
      texto:
        "O corpo se reorganiza no novo padrão. A energia sobe, o sono melhora, e você prepara a transição para o Método Alimentação Bíblica, onde vai viver daqui pra frente.",
    },
  ],
  estrutura: [
    { rotulo: "Ao acordar", texto: "a Água do Jordão, em jejum" },
    { rotulo: "Café da manhã", texto: "leve e anti-inflamatório, sustenta sem pesar" },
    { rotulo: "Almoço", texto: "a refeição principal, completa e colorida" },
    { rotulo: "Ceia", texto: "propositalmente leve, para o corpo descansar e drenar no sono" },
    { rotulo: "Ao longo do dia", texto: "água, e uma caminhada leve opcional" },
  ],

  aguaVersiculo: "...a sua carne tornou-se como a carne de um menino, e ficou purificado.",
  aguaVersiculoRef: "2 Reis 5:14",
  aguaTexto:
    "Esta é a bebida que abre cada um dos sete dias. Tome em jejum, em goles calmos, sentada, antes de qualquer outra coisa — antes do café, antes do celular, antes da correria.",
  aguaRendimento: "1 porção · 5 minutos",
  aguaIngredientes: [
    "250 ml de água morna (morna de verdade, nunca fervendo)",
    "Suco de meio limão",
    "1 cm de gengibre fresco ralado",
    "1 pitada de cúrcuma (açafrão-da-terra) em pó",
  ],
  aguaPreparo: [
    "Aqueça a água até ficar morna ao toque (cerca de 40°C — você segura o copo confortavelmente).",
    "Rale o gengibre fresco diretamente no copo.",
    "Esprema o meio limão.",
    "Adicione a pitada de cúrcuma e mexa bem.",
    "Beba devagar, em goles, ao longo de uns 5 minutos. Não vire de uma vez.",
  ],
  aguaPorque:
    "O gengibre e a cúrcuma são os dois alimentos anti-inflamatórios mais estudados pela ciência. O limão morno em jejum estimula a digestão e ajuda o fígado na limpeza. Em alguns dias você acrescenta um ingrediente extra à base — está sempre indicado no topo do dia.",
  aguaDica:
    "Se o gengibre arder muito no começo, comece com menos (meio centímetro) e vá aumentando ao longo da semana. O paladar se acostuma e logo você sente falta se faltar.",

  dias: [
    {
      numero: 1,
      nome: "O Preparo",
      versiculo: "Sede limpos vós que levais os vasos do Senhor.",
      versiculoRef: "Isaías 52:11",
      intro:
        "Querida, hoje o corpo começa a entender que algo mudou. Não espere fogos de artifício hoje — espere o começo. A leveza chega devagar, e é hoje que você planta a semente dela. Talvez sinta um pouco mais de fome que o normal. Beba água, respire, e siga firme.",
      aoAcordar: "Água do Jordão (base)",
      refeicoes: [
        {
          rotulo: "Café da manhã",
          titulo: "Mingau dourado de aveia, maçã e canela",
          rendimento: "1 porção · 10 minutos",
          ingredientes: [
            "3 colheres de sopa de aveia em flocos",
            "200 ml de água (ou 150 ml de água + 50 ml de leite vegetal)",
            "Meia maçã em cubos pequenos",
            "1 pitada generosa de canela",
            "1 colher de chá de mel",
            "5 nozes picadas",
            "1 pitada de cúrcuma (opcional)",
          ],
          preparo: [
            "Em uma panela pequena, leve a aveia e a água ao fogo médio.",
            "Cozinhe por 4 a 5 minutos, mexendo, até engrossar.",
            "Nos últimos 2 minutos, junte a maçã em cubos e a canela.",
            "Desligue, transfira para a tigela e finalize com o mel e as nozes picadas por cima.",
          ],
          substituicoes:
            "Sem aveia? Flocos de quinoa ou tapioca. Sem nozes? Castanhas, amêndoas ou sementes de girassol. Sem maçã? Pera ou banana.",
        },
        {
          rotulo: "Almoço",
          titulo: "Frango grelhado às ervas com legumes no vapor e arroz integral",
          rendimento: "1 porção · 30 minutos",
          ingredientes: [
            "1 filé de frango (cerca de 150 g)",
            "2 dentes de alho amassados",
            "1 ramo de alecrim (ou 1 colher de chá seco)",
            "Suco de meio limão",
            "1 xícara de brócolis em buquês",
            "1 cenoura em rodelas",
            "1 abobrinha em meias-luas",
            "3 colheres de sopa de arroz integral cozido",
            "Azeite de oliva extravirgem, sal e pimenta a gosto",
          ],
          preparo: [
            "Tempere o frango com alho, alecrim, suco de limão, sal e pimenta. Deixe pegar gosto por 10 minutos.",
            "Aqueça uma frigideira com um fio de azeite em fogo médio-alto. Grelhe o frango por 5 a 6 minutos de cada lado.",
            "Cozinhe os legumes no vapor por 6 a 8 minutos — firmes e vivos na cor, nunca moles.",
            "Monte o prato: arroz integral, legumes e frango fatiado.",
            "Finalize com um fio generoso de azeite cru por cima e mais um pouco de limão.",
          ],
          substituicoes:
            "Não come frango? Peixe branco ou ovos cozidos. Sem arroz integral? Quinoa ou batata-doce cozida.",
        },
        {
          rotulo: "Ceia",
          titulo: "Sopa leve de abobrinha e hortelã",
          rendimento: "1 porção · 20 minutos",
          ingredientes: [
            "2 abobrinhas médias em cubos",
            "Meia cebola picada",
            "1 dente de alho",
            "400 ml de água",
            "Folhas de hortelã fresca",
            "Azeite de oliva, sal e pimenta a gosto",
          ],
          preparo: [
            "Refogue a cebola e o alho em um fio de azeite até ficarem transparentes.",
            "Junte a abobrinha e refogue por 2 minutos.",
            "Adicione a água, tempere e cozinhe por 12 minutos.",
            "Bata no liquidificador até virar um creme liso.",
            "Volte à panela, ajuste o sal, e finalize com hortelã fresca picada e um fio de azeite.",
          ],
          substituicoes: "Sem abobrinha? Chuchu ou couve-flor funcionam igual.",
        },
      ],
      hidratacao:
        "Beba pelo menos 2 litros de água ao longo do dia. Se puder, faça uma caminhada leve de 15 minutos — não para queimar, mas para ativar a circulação e ajudar o corpo a abrir as comportas.",
    },
    {
      numero: 2,
      nome: "A Limpeza Começa",
      versiculo: "Lavai-vos, purificai-vos, tirai a maldade de vossos atos.",
      versiculoRef: "Isaías 1:16",
      intro:
        "Hoje você pode sentir o corpo trabalhando — ir mais ao banheiro, menos peso na barriga, talvez uma leve dor de cabeça no fim da tarde. Calma: é o corpo se livrando do excesso de sódio e do açúcar a que estava viciado. É desconforto de quem está limpando a casa, não de quem está adoecendo. Beba mais água. Amanhã passa.",
      aoAcordar: "Água do Jordão (base) + 3 folhas de hortelã amassadas",
      refeicoes: [
        {
          rotulo: "Café da manhã",
          titulo: "Iogurte natural com chia, frutas vermelhas e mel",
          rendimento: "1 porção · 5 minutos (+ 5 de descanso)",
          ingredientes: [
            "1 pote de iogurte natural integral sem açúcar (cerca de 170 g)",
            "1 colher de sopa de sementes de chia",
            "1 punhado de frutas vermelhas (frescas ou congeladas)",
            "1 colher de chá de mel",
            "1 colher de sopa de granola sem açúcar (opcional)",
          ],
          preparo: [
            "Em uma tigela, misture a chia no iogurte e deixe descansar 5 minutos.",
            "Adicione as frutas vermelhas por cima.",
            "Finalize com o mel e, se quiser, a granola.",
          ],
          substituicoes: "Sem frutas vermelhas? Qualquer fruta picada. Sem chia? Linhaça moída.",
        },
        {
          rotulo: "Almoço",
          titulo: "Peixe branco assado com salada de folhas e grão-de-bico",
          rendimento: "1 porção · 25 minutos",
          ingredientes: [
            "1 filé de peixe branco (tilápia, pescada ou merluza — cerca de 150 g)",
            "Suco de meio limão",
            "1 dente de alho amassado",
            "1 ramo de tomilho ou alecrim",
            "2 xícaras de folhas verdes variadas",
            "3 colheres de sopa de grão-de-bico cozido",
            "Meio tomate em cubos",
            "Meio pepino em cubos",
            "Azeite de oliva, sal e pimenta a gosto",
          ],
          preparo: [
            "Preaqueça o forno a 200°C.",
            "Tempere o peixe com limão, alho, sal, pimenta e a erva. Coloque em uma assadeira com um fio de azeite.",
            "Asse por 15 minutos, até a carne soltar em lascas.",
            "Monte a salada: folhas, grão-de-bico, tomate e pepino. Tempere com azeite, limão e sal.",
            "Sirva o peixe sobre ou ao lado da salada.",
          ],
          substituicoes:
            "Sem peixe? Frango grelhado ou 2 ovos cozidos. Sem grão-de-bico? Lentilha cozida ou feijão branco.",
        },
        {
          rotulo: "Ceia",
          titulo: "Caldo verde leve de couve",
          rendimento: "1 porção · 25 minutos",
          ingredientes: [
            "1 maço de couve cortada em tiras bem finas",
            "1 batata pequena em cubos",
            "Meia cebola picada",
            "1 dente de alho",
            "400 ml de água",
            "Azeite de oliva, sal e pimenta a gosto",
          ],
          preparo: [
            "Refogue a cebola e o alho em um fio de azeite.",
            "Junte a batata e a água, cozinhe por 15 minutos até a batata amaciar.",
            "Bata no liquidificador e volte à panela.",
            "Acrescente a couve bem fina e cozinhe por apenas 3 minutos — ela deve ficar verde-viva.",
            "Finalize com azeite e ajuste o sal.",
          ],
          substituicoes: "A batata pode virar mandioquinha ou meia xícara de abóbora.",
        },
      ],
      hidratacao:
        "2 litros de água. Se a vontade de doce aparecer (e ela vai, hoje), não lute — coma uma fruta ou uma tâmara. Substituir é mais inteligente do que resistir.",
    },
    {
      numero: 3,
      nome: "O Pico da Drenagem",
      versiculo: "Lava-te, e serás limpo.",
      versiculoRef: "2 Reis 5:13",
      ritual: true,
      intro:
        "Querida, hoje é o dia mais importante de toda a semana. É quando o corpo solta de verdade. Por isso, hoje à noite você vai usar o Ritual de Drenagem do 3º Dia — o bônus que reservei para você (veja a seção do Ritual). A maioria das mulheres acorda no Dia 4 com o rosto visivelmente mais leve. Hoje é o ponto de virada.",
      aoAcordar: "Água do Jordão (base) + 1 pitada extra de cúrcuma",
      refeicoes: [
        {
          rotulo: "Café da manhã",
          titulo: "Vitamina verde da manhã",
          rendimento: "1 porção · 5 minutos",
          ingredientes: [
            "1 folha de couve sem o talo",
            "Meia maçã verde",
            "Suco de 1 laranja",
            "1 cm de gengibre fresco",
            "200 ml de água gelada",
            "5 folhas de hortelã",
            "1 colher de chá de mel (opcional)",
          ],
          preparo: [
            "Coloque todos os ingredientes no liquidificador.",
            "Bata por 1 minuto, até ficar homogêneo.",
            "Beba em seguida, sem coar se conseguir (a fibra é parte do benefício).",
          ],
          substituicoes: "Sem couve? Espinafre. Sem maçã verde? Maçã comum ou meio pepino.",
        },
        {
          rotulo: "Almoço",
          titulo: "Bowl de quinoa, legumes assados e frango desfiado",
          rendimento: "1 porção · 35 minutos",
          ingredientes: [
            "3 colheres de sopa de quinoa cozida",
            "1 filé de frango (150 g) cozido e desfiado",
            "Meia abóbora pequena em cubos",
            "Meia cebola roxa em gomos",
            "Meio pimentão em tiras",
            "1 punhado de rúcula",
            "Azeite de oliva, cúrcuma, sal e pimenta a gosto",
            "Suco de limão",
          ],
          preparo: [
            "Preaqueça o forno a 200°C. Espalhe a abóbora, a cebola roxa e o pimentão em uma assadeira, regue com azeite, sal, pimenta e uma pitada de cúrcuma. Asse por 25 minutos.",
            "Cozinhe o frango temperado em água ou grelhado, e desfie.",
            "Monte o bowl: quinoa na base, legumes assados, frango desfiado e rúcula fresca por cima.",
            "Finalize com azeite cru e um aperto de limão.",
          ],
          substituicoes:
            "Sem quinoa? Arroz integral. Sem frango? Grão-de-bico assado (versão vegetariana completa).",
        },
        {
          rotulo: "Ceia",
          titulo: "Sopa de tomate assado e manjericão",
          rendimento: "1 porção · 30 minutos",
          ingredientes: [
            "4 tomates maduros cortados ao meio",
            "Meia cebola",
            "1 dente de alho com casca",
            "300 ml de água quente",
            "Folhas de manjericão fresco",
            "1 colher de chá de mel (equilibra a acidez)",
            "Azeite de oliva, sal e pimenta a gosto",
          ],
          preparo: [
            "Preaqueça o forno a 200°C. Asse os tomates, a cebola e o alho com casca, regados com azeite, sal e pimenta, por 20 minutos.",
            "Aperte o alho para fora da casca. Transfira tudo para o liquidificador com a água quente e metade do manjericão. Bata.",
            "Volte à panela, junte o mel, ajuste o sal e aqueça por 3 minutos.",
            "Sirva com o restante do manjericão fresco rasgado e um fio de azeite.",
          ],
          substituicoes: "",
          nota: "À noite: faça o Ritual de Drenagem do 3º Dia (veja a seção do Ritual).",
        },
      ],
      hidratacao:
        "2 a 2,5 litros de água hoje — é dia de drenagem, o corpo precisa de líquido limpo para soltar o retido. Caminhada leve de 20 minutos, se possível, ajuda muito hoje.",
    },
    {
      numero: 4,
      nome: "A Estabilização",
      versiculo: "Os que esperam no Senhor renovarão as suas forças.",
      versiculoRef: "Isaías 40:31",
      intro:
        "Depois do pico de ontem, hoje o corpo se reorganiza. Esta costuma ser a manhã da primeira grande surpresa no espelho — o rosto mais fino, os olhos menos inchados. A energia tende a subir a partir de hoje, e muitas mulheres relatam que voltaram a dormir a noite inteira. Você está vendo o freio soltar.",
      aoAcordar: "Água do Jordão (base)",
      refeicoes: [
        {
          rotulo: "Café da manhã",
          titulo: "Ovos mexidos com tomate e pão de fermentação natural",
          rendimento: "1 porção · 10 minutos",
          ingredientes: [
            "2 ovos",
            "1 tomate sem sementes em cubos",
            "1 fatia de pão de fermentação natural",
            "Orégano, sal e pimenta a gosto",
            "Azeite de oliva",
            "Cebolinha ou salsa picada (opcional)",
          ],
          preparo: [
            "Bata levemente os ovos com sal e pimenta.",
            "Em uma frigideira com um fio de azeite, refogue o tomate por 2 minutos.",
            "Junte os ovos e mexa em fogo baixo até o ponto cremoso (não deixe ressecar).",
            "Finalize com orégano e ervas frescas.",
            "Sirva com a fatia de pão levemente tostada.",
          ],
          substituicoes: "Não come ovo? Tofu mexido com cúrcuma fica parecido e nutritivo.",
        },
        {
          rotulo: "Almoço",
          titulo: "Lentilha refogada com arroz integral e salada de cenoura",
          rendimento: "1 porção · 25 minutos (com lentilha já cozida)",
          ingredientes: [
            "4 colheres de sopa de lentilha cozida",
            "Meia cebola picada",
            "1 dente de alho",
            "1 pitada de cominho",
            "2 colheres de sopa de arroz integral cozido",
            "1 cenoura ralada",
            "Folhas verdes a gosto",
            "Azeite de oliva, limão, sal e pimenta",
          ],
          preparo: [
            "Refogue a cebola e o alho no azeite até dourar levemente.",
            "Junte a lentilha cozida e o cominho. Refogue por 3 minutos, ajustando o sal.",
            "Monte o prato com arroz integral, lentilha refogada e salada de cenoura ralada com folhas verdes.",
            "Tempere a salada com azeite, limão e sal.",
          ],
          substituicoes: "Sem lentilha? Feijão ou grão-de-bico. A cenoura pode virar beterraba ralada.",
        },
        {
          rotulo: "Ceia",
          titulo: "Creme de abóbora com gengibre",
          rendimento: "1 porção · 25 minutos",
          ingredientes: [
            "300 g de abóbora cabotiá em cubos",
            "Meia cebola",
            "1 cm de gengibre fresco",
            "350 ml de água",
            "Azeite de oliva, sal e pimenta a gosto",
            "Sementes de abóbora torradas para finalizar (opcional)",
          ],
          preparo: [
            "Refogue a cebola e o gengibre em um fio de azeite.",
            "Junte a abóbora e a água, cozinhe por 15 minutos até amaciar.",
            "Bata no liquidificador até virar um creme liso e aveludado.",
            "Volte à panela, ajuste o sal, finalize com azeite e sementes de abóbora.",
          ],
          substituicoes: "Abóbora pode virar cenoura ou mandioquinha.",
        },
      ],
      hidratacao:
        "Mantenha os 2 litros. Repare como a sede está diferente quando o corpo está hidratado de verdade — ele para de estocar água.",
    },
    {
      numero: 5,
      nome: "A Leveza Instalada",
      versiculo: "O meu povo se fartará da minha bondade, diz o Senhor.",
      versiculoRef: "Jeremias 31:14",
      intro:
        "Querida, a esta altura o inchaço já cedeu bastante. As roupas começam a vestir diferente. Por isso, hoje o cardápio fica um pouco mais generoso: o corpo já está respondendo e merece ser celebrado, não punido. Cuidar de si nunca foi sobre privação. É sobre escolher bem.",
      aoAcordar: "Água do Jordão (base) + 3 folhas de hortelã",
      refeicoes: [
        {
          rotulo: "Café da manhã",
          titulo: "Crepioca recheada com queijo branco e tomate",
          rendimento: "1 porção · 10 minutos",
          ingredientes: [
            "1 ovo",
            "2 colheres de sopa de goma de tapioca",
            "1 colher de sopa de água",
            "1 fatia de queijo branco fresco",
            "Meio tomate em rodelas finas",
            "Orégano, sal e azeite a gosto",
          ],
          preparo: [
            "Em uma tigela, bata o ovo com a goma de tapioca, a água e uma pitada de sal até formar uma massa lisa.",
            "Aqueça uma frigideira antiaderente com um fio de azeite em fogo médio.",
            "Despeje a massa, espalhe bem e cozinhe por 2 minutos de cada lado.",
            "Recheie metade com o queijo e o tomate, polvilhe orégano, dobre ao meio e sirva.",
          ],
          substituicoes:
            "Sem queijo branco? Ricota ou pasta de grão-de-bico. Sem tomate? Folhas de espinafre refogadas.",
        },
        {
          rotulo: "Almoço",
          titulo: "Peixe grelhado com purê de abóbora e brócolis no vapor",
          rendimento: "1 porção · 30 minutos",
          ingredientes: [
            "1 filé de peixe (150 g)",
            "Suco de meio limão",
            "1 dente de alho",
            "250 g de abóbora cabotiá em cubos",
            "1 xícara de brócolis em buquês",
            "Azeite de oliva, noz-moscada, sal e pimenta a gosto",
          ],
          preparo: [
            "Tempere o peixe com limão, alho, sal e pimenta. Reserve.",
            "Cozinhe a abóbora em água até ficar bem macia (cerca de 15 minutos). Escorra e amasse com um garfo, adicionando azeite, sal e uma pitada de noz-moscada, até virar um purê.",
            "Cozinhe o brócolis no vapor por 6 minutos.",
            "Grelhe o peixe em frigideira quente com um fio de azeite, 4 minutos de cada lado.",
            "Monte o prato: purê de base, peixe por cima e brócolis ao lado. Finalize com azeite cru.",
          ],
          substituicoes:
            "O purê de abóbora pode virar purê de mandioquinha ou couve-flor. O peixe pode ser frango.",
        },
        {
          rotulo: "Ceia",
          titulo: "Salada morna de grão-de-bico",
          rendimento: "1 porção · 15 minutos",
          ingredientes: [
            "4 colheres de sopa de grão-de-bico cozido (morno)",
            "Meio tomate em cubos",
            "Meia cebola roxa picada fina",
            "1 colher de sopa de salsa fresca picada",
            "1 colher de chá de cominho",
            "Azeite de oliva, limão, sal e pimenta a gosto",
          ],
          preparo: [
            "Aqueça levemente o grão-de-bico cozido.",
            "Em uma tigela, misture o grão-de-bico morno com o tomate, a cebola roxa e a salsa.",
            "Tempere com azeite, limão, cominho, sal e pimenta.",
            "Misture bem e sirva ainda morno — o calor faz o grão absorver melhor o tempero.",
          ],
          substituicoes: "Grão-de-bico pode virar lentilha morna ou feijão branco.",
        },
      ],
      hidratacao:
        "Mantenha os 2 litros de água. Hoje, experimente vestir aquela roupa que estava apertada no início da semana — só para sentir, no corpo, o que está acontecendo.",
    },
    {
      numero: 6,
      nome: "A Preparação para a Vida Nova",
      versiculo: "Eis que faço uma coisa nova, agora sairá à luz.",
      versiculoRef: "Isaías 43:19",
      intro:
        "Faltam dois dias, querida. Hoje vem uma percepção importante: isto nunca foi um sacrifício temporário que termina e volta tudo ao que era. Foi um recomeço. O seu corpo já aprendeu o caminho. Hoje, enquanto cozinha, comece a pensar em como levar isso para a sua vida depois do 7º dia.",
      aoAcordar: "Água do Jordão (base)",
      refeicoes: [
        {
          rotulo: "Café da manhã",
          titulo: "Mingau de aveia com banana e canela",
          rendimento: "1 porção · 10 minutos",
          ingredientes: [
            "3 colheres de sopa de aveia em flocos",
            "200 ml de água ou leite vegetal",
            "Meia banana amassada",
            "1 pitada generosa de canela",
            "5 nozes picadas",
            "1 colher de chá de mel (opcional)",
          ],
          preparo: [
            "Cozinhe a aveia com o líquido em fogo médio por 5 minutos, mexendo.",
            "Nos últimos 2 minutos, junte a banana amassada e a canela.",
            "Sirva com as nozes e, se quiser, um fio de mel.",
          ],
          substituicoes: "Banana pode ser maçã ou pera. A aveia pode virar flocos de quinoa.",
        },
        {
          rotulo: "Almoço",
          titulo: "Frango ao curry suave com leite de coco e arroz integral",
          rendimento: "1 porção · 30 minutos",
          ingredientes: [
            "1 filé de frango (150 g) em cubos",
            "1 colher de chá de curry em pó",
            "Meia colher de chá de cúrcuma",
            "100 ml de leite de coco",
            "Meia cebola picada",
            "1 dente de alho",
            "Meia cenoura em cubos pequenos",
            "Meia abobrinha em cubos",
            "2 colheres de sopa de arroz integral cozido",
            "Azeite, sal e pimenta a gosto",
            "Coentro ou salsa para finalizar",
          ],
          preparo: [
            "Refogue a cebola e o alho no azeite até dourar.",
            "Junte o frango em cubos e sele por 5 minutos.",
            "Adicione o curry e a cúrcuma, mexendo por 1 minuto para liberar o aroma.",
            "Acrescente a cenoura, a abobrinha e o leite de coco. Cozinhe em fogo baixo por 10 minutos.",
            "Ajuste o sal, finalize com coentro ou salsa, e sirva com o arroz integral.",
          ],
          substituicoes:
            "Frango pode virar peixe firme ou grão-de-bico. O leite de coco pode ser reduzido pela metade.",
        },
        {
          rotulo: "Ceia",
          titulo: "Sopa de legumes variados",
          rendimento: "1 porção · 25 minutos",
          ingredientes: [
            "1 cenoura em cubos",
            "1 abobrinha em cubos",
            "1 chuchu pequeno em cubos",
            "Meia cebola",
            "1 dente de alho",
            "400 ml de água",
            "1 colher de sopa de salsa fresca",
            "Azeite, sal e pimenta a gosto",
          ],
          preparo: [
            "Refogue a cebola e o alho no azeite.",
            "Junte todos os legumes e refogue por 3 minutos.",
            "Adicione a água, tempere e cozinhe por 15 minutos.",
            "Bata metade da sopa no liquidificador e devolva à panela — dá corpo, mantendo pedaços para mastigar.",
            "Finalize com salsa fresca e azeite.",
          ],
          substituicoes: "Use qualquer legume que tiver em casa — esta sopa é uma faxina de geladeira saudável.",
        },
      ],
      hidratacao:
        "2 litros de água. Hoje, separe mentalmente (ou anote) três receitas do Método Alimentação Bíblica que você vai fazer na próxima semana. A transição começa na cabeça antes de começar na cozinha.",
    },
    {
      numero: 7,
      nome: "A Renovação",
      versiculo: "Tomando Jesus os pães, e havendo dado graças, repartiu-os.",
      versiculoRef: "João 6:11",
      intro:
        "O sétimo mergulho, querida. Hoje você fecha o ciclo. Pare diante do espelho de manhã e compare com calma: a mulher de hoje e a mulher do Dia 1. Não é vaidade — é gratidão. Hoje o cardápio é o mais farto e bonito da semana, porque é dia de celebração. Você merece.",
      aoAcordar: "Água do Jordão completa (base + 1 pitada de cúrcuma + 3 folhas de hortelã)",
      refeicoes: [
        {
          rotulo: "Café da manhã",
          titulo: "Bowl de iogurte, frutas, mel e granola",
          rendimento: "1 porção · 5 minutos",
          ingredientes: [
            "1 pote de iogurte natural integral sem açúcar",
            "Frutas variadas picadas (banana, morango, mamão, manga)",
            "1 colher de sopa de mel",
            "2 colheres de sopa de granola sem açúcar",
            "1 colher de chá de sementes de chia (opcional)",
          ],
          preparo: [
            "Em uma taça ou tigela bonita, coloque o iogurte na base.",
            "Monte as frutas por cima, em camadas coloridas.",
            "Finalize com o mel, a granola e a chia.",
            "Coma com calma. Hoje é dia de saborear, não de pressa.",
          ],
          substituicoes: "Use as frutas da estação que você mais gosta.",
        },
        {
          rotulo: "Almoço",
          titulo: "Salmão assado com legumes coloridos e quinoa",
          rendimento: "1 porção · 30 minutos",
          ingredientes: [
            "1 posta de salmão (150 g)",
            "Suco de meio limão",
            "1 ramo de endro (ou alecrim)",
            "Meio pimentão vermelho em tiras",
            "Meia abobrinha em meias-luas",
            "Meia cenoura em rodelas",
            "3 colheres de sopa de quinoa cozida (ou arroz integral)",
            "Azeite de oliva, sal e pimenta a gosto",
          ],
          preparo: [
            "Preaqueça o forno a 200°C.",
            "Tempere o salmão com limão, sal, pimenta e o endro.",
            "Em uma assadeira, espalhe os legumes regados com azeite e sal. Coloque o salmão por cima.",
            "Asse por 18 a 20 minutos, até o salmão estar opaco por fora e os legumes macios.",
            "Sirva com a quinoa ao lado e um fio de azeite cru por cima de tudo.",
          ],
          substituicoes:
            "Sem salmão? Qualquer peixe ou um bom filé de frango. Sem quinoa? Arroz integral ou batata-doce.",
        },
        {
          rotulo: "Ceia",
          titulo: "Caldo de Daniel (lentilha leve)",
          rendimento: "1 porção · 30 minutos",
          ingredientes: [
            "3 colheres de sopa de lentilha",
            "1 cenoura em cubos pequenos",
            "Meia cebola picada",
            "1 dente de alho",
            "1 pitada de cominho",
            "400 ml de água",
            "1 colher de sopa de salsa e coentro frescos",
            "Azeite de oliva, sal e pimenta",
            "Suco de limão para finalizar",
          ],
          preparo: [
            "Refogue a cebola e o alho no azeite. Junte o cominho.",
            "Acrescente a lentilha, a cenoura e a água. Cozinhe por 25 minutos, até a lentilha ficar macia.",
            "Ajuste o sal, finalize com salsa, coentro e um aperto de limão.",
            "Sirva quente.",
          ],
          substituicoes: "A lentilha pode virar grão-de-bico ou feijão.",
          nota: "O Caldo de Daniel fecha sua semana conectando você à história que começou tudo — o jovem que comendo simples ficou mais saudável que os reis.",
        },
      ],
      hidratacao:
        "Mantenha a hidratação. E hoje, antes de dormir, faça uma oração de gratidão pelo corpo que respondeu. Amanhã começa a vida nova — direto no Método Alimentação Bíblica.",
    },
  ],

  comprasIntro:
    "Organizada por seção do mercado, para você comprar tudo de uma vez, gastar pouco e não desperdiçar. As quantidades são para 1 pessoa nos 7 dias — multiplique se mais alguém acompanhar.",
  comprasSecoes: [
    {
      titulo: "Frutas",
      itens: [
        "Limões — 8 a 10",
        "Maçãs — 3 (sendo 1 verde)",
        "Banana — 2",
        "Laranja — 1",
        "Frutas vermelhas — 2 caixas (fresco ou congelado)",
        "Frutas variadas da estação para o Dia 7 — a gosto",
      ],
    },
    {
      titulo: "Legumes e verduras",
      itens: [
        "Gengibre fresco — 1 raiz grande",
        "Abobrinha — 4",
        "Brócolis — 2 maços",
        "Cenoura — 6",
        "Abóbora cabotiá — 1 pedaço grande",
        "Couve — 2 maços",
        "Tomate — 10",
        "Cebola — 4",
        "Cebola roxa — 2",
        "Pimentão vermelho — 2",
        "Chuchu — 1",
        "Batata — 1 pequena",
        "Alho — 1 cabeça",
        "Pepino — 2",
        "Folhas verdes variadas (alface, rúcula, espinafre) — 3 maços",
      ],
    },
    {
      titulo: "Ervas frescas",
      itens: [
        "Hortelã — 2 maços",
        "Manjericão — 1 maço",
        "Salsa — 1 maço",
        "Coentro — 1 maço",
        "Alecrim — 1 maço",
        "Tomilho — 1 maço",
        "Endro — 1 maço",
      ],
    },
    {
      titulo: "Proteínas",
      itens: [
        "Filé de frango — 5 porções (cerca de 750 g)",
        "Peixe branco (tilápia/pescada) — 2 filés",
        "Salmão — 1 posta",
        "Ovos — 1 dúzia",
      ],
    },
    {
      titulo: "Grãos, cereais e sementes",
      itens: [
        "Aveia em flocos — 1 pacote",
        "Quinoa — 1 pacote pequeno",
        "Arroz integral — 1 pacote",
        "Lentilha — 1 pacote",
        "Grão-de-bico — seco ou em conserva",
        "Goma de tapioca — 1 pacote pequeno",
        "Granola sem açúcar — 1 pacote",
        "Nozes — 1 pacote pequeno",
        "Sementes de chia — 1 pacote pequeno",
        "Sementes de abóbora — opcional",
      ],
    },
    {
      titulo: "Laticínios",
      itens: [
        "Iogurte natural integral sem açúcar — 4 a 5 potes",
        "Queijo branco fresco — 1 peça pequena",
      ],
    },
    {
      titulo: "Despensa e temperos",
      itens: [
        "Azeite de oliva extravirgem — compre um bom",
        "Cúrcuma (açafrão-da-terra) em pó",
        "Canela em pó",
        "Cominho",
        "Curry em pó",
        "Noz-moscada",
        "Orégano seco",
        "Mel puro — 1 pote",
        "Leite de coco — 1 caixa pequena",
        "Pão de fermentação natural — 1 unidade",
        "Sal e pimenta-do-reino",
      ],
    },
    {
      titulo: "Para o Ritual de Drenagem (Dia 3)",
      itens: ["Sal grosso ou sal de Epsom (sal amargo) — 1 pacote pequeno"],
    },
  ],
  comprasDica:
    "Dica da Beatriz: compre legumes e ervas no início da semana, mas se puder, faça uma segunda passada rápida na feira no Dia 4 para repor folhas e ervas frescas. Congele o que sobrar de proteína em porções.",

  guiaSoltamTitulo: "Os 5 que SOLTAM o freio da inflamação",
  guiaSoltam: [
    {
      nome: "Gengibre",
      texto:
        "A raiz anti-inflamatória mais estudada da natureza. O gingerol age diretamente sobre os processos inflamatórios. Está na sua Água do Jordão todos os dias. Use sem medo, sempre.",
    },
    {
      nome: "Cúrcuma (açafrão-da-terra)",
      texto:
        "A curcumina é um dos anti-inflamatórios naturais mais potentes. É muito mais aproveitada quando combinada com pimenta-do-reino e uma gordura boa — por isso, sempre que usar, adicione uma pitada de pimenta e um fio de azeite.",
    },
    {
      nome: "Azeite de oliva extravirgem",
      texto:
        "Contém o oleocantal, que age como um anti-inflamatório suave. Use sempre cru, por cima dos pratos prontos — o calor reduz suas propriedades. Um bom azeite é o investimento mais importante da cozinha.",
    },
    {
      nome: "Folhas verdes escuras",
      texto:
        "Couve, rúcula, espinafre. Ricas em água, fibra, magnésio e antioxidantes. Ajudam a drenar o líquido retido e alimentam as bactérias boas do intestino.",
    },
    {
      nome: "Peixes, especialmente o salmão",
      texto:
        "O ômega-3 é o nutriente que mais diretamente combate a inflamação celular. É o oposto químico dos óleos inflamatórios da indústria. Mantenha o hábito de 2 a 3 vezes por semana.",
    },
  ],
  guiaTravamTitulo: 'Os 5 que MANTÊM o freio puxado (mesmo parecendo "saudáveis")',
  guiaTravam: [
    {
      nome: "Adoçantes artificiais",
      texto:
        'O refrigerante "zero", o suco "diet", o iogurte "light" adoçado. Mantêm a inflamação ativa e bagunçam o intestino. Durante os 7 dias, corte completamente.',
    },
    {
      nome: 'Pães e biscoitos "integrais" industrializados',
      texto:
        'A palavra "integral" engana. Muitos têm açúcar escondido, óleos refinados e aditivos. Só o pão de fermentação natural de verdade passa no protocolo.',
    },
    {
      nome: 'Iogurtes adoçados e "de frutas"',
      texto:
        "Muitos têm tanto açúcar quanto uma sobremesa. Use sempre o iogurte natural integral sem açúcar, e adoce você mesma com fruta e mel.",
    },
    {
      nome: "Excesso de sal e embutidos",
      texto:
        "O sódio em excesso é o maior responsável pela retenção de líquido. Cuidado com presunto, peito de peru, salsicha, salgadinhos, temperos em cubo e molhos prontos. Tempere com ervas, alho, limão e azeite.",
    },
    {
      nome: "Óleos vegetais refinados",
      texto:
        "Soja, milho, canola, girassol. Altamente inflamatórios, estão na maioria dos processados e frituras. Durante o protocolo, use exclusivamente azeite de oliva.",
    },
  ],
  guiaDica:
    "Não precisa decorar listas. A regra é simples: quanto mais perto da forma que Deus criou, melhor. Se veio de uma planta, de um animal, da terra — pode. Se veio de uma fábrica, com nome que você não sabe pronunciar, desconfie.",

  ritualVersiculo: "Lava-te, e serás limpo.",
  ritualVersiculoRef: "2 Reis 5:13",
  ritualIntro:
    "Este é o recurso que eu uso pessoalmente, reservado como surpresa para você. É feito uma única vez, na noite do 3º Dia — no pico da drenagem. São três partes, em sequência, na hora de dormir. Reserve uns 40 minutos só para você. Tranque a porta, silencie o celular. Este é o seu momento.",
  ritualPartes: [
    {
      titulo: "Parte 1 — O Chá da Drenagem (prepare primeiro)",
      ingredientes: [
        "300 ml de água",
        "1 cm de gengibre fatiado",
        "3 ramos de hortelã fresca",
        "1 pau de canela",
        "Suco de meio limão",
      ],
      passos: [
        "Ferva a água com o gengibre, a canela e a hortelã por 5 minutos.",
        "Desligue o fogo, tampe e deixe em infusão por mais 5 minutos.",
        "Coe e adicione o suco de limão.",
        "Beba morno, em goles calmos, enquanto faz a Parte 2.",
      ],
    },
    {
      titulo: "Parte 2 — O Escalda-Pés das Ervas",
      intro:
        "Você vai precisar de: 1 bacia grande com água morna, 2 colheres de sopa de sal grosso (ou sal de Epsom), 1 punhado de alecrim e hortelã frescos.",
      passos: [
        "Dissolva o sal na água morna da bacia.",
        "Junte o alecrim e a hortelã, amassando levemente as folhas para liberar o aroma.",
        "Mergulhe os pés por 15 a 20 minutos, enquanto bebe o chá.",
        "Aproveite para respirar fundo, orar, ou simplesmente ficar em silêncio.",
      ],
    },
    {
      titulo: "Parte 3 — A Automassagem de Drenagem",
      intro: "Depois de secar bem os pés, com um pouco de azeite ou creme nas mãos para deslizar:",
      passos: [
        "Comece pelos tornozelos e suba em direção aos joelhos, sempre de baixo para cima, com pressão suave e firme. Nunca de cima para baixo.",
        "Faça 10 movimentos longos em cada perna, do tornozelo ao joelho.",
        "Depois, do joelho até a virilha, mais 10 movimentos em cada perna.",
        "Por fim, com as duas mãos sobre a barriga, faça círculos suaves no sentido horário — 20 vezes.",
      ],
      fecho:
        "Antes de deitar, beba mais um copo de água. Durma com as pernas levemente elevadas (um travesseiro embaixo dos pés). Na manhã do 4º Dia, observe o rosto, os tornozelos e a barriga.",
    },
  ],
  ritualImportante:
    "Este ritual pode ser repetido uma vez por semana, sempre que sentir o corpo mais inchado — depois de uma viagem, das festas, de uma fase de estresse. Ele é seu para sempre.",

  esperarFases: [
    {
      titulo: "Dias 1 e 2",
      texto:
        "Você pode sentir um pouco mais de fome, vontade de doce, e talvez uma leve dor de cabeça no Dia 2. É o corpo se desacostumando do excesso de açúcar e sódio. É temporário e é bom sinal. Beba mais água.",
    },
    {
      titulo: "Dias 3 e 4",
      texto:
        "O auge da drenagem. Você vai ao banheiro mais vezes. No Dia 4 de manhã costuma vir a primeira grande surpresa no espelho. A energia começa a subir.",
    },
    {
      titulo: "Dias 5, 6 e 7",
      texto:
        'Leveza instalada, sono melhor, disposição maior, roupas vestindo diferente. A sensação deixa de ser "esforço" e vira "como eu vivia sem isso?".',
    },
  ],

  erros: [
    {
      nome: "Beber pouca água",
      texto:
        "O erro número um. Sem água limpa em abundância, o corpo não solta o líquido retido. Quem bebe pouco incha mais.",
    },
    {
      nome: "Pular a Água do Jordão",
      texto: "Ela abre o dia e ativa o metabolismo da limpeza. Pular é tirar a fundação do protocolo.",
    },
    {
      nome: "Beliscar fora das refeições",
      texto:
        "O corpo precisa de intervalos para drenar. Se a fome apertar, beba água ou um chá de ervas, e coma uma fruta se necessário.",
    },
    {
      nome: "Usar sal demais",
      texto: "O sódio é o inimigo do desinchaço. Tempere com ervas, alho, limão e azeite — o paladar se reeduca em poucos dias.",
    },
    {
      nome: "Desistir no Dia 2",
      texto:
        "O Dia 2 costuma ser o mais difícil. Quem atravessa o Dia 2 chega ao Dia 4 e vê o resultado. Aguente firme — é só um dia.",
    },
  ],

  faq: [
    {
      q: "Posso tomar café durante o protocolo?",
      a: "Pode, um por dia, sem açúcar (ou adoçado com um fio de mel). Só não substitua a Água do Jordão pelo café — tome a água primeiro, o café depois.",
    },
    {
      q: "E se eu furar em uma refeição?",
      a: "Não desista por causa de um deslize. Furou no almoço? Retome na próxima refeição. O protocolo só se quebra se você usar o erro como desculpa para parar.",
    },
    {
      q: "Posso repetir o protocolo depois?",
      a: "Sim. Foi feito para ser repetido sempre que sentir o corpo pesado de novo. Muitas mulheres fazem uma vez por mês.",
    },
    {
      q: "Vou passar fome?",
      a: "Não. Você vai comer três refeições por dia, completas. A diferença é a qualidade do que entra, não a quantidade que falta.",
    },
    {
      q: "Posso fazer junto com a família?",
      a: "Pode, e é ótimo. Só multiplique as quantidades da lista de compras.",
    },
    {
      q: "Não vi tanto resultado quanto esperava. O que faço?",
      a: "Cada corpo responde no seu tempo, e 7 dias é um começo. Revise os erros que travam — quase sempre o resultado menor está ligado a pouca água ou sal em excesso. E o resultado profundo vem da continuidade no Método Alimentação Bíblica.",
    },
  ],

  finalTexto: [
    "Querida, você completou os sete mergulhos. O que você fez nestes sete dias não foi uma dieta relâmpago. Você ensinou o seu corpo a funcionar sem o freio puxado. Soltou a inflamação que estava te travando há anos. E provou para si mesma que consegue.",
    "Agora vem a parte que de verdade muda uma vida: a continuidade. O Protocolo foi a largada. O Método Alimentação Bíblica é a estrada — a forma de viver e comer que mantém o seu corpo leve, com energia e em paz, para sempre.",
    "A partir de amanhã, abra o seu Método e escolha uma receita para o café da manhã. Um passo por vez, como você fez aqui. E sempre que o corpo voltar a pesar, volte aos sete mergulhos. Eles estarão sempre aqui, esperando por você.",
    "Que Deus continue renovando o seu corpo, a sua energia e o seu coração. Você cuidou do templo que Ele te confiou. E isso, querida, é uma forma de adoração.",
  ],
  finalAssinatura: "Com fé e carinho, Beatriz Morales — Nutricionista Cristã",
};

const es: ProtocoloContent = {
  nav: "Antiinflam.",
  badge: "Exclusivo",
  unlocked: "✦ Has desbloqueado este bono",
  title: "Protocolo Antiinflamación de 7 Días",
  author: "Por Beatriz Morales — Nutricionista Cristiana",
  subtitle: "Los siete días que liberan la respuesta de tu cuerpo.",
  back: "Volver",
  diasTitulo: "Tus 7 días",
  diasSub: "Toca un día para ver el menú completo.",
  guiaTitulo: "Guía completa",
  guiaSub: "Todo lo que necesitas saber, cuando lo necesites.",
  voltarDias: "Todos los días",
  comecarDia1: "Empezar por el Día 1 →",
  lerMais: "Leer más",
  lerMenos: "Leer menos",

  secAbertura: "Lee esto antes de comenzar",
  secComoFunciona: "Cómo funciona el protocolo",
  secAguaJordao: "El Agua del Jordán",
  secDias: "Los 7 días",
  secCompras: "Lista de compras",
  secGuia: "Guía de alimentos",
  secRitual: "Bono secreto · Ritual de Drenaje",
  secEsperar: "Lo que puedes esperar en cada fase",
  secErros: "Errores que traban el protocolo",
  secFaq: "Preguntas que toda mujer hace",
  secFinal: "Palabra final",
  diaLabel: "Día",

  lblIngredientes: "Ingredientes",
  lblPreparo: "Modo de preparación",
  lblSubstituicoes: "Sustituciones",
  lblAoAcordar: "Al despertar",
  lblHidratacao: "Hidratación y movimiento",
  lblPorque: "Por qué funciona",
  lblDicaBeatriz: "Consejo de Beatriz",

  aberturaTitulo: "Querida,",
  aberturaTexto: [
    "Si estás leyendo esto, es porque decidiste no esperar. Decidiste que tu cuerpo merece responder ahora — no dentro de tres meses.",
    'Este protocolo no es una dieta de moda. No es sacrificio. No es pasar hambre. Es un período corto e intencional en el que le vas a dar a tu cuerpo exactamente lo que necesita para soltar el "freno de mano" de la inflamación acumulada — esa que se instala después de años comiendo lo que la industria inventó y que ninguna cantidad de fuerza de voluntad, sola, puede vencer.',
    "Piensa en Naamán, el general que se sumergió siete veces en el río Jordán. No fueron treinta inmersiones. No fue una. Fueron siete, en el orden correcto, con obediencia. Y su carne se renovó como la de un niño. Estos son tus siete zambullidos.",
  ],
  compromissos: [
    {
      titulo: "Sigue el orden de los días",
      texto:
        "Cada día fue pensado para preparar el siguiente. Los primeros limpian, los del medio drenan, los últimos estabilizan. No te saltes, no mezcles, no trates de adelantar.",
    },
    {
      titulo: "Comienza con el Agua del Jordán",
      texto:
        "Cada mañana. Es el gesto que abre el día y activa todo lo demás. Este paso nunca se omite.",
    },
    {
      titulo: "Toma agua todo el día",
      texto:
        "Mucha. Parece contradictorio, pero el cuerpo solo suelta el líquido retenido cuando recibe líquido limpio en abundancia. Quien toma poco, se hincha más.",
    },
    {
      titulo: "Sé gentil contigo misma",
      texto:
        "Habrá días más fáciles y días en que el cuerpo se queje un poco. Eso es normal y te lo explicaré en cada día. Confía en el proceso.",
    },
  ],
  aberturaAviso:
    "Un recordatorio de cuidado: este protocolo usa solo alimentos naturales y seguros, en cantidades equilibradas. Pero si tienes alguna condición de salud, eres diabética, hipertensa, estás embarazada, lactando, o tomas medicación continua, habla con tu médico antes de comenzar. Este material es una guía alimentaria, no sustituye la orientación médica individual.",
  aberturaAssinatura: "Con fe y cariño, Beatriz",

  comoFuncionaTexto: [
    'Cuando entiendes el "porqué", no abandonas a la mitad. La inflamación crónica acumulada funciona como un freno de mano jalado en tu cuerpo: retiene líquido en los tejidos (la hinchazón en el rostro, los tobillos, la barriga), bloquea las articulaciones y roba tu energía, porque el cuerpo gasta recursos tratando de apagar un incendio silencioso que nunca cesa.',
    "Estos siete días atacan eso en tres fases:",
  ],
  fases: [
    {
      titulo: "Fase 1 — Preparación y limpieza (Días 1 y 2)",
      texto:
        "El cuerpo deja de recibir lo que lo inflama y comienza a abrir las compuertas. Irás al baño con más frecuencia. Es el líquido retenido comenzando a salir.",
    },
    {
      titulo: "Fase 2 — Drenaje intenso (Días 3 y 4)",
      texto:
        "El punto álgido. Es cuando el cuerpo suelta de verdad. El Día 3 trae el Ritual de Drenaje (tu bono) para potenciar ese momento. Es aquí donde ves el primer cambio real en el espejo.",
    },
    {
      titulo: "Fase 3 — Estabilización (Días 5, 6 y 7)",
      texto:
        "El cuerpo se reorganiza en el nuevo patrón. La energía sube, el sueño mejora, y te preparas para la transición al Método Alimentación Bíblica, donde vivirás de aquí en adelante.",
    },
  ],
  estrutura: [
    { rotulo: "Al despertar", texto: "el Agua del Jordán, en ayunas" },
    { rotulo: "Desayuno", texto: "liviano y antiinflamatorio, sustenta sin pesar" },
    { rotulo: "Almuerzo", texto: "la comida principal, completa y colorida" },
    { rotulo: "Cena", texto: "intencionalmente liviana, para descansar y drenar durante el sueño" },
    { rotulo: "A lo largo del día", texto: "agua, y una caminata suave opcional" },
  ],

  aguaVersiculo: "...su carne se volvió como la carne de un niño, y quedó limpio.",
  aguaVersiculoRef: "2 Reyes 5:14",
  aguaTexto:
    "Esta es la bebida que abre cada uno de los siete días. Tómala en ayunas, en sorbos lentos, sentada, antes de cualquier otra cosa — antes del café, antes del celular, antes de la prisa.",
  aguaRendimento: "1 porción · 5 minutos",
  aguaIngredientes: [
    "250 ml de agua tibia (tibia de verdad, nunca hirviendo)",
    "Jugo de medio limón",
    "1 cm de jengibre fresco rallado",
    "1 pizca de cúrcuma en polvo",
  ],
  aguaPreparo: [
    "Calienta el agua hasta que esté tibia al tacto (unos 40°C — sostienes el vaso cómodamente).",
    "Ralla el jengibre fresco directamente en el vaso.",
    "Exprime el medio limón.",
    "Agrega la pizca de cúrcuma y revuelve bien.",
    "Tómala despacio, en sorbos, durante unos 5 minutos. No la tomes de un golpe.",
  ],
  aguaPorque:
    "El jengibre y la cúrcuma son los dos alimentos antiinflamatorios más estudiados por la ciencia. El limón tibio en ayunas estimula la digestión y ayuda al hígado en su limpieza. En algunos días agregarás un ingrediente extra a la base — siempre está indicado al inicio del día.",
  aguaDica:
    "Si el jengibre te arde mucho al principio, comienza con menos (medio centímetro) y ve aumentando a lo largo de la semana. El paladar se acostumbra, y pronto lo extrañarás si falta.",

  dias: [
    {
      numero: 1,
      nome: "La Preparación",
      versiculo: "Lavaos y limpiaos; quitad la iniquidad de vuestras obras.",
      versiculoRef: "Isaías 1:16",
      intro:
        "Querida, hoy el cuerpo comienza a entender que algo cambió. No esperes fuegos artificiales hoy — espera el comienzo. La ligereza llega despacio, y hoy plantas su semilla. Quizás sientas un poco más de hambre de lo normal. Toma agua, respira, y sigue firme.",
      aoAcordar: "Agua del Jordán (base)",
      refeicoes: [
        {
          rotulo: "Desayuno",
          titulo: "Avena dorada con manzana y canela",
          rendimento: "1 porción · 10 minutos",
          ingredientes: [
            "3 cucharadas de avena en hojuelas",
            "200 ml de agua (o 150 ml de agua + 50 ml de bebida vegetal)",
            "Media manzana en cubos pequeños",
            "1 pizca generosa de canela",
            "1 cucharadita de miel",
            "5 nueces picadas",
            "1 pizca de cúrcuma (opcional)",
          ],
          preparo: [
            "En una olla pequeña, lleva la avena y el agua a fuego medio.",
            "Cocina por 4 a 5 minutos, revolviendo, hasta que espese.",
            "En los últimos 2 minutos, incorpora la manzana en cubos y la canela.",
            "Apaga, transfiere al tazón y finaliza con la miel y las nueces picadas encima.",
          ],
          substituicoes:
            "¿Sin avena? Hojuelas de quinoa o tapioca. ¿Sin nueces? Almendras, maní o semillas de girasol. ¿Sin manzana? Pera o banano.",
        },
        {
          rotulo: "Almuerzo",
          titulo: "Pollo a las hierbas con verduras al vapor y arroz integral",
          rendimento: "1 porción · 30 minutos",
          ingredientes: [
            "1 filete de pollo (unos 150 g)",
            "2 dientes de ajo machacados",
            "1 rama de romero (o 1 cucharadita seco)",
            "Jugo de medio limón",
            "1 taza de brócoli en ramitos",
            "1 zanahoria en rodajas",
            "1 calabacín en medias lunas",
            "3 cucharadas de arroz integral cocido",
            "Aceite de oliva extra virgen, sal y pimienta al gusto",
          ],
          preparo: [
            "Sazona el pollo con ajo, romero, jugo de limón, sal y pimienta. Deja que tome sabor por 10 minutos.",
            "Calienta una sartén con un hilo de aceite a fuego medio-alto. Cocina el pollo por 5 a 6 minutos de cada lado.",
            "Cocina las verduras al vapor por 6 a 8 minutos — firmes y vivas en color, nunca blandas.",
            "Arma el plato: arroz integral, verduras y pollo en láminas.",
            "Finaliza con un hilo generoso de aceite crudo por encima y un poco más de limón.",
          ],
          substituicoes:
            "¿No comes pollo? Pescado blanco o huevos cocidos. ¿Sin arroz integral? Quinoa o papa criolla cocida.",
        },
        {
          rotulo: "Cena",
          titulo: "Sopa liviana de calabacín y hierbabuena",
          rendimento: "1 porción · 20 minutos",
          ingredientes: [
            "2 calabacines medianos en cubos",
            "Media cebolla picada",
            "1 diente de ajo",
            "400 ml de agua",
            "Hojas de hierbabuena fresca",
            "Aceite de oliva, sal y pimienta al gusto",
          ],
          preparo: [
            "Sofríe la cebolla y el ajo en un hilo de aceite hasta que queden transparentes.",
            "Incorpora el calabacín y sofríe por 2 minutos.",
            "Agrega el agua, sazona y cocina por 12 minutos.",
            "Licúa hasta obtener una crema lisa.",
            "Regresa a la olla, ajusta la sal, y finaliza con hierbabuena fresca picada y un hilo de aceite.",
          ],
          substituicoes: "¿Sin calabacín? Cidra o coliflor funcionan igual.",
        },
      ],
      hidratacao:
        "Toma al menos 2 litros de agua a lo largo del día. Si puedes, haz una caminata suave de 15 minutos — no para quemar, sino para activar la circulación y ayudar al cuerpo a abrir las compuertas.",
    },
    {
      numero: 2,
      nome: "La Limpieza Comienza",
      versiculo: "Lavaos y limpiaos; quitad la iniquidad de vuestras obras.",
      versiculoRef: "Isaías 1:16",
      intro:
        "Hoy puedes sentir el cuerpo trabajando — ir más al baño, menos peso en la barriga, quizás un leve dolor de cabeza al final de la tarde. Tranquila: es el cuerpo liberándose del exceso de sodio y azúcar al que estaba acostumbrado. Es la incomodidad de quien limpia la casa, no de quien enferma. Toma más agua. Mañana pasa.",
      aoAcordar: "Agua del Jordán (base) + 3 hojas de hierbabuena machacadas",
      refeicoes: [
        {
          rotulo: "Desayuno",
          titulo: "Yogur natural con chía, frutos rojos y miel",
          rendimento: "1 porción · 5 minutos (+ 5 de reposo)",
          ingredientes: [
            "1 pote de yogur natural entero sin azúcar (unos 170 g)",
            "1 cucharada de semillas de chía",
            "1 puñado de frutos rojos (frescos o congelados)",
            "1 cucharadita de miel",
            "1 cucharada de granola sin azúcar (opcional)",
          ],
          preparo: [
            "En un tazón, mezcla la chía en el yogur y deja reposar 5 minutos.",
            "Agrega los frutos rojos encima.",
            "Finaliza con la miel y, si quieres, la granola.",
          ],
          substituicoes: "¿Sin frutos rojos? Cualquier fruta picada. ¿Sin chía? Linaza molida.",
        },
        {
          rotulo: "Almuerzo",
          titulo: "Pescado blanco al horno con ensalada de hojas y garbanzo",
          rendimento: "1 porción · 25 minutos",
          ingredientes: [
            "1 filete de pescado blanco (tilapia, merluza o corvina — unos 150 g)",
            "Jugo de medio limón",
            "1 diente de ajo machacado",
            "1 rama de tomillo o romero",
            "2 tazas de hojas verdes variadas",
            "3 cucharadas de garbanzo cocido",
            "Medio tomate en cubos",
            "Medio pepino en cubos",
            "Aceite de oliva, sal y pimienta al gusto",
          ],
          preparo: [
            "Precalienta el horno a 200°C.",
            "Sazona el pescado con limón, ajo, sal, pimienta y la hierba. Ponlo en una bandeja con un hilo de aceite.",
            "Hornea por 15 minutos, hasta que la carne se deshaga en láminas.",
            "Arma la ensalada: hojas, garbanzo, tomate y pepino. Sazona con aceite, limón y sal.",
            "Sirve el pescado sobre o al lado de la ensalada.",
          ],
          substituicoes:
            "¿Sin pescado? Pollo a la plancha o 2 huevos cocidos. ¿Sin garbanzo? Lentejas cocidas o fríjol blanco.",
        },
        {
          rotulo: "Cena",
          titulo: "Caldo de col liviano",
          rendimento: "1 porción · 25 minutos",
          ingredientes: [
            "1 manojo de col rizada (o repollo) en tiras muy finas",
            "1 papa pequeña en cubos",
            "Media cebolla picada",
            "1 diente de ajo",
            "400 ml de agua",
            "Aceite de oliva, sal y pimienta al gusto",
          ],
          preparo: [
            "Sofríe la cebolla y el ajo en un hilo de aceite.",
            "Agrega la papa y el agua, cocina por 15 minutos hasta que esté blanda.",
            "Licúa y regresa a la olla.",
            "Incorpora la col en tiras muy finas y cocina solo 3 minutos — debe quedar de color verde vivo.",
            "Finaliza con aceite y ajusta la sal.",
          ],
          substituicoes: "La papa puede cambiarse por arracacha o media taza de ahuyama.",
        },
      ],
      hidratacao:
        "2 litros de agua. Si te dan ganas de algo dulce (y las tendrás, hoy), no pelees — come una fruta o un dátil. Sustituir es más inteligente que resistir.",
    },
    {
      numero: 3,
      nome: "El Pico del Drenaje",
      versiculo: "Lávate, y quedarás limpio.",
      versiculoRef: "2 Reyes 5:13",
      ritual: true,
      intro:
        "Querida, hoy es el día más importante de toda la semana. Es cuando el cuerpo suelta de verdad. Por eso, esta noche harás el Ritual de Drenaje del 3er Día — el bono que guardé para ti (ver la sección del Ritual). La mayoría de las mujeres amanece el Día 4 con el rostro visiblemente más liviano. Hoy es el punto de quiebre.",
      aoAcordar: "Agua del Jordán (base) + 1 pizca extra de cúrcuma",
      refeicoes: [
        {
          rotulo: "Desayuno",
          titulo: "Vitamina verde de la mañana",
          rendimento: "1 porción · 5 minutos",
          ingredientes: [
            "1 hoja de col rizada sin el tallo",
            "Media manzana verde",
            "Jugo de 1 naranja",
            "1 cm de jengibre fresco",
            "200 ml de agua fría",
            "5 hojas de hierbabuena",
            "1 cucharadita de miel (opcional)",
          ],
          preparo: [
            "Pon todos los ingredientes en la licuadora.",
            "Licúa por 1 minuto, hasta que quede homogéneo.",
            "Tómalo de inmediato, sin colar si puedes (la fibra es parte del beneficio).",
          ],
          substituicoes: "¿Sin col rizada? Espinaca. ¿Sin manzana verde? Manzana común o medio pepino.",
        },
        {
          rotulo: "Almuerzo",
          titulo: "Bowl de quinoa, verduras asadas y pollo desmechado",
          rendimento: "1 porción · 35 minutos",
          ingredientes: [
            "3 cucharadas de quinoa cocida",
            "1 filete de pollo (150 g) cocido y desmechado",
            "Media ahuyama pequeña en cubos",
            "Media cebolla morada en gajos",
            "Medio pimentón en tiras",
            "1 puñado de rúgula",
            "Aceite de oliva, cúrcuma, sal y pimienta al gusto",
            "Jugo de limón",
          ],
          preparo: [
            "Precalienta el horno a 200°C. Extiende la ahuyama, la cebolla morada y el pimentón en una bandeja, riega con aceite, sal, pimienta y una pizca de cúrcuma. Hornea por 25 minutos.",
            "Cocina el pollo sazonado en agua o a la plancha, y desmecha.",
            "Arma el bowl: quinoa como base, verduras asadas, pollo desmechado y rúgula fresca encima.",
            "Finaliza con aceite crudo y un apretón de limón.",
          ],
          substituicoes:
            "¿Sin quinoa? Arroz integral. ¿Sin pollo? Garbanzo asado (versión vegetariana completa).",
        },
        {
          rotulo: "Cena",
          titulo: "Sopa de tomate asado y albahaca",
          rendimento: "1 porción · 30 minutos",
          ingredientes: [
            "4 tomates maduros cortados por la mitad",
            "Media cebolla",
            "1 diente de ajo con cáscara",
            "300 ml de agua caliente",
            "Hojas de albahaca fresca",
            "1 cucharadita de miel (equilibra la acidez)",
            "Aceite de oliva, sal y pimienta al gusto",
          ],
          preparo: [
            "Precalienta el horno a 200°C. Asa los tomates, la cebolla y el ajo con cáscara, rociados con aceite, sal y pimienta, por 20 minutos.",
            "Aprieta el ajo para sacarlo de la cáscara. Transfiere todo a la licuadora con el agua caliente y la mitad de la albahaca. Licúa.",
            "Regresa a la olla, agrega la miel, ajusta la sal y calienta por 3 minutos.",
            "Sirve con el resto de la albahaca fresca y un hilo de aceite.",
          ],
          substituicoes: "",
          nota: "Esta noche: haz el Ritual de Drenaje del 3er Día (ver la sección del Ritual).",
        },
      ],
      hidratacao:
        "De 2 a 2,5 litros de agua hoy — es día de drenaje, el cuerpo necesita líquido limpio para soltar el retenido. Una caminata suave de 20 minutos, si es posible, ayuda mucho hoy.",
    },
    {
      numero: 4,
      nome: "La Estabilización",
      versiculo: "Los que esperan en el Señor renovarán sus fuerzas.",
      versiculoRef: "Isaías 40:31",
      intro:
        "Después del pico de ayer, hoy el cuerpo se reorganiza. Esta suele ser la mañana de la primera gran sorpresa en el espejo — el rostro más fino, los ojos menos hinchados. La energía tiende a subir, y muchas mujeres cuentan que volvieron a dormir la noche entera. Estás viendo el freno soltarse.",
      aoAcordar: "Agua del Jordán (base)",
      refeicoes: [
        {
          rotulo: "Desayuno",
          titulo: "Huevos revueltos con tomate y pan de masa madre",
          rendimento: "1 porción · 10 minutos",
          ingredientes: [
            "2 huevos",
            "1 tomate sin semillas en cubos",
            "1 rebanada de pan de masa madre",
            "Orégano, sal y pimienta al gusto",
            "Aceite de oliva",
            "Cebollín o perejil picado (opcional)",
          ],
          preparo: [
            "Bate ligeramente los huevos con sal y pimienta.",
            "En una sartén con un hilo de aceite, sofríe el tomate por 2 minutos.",
            "Agrega los huevos y revuelve a fuego bajo hasta el punto cremoso (no dejes que se resequen).",
            "Finaliza con orégano y hierbas frescas.",
            "Sirve con la rebanada de pan ligeramente tostada.",
          ],
          substituicoes: "¿No comes huevo? Tofu revuelto con cúrcuma queda muy parecido y nutritivo.",
        },
        {
          rotulo: "Almuerzo",
          titulo: "Lentejas guisadas con arroz integral y ensalada de zanahoria",
          rendimento: "1 porción · 25 minutos (con lentejas ya cocidas)",
          ingredientes: [
            "4 cucharadas de lentejas cocidas",
            "Media cebolla picada",
            "1 diente de ajo",
            "1 pizca de comino",
            "2 cucharadas de arroz integral cocido",
            "1 zanahoria rallada",
            "Hojas verdes al gusto",
            "Aceite de oliva, limón, sal y pimienta",
          ],
          preparo: [
            "Sofríe la cebolla y el ajo en aceite hasta dorar levemente.",
            "Agrega las lentejas cocidas y el comino. Sofríe por 3 minutos, ajustando la sal.",
            "Arma el plato con arroz integral, lentejas guisadas y ensalada de zanahoria rallada con hojas verdes.",
            "Sazona la ensalada con aceite, limón y sal.",
          ],
          substituicoes: "¿Sin lentejas? Fríjol o garbanzo. La zanahoria puede cambiarse por remolacha rallada.",
        },
        {
          rotulo: "Cena",
          titulo: "Crema de ahuyama con jengibre",
          rendimento: "1 porción · 25 minutos",
          ingredientes: [
            "300 g de ahuyama en cubos",
            "Media cebolla",
            "1 cm de jengibre fresco",
            "350 ml de agua",
            "Aceite de oliva, sal y pimienta al gusto",
            "Semillas de ahuyama tostadas para finalizar (opcional)",
          ],
          preparo: [
            "Sofríe la cebolla y el jengibre en un hilo de aceite.",
            "Agrega la ahuyama y el agua, cocina por 15 minutos hasta que esté muy blanda.",
            "Licúa hasta obtener una crema lisa y aterciopelada.",
            "Regresa a la olla, ajusta la sal, finaliza con aceite y semillas de ahuyama.",
          ],
          substituicoes: "La ahuyama puede cambiarse por zanahoria o arracacha.",
        },
      ],
      hidratacao:
        "Mantén los 2 litros. Repara cómo la sed es diferente cuando el cuerpo está hidratado de verdad — deja de almacenar agua.",
    },
    {
      numero: 5,
      nome: "La Ligereza Instalada",
      versiculo: "Mi pueblo se saciará de mi bondad, dice el Señor.",
      versiculoRef: "Jeremías 31:14",
      intro:
        "Querida, a estas alturas la hinchazón ya ha cedido bastante. La ropa comienza a vestir diferente. Por eso, hoy el menú se vuelve un poco más generoso: el cuerpo ya está respondiendo y merece celebrarse, no castigarse. Cuidar de ti nunca fue sobre privación. Es sobre elegir bien.",
      aoAcordar: "Agua del Jordán (base) + 3 hojas de hierbabuena",
      refeicoes: [
        {
          rotulo: "Desayuno",
          titulo: "Crepioca rellena con queso blanco y tomate",
          rendimento: "1 porción · 10 minutos",
          ingredientes: [
            "1 huevo",
            "2 cucharadas de almidón de yuca (tapioca)",
            "1 cucharada de agua",
            "1 tajada de queso blanco fresco",
            "Medio tomate en rodajas finas",
            "Orégano, sal y aceite al gusto",
          ],
          preparo: [
            "En un tazón, bate el huevo con el almidón de yuca, el agua y una pizca de sal hasta formar una masa lisa.",
            "Calienta una sartén antiadherente con un hilo de aceite a fuego medio.",
            "Vierte la masa, extiende bien y cocina por 2 minutos de cada lado.",
            "Rellena la mitad con el queso y el tomate, espolvorea orégano, dobla a la mitad y sirve.",
          ],
          substituicoes:
            "¿Sin queso blanco? Ricotta o pasta de garbanzo. ¿Sin tomate? Hojas de espinaca salteadas.",
        },
        {
          rotulo: "Almuerzo",
          titulo: "Pescado a la plancha con puré de ahuyama y brócoli al vapor",
          rendimento: "1 porción · 30 minutos",
          ingredientes: [
            "1 filete de pescado (150 g)",
            "Jugo de medio limón",
            "1 diente de ajo",
            "250 g de ahuyama en cubos",
            "1 taza de brócoli en ramitos",
            "Aceite de oliva, nuez moscada, sal y pimienta al gusto",
          ],
          preparo: [
            "Sazona el pescado con limón, ajo, sal y pimienta. Reserva.",
            "Cocina la ahuyama en agua hasta que esté muy blanda (unos 15 minutos). Escurre y aplasta con un tenedor, agregando aceite, sal y una pizca de nuez moscada, hasta obtener un puré.",
            "Cocina el brócoli al vapor por 6 minutos.",
            "Cocina el pescado en una sartén caliente con un hilo de aceite, 4 minutos de cada lado.",
            "Arma el plato: puré como base, pescado encima y brócoli al lado. Finaliza con aceite crudo.",
          ],
          substituicoes:
            "El puré de ahuyama puede cambiarse por puré de papa criolla o coliflor. El pescado puede ser pollo.",
        },
        {
          rotulo: "Cena",
          titulo: "Ensalada tibia de garbanzo",
          rendimento: "1 porción · 15 minutos",
          ingredientes: [
            "4 cucharadas de garbanzo cocido (tibio)",
            "Medio tomate en cubos",
            "Media cebolla morada finamente picada",
            "1 cucharada de perejil fresco picado",
            "1 cucharadita de comino",
            "Aceite de oliva, limón, sal y pimienta al gusto",
          ],
          preparo: [
            "Calienta ligeramente el garbanzo cocido.",
            "En un tazón, mezcla el garbanzo tibio con el tomate, la cebolla morada y el perejil.",
            "Sazona con aceite, limón, comino, sal y pimienta.",
            "Mezcla bien y sirve aún tibio — el calor hace que el garbanzo absorba mejor el sabor.",
          ],
          substituicoes: "El garbanzo puede cambiarse por lenteja tibia o fríjol blanco.",
        },
      ],
      hidratacao:
        "Mantén los 2 litros de agua. Hoy, pruébate aquella ropa que estaba apretada al inicio de la semana — solo para sentir, en el cuerpo, lo que está pasando.",
    },
    {
      numero: 6,
      nome: "La Preparación para la Vida Nueva",
      versiculo: "He aquí que yo hago algo nuevo; pronto saldrá a la luz.",
      versiculoRef: "Isaías 43:19",
      intro:
        "Faltan dos días, querida. Hoy llega una percepción importante: esto nunca fue un sacrificio temporal que termina y vuelve todo a como era. Fue un nuevo comienzo. Tu cuerpo ya aprendió el camino. Hoy, mientras cocinas, empieza a pensar en cómo llevar esto a tu vida después del 7º día.",
      aoAcordar: "Agua del Jordán (base)",
      refeicoes: [
        {
          rotulo: "Desayuno",
          titulo: "Avena con banano y canela",
          rendimento: "1 porción · 10 minutos",
          ingredientes: [
            "3 cucharadas de avena en hojuelas",
            "200 ml de agua o bebida vegetal",
            "Medio banano aplastado",
            "1 pizca generosa de canela",
            "5 nueces picadas",
            "1 cucharadita de miel (opcional)",
          ],
          preparo: [
            "Cocina la avena con el líquido a fuego medio por 5 minutos, revolviendo.",
            "En los últimos 2 minutos, agrega el banano aplastado y la canela.",
            "Sirve con las nueces y, si quieres, un hilo de miel.",
          ],
          substituicoes: "El banano puede cambiarse por manzana o pera. La avena puede cambiarse por hojuelas de quinoa.",
        },
        {
          rotulo: "Almuerzo",
          titulo: "Pollo al curry suave con leche de coco y arroz integral",
          rendimento: "1 porción · 30 minutos",
          ingredientes: [
            "1 filete de pollo (150 g) en cubos",
            "1 cucharadita de curry en polvo",
            "Media cucharadita de cúrcuma",
            "100 ml de leche de coco",
            "Media cebolla picada",
            "1 diente de ajo",
            "Media zanahoria en cubos pequeños",
            "Medio calabacín en cubos",
            "2 cucharadas de arroz integral cocido",
            "Aceite, sal y pimienta al gusto",
            "Cilantro o perejil para finalizar",
          ],
          preparo: [
            "Sofríe la cebolla y el ajo en aceite hasta dorar.",
            "Agrega el pollo en cubos y sella por 5 minutos.",
            "Incorpora el curry y la cúrcuma, revolviendo por 1 minuto para liberar el aroma.",
            "Añade la zanahoria, el calabacín y la leche de coco. Cocina a fuego bajo por 10 minutos.",
            "Ajusta la sal, finaliza con cilantro o perejil, y sirve con el arroz integral.",
          ],
          substituicoes:
            "El pollo puede cambiarse por pescado firme o garbanzo. La leche de coco puede reducirse a la mitad.",
        },
        {
          rotulo: "Cena",
          titulo: "Sopa de verduras variadas",
          rendimento: "1 porción · 25 minutos",
          ingredientes: [
            "1 zanahoria en cubos",
            "1 calabacín en cubos",
            "1 cidra pequeña en cubos",
            "Media cebolla",
            "1 diente de ajo",
            "400 ml de agua",
            "1 cucharada de perejil fresco",
            "Aceite, sal y pimienta al gusto",
          ],
          preparo: [
            "Sofríe la cebolla y el ajo en aceite.",
            "Agrega todas las verduras y sofríe por 3 minutos.",
            "Vierte el agua, sazona y cocina por 15 minutos.",
            "Licúa la mitad de la sopa y devuelve a la olla — esto da cuerpo, manteniendo trozos para masticar.",
            "Finaliza con perejil fresco y aceite.",
          ],
          substituicoes: "Usa cualquier verdura que tengas en casa — esta sopa es una limpieza de nevera saludable.",
        },
      ],
      hidratacao:
        "2 litros de agua. Hoy, separa mentalmente (o anota) tres recetas del Método Alimentación Bíblica que harás la próxima semana. La transición comienza en la cabeza antes de comenzar en la cocina.",
    },
    {
      numero: 7,
      nome: "La Renovación",
      versiculo: "Tomando Jesús los panes, y habiendo dado gracias, los repartió.",
      versiculoRef: "Juan 6:11",
      intro:
        "El séptimo zambullido, querida. Hoy cierras el ciclo. Detente frente al espejo por la mañana y compara con calma: la mujer de hoy y la mujer del Día 1. No es vanidad — es gratitud. Hoy el menú es el más abundante y bonito de la semana, porque es día de celebración. Te lo mereces.",
      aoAcordar: "Agua del Jordán completa (base + 1 pizca de cúrcuma + 3 hojas de hierbabuena)",
      refeicoes: [
        {
          rotulo: "Desayuno",
          titulo: "Bowl de yogur, frutas, miel y granola",
          rendimento: "1 porción · 5 minutos",
          ingredientes: [
            "1 pote de yogur natural entero sin azúcar",
            "Frutas variadas picadas (banano, fresa, papaya, mango)",
            "1 cucharada de miel",
            "2 cucharadas de granola sin azúcar",
            "1 cucharadita de semillas de chía (opcional)",
          ],
          preparo: [
            "En una copa o tazón bonito, pon el yogur como base.",
            "Arma las frutas encima, en capas coloridas.",
            "Finaliza con la miel, la granola y la chía.",
            "Come con calma. Hoy es día de saborear, no de prisa.",
          ],
          substituicoes: "Usa las frutas de temporada que más te gusten.",
        },
        {
          rotulo: "Almuerzo",
          titulo: "Salmón al horno con verduras coloridas y quinoa",
          rendimento: "1 porción · 30 minutos",
          ingredientes: [
            "1 porción de salmón (150 g)",
            "Jugo de medio limón",
            "1 rama de eneldo (o romero)",
            "Medio pimentón rojo en tiras",
            "Medio calabacín en medias lunas",
            "Media zanahoria en rodajas",
            "3 cucharadas de quinoa cocida (o arroz integral)",
            "Aceite de oliva, sal y pimienta al gusto",
          ],
          preparo: [
            "Precalienta el horno a 200°C.",
            "Sazona el salmón con limón, sal, pimienta y el eneldo.",
            "En una bandeja, extiende las verduras rociadas con aceite y sal. Coloca el salmón encima.",
            "Hornea por 18 a 20 minutos, hasta que el salmón esté opaco por fuera y las verduras blandas.",
            "Sirve con la quinoa al lado y un hilo de aceite crudo por encima de todo.",
          ],
          substituicoes:
            "¿Sin salmón? Cualquier pescado o un buen filete de pollo. ¿Sin quinoa? Arroz integral o papa criolla.",
        },
        {
          rotulo: "Cena",
          titulo: "Caldo de Daniel (lentejas livianas)",
          rendimento: "1 porción · 30 minutos",
          ingredientes: [
            "3 cucharadas de lentejas",
            "1 zanahoria en cubos pequeños",
            "Media cebolla picada",
            "1 diente de ajo",
            "1 pizca de comino",
            "400 ml de agua",
            "1 cucharada de perejil y cilantro frescos",
            "Aceite de oliva, sal y pimienta",
            "Jugo de limón para finalizar",
          ],
          preparo: [
            "Sofríe la cebolla y el ajo en aceite. Agrega el comino.",
            "Incorpora las lentejas, la zanahoria y el agua. Cocina por 25 minutos, hasta que estén blandas.",
            "Ajusta la sal, finaliza con perejil, cilantro y un apretón de limón.",
            "Sirve caliente.",
          ],
          substituicoes: "Las lentejas pueden cambiarse por garbanzo o fríjol.",
          nota: "El Caldo de Daniel cierra tu semana conectándote a la historia que comenzó todo — el joven que comiendo simple estuvo más saludable que los reyes.",
        },
      ],
      hidratacao:
        "Mantén la hidratación. Y hoy, antes de dormir, haz una oración de gratitud por el cuerpo que respondió. Mañana empieza la vida nueva — directo al Método Alimentación Bíblica.",
    },
  ],

  comprasIntro:
    "Organizada por sección del mercado, para que compres todo de una vez, gastes poco y no desperdicies. Las cantidades son para 1 persona en los 7 días — multiplica si alguien más te acompaña.",
  comprasSecoes: [
    {
      titulo: "Frutas",
      itens: [
        "Limones — 8 a 10",
        "Manzanas — 3 (siendo 1 verde)",
        "Bananos — 2",
        "Naranja — 1",
        "Frutos rojos — 2 cajitas (frescos o congelados)",
        "Frutas variadas de temporada para el Día 7 — al gusto",
      ],
    },
    {
      titulo: "Verduras",
      itens: [
        "Jengibre fresco — 1 raíz grande",
        "Calabacín — 4",
        "Brócoli — 2 manojos",
        "Zanahoria — 6",
        "Ahuyama — 1 trozo grande",
        "Col rizada o repollo — 2 manojos",
        "Tomate — 10",
        "Cebolla — 4",
        "Cebolla morada — 2",
        "Pimentón rojo — 2",
        "Cidra — 1",
        "Papa criolla — 1 pequeña",
        "Ajo — 1 cabeza",
        "Pepino — 2",
        "Hojas verdes variadas (lechuga, rúgula, espinaca) — 3 manojos",
      ],
    },
    {
      titulo: "Hierbas frescas",
      itens: [
        "Hierbabuena — 2 manojos",
        "Albahaca — 1 manojo",
        "Perejil — 1 manojo",
        "Cilantro — 1 manojo",
        "Romero — 1 manojo",
        "Tomillo — 1 manojo",
        "Eneldo — 1 manojo",
      ],
    },
    {
      titulo: "Proteínas",
      itens: [
        "Filete de pollo — 5 porciones (unos 750 g)",
        "Pescado blanco (tilapia/corvina) — 2 filetes",
        "Salmón — 1 porción",
        "Huevos — 1 docena",
      ],
    },
    {
      titulo: "Granos, cereales y semillas",
      itens: [
        "Avena en hojuelas — 1 paquete",
        "Quinoa — 1 paquete pequeño",
        "Arroz integral — 1 paquete",
        "Lentejas — 1 paquete",
        "Garbanzo — seco o en lata",
        "Almidón de yuca (tapioca) — 1 paquete pequeño",
        "Granola sin azúcar — 1 paquete",
        "Nueces — 1 paquete pequeño",
        "Semillas de chía — 1 paquete pequeño",
        "Semillas de ahuyama — opcional",
      ],
    },
    {
      titulo: "Lácteos",
      itens: [
        "Yogur natural entero sin azúcar — 4 a 5 potes",
        "Queso blanco fresco — 1 trozo pequeño",
      ],
    },
    {
      titulo: "Despensa y condimentos",
      itens: [
        "Aceite de oliva extra virgen — compra uno bueno",
        "Cúrcuma en polvo",
        "Canela en polvo",
        "Comino",
        "Curry en polvo",
        "Nuez moscada",
        "Orégano seco",
        "Miel pura — 1 frasco",
        "Leche de coco — 1 cajita pequeña",
        "Pan de masa madre — 1 unidad",
        "Sal y pimienta negra",
      ],
    },
    {
      titulo: "Para el Ritual de Drenaje (Día 3)",
      itens: ["Sal gruesa o sal de Epsom — 1 paquete pequeño"],
    },
  ],
  comprasDica:
    "Consejo de Beatriz: compra las verduras y hierbas al inicio de la semana, pero si puedes, haz una segunda pasada rápida a la plaza el Día 4 para reponer hojas y hierbas frescas. Congela lo que sobre de proteína en porciones.",

  guiaSoltamTitulo: "Los 5 que SUELTAN el freno de la inflamación",
  guiaSoltam: [
    {
      nome: "Jengibre",
      texto:
        "La raíz antiinflamatoria más estudiada de la naturaleza. El gingerol actúa directamente sobre los procesos inflamatorios. Está en tu Agua del Jordán todos los días. Úsalo sin miedo, siempre.",
    },
    {
      nome: "Cúrcuma",
      texto:
        "La curcumina es uno de los antiinflamatorios naturales más potentes. El cuerpo la aprovecha mucho mejor combinada con pimienta negra y una grasa buena — por eso, siempre que la uses, agrega una pizca de pimienta y un hilo de aceite.",
    },
    {
      nome: "Aceite de oliva extra virgen",
      texto:
        "Contiene el oleocantal, que actúa como un antiinflamatorio suave. Úsalo siempre crudo, por encima de los platos listos — el calor reduce sus propiedades. Un buen aceite es la inversión más importante de la cocina.",
    },
    {
      nome: "Hojas verdes oscuras",
      texto:
        "Col rizada, rúgula, espinaca. Ricas en agua, fibra, magnesio y antioxidantes. Ayudan a drenar el líquido retenido y alimentan las bacterias buenas del intestino.",
    },
    {
      nome: "Pescados, especialmente el salmón",
      texto:
        "El omega-3 es el nutriente que más directamente combate la inflamación celular. Es el opuesto químico de los aceites inflamatorios de la industria. Mantén el hábito de 2 a 3 veces por semana.",
    },
  ],
  guiaTravamTitulo: 'Los 5 que MANTIENEN el freno jalado (aunque parezcan "saludables")',
  guiaTravam: [
    {
      nome: "Edulcorantes artificiales",
      texto:
        'El refresco "cero", el jugo "diet", el yogur "light" endulzado. Mantienen la inflamación activa y desorganizan el intestino. Durante los 7 días, elimínalos completamente.',
    },
    {
      nome: 'Panes y galletas "integrales" industriales',
      texto:
        'La palabra "integral" engaña. Muchos tienen azúcar escondida, aceites refinados y aditivos. Solo el pan de masa madre de verdad pasa en el protocolo.',
    },
    {
      nome: 'Yogures endulzados y "de frutas"',
      texto:
        "Muchos tienen tanta azúcar como un postre. Usa siempre el yogur natural entero sin azúcar, y endulza tú misma con fruta y miel.",
    },
    {
      nome: "Exceso de sal y embutidos",
      texto:
        "El sodio en exceso es el mayor responsable de la retención de líquido. Cuidado con jamón, salchicha, snacks salados, cubitos de caldo y salsas industriales. Sazona con hierbas, ajo, limón y aceite.",
    },
    {
      nome: "Aceites vegetales refinados",
      texto:
        "Soya, maíz, canola, girasol. Altamente inflamatorios, están en la mayoría de los procesados y frituras. Durante el protocolo, usa exclusivamente aceite de oliva.",
    },
  ],
  guiaDica:
    "No necesitas memorizar listas. La regla es simple: cuanto más cerca de la forma en que Dios lo creó, mejor. Si vino de una planta, de un animal, de la tierra — puede ser. Si vino de una fábrica, con nombre que no sabes pronunciar, desconfía.",

  ritualVersiculo: "Lávate, y quedarás limpio.",
  ritualVersiculoRef: "2 Reyes 5:13",
  ritualIntro:
    "Este es el recurso que yo uso personalmente, guardado como sorpresa para ti. Se hace una única vez, en la noche del 3er Día — en el pico del drenaje. Son tres partes, en secuencia, a la hora de dormir. Reserva unos 40 minutos solo para ti. Cierra la puerta, silencia el celular. Este es tu momento.",
  ritualPartes: [
    {
      titulo: "Parte 1 — El Té del Drenaje (prepáralo primero)",
      ingredientes: [
        "300 ml de agua",
        "1 cm de jengibre en láminas",
        "3 ramas de hierbabuena fresca",
        "1 astilla de canela",
        "Jugo de medio limón",
      ],
      passos: [
        "Hierve el agua con el jengibre, la canela y la hierbabuena por 5 minutos.",
        "Apaga el fuego, tapa y deja en infusión por 5 minutos más.",
        "Cuela y agrega el jugo de limón.",
        "Tómalo tibio, en sorbos lentos, mientras haces la Parte 2.",
      ],
    },
    {
      titulo: "Parte 2 — El Baño de Pies con Hierbas",
      intro:
        "Necesitarás: 1 ponchera grande con agua tibia, 2 cucharadas de sal gruesa (o sal de Epsom), 1 puñado de romero y hierbabuena frescos.",
      passos: [
        "Disuelve la sal en el agua tibia de la ponchera.",
        "Agrega el romero y la hierbabuena, apretando levemente las hojas para liberar el aroma.",
        "Sumerge los pies por 15 a 20 minutos, mientras tomas el té.",
        "Aprovecha para respirar profundo, orar, o simplemente quedarte en silencio.",
      ],
    },
    {
      titulo: "Parte 3 — El Automasaje de Drenaje",
      intro: "Después de secar bien los pies, con un poco de aceite o crema en las manos para deslizar:",
      passos: [
        "Comienza en los tobillos y sube hacia las rodillas, siempre de abajo hacia arriba, con presión suave y firme. Nunca de arriba hacia abajo.",
        "Haz 10 movimientos largos en cada pierna, del tobillo a la rodilla.",
        "Luego, de la rodilla hasta la ingle, 10 movimientos más en cada pierna.",
        "Por último, con las dos manos sobre el vientre, haz círculos suaves en sentido horario — 20 veces.",
      ],
      fecho:
        "Antes de acostarte, toma un vaso más de agua. Duerme con las piernas ligeramente elevadas (una almohada debajo de los pies). En la mañana del Día 4, observa el rostro, los tobillos y la barriga.",
    },
  ],
  ritualImportante:
    "Este ritual puede repetirse una vez a la semana, siempre que sientas el cuerpo más hinchado — después de un viaje, de las fiestas, de una etapa de estrés. Es tuyo para siempre.",

  esperarFases: [
    {
      titulo: "Días 1 y 2",
      texto:
        "Puedes sentir un poco más de hambre, ganas de algo dulce, y quizás un leve dolor de cabeza el Día 2. Es el cuerpo desacostumbrándose del exceso de azúcar y sodio. Es temporal y es buena señal. Toma más agua.",
    },
    {
      titulo: "Días 3 y 4",
      texto:
        "El pico del drenaje. Irás al baño con más frecuencia. En la mañana del Día 4 suele llegar la primera gran sorpresa en el espejo. La energía empieza a subir.",
    },
    {
      titulo: "Días 5, 6 y 7",
      texto:
        'Ligereza instalada, mejor sueño, más energía, ropa que viste diferente. La sensación deja de ser "esfuerzo" y se convierte en "¿cómo vivía sin esto?".',
    },
  ],

  erros: [
    {
      nome: "Tomar poca agua",
      texto:
        "El error número uno. Sin agua limpia en abundancia, el cuerpo no suelta el líquido retenido. Quien toma poco se hincha más.",
    },
    {
      nome: "Saltarse el Agua del Jordán",
      texto: "Abre el día y activa el metabolismo de la limpieza. Saltarla es quitarle la base al protocolo.",
    },
    {
      nome: "Picar entre comidas",
      texto:
        "El cuerpo necesita intervalos para drenar. Si el hambre aprieta, toma agua o un té de hierbas, y come una fruta si es necesario.",
    },
    {
      nome: "Usar demasiada sal",
      texto: "El sodio es el enemigo del deshinchamiento. Sazona con hierbas, ajo, limón y aceite — el paladar se reeduca en pocos días.",
    },
    {
      nome: "Abandonar en el Día 2",
      texto:
        "El Día 2 suele ser el más difícil. Quien atraviesa el Día 2 llega al Día 4 y ve el resultado. Aguanta firme — es solo un día.",
    },
  ],

  faq: [
    {
      q: "¿Puedo tomar café durante el protocolo?",
      a: "Sí, uno al día, sin azúcar (o endulzado con un hilo de miel). Solo no reemplaces el Agua del Jordán por el café — toma el agua primero, el café después.",
    },
    {
      q: "¿Y si fallo en una comida?",
      a: "No abandones por un desliz. ¿Fallaste en el almuerzo? Retoma en la próxima comida. El protocolo solo se rompe si usas el error como excusa para parar.",
    },
    {
      q: "¿Puedo repetir el protocolo después?",
      a: "Sí. Fue hecho para repetirse siempre que sientas el cuerpo pesado de nuevo. Muchas mujeres lo hacen una vez al mes.",
    },
    {
      q: "¿Voy a pasar hambre?",
      a: "No. Comerás tres comidas al día, completas. La diferencia es la calidad de lo que entra, no la cantidad que falta.",
    },
    {
      q: "¿Puede hacerlo mi familia?",
      a: "Sí, y es genial. Solo multiplica las cantidades de la lista de compras.",
    },
    {
      q: "No vi tanto resultado como esperaba. ¿Qué hago?",
      a: "Cada cuerpo responde a su tiempo, y 7 días es un comienzo. Revisa los errores que traban — casi siempre el resultado menor está ligado a poca agua o exceso de sal. Y el resultado profundo viene de la continuidad en el Método Alimentación Bíblica.",
    },
  ],

  finalTexto: [
    "Querida, completaste los siete zambullidos. Lo que hiciste en estos siete días no fue una dieta relámpago. Le enseñaste a tu cuerpo a funcionar sin el freno jalado. Soltaste la inflamación que te estaba trabando hace años. Y te demostraste a ti misma que puedes.",
    "Ahora viene la parte que de verdad cambia una vida: la continuidad. El Protocolo fue la largada. El Método Alimentación Bíblica es el camino — la forma de vivir y comer que mantiene tu cuerpo liviano, con energía y en paz, para siempre.",
    "A partir de mañana, abre tu Método y elige una receta para el desayuno. Un paso a la vez, como lo hiciste aquí. Y siempre que el cuerpo vuelva a pesar, vuelve a los siete zambullidos. Estarán siempre aquí, esperándote.",
    "Que Dios siga renovando tu cuerpo, tu energía y tu corazón. Cuidaste el templo que Él te confió. Y eso, querida, es una forma de adoración.",
  ],
  finalAssinatura: "Con fe y cariño, Beatriz Morales — Nutricionista Cristiana",
};

export const protocoloContent: Record<Lang, ProtocoloContent> = { pt, es };
