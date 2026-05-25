import { useEffect, useState, useMemo } from "react";
import { getLang, setLang as setLangStorage, type Lang, T } from "./i18n";
import { getRecipesLang, type Receita } from "./recipes";
import { initImages, isImagesReady } from "./image-store";
import { upsertProfile, upsertDaily } from "./sync";

export interface UserProfile {
  nome: string;
  email?: string;
  idade?: number;
  pesoAtual?: number;
  objetivo?: string;
  energia?: number;
  aguaMeta?: number;
  oracao?: string;
  restricoes?: string;
  onboarded?: boolean;
  createdAt?: string;
  notifications?: { morning: boolean; afternoon: boolean; devotional: boolean };
}

export interface DailyState {
  date: string;
  aguaMl: number;
  sucoTomado: boolean;
  jornadaDia: number;
  sequencia: number;
  ultimaReceita?: string;
  favoritos: string[];
  pesoHistorico: { date: string; peso: number }[];
  energiaHistorico: { date: string; valor: number }[];
}

const today = () => new Date().toISOString().slice(0, 10);

const KEY_USER = "mab:user";
const KEY_DAILY = "mab:daily";
const KEY_USERS_BY_EMAIL = "mab:users"; // Record<email, { user, daily }>

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("mab:storage", { detail: k }));
}

// ── Per-email user store ─────────────────────────────────────────────────────
// Persists each user's profile + daily snapshot keyed by email so the same
// person who logs out and back in (or who installs the PWA after onboarding)
// gets all of their data restored instead of becoming a "visitor" again.

type UsersByEmail = Record<string, { user: UserProfile; daily?: DailyState }>;

function readUsersByEmail(): UsersByEmail {
  return read<UsersByEmail>(KEY_USERS_BY_EMAIL, {});
}

function writeUsersByEmail(m: UsersByEmail) {
  write(KEY_USERS_BY_EMAIL, m);
}

function normalizeEmail(e: string | undefined): string {
  return (e ?? "").trim().toLowerCase();
}

/** Look up a previously-saved profile by email. Returns null if not found. */
export function findUserByEmail(email: string): { user: UserProfile; daily?: DailyState } | null {
  const key = normalizeEmail(email);
  if (!key) return null;
  return readUsersByEmail()[key] ?? null;
}

/** Snapshot current user/daily into the by-email store. */
function snapshotByEmail(u: UserProfile, daily?: DailyState) {
  const key = normalizeEmail(u.email);
  if (!key) return;
  const all = readUsersByEmail();
  all[key] = { user: u, daily: daily ?? read<DailyState | undefined>(KEY_DAILY, undefined) };
  writeUsersByEmail(all);
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(() =>
    read<UserProfile | null>(KEY_USER, null),
  );
  useEffect(() => {
    const sync = () => setUser(read<UserProfile | null>(KEY_USER, null));
    window.addEventListener("mab:storage", sync);
    return () => window.removeEventListener("mab:storage", sync);
  }, []);
  const save = (u: UserProfile | null) => {
    if (u) {
      write(KEY_USER, u);
      // Persist to by-email store + cloud
      snapshotByEmail(u);
      const daily = read<DailyState | undefined>(KEY_DAILY, undefined);
      upsertProfile(u, daily).catch(() => {});
    } else if (typeof window !== "undefined") {
      // Logout: snapshot under previous email + push to cloud first, then clear
      const prev = read<UserProfile | null>(KEY_USER, null);
      const daily = read<DailyState | undefined>(KEY_DAILY, undefined);
      if (prev?.email) {
        snapshotByEmail(prev, daily);
        upsertProfile(prev, daily).catch(() => {});
      }
      localStorage.removeItem(KEY_USER);
    }
    setUser(u);
  };
  return { user, save };
}

const defaultDaily = (): DailyState => ({
  date: today(),
  aguaMl: 0,
  sucoTomado: false,
  jornadaDia: 1,
  sequencia: 1,
  favoritos: [],
  pesoHistorico: [],
  energiaHistorico: [],
});

