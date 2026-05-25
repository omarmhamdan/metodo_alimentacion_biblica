import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useUser, useLang } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
  // title set by AppShell bootstrap (per-language)
});

const content = {
  es: {
    stepLabel: (s: number, t: number) => `Paso ${s} de ${t}`,
    skip: "Omitir",
    back: "Atrás",
    next: "Continuar",
    finish: "Comenzar mi jornada",
    verses: [
      { t: "Todo tiene su tiempo determinado.", r: "Eclesiastés 3:1" },
      { t: "Gustad y ved que el Señor es bueno.", r: "Salmos 34:8" },
      { t: "El Señor es mi pastor, nada me faltará.", r: "Salmos 23:1" },
      { t: "No solo de pan vivirá el hombre.", r: "Mateo 4:4" },
      { t: "Buscad primero el reino de Dios.", r: "Mateo 6:33" },
      { t: "Todo lo puedo en Cristo que me fortalece.", r: "Filipenses 4:13" },
    ],
    steps: [
      { title: "¿Cómo podemos llamarte?", subtitle: "Vamos a preparar una mesa solo para ti." },
      {
        title: "Cuéntanos un poco sobre ti",
        subtitle: "Tu información queda guardada solo contigo.",
      },
      { title: "¿Cuál es tu objetivo?", subtitle: "Elige lo que más resuena con tu corazón." },
      { title: "¿Cuánta agua tomas?", subtitle: "Vamos a definir una meta suave para tu día." },
      { title: "¿Alguna restricción alimentaria?", subtitle: "Opcional. Puedes editarlo después." },
    ],
    objetivos: [
      "Adelgazar",
      "Desinflamar",
      "Mejorar energía",
      "Reconectarme con la alimentación natural",
      "Alimentación bíblica en familia",
    ],
    namePlaceholder: "Tu nombre",
    agePlaceholder: "Edad",
    ageSuffix: "años",
    weightPlaceholder: "Peso",
    weightSuffix: "kg",
    waterLabel: "Meta diaria",
    energyLabel: "Nivel de energía hoy",
    restrictionPlaceholder: "Ej: intolerancia a la lactosa, sin gluten...",
    finishVerse: { t: "Todo lo puedo en Cristo que me fortalece.", r: "Filipenses 4:13" },
  },
  pt: {
    stepLabel: (s: number, t: number) => `Passo ${s} de ${t}`,
    skip: "Pular",
    back: "Voltar",
    next: "Continuar",
    finish: "Começar minha jornada",
    verses: [
      { t: "Tudo tem o seu tempo determinado.", r: "Eclesiastes 3:1" },
      { t: "Provai e vede que o Senhor é bom.", r: "Salmos 34:8" },
      { t: "O Senhor é o meu pastor, nada me faltará.", r: "Salmos 23:1" },
      { t: "Não só de pão viverá o homem.", r: "Mateus 4:4" },
      { t: "Buscai primeiro o reino de Deus.", r: "Mateus 6:33" },
      { t: "Tudo posso naquele que me fortalece.", r: "Filipenses 4:13" },
    ],
    steps: [
      { title: "Como podemos te chamar?", subtitle: "Vamos preparar uma mesa só sua." },
      {
        title: "Conte um pouco sobre você",
        subtitle: "Suas informações ficam guardadas com você.",
      },
      { title: "Qual o seu objetivo?", subtitle: "Escolha o que mais ressoa com seu coração." },
      {
        title: "Quanta água você bebe?",
        subtitle: "Vamos definir uma meta gentil para o seu dia.",
      },
      { title: "Alguma restrição alimentar?", subtitle: "Opcional. Você poderá editar depois." },
    ],
    objetivos: [
      "Emagrecer",
      "Desinflamar",
      "Melhorar energia",
      "Reconectar-se com alimentação natural",
      "Alimentação bíblica em família",
    ],
    namePlaceholder: "Seu nome",
    agePlaceholder: "Idade",
    ageSuffix: "anos",
    weightPlaceholder: "Peso",
    weightSuffix: "kg",
    waterLabel: "Meta diária",
    energyLabel: "Nível de energia hoje",
    restrictionPlaceholder: "Ex: intolerância à lactose, sem glúten...",
    finishVerse: { t: "Tudo posso naquele que me fortalece.", r: "Filipenses 4:13" },
  },
};

