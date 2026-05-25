import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/store";

export const Route = createFileRoute("/fundamentos")({
  component: FundamentosPage,
  // title set by AppShell bootstrap (per-language)
});

const sessoesContent = {
  pt: {
    subtitle: "Fundamentos",
    title: "A Mesa do Éden",
    desc: "Pequenos capítulos para reaprender a comer com fé e propósito.",
    chapterLabel: "Capítulo",
    quote: '"Provai e vede que o Senhor é bom."',
    quoteRef: "Salmos 34:8",
    items: [
      {
        titulo: "O problema nunca foi o seu peso",
        versiculo: "Salmos 139:14",
        texto:
          "Por décadas você foi ensinada a culpar o número da balança. Mas o ponto de partida não é o peso — é a desconexão. Voltar à mesa que Deus criou é voltar para casa.",
      },
      {
        titulo: "Inflamação silenciosa",
        versiculo: "1 Coríntios 6:19",
        texto:
          "O excesso de açúcar, ultraprocessados e óleos refinados acendem um fogo invisível no corpo. Esse fogo se chama inflamação — e ela é a raiz por trás do cansaço, da retenção e do peso que não sai.",
      },
      {
        titulo: "A resposta de Daniel",
        versiculo: "Daniel 1:12",
        texto:
          "Daniel pediu apenas dez dias com vegetais e água. Ao final, ele e seus companheiros estavam mais fortes e mais belos. O método começa aqui: na coragem de comer simples.",
      },
      {
        titulo: "O que a Bíblia descreve, a ciência confirma",
        versiculo: "Provérbios 24:13",
        texto:
          "Azeite, peixe, ervas, leguminosas, frutas frescas e mel cru. A dieta mediterrânea bíblica é hoje uma das mais estudadas — e está nas Escrituras há milênios.",
      },
      {
        titulo: "Como usar este método",
        versiculo: "Eclesiastes 3:1",
        texto:
          "Sem pressa, sem perfeição. Substitua aos poucos. Tome o Suco Sagrado pela manhã. Beba água com presença. Cozinhe orando. Repita.",
      },
      {
        titulo: "A mesa do Éden",
        versiculo: "Gênesis 1:29",
        texto:
          "'Eis que vos tenho dado toda erva que dá semente, e toda árvore frutífera; ser-vos-á para mantimento.' A mesa original é viva, colorida, fragrante. Ela já é sua.",
      },
    ],
  },
  es: {
    subtitle: "Fundamentos",
    title: "La Mesa del Edén",
    desc: "Pequeños capítulos para reaprender a comer con fe y propósito.",
    chapterLabel: "Capítulo",
    quote: '"Gustad y ved que el Señor es bueno."',
    quoteRef: "Salmos 34:8",
    items: [
      {
        titulo: "El problema nunca fue tu peso",
        versiculo: "Salmos 139:14",
        texto:
          "Por décadas te enseñaron a culpar al número de la balanza. Pero el punto de partida no es el peso — es la desconexión. Volver a la mesa que Dios creó es volver a casa.",
      },
      {
        titulo: "Inflamación silenciosa",
        versiculo: "1 Corintios 6:19",
        texto:
          "El exceso de azúcar, ultraprocesados y aceites refinados encienden un fuego invisible en el cuerpo. Ese fuego se llama inflamación — y es la raíz detrás del cansancio, la retención y el peso que no se va.",
      },
      {
        titulo: "La respuesta de Daniel",
        versiculo: "Daniel 1:12",
        texto:
          "Daniel pidió solo diez días con vegetales y agua. Al final, él y sus compañeros estaban más fuertes y más sanos. El método empieza aquí: en el coraje de comer simple.",
      },
      {
        titulo: "Lo que la Biblia describe, la ciencia confirma",
        versiculo: "Proverbios 24:13",
        texto:
          "Aceite de oliva, pescado, hierbas, legumbres, frutas frescas y miel cruda. La dieta mediterránea bíblica es hoy una de las más estudiadas — y está en las Escrituras desde hace milenios.",
      },
      {
        titulo: "Cómo usar este método",
        versiculo: "Eclesiastés 3:1",
        texto:
          "Sin prisa, sin perfección. Sustituye poco a poco. Toma el Jugo Sagrado por la mañana. Bebe agua con presencia. Cocina orando. Repite.",
      },
      {
        titulo: "La mesa del Edén",
        versiculo: "Génesis 1:29",
        texto:
          "'He aquí que os he dado toda planta que da semilla, y todo árbol que da fruto; os serán para comer.' La mesa original es viva, colorida, fragante. Ya es tuya.",
      },
    ],
  },
};

function FundamentosPage() {
  const { lang } = useLang();
  const c = sessoesContent[lang] ?? sessoesContent.es;

  return (
    <AppShell>
      <header className="px-6 pt-10 pb-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {c.subtitle}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-foreground">{c.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground text-balance">{c.desc}</p>
      </header>

      <div className="space-y-3 px-6 pb-4">
        {c.items.map((s, i) => (
          <motion.article
            key={s.titulo}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className="rounded-3xl bg-card p-5 shadow-card"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="font-serif text-xs text-earth">
                {c.chapterLabel} {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                {s.versiculo}
              </span>
            </div>
            <h2 className="font-serif text-xl leading-tight text-foreground text-balance">
              {s.titulo}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-balance">
              {s.texto}
            </p>
          </motion.article>
        ))}
      </div>

      <div className="mx-6 mb-6 rounded-3xl bg-gradient-devotional p-6 text-center shadow-card">
        <p className="font-serif italic text-base text-foreground text-balance">{c.quote}</p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {c.quoteRef}
        </p>
      </div>
    </AppShell>
  );
}