// Difference in whole days between two "YYYY-MM-DD" dates (timezone-safe).
function daysBetween(prev: string, curr: string): number {
  const a = new Date(prev + "T00:00:00").getTime();
  const b = new Date(curr + "T00:00:00").getTime();
  return Math.round((b - a) / 86_400_000);
}

export function useDaily() {
  const [daily, setDaily] = useState<DailyState>(() => {
    const d = read<DailyState>(KEY_DAILY, defaultDaily());
    if (d.date !== today()) {
      const gap = daysBetween(d.date, today());
      // gap === 1 (consecutive day) → streak continues; otherwise → reset to 1
      const newStreak = gap === 1 ? (d.sequencia ?? 0) + 1 : 1;
      const nd: DailyState = {
        ...d,
        date: today(),
        aguaMl: 0,
        sucoTomado: false,
        jornadaDia: (d.jornadaDia ?? 0) + 1,
        sequencia: newStreak,
      };
      write(KEY_DAILY, nd);
      return nd;
    }
    return d;
  });

  useEffect(() => {
    const sync = () => setDaily(read<DailyState>(KEY_DAILY, defaultDaily()));
    window.addEventListener("mab:storage", sync);
    return () => window.removeEventListener("mab:storage", sync);
  }, []);

  const update = (patch: Partial<DailyState>) => {
    const next = { ...daily, ...patch };
    write(KEY_DAILY, next);
    setDaily(next);
    // Cloud sync (best-effort, debounced via microtask coalescing)
    const u = read<UserProfile | null>(KEY_USER, null);
    if (u?.email) upsertDaily(u.email, next).catch(() => {});
  };

  const toggleFavorito = (id: string) => {
    const set = new Set(daily.favoritos);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    update({ favoritos: Array.from(set) });
  };

  return { daily, update, toggleFavorito };
}

// ── Language hook ─────────────────────────────────────────────────────────────
export function useLang() {
  const [lang, setLangState] = useState<Lang>(getLang);

  useEffect(() => {
    const sync = () => setLangState(getLang());
    window.addEventListener("mab:lang", sync);
    return () => window.removeEventListener("mab:lang", sync);
  }, []);

  const setLang = (l: Lang) => {
    setLangStorage(l);
    setLangState(l);
  };

  const t = (key: keyof typeof T.es): string => T[lang][key] as string;

  return { lang, setLang, t };
}

/** True once the IndexedDB image cache is populated. Components can use this
 *  to avoid showing the default stock photo for ~1s before the user upload swaps in. */
export function useImagesReady(): boolean {
  const [ready, setReady] = useState<boolean>(() => isImagesReady());
  useEffect(() => {
    if (isImagesReady()) {
      setReady(true);
      return;
    }
    const fn = () => setReady(true);
    window.addEventListener("mab:images-ready", fn);
    // Safety: if init hasn't been kicked off yet, do it now
    initImages();
    return () => window.removeEventListener("mab:images-ready", fn);
  }, []);
  return ready;
}

// ── Recipes hook (reactive to lang + admin overrides + IDB images) ───────────
export function useRecipes(): Receita[] {
  const { lang } = useLang();
  const [list, setList] = useState<Receita[]>(() => getRecipesLang(lang));

  // Load IDB images into cache on first mount, then rebuild
  useEffect(() => {
    initImages().then(() => setList(getRecipesLang(getLang())));
  }, []);

  // Re-compute when language changes
  useEffect(() => {
    setList(getRecipesLang(lang));
  }, [lang]);

  // Re-compute when admin saves text overrides or uploads/deletes images
  useEffect(() => {
    const fn = () => setList(getRecipesLang(getLang()));
    window.addEventListener("mab:overrides", fn);
    window.addEventListener("mab:images", fn);
    return () => {
      window.removeEventListener("mab:overrides", fn);
      window.removeEventListener("mab:images", fn);
    };
  }, []);

  return list;
}

