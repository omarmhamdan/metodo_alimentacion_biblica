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
  Apple,
  FlaskConical,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLang, useStoredImageMap } from "@/lib/store";
import { protocoloContent, type Refeicao, type Dia, type ProtocoloContent } from "@/lib/protocolo";
import { bonusFallbacks } from "@/lib/bonus-images";
import { Ed, EditImage } from "@/components/Editable";

const PT = protocoloContent.pt;
const ES = protocoloContent.es;
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
        <EditImage id="protocolo-hero" src={img["protocolo-hero"]} alt={c.title} className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-background" />
        <Link
          to="/dashboard"
          className="absolute left-4 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream/85 text-foreground shadow-card backdrop-blur"
          aria-label={c.back}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-earth px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cream shadow-soft">
            <Sparkles className="h-3 w-3" /> <Ed k="protocolo.badge" pt={PT.badge} es={ES.badge} />
          </span>
          <Ed
            as="h1"
            k="protocolo.title"
            pt={PT.title}
            es={ES.title}
            className="mt-2 block font-serif text-[30px] leading-tight text-cream drop-shadow text-balance"
          />
          <Ed
            as="p"
            k="protocolo.subtitle"
            pt={PT.subtitle}
            es={ES.subtitle}
            className="mt-1 block text-sm text-cream/90 drop-shadow text-balance"
          />
        </div>
      </div>

      <div className="px-5 pt-4">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-sage/30 px-3 py-1 text-[11px] font-medium text-earth">
          <Ed k="protocolo.unlocked" pt={PT.unlocked} es={ES.unlocked} />
        </p>
        <Ed
          as="p"
          k="protocolo.author"
          pt={PT.author}
          es={ES.author}
          className="mt-2 block text-[11px] uppercase tracking-wider text-muted-foreground"
        />

        {/* Seus 7 dias — grade de cards com foto */}
        <div className="mt-5 mb-2 flex items-end justify-between">
          <div>
            <Ed as="h2" k="protocolo.diasTitulo" pt={PT.diasTitulo} es={ES.diasTitulo} className="block font-serif text-xl text-foreground" />
            <Ed as="p" k="protocolo.diasSub" pt={PT.diasSub} es={ES.diasSub} className="block text-xs text-muted-foreground" />
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
                <EditImage
                  id={`protocolo-dia-${d.numero}`}
                  src={img[`protocolo-dia-${d.numero}`]}
                  alt={d.nome}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {d.ritual && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-earth/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-cream">
                    <Sparkles className="h-2.5 w-2.5" /> {lang === "es" ? "Bono" : "Bônus"}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-cream">
                  <span className="text-[9px] font-medium uppercase tracking-[0.18em] opacity-90">
                    {c.diaLabel} {d.numero}
                  </span>
                  <Ed
                    as="p"
                    k={`protocolo.dia.${d.numero}.nome`}
                    pt={PT.dias[i].nome}
                    es={ES.dias[i].nome}
                    className="block font-serif text-[15px] leading-tight"
                  />
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
          <GuideCard icon={FlaskConical} title={c.secMitos}>
            <Mitos c={c} />
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
        <EditImage id={`protocolo-dia-${dia.numero}`} src={img[`protocolo-dia-${dia.numero}`]} alt={dia.nome} className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-background" />
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
          <Ed
            as="h1"
            k={`protocolo.dia.${dia.numero}.nome`}
            pt={PT.dias[dia.numero - 1].nome}
            es={ES.dias[dia.numero - 1].nome}
            className="block font-serif text-[28px] leading-tight text-cream drop-shadow"
          />
        </div>
      </div>

      <div className="px-5 pt-4">
        <blockquote className="rounded-2xl bg-gradient-devotional p-4">
          <Ed
            as="p"
            k={`protocolo.dia.${dia.numero}.versiculo`}
            pt={`"${PT.dias[dia.numero - 1].versiculo}"`}
            es={`"${ES.dias[dia.numero - 1].versiculo}"`}
            className="block font-serif italic text-sm text-foreground"
          />
          <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {dia.versiculoRef}
          </p>
        </blockquote>

        <Ed
          as="p"
          k={`protocolo.dia.${dia.numero}.intro`}
          pt={PT.dias[dia.numero - 1].intro}
          es={ES.dias[dia.numero - 1].intro}
          className="mt-3 block text-sm leading-relaxed text-muted-foreground"
        />

        {/* Ao acordar */}
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-highlight/60 p-3.5">
          <Sunrise className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-earth">
              {c.lblAoAcordar}
            </p>
            <Ed
              as="p"
              k={`protocolo.dia.${dia.numero}.aoAcordar`}
              pt={PT.dias[dia.numero - 1].aoAcordar}
              es={ES.dias[dia.numero - 1].aoAcordar}
              className="mt-0.5 block text-sm text-foreground"
            />
          </div>
        </div>

        {/* Refeições — accordion (fechado por padrão = pouco texto) */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-card">
          <Accordion type="single" collapsible defaultValue="meal-0">
            {dia.refeicoes.map((r, i) => (
              <MealAccordion key={i} r={r} c={c} diaNum={dia.numero} idx={i} value={`meal-${i}`} last={i === dia.refeicoes.length - 1} />
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
            <Ed
              as="p"
              k={`protocolo.dia.${dia.numero}.hidratacao`}
              pt={PT.dias[dia.numero - 1].hidratacao}
              es={ES.dias[dia.numero - 1].hidratacao}
              className="mt-0.5 block text-xs leading-relaxed text-muted-foreground"
            />
          </div>
        </div>

        {/* Ciência do dia */}
        {dia.ciencia && (
          <div className="mt-3 rounded-2xl bg-gradient-devotional p-4">
            <div className="mb-1 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-earth" />
              <p className="text-[11px] font-medium uppercase tracking-wider text-earth">
                {c.lblCiencia}
              </p>
            </div>
            <Ed
              as="p"
              k={`protocolo.dia.${dia.numero}.ciencia`}
              pt={PT.dias[dia.numero - 1].ciencia ?? ""}
              es={ES.dias[dia.numero - 1].ciencia ?? ""}
              className="block text-sm leading-relaxed text-foreground"
            />
          </div>
        )}

        {/* Lanches liberados */}
        {dia.snacks && dia.snacks.length > 0 && (
          <div className="mt-3 rounded-2xl bg-card p-4 shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <Apple className="h-4 w-4 text-olive" />
              <p className="text-[11px] font-medium uppercase tracking-wider text-foreground">
                {c.lblSnacks}
              </p>
            </div>
            <ul className="space-y-1.5">
              {dia.snacks.map((s, j) => (
                <li key={j} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-olive" />
                  <Ed
                    k={`protocolo.dia.${dia.numero}.snack.${j}`}
                    pt={PT.dias[dia.numero - 1].snacks?.[j] ?? s}
                    es={ES.dias[dia.numero - 1].snacks?.[j] ?? s}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

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
  diaNum,
  idx,
  value,
  last,
}: {
  r: Refeicao;
  c: ProtocoloContent;
  diaNum: number;
  idx: number;
  value: string;
  last: boolean;
}) {
  const mp = PT.dias[diaNum - 1].refeicoes[idx];
  const me = ES.dias[diaNum - 1].refeicoes[idx];
  const base = `protocolo.dia.${diaNum}.meal.${idx}`;
  return (
    <AccordionItem value={value} className={last ? "border-0" : "border-border/50"}>
      <AccordionTrigger className="px-4 no-underline hover:no-underline">
        <span className="flex flex-col gap-0.5 text-left">
          <Ed as="span" k={`${base}.rotulo`} pt={mp.rotulo} es={me.rotulo} className="block text-[10px] font-medium uppercase tracking-[0.18em] text-earth" />
          <Ed as="span" k={`${base}.titulo`} pt={mp.titulo} es={me.titulo} className="block font-serif text-base leading-tight text-foreground" />
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
          {r.ingredientes.map((it, j) => (
            <li key={j} className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-olive" />
              <Ed k={`${base}.ing.${j}`} pt={mp.ingredientes[j] ?? it} es={me.ingredientes[j] ?? it} />
            </li>
          ))}
        </ul>
        <h5 className="mb-1.5 mt-3 text-[11px] font-medium uppercase tracking-wider text-foreground">
          {c.lblPreparo}
        </h5>
        <ol className="space-y-1.5">
          {r.preparo.map((p, j) => (
            <li key={j} className="flex gap-2.5 text-[13px] text-muted-foreground">
              <span className="font-serif text-xs text-earth">{j + 1}.</span>
              <Ed k={`${base}.prep.${j}`} pt={mp.preparo[j] ?? p} es={me.preparo[j] ?? p} className="leading-relaxed" />
            </li>
          ))}
        </ol>
        {r.substituicoes && (
          <p className="mt-3 rounded-xl bg-highlight/50 px-3 py-2 text-[12px] leading-relaxed text-earth">
            <span className="font-medium">{c.lblSubstituicoes}: </span>
            <Ed k={`${base}.subst`} pt={mp.substituicoes ?? ""} es={me.substituicoes ?? ""} />
          </p>
        )}
        {r.nota && (
          <p className="mt-2 rounded-xl bg-gradient-devotional px-3 py-2 text-[12px] leading-relaxed text-foreground">
            <Ed k={`${base}.nota`} pt={mp.nota ?? ""} es={me.nota ?? ""} />
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
      <Ed as="h3" k="protocolo.aberturaTitulo" pt={PT.aberturaTitulo} es={ES.aberturaTitulo} className="block font-serif text-lg text-foreground" />
      {c.aberturaTexto.map((p, i) => (
        <Ed key={i} as="p" k={`protocolo.aberturaTexto.${i}`} pt={PT.aberturaTexto[i]} es={ES.aberturaTexto[i]} className="mt-2 block text-sm leading-relaxed text-muted-foreground" />
      ))}
      <div className="mt-4 grid gap-2.5">
        {c.compromissos.map((comp, i) => (
          <div key={i} className="flex gap-3 rounded-2xl bg-secondary/40 p-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-serif text-sm text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <Ed as="p" k={`protocolo.compromisso.${i}.titulo`} pt={PT.compromissos[i].titulo} es={ES.compromissos[i].titulo} className="block text-sm font-medium text-foreground" />
              <Ed as="p" k={`protocolo.compromisso.${i}.texto`} pt={PT.compromissos[i].texto} es={ES.compromissos[i].texto} className="mt-0.5 block text-xs leading-relaxed text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      <Ed as="p" k="protocolo.aberturaAviso" pt={PT.aberturaAviso} es={ES.aberturaAviso} className="mt-4 block rounded-2xl bg-highlight/60 p-3.5 text-xs leading-relaxed text-earth" />
      <Ed as="p" k="protocolo.aberturaAssinatura" pt={PT.aberturaAssinatura} es={ES.aberturaAssinatura} className="mt-3 block font-serif italic text-sm text-foreground" />
    </>
  );
}

function ComoFunciona({ c }: { c: ProtocoloContent }) {
  return (
    <>
      {c.comoFuncionaTexto.map((p, i) => (
        <Ed key={i} as="p" k={`protocolo.comoFunciona.${i}`} pt={PT.comoFuncionaTexto[i]} es={ES.comoFuncionaTexto[i]} className="mb-2 block text-sm leading-relaxed text-muted-foreground" />
      ))}
      <div className="mt-3 grid gap-2.5">
        {c.fases.map((f, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-4">
            <Ed as="p" k={`protocolo.fase.${i}.titulo`} pt={PT.fases[i].titulo} es={ES.fases[i].titulo} className="block font-serif text-base text-foreground" />
            <Ed as="p" k={`protocolo.fase.${i}.texto`} pt={PT.fases[i].texto} es={ES.fases[i].texto} className="mt-1 block text-xs leading-relaxed text-muted-foreground" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-highlight/40 p-4">
        {c.estrutura.map((e, i) => (
          <div key={i} className="flex gap-2 py-1 text-xs">
            <span className="font-medium text-earth">{e.rotulo}:</span>
            <Ed k={`protocolo.estrutura.${i}.texto`} pt={PT.estrutura[i].texto} es={ES.estrutura[i].texto} className="text-muted-foreground" />
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
        <EditImage id="protocolo-agua" src={img["protocolo-agua"]} alt={c.secAguaJordao} className="h-36 w-full object-cover" />
      </div>
      <blockquote className="mt-3 rounded-2xl bg-gradient-devotional p-4">
        <Ed as="p" k="protocolo.aguaVersiculo" pt={`"${PT.aguaVersiculo}"`} es={`"${ES.aguaVersiculo}"`} className="block font-serif italic text-sm text-foreground" />
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {c.aguaVersiculoRef}
        </p>
      </blockquote>
      <Ed as="p" k="protocolo.aguaTexto" pt={PT.aguaTexto} es={ES.aguaTexto} className="mt-3 block text-sm leading-relaxed text-muted-foreground" />
      <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-foreground">
        {c.lblIngredientes}
      </h4>
      <ul className="space-y-1.5">
        {c.aguaIngredientes.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />
            <Ed k={`protocolo.agua.ing.${i}`} pt={PT.aguaIngredientes[i]} es={ES.aguaIngredientes[i]} />
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
            <Ed k={`protocolo.agua.prep.${i}`} pt={PT.aguaPreparo[i]} es={ES.aguaPreparo[i]} className="pt-0.5 leading-relaxed" />
          </li>
        ))}
      </ol>
      <div className="mt-3 rounded-2xl bg-highlight/40 p-3.5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-earth">{c.lblPorque}</p>
        <Ed as="p" k="protocolo.aguaPorque" pt={PT.aguaPorque} es={ES.aguaPorque} className="mt-1 block text-xs leading-relaxed text-muted-foreground" />
      </div>
      <div className="mt-3 rounded-2xl bg-highlight/40 p-3.5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-earth">{c.lblDicaBeatriz}</p>
        <Ed as="p" k="protocolo.aguaDica" pt={PT.aguaDica} es={ES.aguaDica} className="mt-1 block text-xs leading-relaxed text-muted-foreground" />
      </div>
    </>
  );
}

function Compras({ c }: { c: ProtocoloContent }) {
  return (
    <>
      <Ed as="p" k="protocolo.comprasIntro" pt={PT.comprasIntro} es={ES.comprasIntro} className="block text-sm leading-relaxed text-muted-foreground" />
      <Accordion type="single" collapsible className="mt-2">
        {c.comprasSecoes.map((s, i) => (
          <AccordionItem key={i} value={`compra-${i}`} className="border-border/60">
            <AccordionTrigger className="font-serif text-sm text-foreground no-underline hover:no-underline">
              {s.titulo}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1.5">
                {s.itens.map((it, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />
                    <Ed k={`protocolo.compras.${i}.${j}`} pt={PT.comprasSecoes[i].itens[j]} es={ES.comprasSecoes[i].itens[j]} />
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
          <FoodItem key={i} item={g} good k={`protocolo.soltam.${i}`} pt={PT.guiaSoltam[i]} es={ES.guiaSoltam[i]} />
        ))}
      </div>
      <h3 className="mt-5 font-serif text-base text-earth">{c.guiaTravamTitulo}</h3>
      <div className="mt-2 space-y-2">
        {c.guiaTravam.map((g, i) => (
          <FoodItem key={i} item={g} k={`protocolo.travam.${i}`} pt={PT.guiaTravam[i]} es={ES.guiaTravam[i]} />
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
        <Ed as="p" k="protocolo.ritualVersiculo" pt={`"${PT.ritualVersiculo}"`} es={`"${ES.ritualVersiculo}"`} className="block font-serif italic text-sm text-foreground" />
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {c.ritualVersiculoRef}
        </p>
      </blockquote>
      <Ed as="p" k="protocolo.ritualIntro" pt={PT.ritualIntro} es={ES.ritualIntro} className="mt-3 block text-sm leading-relaxed text-muted-foreground" />
      <div className="mt-3 space-y-3">
        {c.ritualPartes.map((p, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-4">
            <Ed as="p" k={`protocolo.ritual.${i}.titulo`} pt={PT.ritualPartes[i].titulo} es={ES.ritualPartes[i].titulo} className="block font-serif text-base text-foreground" />
            {p.intro && (
              <Ed as="p" k={`protocolo.ritual.${i}.intro`} pt={PT.ritualPartes[i].intro ?? ""} es={ES.ritualPartes[i].intro ?? ""} className="mt-1 block text-xs leading-relaxed text-muted-foreground" />
            )}
            {p.ingredientes && (
              <ul className="mt-2 space-y-1.5">
                {p.ingredientes.map((it, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />
                    <Ed k={`protocolo.ritual.${i}.ing.${j}`} pt={PT.ritualPartes[i].ingredientes![j]} es={ES.ritualPartes[i].ingredientes![j]} />
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
                    <Ed k={`protocolo.ritual.${i}.passo.${j}`} pt={PT.ritualPartes[i].passos![j]} es={ES.ritualPartes[i].passos![j]} className="pt-0.5 leading-relaxed" />
                  </li>
                ))}
              </ol>
            )}
            {p.fecho && (
              <Ed as="p" k={`protocolo.ritual.${i}.fecho`} pt={PT.ritualPartes[i].fecho ?? ""} es={ES.ritualPartes[i].fecho ?? ""} className="mt-2 block text-xs leading-relaxed text-muted-foreground" />
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
          <Ed as="p" k={`protocolo.esperar.${i}.titulo`} pt={PT.esperarFases[i].titulo} es={ES.esperarFases[i].titulo} className="block font-serif text-base text-foreground" />
          <Ed as="p" k={`protocolo.esperar.${i}.texto`} pt={PT.esperarFases[i].texto} es={ES.esperarFases[i].texto} className="mt-1 block text-xs leading-relaxed text-muted-foreground" />
        </div>
      ))}
    </div>
  );
}

function Erros({ c }: { c: ProtocoloContent }) {
  return (
    <div className="space-y-2">
      {c.erros.map((e, i) => (
        <FoodItem key={i} item={e} k={`protocolo.erro.${i}`} pt={PT.erros[i]} es={ES.erros[i]} />
      ))}
    </div>
  );
}

function Mitos({ c }: { c: ProtocoloContent }) {
  return (
    <div className="space-y-2">
      {c.mitos.map((m, i) => (
        <FoodItem key={i} item={m} k={`protocolo.mito.${i}`} pt={PT.mitos[i]} es={ES.mitos[i]} />
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
            <Ed as="p" k={`protocolo.faq.${i}.a`} pt={PT.faq[i].a} es={ES.faq[i].a} className="block leading-relaxed text-muted-foreground" />
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
          <Ed key={i} as="p" k={`protocolo.final.${i}`} pt={PT.finalTexto[i]} es={ES.finalTexto[i]} className="mb-2.5 block text-sm leading-relaxed text-foreground last:mb-0" />
        ))}
        <Ed as="p" k="protocolo.finalAssinatura" pt={PT.finalAssinatura} es={ES.finalAssinatura} className="mt-4 block font-serif italic text-sm text-earth" />
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
function FoodItem({
  good,
  k,
  pt,
  es,
}: {
  item?: { nome: string; texto: string };
  good?: boolean;
  k: string;
  pt: { nome: string; texto: string };
  es: { nome: string; texto: string };
}) {
  return (
    <div className="rounded-2xl bg-secondary/40 p-3.5">
      <Ed as="p" k={`${k}.nome`} pt={pt.nome} es={es.nome} className={`block text-sm font-medium ${good ? "text-olive" : "text-earth"}`} />
      <Ed as="p" k={`${k}.texto`} pt={pt.texto} es={es.texto} className="mt-0.5 block text-xs leading-relaxed text-muted-foreground" />
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