function OnboardingPage() {
  const { user, save } = useUser();
  const navigate = useNavigate();
  const { lang } = useLang();
  const c = content[lang] ?? content.es;

  const [step, setStep] = useState(0);
  const [nome, setNome] = useState(user?.nome ?? "");
  const [idade, setIdade] = useState<number | "">("");
  const [peso, setPeso] = useState<number | "">("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [agua, setAgua] = useState(2000);
  const [energia, setEnergia] = useState(5);
  const [restricoes, setRestricoes] = useState("");

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, [user, navigate]);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;
  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    save({
      ...(user ?? { nome }),
      nome: nome || user?.nome || (lang === "es" ? "Amada" : "Amada"),
      idade: Number(idade) || undefined,
      pesoAtual: Number(peso) || undefined,
      objetivo,
      aguaMeta: agua,
      energia,
      restricoes,
      onboarded: true,
    });
    navigate({ to: "/dashboard" });
  };

  const verse = c.verses[Math.min(step, c.verses.length - 1)];

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md bg-gradient-devotional px-6 pt-10 pb-10">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{c.stepLabel(step + 1, totalSteps)}</span>
          <button onClick={() => navigate({ to: "/dashboard" })} className="hover:text-foreground">
            {c.skip}
          </button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.div
        key={`verse-${step}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <p className="font-serif italic text-sm text-earth">"{verse.t}"</p>
        <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{verse.r}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl bg-card p-6 shadow-soft"
        >
          {/* STEP 0 — Name */}
          {step === 0 && (
            <StepBlock title={c.steps[0].title} subtitle={c.steps[0].subtitle}>
              <Input value={nome} onChange={setNome} placeholder={c.namePlaceholder} />
            </StepBlock>
          )}

          {/* STEP 1 — Age & weight */}
          {step === 1 && (
            <StepBlock title={c.steps[1].title} subtitle={c.steps[1].subtitle}>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={idade}
                  onChange={(v) => setIdade(v === "" ? "" : Number(v))}
                  placeholder={c.agePlaceholder}
                  type="number"
                  suffix={c.ageSuffix}
                />
                <Input
                  value={peso}
                  onChange={(v) => setPeso(v === "" ? "" : Number(v))}
                  placeholder={c.weightPlaceholder}
                  type="number"
                  suffix={c.weightSuffix}
                />
              </div>
            </StepBlock>
          )}

          {/* STEP 2 — Goal */}
          {step === 2 && (
            <StepBlock title={c.steps[2].title} subtitle={c.steps[2].subtitle}>
              <div className="space-y-2">
                {c.objetivos.map((o) => (
                  <button
                    key={o}
                    onClick={() => setObjetivo(o)}
                    className={`w-full rounded-2xl border px-4 py-3.5 text-left text-sm transition-all ${objetivo === o ? "border-olive bg-highlight text-foreground shadow-card" : "border-border bg-card text-muted-foreground hover:border-olive/40"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </StepBlock>
          )}

          {/* STEP 3 — Water & energy */}
          {step === 3 && (
            <StepBlock title={c.steps[3].title} subtitle={c.steps[3].subtitle}>
              <div className="text-center">
                <div className="font-serif text-4xl text-foreground">
                  {(agua / 1000).toFixed(1)}L
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.waterLabel}</p>
              </div>
              <input
                type="range"
                min={1000}
                max={4000}
                step={100}
                value={agua}
                onChange={(e) => setAgua(Number(e.target.value))}
                className="mt-5 w-full accent-[color:var(--olive)]"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>1L</span>
                <span>4L</span>
              </div>
              <div className="mt-6">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {c.energyLabel}
                </p>
                <div className="flex items-center justify-between gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setEnergia(i + 1)}
                      className={`h-9 flex-1 rounded-lg text-xs font-medium transition-all ${i < energia ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </StepBlock>
          )}

          {/* STEP 4 — Restrictions */}
          {step === 4 && (
            <StepBlock title={c.steps[4].title} subtitle={c.steps[4].subtitle}>
              <textarea
                value={restricoes}
                onChange={(e) => setRestricoes(e.target.value)}
                placeholder={c.restrictionPlaceholder}
                rows={4}
                className="w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none focus:border-olive/50 focus:ring-2 focus:ring-olive/15"
              />
              <div className="mt-6 rounded-2xl bg-devotional p-4 text-center">
                <p className="font-serif italic text-sm text-earth">"{c.finishVerse.t}"</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {c.finishVerse.r}
                </p>
              </div>
            </StepBlock>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => {
            if (step > 0) back();
            else {
              save(null);
              navigate({ to: "/" });
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-card transition-colors hover:bg-secondary"
          aria-label={c.back}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={step === totalSteps - 1 ? finish : next}
          className="flex-1 rounded-2xl bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {step === totalSteps - 1 ? c.finish : c.next}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

function StepBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground text-balance">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground text-balance">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  suffix?: string;
}) {
  return (
    <label className="relative flex items-center rounded-2xl border border-border bg-card px-4 py-3 shadow-card focus-within:border-olive/50 focus-within:ring-2 focus-within:ring-olive/15">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
      />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </label>
  );
}