// ── Devotionals (30+ for daily rotation) ─────────────────────────────────────
export const devocionaisPT = [
  {
    texto: "Quer comais, quer bebais, fazei tudo para glória de Deus.",
    ref: "1 Coríntios 10:31",
    reflexao:
      'Antes de cuidar do seu corpo, Deus já o chamou de templo. Comer com presença é um ato de adoração. Cada escolha à mesa é uma pequena oração silenciosa — um "sim" à vida que Ele já preparou para você.',
    oracao:
      "Senhor, ensina-me a comer com gratidão. Que cada refeição seja altar, cada gole seja prece, e cada gesto à mesa seja um lembrete do Teu cuidado por mim. Amém.",
  },
  {
    texto: "Não só de pão viverá o homem, mas de toda palavra que sai da boca de Deus.",
    ref: "Mateus 4:4",
    reflexao:
      "O alimento nutre o corpo, mas é a Palavra que sustenta a alma. Hoje, antes de comer, abra as Escrituras por cinco minutos. Deixe que Ele prepare sua mesa interior antes da física.",
    oracao:
      "Pai, que eu busque primeiro o Teu Reino e a Tua justiça, e que todas as demais coisas — inclusive o alimento — sejam acrescentadas a mim. Amém.",
  },
  {
    texto: "O Senhor é o meu pastor, nada me faltará.",
    ref: "Salmos 23:1",
    reflexao:
      "Quando você escolhe alimentos naturais, está aceitando o que o Bom Pastor preparou desde o início. A escassez não mora na mesa de Deus — ali, sempre há o suficiente.",
    oracao:
      "Senhor, que eu confie no Teu suprimento a cada dia. Que minha mesa seja sinal da Tua fidelidade. Amém.",
  },
  {
    texto: "Provai e vede que o Senhor é bom.",
    ref: "Salmos 34:8",
    reflexao:
      "Comer com atenção é uma forma de provar a bondade de Deus. Cada sabor, cada textura, cada aroma — são memórias do Éden que ainda chegam até nós através do alimento que Ele criou.",
    oracao:
      "Deus, hoje quero provar da Tua bondade em cada refeição. Que meu paladar me leve até a adoração. Amém.",
  },
  {
    texto: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
    ref: "Mateus 11:28",
    reflexao:
      "O cansaço muitas vezes começa no corpo antes de chegar à alma. Cuidar do templo que Deus te deu é uma forma de receber o alívio que Ele prometeu. Comer bem é acolher o descanso.",
    oracao:
      "Senhor, venho até Ti carregando o peso do cansaço. Recebo hoje o Teu alívio — no alimento que escolho, na água que bebo, no descanso que Tuas criações me oferecem. Amém.",
  },
  {
    texto: "O justo come para satisfazer o seu apetite.",
    ref: "Provérbios 13:25",
    reflexao:
      "Comer até a satisfação — não até o excesso — é sabedoria bíblica. O justo sabe quando parar. Hoje, pratique ouvir o seu corpo: ele é o templo do Espírito, e fala quando está saciado.",
    oracao:
      "Senhor, que eu aprenda a ouvir o Teu templo. Que eu coma até a satisfação e confie que isso é suficiente. Amém.",
  },
  {
    texto: "Come mel, meu filho, porque é bom.",
    ref: "Provérbios 24:13",
    reflexao:
      "Deus não apenas tolerou o doce — Ele o celebrou. A doçura é uma dádiva divina. Hoje, escolha a doçura natural: mel, fruta madura, tâmaras. Saboreie sem culpa — é a criação de Deus.",
    oracao:
      "Pai, que eu receba a doçura da Tua criação com alegria, sem culpa, como presente que é. Amém.",
  },
  {
    texto: "Bendirás ao Senhor teu Deus pelo bom território que te deu.",
    ref: "Deuteronômio 8:10",
    reflexao:
      "Toda refeição é uma terra boa. Quando você abençoa o alimento antes de comer, está repetindo um gesto que atravessa milênios de gratidão. A bênção não apenas agradece — ela santifica.",
    oracao:
      "Senhor, obrigada pela terra boa que se expressa no meu prato hoje. Abençoo este alimento em Teu nome. Amém.",
  },
  {
    texto: "Aquele que planta e aquele que rega são iguais, e cada um receberá o seu salário.",
    ref: "1 Coríntios 3:8",
    reflexao:
      "Cada pequeno gesto de saúde conta: o suco que você faz de manhã, a água que você bebe, o legume que você escolhe no mercado. Tudo isso é semente. Tudo tem seu tempo de colheita.",
    oracao:
      "Pai, que eu plante hábitos saudáveis com constância, confiando que toda semente Tua tem seu tempo de colheita. Amém.",
  },
  {
    texto: "Dai graças em tudo, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
    ref: "1 Tessalonicenses 5:18",
    reflexao:
      "Gratidão antes de comer muda a relação com o alimento. Não é superstição — é consciência. Quando você agradece, você come mais lento, mais atento, mais saciado. A gratidão é digestiva.",
    oracao:
      "Senhor, que a gratidão seja minha primeira ferramenta à mesa. Antes de qualquer garfada, um obrigado. Amém.",
  },
  {
    texto: "Não vos embriagueis com vinho, em que há dissolução; antes sede cheios do Espírito.",
    ref: "Efésios 5:18",
    reflexao:
      "O que nos enche importa. O ultraprocessado nos enche de vazio — inflama, vicia, entorpece. O alimento de verdade nos enche de vida. Hoje, escolha ser enchido pelo que Deus criou.",
    oracao:
      "Espírito Santo, que Tua presença seja o que me sacia hoje — no alimento que escolho e na paz que habita em mim. Amém.",
  },
  {
    texto: "Até o pardal encontrou uma casa e a andorinha um ninho.",
    ref: "Salmos 84:3",
    reflexao:
      "Deus cuida do menor dos pássaros. Quantas mais Ele cuida de você? Hoje, enquanto prepara sua refeição, lembre-se: Ele já preparou provisão. Sua tarefa é receber com fé.",
    oracao:
      "Pai, que eu confie no Teu cuidado tão completamente quanto o pardal confia. Que minha mesa seja prova da Tua fidelidade. Amém.",
  },
  {
    texto: "E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor.",
    ref: "Colossenses 3:23",
    reflexao:
      "Cozinhar com intenção é um ato de culto. Quando você prepara uma refeição de boa comida com presença e amor — mesmo sozinha — está servindo ao Senhor. A cozinha pode ser altar.",
    oracao:
      "Senhor, que eu cozinhe hoje com o coração voltado para Ti. Que cada gesto na cozinha seja oferenda. Amém.",
  },
  {
    texto: "O espírito é que vivifica; a carne não aproveita nada.",
    ref: "João 6:63",
    reflexao:
      "O alimento que você escolhe pode vivificar ou murchar o espírito. Comida morta — ultraprocessada — não alimenta o espírito. Comida viva, natural, criada por Deus — alimenta corpo e alma.",
    oracao:
      "Senhor, que eu escolha o que vivifica em cada refeição. Que meu corpo receba vida, e não mais inflamação. Amém.",
  },
  {
    texto:
      "Criou Deus os grandes animais marinhos, e todos os répteis que se movem nas águas... e viu Deus que era bom.",
    ref: "Gênesis 1:21",
    reflexao:
      "Tudo o que Deus criou foi declarado bom. O peixe, o grão, a erva, a fruta — são 'bons' desde antes que qualquer humano os tocasse. Escolher esses alimentos é escolher o que Ele chamou de bom.",
    oracao:
      "Criador, que eu honre a bondade da Tua criação ao escolher o que entra no meu corpo. Amém.",
  },
  {
    texto: "Serei como o orvalho para Israel; ele florescerá como o lírio.",
    ref: "Oseias 14:5",
    reflexao:
      "O orvalho cai todo dia, silencioso e suficiente. Assim é o cuidado de Deus com o seu corpo — constante, suave, diário. Cada manhã é uma nova oportunidade de florescer.",
    oracao:
      "Senhor, que Teu cuidado caia sobre mim como orvalho. Que eu floresça hoje em saúde e gratidão. Amém.",
  },
  {
    texto: "Assim como o Pai me enviou, também eu vos envio.",
    ref: "João 20:21",
    reflexao:
      "Você foi enviada com um corpo — o mesmo templo que o Espírito habita. Cuidar desse templo é parte da sua missão. Saúde não é vaidade; é preparação para o chamado.",
    oracao:
      "Pai, que eu cuide do meu corpo como quem guarda um instrumento de missão. Que eu sirva melhor porque me cuido bem. Amém.",
  },
  {
    texto:
      "Melhor é o pão seco, acompanhado de paz, do que a casa cheia de banquetes, com contendas.",
    ref: "Provérbios 17:1",
    reflexao:
      "Às vezes a melhor refeição é a mais simples, feita com paz. Hoje, se sua mesa for humilde, que ela seja cheia de paz. Deus abençoa o simples.",
    oracao:
      "Senhor, que minha mesa seja sempre cheia de paz, mesmo quando simples. A paz à mesa é sinal do Teu Reino. Amém.",
  },
  {
    texto: "Dão-te a comer pão de angústia e água de tribulação.",
    ref: "Isaías 30:20",
    reflexao:
      "Mesmo em tempos difíceis, Deus ainda é professor. Cada dificuldade que passamos — no corpo, na saúde — pode ser escola. O importante é que o Mestre não abandona o aluno.",
    oracao:
      "Senhor, que mesmo nas dificuldades de saúde, eu veja Tua mão ensinando e não me abandonando. Amém.",
  },
  {
    texto: "E Deus disse: Eis que vos tenho dado toda a erva que dá semente.",
    ref: "Gênesis 1:29",
    reflexao:
      "A primeira instrução alimentar de Deus ao ser humano foi: coma o que a terra dá. Sementes, frutos, ervas. Antes de qualquer ultraprocessado, havia um cardápio completo, gratuito e perfeito.",
    oracao:
      "Criador, que eu volte ao cardápio que Tu originalmente preparaste para mim. Que a terra seja minha farmácia e Tua criação meu remédio. Amém.",
  },
  {
    texto: "E farei que desçam as chuvas a seu tempo; haverá chuvas de bênção.",
    ref: "Ezequiel 34:26",
    reflexao:
      "As estações, as chuvas, as colheitas — tudo tem tempo. Sua cura também tem tempo. Não force, não desista. Plante os hábitos certos e confie nas chuvas de bênção de Deus.",
    oracao:
      "Senhor, que eu plante na estação certa e confie nas Tuas chuvas de bênção sobre minha saúde. Amém.",
  },
  {
    texto:
      "Cada um deve considerar como seu próximo não o que é bom para si, mas o que é bom para o outro.",
    ref: "1 Coríntios 10:24",
    reflexao:
      "Cozinhar para a família com alimentos bíblicos é um ato de amor. Quando você coloca uma refeição saudável na mesa, não está fazendo só por você — está abençoando todos os que dependem da sua cozinha.",
    oracao:
      "Senhor, que minha cozinha seja fonte de bênção para toda a minha família. Que o alimento que preparo seja amor servido à mesa. Amém.",
  },
  {
    texto: "Para mim, viver é Cristo e o morrer é lucro.",
    ref: "Filipenses 1:21",
    reflexao:
      "Viver plenamente exige um corpo capaz de servir. Cuidar da sua saúde não é egoísmo — é preparação para viver em Cristo com mais plenitude, mais disposição, mais anos de serviço.",
    oracao:
      "Pai, que eu cuide da vida que Tu me deste, para vivê-la com mais plenitude em Cristo. Amém.",
  },
  {
    texto: "A fé sem obras é morta.",
    ref: "Tiago 2:26",
    reflexao:
      "Orar por saúde e continuar comendo o que adoece é fé sem obra. A fé que move o corpo é a que muda o prato. Hoje, que sua fé se expresse na escolha que você faz à mesa.",
    oracao:
      "Senhor, que minha fé tenha obra à mesa. Que eu aja conforme o que creio sobre o Teu cuidado pelo meu corpo. Amém.",
  },
  {
    texto: "Sede fortes e corajosos. Não temais nem desfaleçais.",
    ref: "Deuteronômio 31:6",
    reflexao:
      "Mudar de hábitos alimentares pede coragem. Abandonar o ultraprocessado, cozinhar do zero, aprender novas receitas — tudo isso é batalha. Mas você não enfrenta sozinha.",
    oracao:
      "Senhor, dá-me coragem para mudar o que precisa ser mudado na minha alimentação. Que eu não desfalece diante das dificuldades. Amém.",
  },
  {
    texto: "Mas os que esperam no Senhor renovarão as suas forças.",
    ref: "Isaías 40:31",
    reflexao:
      "Renovação de forças começa de dentro para fora — mas também de fora para dentro. O alimento certo renova as forças físicas; a espera no Senhor renova as espirituais. As duas se completam.",
    oracao:
      "Senhor, enquanto espero em Ti, que eu também cuide do templo que Tu me deste. Que minha força seja renovada em cada sentido. Amém.",
  },
  {
    texto: "Aqui está o suco de uva e os pães asmos.",
    ref: "Gênesis 14:18",
    reflexao:
      "Melquisedec serviu a Abraão com os alimentos mais simples: pão e vinho. Os maiores momentos de encontro com Deus muitas vezes acontecem à volta de uma mesa simples, com alimentos simples.",
    oracao:
      "Pai, que eu encontre o sagrado na simplicidade do meu prato hoje. Que minha mesa seja lugar de encontro com o Senhor. Amém.",
  },
  {
    texto: "Procura a paz e segue-a.",
    ref: "Salmos 34:14",
    reflexao:
      "A paz começa no corpo. Um corpo inflamado produz ansiedade. Um corpo nutrido com alimentos que Deus criou tende ao equilíbrio, à serenidade, à paz. Comer bem é caminho de paz.",
    oracao:
      "Senhor, que minha escolha alimentar hoje seja um passo em direção à paz que Tua Palavra me promete. Amém.",
  },
  {
    texto:
      "Mas a semente que caiu em boa terra são os que, num coração bom e reto, retêm a palavra e dão fruto com perseverança.",
    ref: "Lucas 8:15",
    reflexao:
      "Hábito é semente. A semente do suco sagrado na manhã, da refeição sem ultraprocessado, da água bebida com gratidão — todas essas sementes precisam de perseverança para dar fruto. Continue.",
    oracao:
      "Senhor, que eu persevere nos pequenos hábitos que Tu plantastes em mim. Que a semente de saúde que estou plantando dê fruto abundante. Amém.",
  },
  {
    texto: "Tudo quanto the vier à mão para fazer, faze-o conforme as tuas forças.",
    ref: "Eclesiastes 9:10",
    reflexao:
      "Você não precisa mudar tudo de uma vez. Faça o que está na sua mão hoje — uma receita nova, um suco a mais, um passo em direção ao que é natural. Deus honra o esforço sincero.",
    oracao:
      "Senhor, que eu faça com fidelidade o que está na minha mão hoje. Um passo de cada vez, com o coração voltado para Ti. Amém.",
  },
  {
    texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
    ref: "João 3:16",
    reflexao:
      "O mesmo amor que deu o Filho também deu o pão, a água, o azeite, o mel, o peixe — tudo que sustenta a vida. O amor de Deus se expressa em toda forma de sustento. Reconheça-o hoje à mesa.",
    oracao:
      "Pai, que eu veja Teu amor em cada alimento que entra no meu corpo hoje. Que comer seja reconhecer o Teu amor. Amém.",
  },
];

