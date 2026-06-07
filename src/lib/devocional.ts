// Devocional do dia — dataset ÚNICO e bilíngue.
// O mesmo versículo aparece no mesmo dia em PT e ES (corrige o bug de versículos
// diferentes por idioma). Reflexão e oração ampliadas. 31 entradas → ciclo ~mensal.

export interface Devocional {
  ref: string;
  texto: { pt: string; es: string };
  reflexao: { pt: string; es: string };
  oracao: { pt: string; es: string };
}

export const devocionais: Devocional[] = [
  {
    ref: "1 Coríntios 10:31",
    texto: {
      pt: "Quer comais, quer bebais, fazei tudo para glória de Deus.",
      es: "Ya sea que comáis o bebáis, hacedlo todo para la gloria de Dios.",
    },
    reflexao: {
      pt: "Antes de cuidar do seu corpo, Deus já o chamou de templo. Por isso comer não é um ato neutro: é espiritual. Cada escolha à mesa é uma pequena oração silenciosa — um 'sim' à vida que Ele preparou. Quando você troca o que adoece pelo que Ele criou, está adorando com o garfo, não só com a boca. Hoje, repare: glorificar a Deus não acontece apenas no culto; acontece também no prato que você monta com cuidado e gratidão. A santidade mora nos gestos pequenos e diários.",
      es: "Antes de cuidar tu cuerpo, Dios ya lo llamó templo. Por eso comer no es un acto neutro: es espiritual. Cada elección en la mesa es una pequeña oración silenciosa — un 'sí' a la vida que Él preparó. Cuando cambias lo que enferma por lo que Él creó, estás adorando con el tenedor, no solo con la boca. Hoy fíjate: glorificar a Dios no ocurre solo en el culto; ocurre también en el plato que armas con cuidado y gratitud. La santidad vive en los gestos pequeños y diarios.",
    },
    oracao: {
      pt: "Senhor, ensina-me a comer com gratidão. Que cada refeição seja altar, cada gole seja prece, e cada gesto à mesa seja um lembrete do Teu cuidado por mim. Que tudo o que eu fizer hoje, até o mais simples, seja para a Tua glória. Amém.",
      es: "Señor, enséñame a comer con gratitud. Que cada comida sea altar, cada sorbo sea oración, y cada gesto en la mesa sea un recordatorio de Tu cuidado por mí. Que todo lo que haga hoy, hasta lo más simple, sea para Tu gloria. Amén.",
    },
  },
  {
    ref: "Mateus 4:4",
    texto: {
      pt: "Não só de pão viverá o homem, mas de toda palavra que sai da boca de Deus.",
      es: "No solo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.",
    },
    reflexao: {
      pt: "O alimento nutre o corpo, mas é a Palavra que sustenta a alma. As duas fomes são reais, e a segunda é mais profunda. Por isso, antes de encher a mesa, vale encher o coração: cinco minutos nas Escrituras preparam a sua mesa interior antes da física. Quando você se alimenta primeiro de Deus, come com menos ansiedade e mais presença. Hoje, deixe que Ele sacie a parte de você que nenhum prato alcança. O corpo bem nutrido e a alma bem alimentada caminham juntos.",
      es: "El alimento nutre el cuerpo, pero es la Palabra la que sostiene el alma. Las dos hambres son reales, y la segunda es más profunda. Por eso, antes de llenar la mesa, vale la pena llenar el corazón: cinco minutos en las Escrituras preparan tu mesa interior antes de la física. Cuando te alimentas primero de Dios, comes con menos ansiedad y más presencia. Hoy, deja que Él sacie la parte de ti que ningún plato alcanza. El cuerpo bien nutrido y el alma bien alimentada caminan juntos.",
    },
    oracao: {
      pt: "Pai, que eu busque primeiro o Teu Reino e a Tua justiça, e que todas as demais coisas — inclusive o alimento — sejam acrescentadas a mim. Sacia hoje a fome da minha alma com a Tua Palavra. Amém.",
      es: "Padre, que busque primero Tu Reino y Tu justicia, y que todas las demás cosas — incluso el alimento — me sean añadidas. Sacia hoy el hambre de mi alma con Tu Palabra. Amén.",
    },
  },
  {
    ref: "Salmos 23:1",
    texto: {
      pt: "O Senhor é o meu pastor, nada me faltará.",
      es: "El Señor es mi pastor, nada me faltará.",
    },
    reflexao: {
      pt: "Quando você escolhe alimentos naturais, está aceitando o que o Bom Pastor preparou desde o início. A escassez não mora na mesa de Deus — ali sempre há o suficiente, em cor, sabor e nutrição. A indústria vende a ideia de que precisamos de mais, de algo artificial, de um atalho; mas o pasto verde do Salmo 23 é justamente o simples e o vivo. Confiar no suprimento de Deus é parar de comer por ansiedade e começar a comer por provisão. Hoje, descanse: o Pastor que cuida das ovelhas cuida da sua mesa.",
      es: "Cuando eliges alimentos naturales, aceptas lo que el Buen Pastor preparó desde el principio. La escasez no vive en la mesa de Dios — allí siempre hay lo suficiente, en color, sabor y nutrición. La industria vende la idea de que necesitamos más, algo artificial, un atajo; pero el pasto verde del Salmo 23 es justamente lo simple y lo vivo. Confiar en la provisión de Dios es dejar de comer por ansiedad y empezar a comer por provisión. Hoy descansa: el Pastor que cuida de las ovejas cuida de tu mesa.",
    },
    oracao: {
      pt: "Senhor, que eu confie no Teu suprimento a cada dia. Que minha mesa seja sinal da Tua fidelidade e que eu nunca confunda fartura artificial com a verdadeira provisão que vem de Ti. Amém.",
      es: "Señor, que confíe en Tu provisión cada día. Que mi mesa sea señal de Tu fidelidad y que nunca confunda la abundancia artificial con la verdadera provisión que viene de Ti. Amén.",
    },
  },
  {
    ref: "Salmos 34:8",
    texto: {
      pt: "Provai e vede que o Senhor é bom.",
      es: "Gustad y ved que el Señor es bueno.",
    },
    reflexao: {
      pt: "Comer com atenção é uma forma de provar a bondade de Deus. Cada sabor, cada textura, cada aroma é uma memória do Éden que ainda chega até nós através do que Ele criou. Quando comemos rápido e distraídos, perdemos esse encontro; quando comemos devagar e presentes, ele vira adoração. A doçura de uma fruta madura, o perfume das ervas, o calor do pão — tudo isso é Deus dizendo, em linguagem de paladar, que Ele é bom. Hoje, prove com intenção. Deixe o sabor te levar de volta à gratidão.",
      es: "Comer con atención es una forma de probar la bondad de Dios. Cada sabor, cada textura, cada aroma es una memoria del Edén que aún llega hasta nosotros a través de lo que Él creó. Cuando comemos rápido y distraídos, perdemos ese encuentro; cuando comemos despacio y presentes, se vuelve adoración. La dulzura de una fruta madura, el perfume de las hierbas, el calor del pan — todo eso es Dios diciendo, en lenguaje de paladar, que Él es bueno. Hoy prueba con intención. Deja que el sabor te lleve de vuelta a la gratitud.",
    },
    oracao: {
      pt: "Deus, hoje quero provar da Tua bondade em cada refeição. Que meu paladar me leve até a adoração e que eu reconheça o Teu cuidado em cada sabor que vem da Tua criação. Amém.",
      es: "Dios, hoy quiero probar Tu bondad en cada comida. Que mi paladar me lleve hasta la adoración y que reconozca Tu cuidado en cada sabor que viene de Tu creación. Amén.",
    },
  },
  {
    ref: "Mateus 11:28",
    texto: {
      pt: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
      es: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
    },
    reflexao: {
      pt: "O cansaço muitas vezes começa no corpo antes de chegar à alma. Um corpo inflamado, mal nutrido e privado de descanso pesa o dia inteiro — e esse peso a gente confunde com tristeza ou desânimo. Cuidar do templo que Deus te deu é uma das formas mais concretas de receber o alívio que Ele prometeu. Beber água, escolher comida viva, dormir bem: nada disso é vaidade, é descanso obedecido. Hoje, venha a Ele também pelo corpo. O alívio que Jesus oferece alcança cada parte de você.",
      es: "El cansancio muchas veces empieza en el cuerpo antes de llegar al alma. Un cuerpo inflamado, mal nutrido y privado de descanso pesa todo el día — y ese peso lo confundimos con tristeza o desánimo. Cuidar el templo que Dios te dio es una de las formas más concretas de recibir el alivio que Él prometió. Beber agua, elegir comida viva, dormir bien: nada de eso es vanidad, es descanso obedecido. Hoy ven a Él también por el cuerpo. El alivio que Jesús ofrece alcanza cada parte de ti.",
    },
    oracao: {
      pt: "Senhor, venho até Ti carregando o peso do cansaço. Recebo hoje o Teu alívio — no alimento que escolho, na água que bebo, no descanso que Tuas criações me oferecem. Renova as minhas forças por dentro e por fora. Amém.",
      es: "Señor, vengo a Ti cargando el peso del cansancio. Recibo hoy Tu alivio — en el alimento que elijo, en el agua que bebo, en el descanso que Tus criaturas me ofrecen. Renueva mis fuerzas por dentro y por fuera. Amén.",
    },
  },
  {
    ref: "Provérbios 13:25",
    texto: {
      pt: "O justo come para satisfazer o seu apetite.",
      es: "El justo come hasta saciar su apetito.",
    },
    reflexao: {
      pt: "Comer até a satisfação — não até o excesso — é sabedoria bíblica. O justo sabe quando parar porque ouve o próprio corpo, e o corpo é o templo do Espírito. A indústria nos ensinou a ignorar a saciedade, a comer pelos olhos e pela emoção; a Palavra nos chama de volta à medida certa. Hoje, antes de repetir o prato, faça uma pausa: pergunte ao corpo se ele ainda tem fome ou se é só vontade. Aprender a parar é tão espiritual quanto aprender a agradecer. A justiça também se pratica à mesa.",
      es: "Comer hasta la satisfacción — no hasta el exceso — es sabiduría bíblica. El justo sabe cuándo parar porque escucha su propio cuerpo, y el cuerpo es el templo del Espíritu. La industria nos enseñó a ignorar la saciedad, a comer por los ojos y por la emoción; la Palabra nos llama de vuelta a la medida justa. Hoy, antes de repetir el plato, haz una pausa: pregúntale al cuerpo si todavía tiene hambre o si es solo antojo. Aprender a parar es tan espiritual como aprender a agradecer. La justicia también se practica en la mesa.",
    },
    oracao: {
      pt: "Senhor, que eu aprenda a ouvir o Teu templo. Que eu coma até a satisfação e confie que isso é suficiente, sem buscar no excesso o que só a Tua presença pode preencher. Amém.",
      es: "Señor, que aprenda a escuchar Tu templo. Que coma hasta la satisfacción y confíe en que eso es suficiente, sin buscar en el exceso lo que solo Tu presencia puede llenar. Amén.",
    },
  },
  {
    ref: "Provérbios 24:13",
    texto: {
      pt: "Come mel, meu filho, porque é bom.",
      es: "Come miel, hijo mío, porque es buena.",
    },
    reflexao: {
      pt: "Deus não apenas tolerou o doce — Ele o celebrou. A doçura é uma dádiva divina, e há um mundo inteiro de doces vivos esperando por você: mel puro, fruta madura, tâmaras, banana assada com canela. O problema nunca foi o doce; foi o doce morto, refinado, que vicia e inflama. Hoje, troque a culpa pela sabedoria: saboreie a doçura que Deus criou, sem medo e sem exagero. Comer mel é lembrar que o Criador quis que a vida tivesse sabor. A alegria também é parte da santidade.",
      es: "Dios no solo toleró lo dulce — lo celebró. La dulzura es un regalo divino, y hay un mundo entero de dulces vivos esperándote: miel pura, fruta madura, dátiles, banano horneado con canela. El problema nunca fue lo dulce; fue el dulce muerto, refinado, que engancha e inflama. Hoy cambia la culpa por la sabiduría: saborea la dulzura que Dios creó, sin miedo y sin exceso. Comer miel es recordar que el Creador quiso que la vida tuviera sabor. La alegría también es parte de la santidad.",
    },
    oracao: {
      pt: "Pai, que eu receba a doçura da Tua criação com alegria, sem culpa, como presente que é. Liberta-me do vício do doce artificial e devolve-me o prazer simples do que Tu fizeste bom. Amém.",
      es: "Padre, que reciba la dulzura de Tu creación con alegría, sin culpa, como el regalo que es. Líbrame de la adicción al dulce artificial y devuélveme el placer simple de lo que Tú hiciste bueno. Amén.",
    },
  },
  {
    ref: "Deuteronômio 8:10",
    texto: {
      pt: "Bendirás ao Senhor teu Deus pelo bom território que te deu.",
      es: "Bendecirás al Señor tu Dios por la buena tierra que te ha dado.",
    },
    reflexao: {
      pt: "Toda refeição é uma terra boa. Quando você abençoa o alimento antes de comer, repete um gesto que atravessa milênios de gratidão — de Abraão à mesa de Jesus. A bênção não apenas agradece: ela santifica, transforma o ordinário em sagrado e nos lembra de quem vem o sustento. Comer sem abençoar é receber sem reconhecer o doador. Hoje, antes da primeira garfada, pare e dê graças em voz alta ou em silêncio. Você vai notar que a comida abençoada alimenta também o coração.",
      es: "Toda comida es una tierra buena. Cuando bendices el alimento antes de comer, repites un gesto que atraviesa milenios de gratitud — de Abraham a la mesa de Jesús. La bendición no solo agradece: santifica, transforma lo ordinario en sagrado y nos recuerda de quién viene el sustento. Comer sin bendecir es recibir sin reconocer al dador. Hoy, antes del primer bocado, detente y da gracias en voz alta o en silencio. Notarás que la comida bendecida alimenta también el corazón.",
    },
    oracao: {
      pt: "Senhor, obrigada pela terra boa que se expressa no meu prato hoje. Abençoo este alimento em Teu nome e reconheço que toda provisão vem das Tuas mãos. Que eu nunca coma sem lembrar de Ti. Amém.",
      es: "Señor, gracias por la buena tierra que se expresa en mi plato hoy. Bendigo este alimento en Tu nombre y reconozco que toda provisión viene de Tus manos. Que nunca coma sin acordarme de Ti. Amén.",
    },
  },
  {
    ref: "1 Coríntios 3:8",
    texto: {
      pt: "Aquele que planta e aquele que rega são iguais, e cada um receberá o seu salário.",
      es: "El que planta y el que riega son una misma cosa, y cada uno recibirá su recompensa.",
    },
    reflexao: {
      pt: "Cada pequeno gesto de saúde conta: o suco que você faz de manhã, a água que você bebe, o legume que você escolhe no mercado. Nada disso parece grande no momento — mas tudo é semente, e nenhuma semente é desprezada por Deus. A tentação é querer o resultado todo de uma vez; a sabedoria é plantar e regar com fidelidade, sabendo que a colheita tem seu tempo. Hoje, não despreze o pequeno passo. O corpo, como a terra, responde a quem cuida com constância. Plante de novo, mesmo sem ver o fruto ainda.",
      es: "Cada pequeño gesto de salud cuenta: el jugo que haces por la mañana, el agua que bebes, la verdura que eliges en el mercado. Nada de eso parece grande en el momento — pero todo es semilla, y ninguna semilla es despreciada por Dios. La tentación es querer el resultado entero de una vez; la sabiduría es plantar y regar con fidelidad, sabiendo que la cosecha tiene su tiempo. Hoy no desprecies el pequeño paso. El cuerpo, como la tierra, responde a quien cuida con constancia. Planta de nuevo, aunque todavía no veas el fruto.",
    },
    oracao: {
      pt: "Pai, que eu plante hábitos saudáveis com constância, confiando que toda semente Tua tem seu tempo de colheita. Dá-me paciência para regar mesmo antes de ver o fruto. Amém.",
      es: "Padre, que plante hábitos saludables con constancia, confiando en que toda semilla Tuya tiene su tiempo de cosecha. Dame paciencia para regar aun antes de ver el fruto. Amén.",
    },
  },
  {
    ref: "1 Tessalonicenses 5:18",
    texto: {
      pt: "Dai graças em tudo, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
      es: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.",
    },
    reflexao: {
      pt: "Gratidão antes de comer muda a relação com o alimento. Não é superstição — é consciência. Quando você agradece, come mais devagar, mais atenta, mais saciada; o agradecimento literalmente ajuda a digestão e a saciedade. Mas a gratidão vai além do prato: dar graças 'em tudo' é treinar o coração a enxergar provisão até nos dias difíceis. Hoje, faça da gratidão a sua primeira ferramenta à mesa. Antes de qualquer garfada, um obrigado — e veja como o simples vira suficiente.",
      es: "La gratitud antes de comer cambia la relación con el alimento. No es superstición — es conciencia. Cuando agradeces, comes más despacio, más atenta, más saciada; el agradecimiento literalmente ayuda a la digestión y a la saciedad. Pero la gratitud va más allá del plato: dar gracias 'en todo' es entrenar el corazón a ver provisión hasta en los días difíciles. Hoy haz de la gratitud tu primera herramienta en la mesa. Antes de cada bocado, un gracias — y mira cómo lo simple se vuelve suficiente.",
    },
    oracao: {
      pt: "Senhor, que a gratidão seja minha primeira ferramenta à mesa. Antes de qualquer garfada, um obrigado. Ensina-me a dar graças em tudo, nos dias de fartura e nos de simplicidade. Amém.",
      es: "Señor, que la gratitud sea mi primera herramienta en la mesa. Antes de cada bocado, un gracias. Enséñame a dar gracias en todo, en los días de abundancia y en los de sencillez. Amén.",
    },
  },
  {
    ref: "Efésios 5:18",
    texto: {
      pt: "Não vos embriagueis com vinho, em que há dissolução; antes sede cheios do Espírito.",
      es: "No os embriaguéis con vino, en lo cual hay disolución; antes bien sed llenos del Espíritu.",
    },
    reflexao: {
      pt: "O que nos enche importa. O ultraprocessado nos enche de vazio — inflama, vicia, entorpece e ainda pede mais. O alimento de verdade nos enche de vida; o Espírito nos enche de paz. A pergunta de hoje é simples: do que você tem se enchido? Há uma fome que nenhuma comida resolve, porque é fome de presença. Quando você se enche primeiro do Espírito, a mesa deixa de ser fuga e volta a ser sustento. Hoje, escolha ser enchido pelo que Deus criou — e pelo Próprio Deus.",
      es: "Lo que nos llena importa. El ultraprocesado nos llena de vacío — inflama, engancha, adormece y aún pide más. El alimento de verdad nos llena de vida; el Espíritu nos llena de paz. La pregunta de hoy es simple: ¿de qué te has estado llenando? Hay un hambre que ninguna comida resuelve, porque es hambre de presencia. Cuando te llenas primero del Espíritu, la mesa deja de ser escape y vuelve a ser sustento. Hoy elige ser llenado por lo que Dios creó — y por Dios mismo.",
    },
    oracao: {
      pt: "Espírito Santo, que Tua presença seja o que me sacia hoje — no alimento que escolho e na paz que habita em mim. Enche os vazios que eu tentava preencher com o que não nutre. Amém.",
      es: "Espíritu Santo, que Tu presencia sea lo que me sacia hoy — en el alimento que elijo y en la paz que habita en mí. Llena los vacíos que yo intentaba llenar con lo que no nutre. Amén.",
    },
  },
  {
    ref: "Salmos 84:3",
    texto: {
      pt: "Até o pardal encontrou uma casa e a andorinha um ninho.",
      es: "Aun el gorrión halla casa, y la golondrina nido para sí.",
    },
    reflexao: {
      pt: "Deus cuida do menor dos pássaros, que não planta nem colhe, e ainda assim encontra casa e ninho. Quanto mais Ele cuida de você, que é feita à Sua imagem? A ansiedade com a comida muitas vezes nasce da falta de confiança no cuidado de Deus. Hoje, enquanto prepara sua refeição, lembre-se: Ele já preparou provisão, e a sua tarefa é receber com fé, não correr com medo. Olhar os pássaros é um exercício de paz. Se há ninho para a andorinha, há mesa para você.",
      es: "Dios cuida del menor de los pájaros, que no siembra ni cosecha, y aun así halla casa y nido. ¿Cuánto más cuida de ti, que fuiste hecha a Su imagen? La ansiedad con la comida muchas veces nace de la falta de confianza en el cuidado de Dios. Hoy, mientras preparas tu comida, recuerda: Él ya preparó provisión, y tu tarea es recibir con fe, no correr con miedo. Mirar a los pájaros es un ejercicio de paz. Si hay nido para la golondrina, hay mesa para ti.",
    },
    oracao: {
      pt: "Pai, que eu confie no Teu cuidado tão completamente quanto o pardal confia. Que minha mesa seja prova da Tua fidelidade e que a ansiedade dê lugar à paz de quem se sabe cuidada. Amém.",
      es: "Padre, que confíe en Tu cuidado tan completamente como el gorrión confía. Que mi mesa sea prueba de Tu fidelidad y que la ansiedad dé lugar a la paz de quien se sabe cuidada. Amén.",
    },
  },
  {
    ref: "Colossenses 3:23",
    texto: {
      pt: "E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.",
      es: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor.",
    },
    reflexao: {
      pt: "Cozinhar com intenção é um ato de culto. Quando você prepara uma refeição com presença e amor — mesmo sozinha, mesmo sem ninguém para ver — está servindo ao Senhor. A cozinha pode ser altar; a panela, oração; o cuidado com o tempero, adoração. O mundo separa o sagrado do cotidiano, mas a fé os une: lavar o legume, dourar a cebola, partir o pão, tudo pode ser feito 'como ao Senhor'. Hoje, transforme uma tarefa comum em oferta. O coração com que você cozinha importa tanto quanto o que vai à mesa.",
      es: "Cocinar con intención es un acto de culto. Cuando preparas una comida con presencia y amor — incluso sola, incluso sin nadie que lo vea — estás sirviendo al Señor. La cocina puede ser altar; la olla, oración; el cuidado con el sazón, adoración. El mundo separa lo sagrado de lo cotidiano, pero la fe los une: lavar la verdura, dorar la cebolla, partir el pan, todo puede hacerse 'como para el Señor'. Hoy transforma una tarea común en ofrenda. El corazón con que cocinas importa tanto como lo que llega a la mesa.",
    },
    oracao: {
      pt: "Senhor, que eu cozinhe hoje com o coração voltado para Ti. Que cada gesto na cozinha seja oferenda e que o cuidado com o que sirvo seja uma forma de amar a Ti e aos que se sentam comigo. Amém.",
      es: "Señor, que cocine hoy con el corazón vuelto hacia Ti. Que cada gesto en la cocina sea ofrenda y que el cuidado con lo que sirvo sea una forma de amarte a Ti y a los que se sientan conmigo. Amén.",
    },
  },
  {
    ref: "João 6:63",
    texto: {
      pt: "O espírito é que vivifica; a carne não aproveita nada.",
      es: "El espíritu es el que da vida; la carne para nada aprovecha.",
    },
    reflexao: {
      pt: "O alimento que você escolhe pode vivificar ou murchar. Comida morta — ultraprocessada, vazia, inflamatória — pesa o corpo e embota o espírito. Comida viva, natural, criada por Deus, alimenta corpo e alma ao mesmo tempo. Não se trata de legalismo, mas de vida: o que entra em você ou te aproxima ou te afasta da disposição para servir, orar e amar. Hoje, escolha o que vivifica. Repare como o corpo nutrido responde com energia, e como essa energia se converte em presença para Deus e para os outros.",
      es: "El alimento que eliges puede dar vida o marchitar. La comida muerta — ultraprocesada, vacía, inflamatoria — pesa el cuerpo y embota el espíritu. La comida viva, natural, creada por Dios, alimenta cuerpo y alma a la vez. No se trata de legalismo, sino de vida: lo que entra en ti o te acerca o te aleja de la disposición para servir, orar y amar. Hoy elige lo que da vida. Fíjate cómo el cuerpo nutrido responde con energía, y cómo esa energía se convierte en presencia para Dios y para los demás.",
    },
    oracao: {
      pt: "Senhor, que eu escolha o que vivifica em cada refeição. Que meu corpo receba vida, e não mais inflamação, e que essa vida se transforme em força para Te servir. Amém.",
      es: "Señor, que elija lo que da vida en cada comida. Que mi cuerpo reciba vida, y no más inflamación, y que esa vida se transforme en fuerza para servirte. Amén.",
    },
  },
  {
    ref: "Gênesis 1:21",
    texto: {
      pt: "Criou Deus os grandes animais marinhos e tudo o que vive nas águas… e viu Deus que era bom.",
      es: "Creó Dios los grandes animales marinos y todo ser viviente que se mueve en las aguas… y vio Dios que era bueno.",
    },
    reflexao: {
      pt: "Tudo o que Deus criou foi declarado bom — o peixe, o grão, a erva, a fruta — desde antes que qualquer humano os tocasse. Escolher esses alimentos é escolher o que Ele mesmo chamou de bom. A indústria inverteu isso: ensinou a olhar com desconfiança o natural e com desejo o artificial. Voltar ao que Deus aprovou é um ato de fé e de bom senso ao mesmo tempo. Hoje, ao montar o prato, pergunte: isto veio da mão do Criador ou da fábrica do homem? O 'bom' do Gênesis ainda está disponível na sua feira.",
      es: "Todo lo que Dios creó fue declarado bueno — el pescado, el grano, la hierba, la fruta — desde antes de que cualquier humano los tocara. Elegir esos alimentos es elegir lo que Él mismo llamó bueno. La industria invirtió eso: enseñó a mirar con desconfianza lo natural y con deseo lo artificial. Volver a lo que Dios aprobó es un acto de fe y de sentido común a la vez. Hoy, al armar el plato, pregunta: ¿esto vino de la mano del Creador o de la fábrica del hombre? El 'bueno' del Génesis sigue disponible en tu mercado.",
    },
    oracao: {
      pt: "Criador, que eu honre a bondade da Tua criação ao escolher o que entra no meu corpo. Que eu volte ao que Tu chamaste de bom e desconfie do que o homem inventou para me afastar dele. Amém.",
      es: "Creador, que honre la bondad de Tu creación al elegir lo que entra en mi cuerpo. Que vuelva a lo que Tú llamaste bueno y desconfíe de lo que el hombre inventó para alejarme de ello. Amén.",
    },
  },
  {
    ref: "Oseias 14:5",
    texto: {
      pt: "Serei como o orvalho para Israel; ele florescerá como o lírio.",
      es: "Seré a Israel como rocío; él florecerá como lirio.",
    },
    reflexao: {
      pt: "O orvalho cai todo dia, silencioso e suficiente — não em tempestade, mas em constância. Assim é o cuidado de Deus com o seu corpo: discreto, diário, paciente. A saúde não floresce com gestos heroicos de um dia só, e sim com o orvalho de pequenos hábitos repetidos. Cada manhã é uma nova oportunidade de florescer, e nenhuma é tarde demais. Hoje, não busque a transformação total de uma vez; busque o orvalho de hoje. O lírio não se esforça para crescer — ele recebe o que cai do céu e floresce no tempo certo.",
      es: "El rocío cae todos los días, silencioso y suficiente — no en tormenta, sino en constancia. Así es el cuidado de Dios con tu cuerpo: discreto, diario, paciente. La salud no florece con gestos heroicos de un solo día, sino con el rocío de pequeños hábitos repetidos. Cada mañana es una nueva oportunidad de florecer, y ninguna es demasiado tarde. Hoy no busques la transformación total de una vez; busca el rocío de hoy. El lirio no se esfuerza por crecer — recibe lo que cae del cielo y florece a su tiempo.",
    },
    oracao: {
      pt: "Senhor, que Teu cuidado caia sobre mim como orvalho — constante e suave. Que eu floresça hoje em saúde e gratidão, confiando no tempo certo da Tua obra em mim. Amém.",
      es: "Señor, que Tu cuidado caiga sobre mí como rocío — constante y suave. Que florezca hoy en salud y gratitud, confiando en el tiempo justo de Tu obra en mí. Amén.",
    },
  },
  {
    ref: "João 20:21",
    texto: {
      pt: "Assim como o Pai me enviou, também eu vos envio.",
      es: "Como me envió el Padre, así también yo os envío.",
    },
    reflexao: {
      pt: "Você foi enviada com um corpo — o mesmo templo em que o Espírito habita. Cuidar desse templo não é vaidade; é preparação para o chamado. Um corpo nutrido, descansado e forte serve melhor, ama por mais tempo e suporta com mais firmeza. Quando você bebe água, escolhe comida viva e dorme bem, está afiando o instrumento da sua missão. Hoje, repare que saúde e propósito caminham juntos: Deus te enviou, e Ele equipa quem envia. Cuide do corpo como quem guarda uma ferramenta para a obra que ainda virá.",
      es: "Fuiste enviada con un cuerpo — el mismo templo en el que habita el Espíritu. Cuidar ese templo no es vanidad; es preparación para el llamado. Un cuerpo nutrido, descansado y fuerte sirve mejor, ama por más tiempo y soporta con más firmeza. Cuando bebes agua, eliges comida viva y duermes bien, estás afilando el instrumento de tu misión. Hoy fíjate que salud y propósito caminan juntos: Dios te envió, y Él equipa a quien envía. Cuida del cuerpo como quien guarda una herramienta para la obra que aún vendrá.",
    },
    oracao: {
      pt: "Pai, que eu cuide do meu corpo como quem guarda um instrumento de missão. Que eu sirva melhor porque me cuido bem, e que a minha saúde seja recurso para o Teu chamado. Amém.",
      es: "Padre, que cuide de mi cuerpo como quien guarda un instrumento de misión. Que sirva mejor porque me cuido bien, y que mi salud sea recurso para Tu llamado. Amén.",
    },
  },
  {
    ref: "Provérbios 17:1",
    texto: {
      pt: "Melhor é um bocado seco com paz do que a casa cheia de banquetes com contendas.",
      es: "Mejor es un bocado seco con paz, que una casa llena de banquetes con discordia.",
    },
    reflexao: {
      pt: "Às vezes a melhor refeição não é a mais farta, e sim a mais tranquila. Um prato simples comido em paz nutre mais do que um banquete cercado de tensão e pressa. Deus se importa não apenas com o que está na mesa, mas com o clima ao redor dela. Hoje, se a sua mesa for humilde, que seja cheia de paz; se for farta, que a paz não falte. Desacelere, respire, agradeça. A paz é o tempero que nenhum dinheiro compra — e é justamente o que transforma comida em comunhão.",
      es: "A veces la mejor comida no es la más abundante, sino la más tranquila. Un plato simple comido en paz nutre más que un banquete rodeado de tensión y prisa. A Dios le importa no solo lo que hay en la mesa, sino el clima alrededor de ella. Hoy, si tu mesa es humilde, que esté llena de paz; si es abundante, que la paz no falte. Desacelera, respira, agradece. La paz es el condimento que ningún dinero compra — y es justamente lo que transforma la comida en comunión.",
    },
    oracao: {
      pt: "Senhor, que minha mesa seja sempre cheia de paz, mesmo quando simples. A paz à mesa é sinal do Teu Reino; ensina-me a valorizá-la mais do que a fartura. Amém.",
      es: "Señor, que mi mesa esté siempre llena de paz, aun cuando sea simple. La paz en la mesa es señal de Tu Reino; enséñame a valorarla más que la abundancia. Amén.",
    },
  },
  {
    ref: "Isaías 30:20",
    texto: {
      pt: "Ainda que o Senhor vos dê pão de angústia e água de aflição, os teus olhos verão os teus mestres.",
      es: "Aunque el Señor os dé pan de angustia y agua de aflicción, tus ojos verán a tus maestros.",
    },
    reflexao: {
      pt: "Mesmo em tempos difíceis, Deus ainda é professor. Cada dificuldade que passamos — no corpo, na saúde, na rotina cansada — pode virar escola, se entregue a Ele. O cansaço que te trouxe até aqui talvez tenha sido o mestre que te ensinou a cuidar de si. O importante é que o Mestre não abandona o aluno no meio da lição. Hoje, em vez de reclamar do processo, pergunte: o que isto está me ensinando? A cura raramente é instantânea, mas é sempre formativa para quem caminha com Deus.",
      es: "Aun en tiempos difíciles, Dios sigue siendo maestro. Cada dificultad que pasamos — en el cuerpo, en la salud, en la rutina cansada — puede volverse escuela, si se la entregamos a Él. El cansancio que te trajo hasta aquí quizás fue el maestro que te enseñó a cuidarte. Lo importante es que el Maestro no abandona al alumno en medio de la lección. Hoy, en vez de quejarte del proceso, pregunta: ¿qué me está enseñando esto? La cura rara vez es instantánea, pero siempre es formativa para quien camina con Dios.",
    },
    oracao: {
      pt: "Senhor, que mesmo nas dificuldades de saúde eu veja Tua mão ensinando e não me abandonando. Transforma cada obstáculo em lição e cada lição em crescimento. Amém.",
      es: "Señor, que aun en las dificultades de salud vea Tu mano enseñando y no abandonándome. Transforma cada obstáculo en lección y cada lección en crecimiento. Amén.",
    },
  },
  {
    ref: "Gênesis 1:29",
    texto: {
      pt: "E Deus disse: Eis que vos tenho dado toda a erva que dá semente… ser-vos-á para mantimento.",
      es: "Y dijo Dios: He aquí que os he dado toda planta que da semilla… os serán para comer.",
    },
    reflexao: {
      pt: "A primeira instrução alimentar de Deus ao ser humano foi simples: coma o que a terra dá. Sementes, frutos, ervas. Antes de qualquer rótulo, embalagem ou ultraprocessado, já existia um cardápio completo, gratuito e perfeito. Voltar a esse cardápio não é radicalismo; é memória — lembrar do plano original do Criador para o corpo que Ele desenhou. Hoje, deixe a terra ser sua farmácia e a criação de Deus ser seu remédio. Quanto mais perto da forma em que Ele fez, mais perto você está do que o seu corpo reconhece como alimento de verdade.",
      es: "La primera instrucción alimentaria de Dios al ser humano fue simple: come lo que la tierra da. Semillas, frutos, hierbas. Antes de cualquier etiqueta, empaque o ultraprocesado, ya existía un menú completo, gratuito y perfecto. Volver a ese menú no es radicalismo; es memoria — recordar el plan original del Creador para el cuerpo que Él diseñó. Hoy deja que la tierra sea tu farmacia y la creación de Dios tu medicina. Cuanto más cerca de la forma en que Él lo hizo, más cerca estás de lo que tu cuerpo reconoce como alimento de verdad.",
    },
    oracao: {
      pt: "Criador, que eu volte ao cardápio que Tu originalmente preparaste para mim. Que a terra seja minha farmácia e Tua criação meu remédio, e que eu confie no plano que fizeste para o meu corpo. Amém.",
      es: "Creador, que vuelva al menú que Tú originalmente preparaste para mí. Que la tierra sea mi farmacia y Tu creación mi medicina, y que confíe en el plan que hiciste para mi cuerpo. Amén.",
    },
  },
  {
    ref: "Ezequiel 34:26",
    texto: {
      pt: "Farei descer a chuva a seu tempo; serão chuvas de bênção.",
      es: "Haré descender la lluvia a su tiempo; serán lluvias de bendición.",
    },
    reflexao: {
      pt: "As estações, as chuvas, as colheitas — tudo tem tempo, e o tempo é de Deus. A sua cura também tem estação: não force, não desista, não compare o seu processo com o de ninguém. Plante os hábitos certos e confie nas chuvas de bênção que vêm 'a seu tempo', não no seu apressado. A pressa é inimiga da constância; a paciência é amiga do fruto. Hoje, faça a sua parte — o suco, a água, a refeição viva — e deixe o tempo da colheita com Deus. O que Ele rega, floresce.",
      es: "Las estaciones, las lluvias, las cosechas — todo tiene tiempo, y el tiempo es de Dios. Tu cura también tiene estación: no fuerces, no desistas, no compares tu proceso con el de nadie. Planta los hábitos correctos y confía en las lluvias de bendición que vienen 'a su tiempo', no al tuyo apurado. La prisa es enemiga de la constancia; la paciencia es amiga del fruto. Hoy haz tu parte — el jugo, el agua, la comida viva — y deja el tiempo de la cosecha en manos de Dios. Lo que Él riega, florece.",
    },
    oracao: {
      pt: "Senhor, que eu plante na estação certa e confie nas Tuas chuvas de bênção sobre minha saúde. Liberta-me da pressa e ensina-me a paciência de quem confia no Teu tempo. Amém.",
      es: "Señor, que plante en la estación correcta y confíe en Tus lluvias de bendición sobre mi salud. Líbrame de la prisa y enséñame la paciencia de quien confía en Tu tiempo. Amén.",
    },
  },
  {
    ref: "1 Coríntios 10:24",
    texto: {
      pt: "Ninguém busque o seu próprio interesse, mas cada um o bem do outro.",
      es: "Ninguno busque su propio bien, sino el del otro.",
    },
    reflexao: {
      pt: "Cozinhar para a família com alimentos bíblicos é um ato de amor que vai além de você. Quando você coloca uma refeição saudável na mesa, não está cuidando só do próprio corpo — está abençoando todos os que dependem da sua cozinha. O cuidado de uma pessoa pode reeducar o paladar de uma casa inteira, muitas vezes sem que ninguém perceba. Hoje, lembre-se de que a sua mesa é também a mesa deles. Cuidar do outro através da comida é uma das formas mais silenciosas e poderosas de servir.",
      es: "Cocinar para la familia con alimentos bíblicos es un acto de amor que va más allá de ti. Cuando pones una comida saludable en la mesa, no estás cuidando solo de tu propio cuerpo — estás bendiciendo a todos los que dependen de tu cocina. El cuidado de una persona puede reeducar el paladar de una casa entera, muchas veces sin que nadie lo note. Hoy recuerda que tu mesa es también la mesa de ellos. Cuidar del otro a través de la comida es una de las formas más silenciosas y poderosas de servir.",
    },
    oracao: {
      pt: "Senhor, que minha cozinha seja fonte de bênção para toda a minha família. Que o alimento que preparo seja amor servido à mesa, cuidando de cada um que Tu colocaste sob o meu teto. Amém.",
      es: "Señor, que mi cocina sea fuente de bendición para toda mi familia. Que el alimento que preparo sea amor servido en la mesa, cuidando de cada uno que pusiste bajo mi techo. Amén.",
    },
  },
  {
    ref: "Filipenses 1:21",
    texto: {
      pt: "Porque para mim o viver é Cristo e o morrer é lucro.",
      es: "Porque para mí el vivir es Cristo, y el morir es ganancia.",
    },
    reflexao: {
      pt: "Viver plenamente exige um corpo capaz de servir. Cuidar da sua saúde não é egoísmo nem culto à aparência — é preparação para viver em Cristo com mais plenitude, mais disposição, mais anos de serviço. Quem entende que o viver é Cristo passa a cuidar do corpo não por vaidade, mas por mordomia: este corpo é emprestado, e tem uma obra a cumprir. Hoje, escolha a saúde como quem investe em mais tempo de presença com Deus e com os que ama. Cada gesto de cuidado é um voto a favor da vida que ainda há para viver.",
      es: "Vivir plenamente exige un cuerpo capaz de servir. Cuidar de tu salud no es egoísmo ni culto a la apariencia — es preparación para vivir en Cristo con más plenitud, más disposición, más años de servicio. Quien entiende que el vivir es Cristo pasa a cuidar del cuerpo no por vanidad, sino por mayordomía: este cuerpo es prestado, y tiene una obra que cumplir. Hoy elige la salud como quien invierte en más tiempo de presencia con Dios y con los que ama. Cada gesto de cuidado es un voto a favor de la vida que aún queda por vivir.",
    },
    oracao: {
      pt: "Pai, que eu cuide da vida que Tu me deste, para vivê-la com mais plenitude em Cristo. Que minha saúde seja mordomia e não vaidade, e que cada ano me encontre mais disponível para Ti. Amém.",
      es: "Padre, que cuide de la vida que me diste, para vivirla con más plenitud en Cristo. Que mi salud sea mayordomía y no vanidad, y que cada año me encuentre más disponible para Ti. Amén.",
    },
  },
  {
    ref: "Tiago 2:26",
    texto: {
      pt: "Assim como o corpo sem espírito está morto, também a fé sem obras é morta.",
      es: "Como el cuerpo sin espíritu está muerto, así también la fe sin obras está muerta.",
    },
    reflexao: {
      pt: "Orar por saúde e continuar comendo o que adoece é fé sem obra. A fé verdadeira move as mãos: ela muda o prato, troca o hábito, levanta da cama para fazer o suco. Não há contradição entre confiar em Deus e agir com sabedoria — a confiança madura é justamente a que se traduz em escolha. Hoje, deixe que a sua fé tenha obra à mesa. Creia no cuidado de Deus pelo seu corpo e aja conforme essa crença, porque a fé que não desce até o prato ainda não desceu até a vida.",
      es: "Orar por salud y seguir comiendo lo que enferma es fe sin obra. La fe verdadera mueve las manos: cambia el plato, sustituye el hábito, levanta de la cama para hacer el jugo. No hay contradicción entre confiar en Dios y actuar con sabiduría — la confianza madura es justamente la que se traduce en elección. Hoy deja que tu fe tenga obra en la mesa. Cree en el cuidado de Dios por tu cuerpo y actúa conforme a esa creencia, porque la fe que no baja hasta el plato aún no ha bajado hasta la vida.",
    },
    oracao: {
      pt: "Senhor, que minha fé tenha obra à mesa. Que eu aja conforme o que creio sobre o Teu cuidado pelo meu corpo, e que a confiança em Ti se traduza em escolhas concretas hoje. Amém.",
      es: "Señor, que mi fe tenga obra en la mesa. Que actúe conforme a lo que creo sobre Tu cuidado por mi cuerpo, y que la confianza en Ti se traduzca en elecciones concretas hoy. Amén.",
    },
  },
  {
    ref: "Deuteronômio 31:6",
    texto: {
      pt: "Sede fortes e corajosos. Não temais, porque o Senhor vai contigo.",
      es: "Esfuérzate y sé valiente. No temas, porque el Señor va contigo.",
    },
    reflexao: {
      pt: "Mudar de hábitos alimentares pede coragem. Abandonar o ultraprocessado, cozinhar do zero, resistir ao que sempre confortou — tudo isso é batalha real, e nenhuma batalha se vence com medo. A boa notícia é que você não enfrenta sozinha: o mesmo Deus que disse 'sê forte e corajoso' caminha ao seu lado em cada escolha. A coragem aqui não é heroísmo de um dia; é firmeza repetida, refeição após refeição. Hoje, quando a vontade antiga voltar, lembre-se de quem vai contigo. Você é mais forte do que o hábito, porque a sua força vem de Deus.",
      es: "Cambiar de hábitos alimentarios pide coraje. Abandonar el ultraprocesado, cocinar desde cero, resistir lo que siempre consoló — todo eso es batalla real, y ninguna batalla se gana con miedo. La buena noticia es que no peleas sola: el mismo Dios que dijo 'esfuérzate y sé valiente' camina a tu lado en cada elección. El coraje aquí no es heroísmo de un día; es firmeza repetida, comida tras comida. Hoy, cuando vuelva el antojo viejo, recuerda quién va contigo. Eres más fuerte que el hábito, porque tu fuerza viene de Dios.",
    },
    oracao: {
      pt: "Senhor, dá-me coragem para mudar o que precisa ser mudado na minha alimentação. Que eu não desfaleça diante das dificuldades, sabendo que Tu vais comigo em cada escolha. Amém.",
      es: "Señor, dame coraje para cambiar lo que necesita cambiar en mi alimentación. Que no desfallezca ante las dificultades, sabiendo que Tú vas conmigo en cada elección. Amén.",
    },
  },
  {
    ref: "Isaías 40:31",
    texto: {
      pt: "Mas os que esperam no Senhor renovarão as suas forças.",
      es: "Pero los que esperan en el Señor tendrán nuevas fuerzas.",
    },
    reflexao: {
      pt: "Renovação de forças começa de dentro para fora — mas também de fora para dentro. O alimento certo renova as forças físicas; a espera no Senhor renova as espirituais; e as duas se completam. Esperar em Deus não é ficar parada, é confiar enquanto se faz a parte: hidratar, nutrir, descansar, orar. Quem só se esforça se esgota; quem só espera se acomoda; mas quem espera no Senhor e age recebe forças que sobem como águia. Hoje, una a sua disciplina à Sua presença. A força que você precisa não vem só do prato, vem da fonte.",
      es: "La renovación de fuerzas empieza de adentro hacia afuera — pero también de afuera hacia adentro. El alimento correcto renueva las fuerzas físicas; la espera en el Señor renueva las espirituales; y las dos se completan. Esperar en Dios no es quedarse quieta, es confiar mientras se hace la parte: hidratar, nutrir, descansar, orar. Quien solo se esfuerza se agota; quien solo espera se acomoda; pero quien espera en el Señor y actúa recibe fuerzas que suben como águila. Hoy une tu disciplina a Su presencia. La fuerza que necesitas no viene solo del plato, viene de la fuente.",
    },
    oracao: {
      pt: "Senhor, enquanto espero em Ti, que eu também cuide do templo que me deste. Que minha força seja renovada em cada sentido — corpo, alma e espírito — e que eu corra sem me cansar. Amém.",
      es: "Señor, mientras espero en Ti, que también cuide del templo que me diste. Que mi fuerza sea renovada en todo sentido — cuerpo, alma y espíritu — y que corra sin cansarme. Amén.",
    },
  },
  {
    ref: "Gênesis 14:18",
    texto: {
      pt: "Melquisedeque trouxe pão e vinho; e era sacerdote do Deus Altíssimo.",
      es: "Melquisedec sacó pan y vino; y era sacerdote del Dios Altísimo.",
    },
    reflexao: {
      pt: "Melquisedeque serviu a Abraão com os alimentos mais simples: pão e vinho. Os maiores encontros com Deus muitas vezes acontecem ao redor de uma mesa simples, com comida simples e corações abertos. Não é a sofisticação do prato que santifica o momento, é a presença de Deus reconhecida nele. Hoje, não espere a ocasião perfeita nem o banquete digno de foto para celebrar a vida; celebre no pão de cada dia. O sagrado cabe no simples — e talvez seja justamente ali, no comum, que Deus mais gosta de aparecer.",
      es: "Melquisedec sirvió a Abraham con los alimentos más simples: pan y vino. Los mayores encuentros con Dios muchas veces ocurren alrededor de una mesa simple, con comida simple y corazones abiertos. No es la sofisticación del plato lo que santifica el momento, es la presencia de Dios reconocida en él. Hoy no esperes la ocasión perfecta ni el banquete digno de foto para celebrar la vida; celebra en el pan de cada día. Lo sagrado cabe en lo simple — y quizás sea justamente allí, en lo común, donde Dios más gusta de aparecer.",
    },
    oracao: {
      pt: "Pai, que eu encontre o sagrado na simplicidade do meu prato hoje. Que minha mesa seja lugar de encontro com o Senhor, mesmo no mais humilde dos pães. Amém.",
      es: "Padre, que encuentre lo sagrado en la sencillez de mi plato hoy. Que mi mesa sea lugar de encuentro con el Señor, aun en el más humilde de los panes. Amén.",
    },
  },
  {
    ref: "Salmos 34:14",
    texto: {
      pt: "Aparta-te do mal e faze o bem; procura a paz e segue-a.",
      es: "Apártate del mal y haz el bien; busca la paz y síguela.",
    },
    reflexao: {
      pt: "A paz começa no corpo. Um corpo inflamado produz ansiedade, irritação e sono ruim; um corpo nutrido com o que Deus criou tende ao equilíbrio, à serenidade, à paz. Por isso 'procurar a paz' também é uma decisão alimentar: o que você tira do prato e o que você coloca nele afetam diretamente o seu humor e a sua calma. Apartar-se do mal, aqui, é apartar-se do que adoece; fazer o bem é nutrir-se com o que vivifica. Hoje, escolha um passo concreto em direção à paz — e veja como ela começa a se instalar de dentro para fora.",
      es: "La paz empieza en el cuerpo. Un cuerpo inflamado produce ansiedad, irritación y mal sueño; un cuerpo nutrido con lo que Dios creó tiende al equilibrio, a la serenidad, a la paz. Por eso 'buscar la paz' también es una decisión alimentaria: lo que quitas del plato y lo que pones en él afectan directamente tu ánimo y tu calma. Apartarse del mal, aquí, es apartarse de lo que enferma; hacer el bien es nutrirse con lo que da vida. Hoy elige un paso concreto hacia la paz — y mira cómo empieza a instalarse de adentro hacia afuera.",
    },
    oracao: {
      pt: "Senhor, que minha escolha alimentar hoje seja um passo em direção à paz que Tua Palavra me promete. Aparta de mim o que me inflama e me agita, e instala em mim a Tua serenidade. Amém.",
      es: "Señor, que mi elección alimentaria hoy sea un paso hacia la paz que Tu Palabra me promete. Aparta de mí lo que me inflama y me agita, e instala en mí Tu serenidad. Amén.",
    },
  },
  {
    ref: "Lucas 8:15",
    texto: {
      pt: "A semente que caiu em boa terra são os que retêm a palavra e dão fruto com perseverança.",
      es: "La semilla que cayó en buena tierra son los que retienen la palabra y dan fruto con perseverancia.",
    },
    reflexao: {
      pt: "Hábito é semente. O suco sagrado da manhã, a refeição sem ultraprocessado, a água bebida com gratidão — todas essas sementes precisam de perseverança para dar fruto. Boa terra não é a que recebe a semente uma vez, é a que a retém e cuida dela ao longo do tempo. A diferença entre quem muda e quem não muda raramente é a informação; quase sempre é a perseverança. Hoje, não meça o seu progresso por um único dia, mas pela direção constante. Continue. O fruto não vem do gesto isolado, vem da repetição fiel.",
      es: "El hábito es semilla. El jugo sagrado de la mañana, la comida sin ultraprocesados, el agua bebida con gratitud — todas esas semillas necesitan perseverancia para dar fruto. Buena tierra no es la que recibe la semilla una vez, es la que la retiene y la cuida a lo largo del tiempo. La diferencia entre quien cambia y quien no cambia rara vez es la información; casi siempre es la perseverancia. Hoy no midas tu progreso por un solo día, sino por la dirección constante. Continúa. El fruto no viene del gesto aislado, viene de la repetición fiel.",
    },
    oracao: {
      pt: "Senhor, que eu persevere nos pequenos hábitos que Tu plantastes em mim. Que a semente de saúde que estou plantando encontre em mim boa terra e dê fruto abundante. Amém.",
      es: "Señor, que persevere en los pequeños hábitos que plantaste en mí. Que la semilla de salud que estoy plantando encuentre en mí buena tierra y dé fruto abundante. Amén.",
    },
  },
  {
    ref: "Eclesiastes 9:10",
    texto: {
      pt: "Tudo quanto te vier à mão para fazer, faze-o conforme as tuas forças.",
      es: "Todo lo que te venga a la mano para hacer, hazlo según tus fuerzas.",
    },
    reflexao: {
      pt: "Você não precisa mudar tudo de uma vez. A tentação do perfeccionismo é justamente o que paralisa: como não dá para fazer tudo, a pessoa não faz nada. Mas a Palavra ensina o contrário: faça o que está na sua mão hoje, conforme as suas forças de hoje. Uma receita nova, um copo de água a mais, um passo em direção ao natural. Deus honra o esforço sincero, mesmo o pequeno, mesmo o imperfeito. Hoje, escolha um gesto possível e faça-o bem. O progresso fiel sempre vence o plano perfeito que nunca começa.",
      es: "No necesitas cambiarlo todo de una vez. La tentación del perfeccionismo es justamente lo que paraliza: como no se puede hacer todo, la persona no hace nada. Pero la Palabra enseña lo contrario: haz lo que está en tu mano hoy, según tus fuerzas de hoy. Una receta nueva, un vaso de agua de más, un paso hacia lo natural. Dios honra el esfuerzo sincero, aun el pequeño, aun el imperfecto. Hoy elige un gesto posible y hazlo bien. El progreso fiel siempre vence al plan perfecto que nunca empieza.",
    },
    oracao: {
      pt: "Senhor, que eu faça com fidelidade o que está na minha mão hoje. Um passo de cada vez, com o coração voltado para Ti, livre da paralisia do perfeccionismo. Amém.",
      es: "Señor, que haga con fidelidad lo que está en mi mano hoy. Un paso a la vez, con el corazón vuelto hacia Ti, libre de la parálisis del perfeccionismo. Amén.",
    },
  },
  {
    ref: "João 3:16",
    texto: {
      pt: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
      es: "Porque de tal manera amó Dios al mundo, que dio a su Hijo unigénito.",
    },
    reflexao: {
      pt: "O mesmo amor que deu o Filho também deu o pão, a água, o azeite, o mel, o peixe — tudo o que sustenta a vida. O amor de Deus não é abstrato: ele se expressa em cada forma de sustento que chega até você. Reconhecer esse amor à mesa muda a refeição de obrigação para celebração. Comer deixa de ser só repor energia e passa a ser receber afeto. Hoje, ao se alimentar, lembre-se: por trás de cada alimento bom há um Deus que ama. O cuidado com o que entra no seu corpo é uma resposta de amor a Quem te amou primeiro.",
      es: "El mismo amor que dio al Hijo también dio el pan, el agua, el aceite, la miel, el pescado — todo lo que sostiene la vida. El amor de Dios no es abstracto: se expresa en cada forma de sustento que llega hasta ti. Reconocer ese amor en la mesa cambia la comida de obligación a celebración. Comer deja de ser solo reponer energía y pasa a ser recibir afecto. Hoy, al alimentarte, recuerda: detrás de cada alimento bueno hay un Dios que ama. El cuidado con lo que entra en tu cuerpo es una respuesta de amor a Quien te amó primero.",
    },
    oracao: {
      pt: "Pai, que eu veja Teu amor em cada alimento que entra no meu corpo hoje. Que comer seja reconhecer o Teu amor, e que o cuidado comigo seja a minha resposta a Quem me amou primeiro. Amém.",
      es: "Padre, que vea Tu amor en cada alimento que entra en mi cuerpo hoy. Que comer sea reconocer Tu amor, y que el cuidado conmigo sea mi respuesta a Quien me amó primero. Amén.",
    },
  },
];

/** Devocional do dia — MESMO versículo para os dois idiomas (corrige o bug). */
export function versiculoDoDia(lang: "pt" | "es" = "pt"): {
  texto: string;
  ref: string;
  reflexao: string;
  oracao: string;
} {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const i = ((dayOfYear % devocionais.length) + devocionais.length) % devocionais.length;
  const d = devocionais[i];
  return {
    texto: d.texto[lang],
    ref: d.ref,
    reflexao: d.reflexao[lang],
    oracao: d.oracao[lang],
  };
}
