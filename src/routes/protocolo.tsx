import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Droplets,
  Sunrise,
  ShoppingBasket,
  Leaf,
  Bath,
  HeartPulse,
  CircleAlert,
  HelpCircle,
  BookHeart,
  Clock,
  ChefHat,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLang, useStoredImageMap } from "@/lib/store";
import { protocoloContent, type Refeicao, type Dia, type ProtocoloContent } from "@/lib/protocolo";
import { bonusFallbacks } from "@/lib/bonus-images";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/protocolo")({
  component: Protocolo,
});

function Protocolo() {
  const { lang } = useLang();
  const c = protocoloContent[lang];
  const [sel, setSel] = useState<number | null>(null);
  const dia = sel ? c.dias.find((d) => d.numero === sel) : null;

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {dia ? (
          <DayDetail key={`d${dia.numero}`} dia={dia} c={c} onBack={() => setSel(null)} onNav={setSel} total={c.dias.length} />
        ) : (
          <Landing key="landing" c={c} onPick={setSel} lang={lang} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

/* ───────────────────────── LANDING ───────────────────────── */
function Landing({
  c,
  onPick,
  lang,
}: {
  c: ProtocoloContent;
  onPick: (n: number) => void;
  lang: "pt" | "es";
}) {
  const img = useStoredImageMap(bonusFallbacks);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero com imagem */}
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden">
        <img src={img["protocolo-hero"]} alt={c.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-background" />
        <Link
          to="/dashboard"
          className="absolute left-4 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream/85 text-foreground shadow-card backdrop-blur"
          aria-label={c.back}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-earth px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cream shadow-soft">
            <Sparkles className="h-3 w-3" /> {c.badge}
          </span>
          <h1 className="mt-2 font-serif text-[30px] leading-tight text-cream drop-shadow text-balance">
            {c.title}
          </h1>
          <p className="mt-1 text-sm text-cream/90 drop-shadow text-balance">{c.subtitle}</p>
        </div>
      </div>

      <div className="px-5 pt-4">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-sage/30 px-3 py-1 text-[11px] font-medium text-earth">
          {c.unlocked}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{c.author}</p>

        {/* Seus 7 dias — grade de cards com foto */}
        <div className="mt-5 mb-2 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-xl text-foreground">{c.diasTitulo}</h2>
            <p className="text-xs text-muted-foreground">{c.diasSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {c.dias.map((d, i) => (
            <motion.button
              key={d.numero}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onPick(d.numero)}
              className="group relative overflow-hidden rounded-2xl bg-card text-left shadow-card transition-all active:scale-[0.97]"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={img[`protocolo-dia-${d.numero}`]}
                  alt={d.nome}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {d.ritual && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-earth/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-cream">
                    <Sparkles className="h-2.5 w-2.5" /> {lang === "es" ? "Bono" : "Bônus"}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-cream">
                  <span className="text-[9px] font-medium uppercase tracking-[0.18em] opacity-90">
                    {c.diaLabel} {d.numero}
                  </span>
                  <p className="font-serif text-[15px] leading-tight">{d.nome}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => onPick(1)}
          className="mt-4 w-full rounded-2xl bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-all active:scale-[0.98]"
        >
          {c.comecarDia1}
        </button>

        {/* Guia completo — accordion enxuto */}
        <div className="mt-7 mb-2">
          <h2 className="font-serif text-xl text-foreground">{c.guiaTitulo}</h2>
          <p className="text-xs text-muted-foreground">{c.guiaSub}</p>
        </div>
        <div className="space-y-2.5">
          <GuideCard icon={Sparkles} title={c.secAbertura}>
            <Abertura c={c} />
          </GuideCard>
          <GuideCard icon={HeartPulse} title={c.secComoFunciona}>
            <ComoFunciona c={c} />
          </GuideCard>
          <GuideCard icon={Droplets} title={c.secAguaJordao} accent>
            <AguaJordao c={c} />
          </GuideCard>
          <GuideCard icon={ShoppingBasket} title={c.secCompras}>
            <Compras c={c} />
          </GuideCard>
          <GuideCard icon={Leaf} title={c.secGuia}>
            <GuiaAlimentos c={c} />
          </GuideCard>
          <GuideCard icon={Bath} title={c.secRitual} accent>
            <Ritual c={c} />
          </GuideCard>
          <GuideCard icon={HeartPulse} title={c.secEsperar}>
            <Esperar c={c} />
          </GuideCard>
          <GuideCard icon={CircleAlert} title={c.secErros}>
            <Erros c={c} />
          </GuideCard>
          <GuideCard icon={HelpCircle} title={c.secFaq}>
            <Faq c={c} />
          </GuideCard>
          <GuideCard icon={BookHeart} title={c.secFinal} accent>
            <Final c={c} lang={lang} />
          </GuideCard>
        </div>
        <div className="h-6" />
      </div>
    </motion.div>
  );
}

/* ───────────────────────── DAY DETAIL ───────────────────────── */
function DayDetail({
  dia,
  c,
  onBack,
  onNav,
  total,
}: {
  dia: Dia;
  c: ProtocoloContent;
  onBack: () => void;
  onNav: (n: number) => void;
  total: number;
}) {
  const img = useStoredImageMap(bonusFallbacks);
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
      {/* Hero do dia */}
      <div className="relative h-[34vh] min-h-[220px] w-full overflow-hidden">
        <img src={img[`protocolo-dia-${dia.numero}`]} alt={dia.nome} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-background" />
        <button
          onClick={onBack}
          className="absolute left-4 top-10 flex items-center gap-1.5 rounded-full bg-cream/85 px-3 py-2 text-xs font-medium text-foreground shadow-card backdrop-blur"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {c.voltarDias}
        </button>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/90">
            {c.diaLabel} {dia.numero}
          </span>
          <h1 className="font-serif text-[28px] leading-tight text-cream drop-shadow">{dia.nome}</h1>
        </div>
      </div>

      <div className="px-5 pt-4">
        <blockquote className="rounded-2xl bg-gradient-devotional p-4">
          <p className="font-serif italic text-sm text-foreground">&quot;{dia.versiculo}&quot;</p>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {dia.versiculoRef}
          </p>
        </blockquote>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{dia.intro}</p>

        {/* Ao acordar */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-highlight/60 p-3.5">
          <Sunrise className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-earth">
              {c.lblAoAcordar}
            </p>
            <p className="mt-0.5 text-sm text-foreground">{dia.aoAcordar}</p>
          </div>
        </div>

        {/* Refeições — accordion (fechado por padrão = pouco texto) */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-card">
          <Accordion type="single" collapsible defaultValue="meal-0">
            {dia.refeicoes.map((r, i) => (
              <MealAccordion key={i} r={r} c={c} value={`meal-${i}`} last={i === dia.refeicoes.length - 1} />
            ))}
          </Accordion>
        </div>

        {/* Hidratação */}
        <div className="mt-3 flex items-start gap-3 rounded-2xl bg-secondary/50 p-3.5">
          <Droplets className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-foreground">
              {c.lblHidratacao}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{dia.hidratacao}</p>
          </div>
        </div>

        {/* Navegação entre dias */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            disabled={dia.numero === 1}
            onClick={() => onNav(dia.numero - 1)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-card px-4 py-3 text-sm text-foreground shadow-card transition-all active:scale-[0.97] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> {c.diaLabel} {dia.numero - 1 || 1}
          </button>
          <button
            disabled={dia.numero === total}
            onClick={() => onNav(dia.numero + 1)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-all active:scale-[0.97] disabled:opacity-40"
          >
            {c.diaLabel} {Math.min(dia.numero + 1, total)} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="h-6" />
      </div>
    </motion.div>
  );
}

function MealAccordion({
  r,
  c,
  value,
  last,
}: {
  r: Refeicao;
  c: ProtocoloContent;
  value: string;
  last: boolean;
}) {
  return (
    <AccordionItem value={value} className={last ? "border-0" : "border-border/50"}>
      <AccordionTrigger className="px-4 no-underline hover:no-underline">
        <span className="flex flex-col gap-0.5 text-left">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-earth">
            {r.rotulo}
          </span>
          <span className="font-serif text-base leading-tight text-foreground">{r.titulo}</span>
          {r.rendimento && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> {r.rendimento}
            </span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <h5 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground">
          <ChefHat className="h-3 w-3" /> {c.lblIngredientes}
        </h5>
        <ul className="space-y-1">
          {r.ingredientes.map((it) => (
            <li key={it} className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-olive" /> {it}
            </li>
          ))}
        </ul>
        <h5 className="mb-1.5 mt-3 text-[11px] font-medium uppercase tracking-wider text-foreground">
          {c.lblPreparo}
        </h5>
        <ol className="space-y-1.5">
          {r.preparo.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-[13px] text-muted-foreground">
              <span className="font-serif text-xs text-earth">{i + 1}.</span>
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ol>
        {r.substituicoes && (
          <p className="mt-3 rounded-xl bg-highlight/50 px-3 py-2 text-[12px] leading-relaxed text-earth">
            <span className="font-medium">{c.lblSubstituicoes}: </span>
            {r.substituicoes}
          </p>
        )}
        {r.nota && (
          <p className="mt-2 rounded-xl bg-gradient-devotional px-3 py-2 text-[12px] leading-relaxed text-foreground">
            {r.nota}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

/* ───────────────────────── GUIDE CARD (collapsible) ───────────────────────── */
function GuideCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: typeof Droplets;
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            accent ? "bg-gradient-primary text-primary-foreground" : "bg-highlight text-earth"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <span className="flex-1 font-serif text-base text-foreground">{title}</span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────── GUIDE SECTIONS ───────────────────────── */
function Abertura({ c }: { c: ProtocoloContent }) {
  return (
    <>
      <h3 className="font-serif text-lg text-foreground">{c.aberturaTitulo}</h3>
      {c.aberturaTexto.map((p, i) => (
        <p key={i} className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
      <div className="mt-4 grid gap-2.5">
        {c.compromissos.map((comp, i) => (
          <div key={i} className="flex gap-3 rounded-2xl bg-secondary/40 p-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-serif text-sm text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{comp.titulo}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{comp.texto}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl bg-highlight/60 p-3.5 text-xs leading-relaxed text-earth">
        {c.aberturaAviso}
      </p>
      <p className="mt-3 font-serif italic text-sm text-foreground">{c.aberturaAssinatura}</p>
    </>
  );
}

function ComoFunciona({ c }: { c: ProtocoloContent }) {
  return (
    <>
      {c.comoFuncionaTexto.map((p, i) => (
        <p key={i} className="mb-2 text-sm leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
      <div className="mt-3 grid gap-2.5">
        {c.fases.map((f, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-4">
            <p className="font-serif text-base text-foreground">{f.titulo}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.texto}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-highlight/40 p-4">
        {c.estrutura.map((e, i) => (
          <div key={i} className="flex gap-2 py-1 text-xs">
            <span className="font-medium text-earth">{e.rotulo}:</span>
            <span className="text-muted-foreground">{e.texto}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function AguaJordao({ c }: { c: ProtocoloContent }) {
  const img = useStoredImageMap(bonusFallbacks);
  return (
    <>
      <div className="overflow-hidden rounded-2xl">
        <img src={img["protocolo-agua"]} alt={c.secAguaJordao} className="h-36 w-full object-cover" />
      </div>
      <blockquote className="mt-3 rounded-2xl bg-gradient-devotional p-4">
        <p className="font-serif italic text-sm text-foreground">&quot;{c.aguaVersiculo}&quot;</p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {c.aguaVersiculoRef}
        </p>
      </blockquote>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.aguaTexto}</p>
      <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-foreground">
        {c.lblIngredientes}
      </h4>
      <ul className="space-y-1.5">
        {c.aguaIngredientes.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" /> {it}
          </li>
        ))}
      </ul>
      <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-foreground">
        {c.lblPreparo}
      </h4>
      <ol className="space-y-2.5">
        {c.aguaPreparo.map((p, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-highlight font-serif text-xs text-earth">
              {i + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{p}</span>
          </li>
        ))}
      </ol>
      <Tip label={c.lblPorque} text={c.aguaPorque} />
      <Tip label={c.lblDicaBeatriz} text={c.aguaDica} />
    </>
  );
}

function Compras({ c }: { c: ProtocoloContent }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-muted-foreground">{c.comprasIntro}</p>
      <Accordion type="single" collapsible className="mt-2">
        {c.comprasSecoes.map((s, i) => (
          <AccordionItem key={i} value={`compra-${i}`} className="border-border/60">
            <AccordionTrigger className="font-serif text-sm text-foreground no-underline hover:no-underline">
              {s.titulo}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1.5">
                {s.itens.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" /> {it}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Tip label={c.lblDicaBeatriz} text={c.comprasDica} />
    </>
  );
}

function GuiaAlimentos({ c }: { c: ProtocoloContent }) {
  return (
    <>
      <h3 className="font-serif text-base text-olive">{c.guiaSoltamTitulo}</h3>
      <div className="mt-2 space-y-2">
        {c.guiaSoltam.map((g, i) => (
          <FoodItem key={i} item={g} good />
        ))}
      </div>
      <h3 className="mt-5 font-serif text-base text-earth">{c.guiaTravamTitulo}</h3>
      <div className="mt-2 space-y-2">
        {c.guiaTravam.map((g, i) => (
          <FoodItem key={i} item={g} />
        ))}
      </div>
      <Tip label={c.lblDicaBeatriz} text={c.guiaDica} />
    </>
  );
}

function Ritual({ c }: { c: ProtocoloContent }) {
  return (
    <>
      <blockquote className="rounded-2xl bg-gradient-devotional p-4">
        <p className="font-serif italic text-sm text-foreground">&quot;{c.ritualVersiculo}&quot;</p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {c.ritualVersiculoRef}
        </p>
      </blockquote>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.ritualIntro}</p>
      <div className="mt-3 space-y-3">
        {c.ritualPartes.map((p, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-4">
            <p className="font-serif text-base text-foreground">{p.titulo}</p>
            {p.intro && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.intro}</p>
            )}
            {p.ingredientes && (
              <ul className="mt-2 space-y-1.5">
                {p.ingredientes.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" /> {it}
                  </li>
                ))}
              </ul>
            )}
            {p.passos && (
              <ol className="mt-2 space-y-2">
                {p.passos.map((s, j) => (
                  <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-highlight font-serif text-xs text-earth">
                      {j + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            )}
            {p.fecho && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.fecho}</p>
            )}
          </div>
        ))}
      </div>
      <Tip text={c.ritualImportante} />
    </>
  );
}

function Esperar({ c }: { c: ProtocoloContent }) {
  return (
    <div className="space-y-2.5">
      {c.esperarFases.map((f, i) => (
        <div key={i} className="rounded-2xl bg-secondary/40 p-4">
          <p className="font-serif text-base text-foreground">{f.titulo}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.texto}</p>
        </div>
      ))}
    </div>
  );
}

function Erros({ c }: { c: ProtocoloContent }) {
  return (
    <div className="space-y-2">
      {c.erros.map((e, i) => (
        <FoodItem key={i} item={e} />
      ))}
    </div>
  );
}

function Faq({ c }: { c: ProtocoloContent }) {
  return (
    <Accordion type="single" collapsible>
      {c.faq.map((f, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-border/60">
          <AccordionTrigger className="text-foreground no-underline hover:no-underline">
            {f.q}
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-relaxed text-muted-foreground">{f.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Final({ c, lang }: { c: ProtocoloContent; lang: "pt" | "es" }) {
  return (
    <>
      <div className="rounded-3xl bg-gradient-devotional p-5">
        {c.finalTexto.map((p, i) => (
          <p key={i} className="mb-2.5 text-sm leading-relaxed text-foreground last:mb-0">
            {p}
          </p>
        ))}
        <p className="mt-4 font-serif italic text-sm text-earth">{c.finalAssinatura}</p>
      </div>
      <Link
        to="/receitas"
        className="mt-4 block w-full rounded-2xl bg-gradient-primary px-5 py-4 text-center text-sm font-medium text-primary-foreground shadow-soft transition-all active:scale-[0.98]"
      >
        {lang === "es"
          ? "Continuar en el Método Alimentación Bíblica →"
          : "Continuar no Método Alimentação Bíblica →"}
      </Link>
    </>
  );
}

/* ───────────────────────── SMALL HELPERS ───────────────────────── */
function FoodItem({ item, good }: { item: { nome: string; texto: string }; good?: boolean }) {
  return (
    <div className="rounded-2xl bg-secondary/40 p-3.5">
      <p className={`text-sm font-medium ${good ? "text-olive" : "text-earth"}`}>{item.nome}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.texto}</p>
    </div>
  );
}

function Tip({ label, text }: { label?: string; text: string }) {
  return (
    <div className="mt-3 rounded-2xl bg-highlight/40 p-3.5">
      {label && (
        <p className="text-[11px] font-medium uppercase tracking-wider text-earth">{label}</p>
      )}
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