export const devocionalES = [
  {
    texto: "Todo lo que hagáis, hacedlo de corazón, como para el Señor.",
    ref: "Colosenses 3:23",
    reflexao:
      "Cocinar con intención es un acto de culto. Cuando preparas una comida con presencia y amor — incluso para ti sola — estás sirviendo al Señor. La cocina puede ser un altar.",
    oracao:
      "Señor, que cocine hoy con el corazón vuelto hacia Ti. Que cada gesto en la cocina sea una ofrenda. Amén.",
  },
  {
    texto: "No solo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.",
    ref: "Mateo 4:4",
    reflexao:
      "El alimento nutre el cuerpo, pero es la Palabra lo que sostiene el alma. Hoy, antes de comer, abre las Escrituras por cinco minutos. Deja que Él prepare tu mesa interior antes que la física.",
    oracao:
      "Padre, que busque primero Tu Reino y Tu justicia, y que todas las demás cosas — incluyendo el alimento — me sean añadidas. Amén.",
  },
  {
    texto: "Gustad y ved que el Señor es bueno.",
    ref: "Salmos 34:8",
    reflexao:
      "Comer con atención es una forma de probar la bondad de Dios. Cada sabor, cada textura, cada aroma son memorias del Edén que aún llegan hasta nosotros a través del alimento que Él creó.",
    oracao:
      "Dios, hoy quiero probar Tu bondad en cada comida. Que mi paladar me lleve hasta la adoración. Amén.",
  },
  {
    texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
    ref: "Mateo 11:28",
    reflexao:
      "El cansancio muchas veces empieza en el cuerpo antes de llegar al alma. Cuidar el templo que Dios te dio es una forma de recibir el alivio que Él prometió. Comer bien es acoger el descanso.",
    oracao:
      "Señor, vengo a Ti cargando el peso del cansancio. Recibo hoy Tu alivio — en el alimento que elijo, en el agua que bebo, en el descanso que Tus criaturas me ofrecen. Amén.",
  },
  {
    texto: "El justo come hasta saciar su apetito.",
    ref: "Proverbios 13:25",
    reflexao:
      "Comer hasta la satisfacción — no hasta el exceso — es sabiduría bíblica. El justo sabe cuándo detenerse. Hoy, practica escuchar tu cuerpo: es el templo del Espíritu, y habla cuando está saciado.",
    oracao:
      "Señor, que aprenda a escuchar Tu templo. Que coma hasta la satisfacción y confíe en que eso es suficiente. Amén.",
  },
  {
    texto: "Come miel, hijo mío, porque es buena.",
    ref: "Proverbios 24:13",
    reflexao:
      "Dios no solo toleró lo dulce — lo celebró. La dulzura es un regalo divino. Hoy, elige la dulzura natural: miel, fruta madura, dátiles. Saborea sin culpa — es la creación de Dios.",
    oracao:
      "Padre, que reciba la dulzura de Tu creación con alegría, sin culpa, como el regalo que es. Amén.",
  },
  {
    texto: "Bendecirás al Señor tu Dios por la buena tierra que te ha dado.",
    ref: "Deuteronomio 8:10",
    reflexao:
      "Toda comida es una tierra buena. Cuando bendices el alimento antes de comer, repites un gesto que atraviesa milenios de gratitud. La bendición no solo agradece — santifica.",
    oracao:
      "Señor, gracias por la buena tierra que se expresa en mi plato hoy. Bendigo este alimento en Tu nombre. Amén.",
  },
  {
    texto: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros.",
    ref: "1 Tesalonicenses 5:18",
    reflexao:
      "La gratitud antes de comer cambia la relación con el alimento. No es superstición — es conciencia. Cuando agradeces, comes más lento, más atento, más saciado. La gratitud es digestiva.",
    oracao:
      "Señor, que la gratitud sea mi primera herramienta a la mesa. Antes de cada bocado, un gracias. Amén.",
  },
  {
    texto: "Dios dijo: He aquí que os he dado toda planta que da semilla.",
    ref: "Génesis 1:29",
    reflexao:
      "La primera instrucción alimentaria de Dios al ser humano fue: come lo que la tierra da. Semillas, frutos, hierbas. Antes de cualquier ultraprocesado, había un menú completo, gratuito y perfecto.",
    oracao:
      "Creador, que vuelva al menú que Tú originalmente preparaste para mí. Que la tierra sea mi farmacia y Tu creación mi medicina. Amén.",
  },
  {
    texto: "Los que esperan en el Señor tendrán nuevas fuerzas.",
    ref: "Isaías 40:31",
    reflexao:
      "La renovación de fuerzas empieza de adentro hacia afuera — pero también de afuera hacia adentro. El alimento correcto renueva las fuerzas físicas; la espera en el Señor renueva las espirituales.",
    oracao:
      "Señor, mientras espero en Ti, que también cuide el templo que me diste. Que mis fuerzas sean renovadas en todos los sentidos. Amén.",
  },
  {
    texto: "La fe sin obras es muerta.",
    ref: "Santiago 2:26",
    reflexao:
      "Orar por salud y seguir comiendo lo que enferma es fe sin obra. La fe que mueve el cuerpo es la que cambia el plato. Hoy, que tu fe se exprese en la elección que haces a la mesa.",
    oracao:
      "Señor, que mi fe tenga obra en la mesa. Que actúe conforme a lo que creo sobre Tu cuidado por mi cuerpo. Amén.",
  },
  {
    texto: "Porque todo lo que Dios creó es bueno.",
    ref: "1 Timoteo 4:4",
    reflexao:
      "El aceite de oliva, la miel, el pescado, los granos, las hierbas — todo lo que Dios creó es bueno. No hay alimento natural que necesite pedir disculpas. El ultraprocessado es lo que el hombre inventó.",
    oracao:
      "Padre, que vea Tu bondad en cada alimento natural que pongo en mi cuerpo. Que regrese a lo que Tú declaraste bueno. Amén.",
  },
  {
    texto: "Soy la vid verdadera, y mi Padre es el labrador.",
    ref: "Juan 15:1",
    reflexao:
      "Dios es agricultor. Entiende de semillas, estaciones, paciencia y fruto. Cuando cuidas tu alimentación, participas del proceso que Él más conoce: el de hacer crecer cosas vivas desde lo pequeño.",
    oracao:
      "Señor labrador, que me cuides en cada estación de mi salud. Que mi vida dé fruto porque permanezco en Ti. Amén.",
  },
  {
    texto: "El Señor es mi pastor; nada me faltará.",
    ref: "Salmos 23:1",
    reflexao:
      "Cuando eliges alimentos naturales, estás aceptando lo que el Buen Pastor preparó desde el principio. La escasez no vive en la mesa de Dios — allí siempre hay lo suficiente.",
    oracao:
      "Señor, que confíe en Tu provisión cada día. Que mi mesa sea señal de Tu fidelidad. Amén.",
  },
  {
    texto: "Vuestra corporación es templo del Espíritu Santo.",
    ref: "1 Corintios 6:19",
    reflexao:
      "No es casualidad que el Espíritu Santo eligió habitar un cuerpo. Este templo merece el mismo cuidado que le damos a lo que es sagrado. Comer bien es reverencia.",
    oracao:
      "Espíritu Santo, que mi cuerpo sea digno morada Tuya. Que cada elección de alimento sea un acto de reverencia. Amén.",
  },
];

export function versiculoDoDia(lang: "pt" | "es" = "pt") {
  const data = lang === "es" ? devocionalES : devocionaisPT;
  // Usa o dia do ano para um ciclo mais longo antes de repetir
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const i = dayOfYear % data.length;
  return data[i];
}
