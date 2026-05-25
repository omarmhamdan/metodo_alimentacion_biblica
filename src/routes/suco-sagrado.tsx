import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useDaily, useLang } from "@/lib/store";
import sucoImg from "@/assets/suco-sagrado.jpg";

export const Route = createFileRoute("/suco-sagrado")({
  component: SucoSagrado,
  // title set by AppShell bootstrap (per-language)
});

const content = {
  es: {
    badge: "Ritual matutino",
    title: "Jugo Sagrado de la Mañana",
    subtitle: "El primer gesto del día que aquieta el alma y despierta el cuerpo.",
    verse: "Por la mañana oirás mi voz, oh Señor; por la mañana me presentaré ante Ti en oración.",
    verseRef: "Salmos 5:3",
    secIngredientes: "Ingredientes",
    secRitual: "Ritual",
    secBeneficios: "Beneficios",
    ingredientes: [
      "1 manzana verde",
      "1 puñado de menta fresca",
      "Jugo de 1 limón",
      "1 cucharadita de miel cruda",
      "1 rodaja fina de jengibre",
      "300 ml de agua filtrada",
    ],
    passos: [
      "Lava bien todos los ingredientes en silencio, agradeciendo por la cosecha.",
      "Licúa todo por 30 segundos.",
      "Cuela (opcional) y sirve inmediatamente, en un vaso de vidrio.",
      "Bebe despacio, en ayunas, en oración.",
    ],
    beneficios: [
      "Despierta el hígado",
      "Reduce inflamación",
      "Aumenta energía natural",
      "Hidrata profundamente",
    ],
    btnDone: "Lo tomé hoy — Dios te bendiga",
    btnMark: "Marcar como tomado hoy",
  },
  pt: {
    badge: "Ritual matinal",
    title: "Suco Sagrado da Manhã",
    subtitle: "O primeiro gesto do dia que aquieta a alma e acorda o corpo.",
    verse: "Pela manhã ouvirás a minha voz, ó Senhor; pela manhã apresentarei a Ti a minha oração.",
    verseRef: "Salmos 5:3",
    secIngredientes: "Ingredientes",
    secRitual: "Ritual",
    secBeneficios: "Benefícios",
    ingredientes: [
      "1 maçã verde",
      "1 punhado de hortelã fresca",
      "Suco de 1 limão",
      "1 colher de chá de mel cru",
      "1 fatia fina de gengibre",
      "300 ml de água filtrada",
    ],
    passos: [
      "Lave bem todos os ingredientes em silêncio, agradecendo pela colheita.",
      "Bata tudo no liquidificador por 30 segundos.",
      "Coe (opcional) e sirva imediatamente, em um copo de vidro.",
      "Beba devagar, em jejum, em oração.",
    ],
    beneficios: [
      "Desperta o fígado",
      "Reduz inflamação",
      "Aumenta energia natural",
      "Hidrata profundamente",
    ],
    btnDone: "Tomei hoje — Deus te abençoe",
    btnMark: "Marcar como tomado hoje",
  },
};

function SucoSagrado() {
  const { daily, update } = useDaily();
  const { lang } = useLang();
  const c = content[lang];

  return (
    <AppShell>
      <div className="relative h-[44vh] min-h-[300px] w-full overflow-hidden">
        <img src={sucoImg} alt={c.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-cream" />
        <Link
          to="/dashboard"
          className="absolute left-4 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream/85 text-foreground shadow-card backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="-mt-6 rounded-t-3xl bg-background px-6 pt-6 pb-2"
      >
        <p className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">{c.badge}</p>
        <h1 className="mt-1 font-serif text-3xl leading-tight text-foreground text-balance">
          {c.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-balance">{c.subtitle}</p>

        <blockquote className="mt-5 rounded-2xl bg-gradient-devotional p-4">
          <p className="font-serif italic text-sm text-foreground">&quot;{c.verse}&quot;</p>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {c.verseRef}
          </p>
        </blockquote>

        <Section title={c.secIngredientes}>
          <ul className="space-y-2">
            {c.ingredientes.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" /> {i}
              </li>
            ))}
          </ul>
        </Section>

        <Section title={c.secRitual}>
          <ol className="space-y-3">
            {c.passos.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-highlight font-serif text-xs text-earth">
                  {i + 1}
                </span>
                <span className="pt-1 leading-relaxed">{p}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={c.secBeneficios}>
          <div className="flex flex-wrap gap-2">
            {c.beneficios.map((b) => (
              <span key={b} className="rounded-full bg-highlight px-3 py-1.5 text-xs text-earth">
                {b}
              </span>
            ))}
          </div>
        </Section>

        <button
          onClick={() => update({ sucoTomado: !daily.sucoTomado })}
          className={`mt-8 w-full rounded-2xl px-5 py-4 text-sm font-medium shadow-soft transition-all active:scale-[0.98] ${
            daily.sucoTomado
              ? "bg-sage/40 text-foreground"
              : "bg-gradient-primary text-primary-foreground"
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {daily.sucoTomado ? (
              <>
                <Check className="h-4 w-4" /> {c.btnDone}
              </>
            ) : (
              c.btnMark
            )}
          </span>
        </button>
      </motion.div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 font-serif text-lg text-foreground">{title}</h2>
      {children}
    </section>
  );
}
