import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Baby,
  Sun,
  Wand2,
  Lightbulb,
  TrendingUp,
  BookHeart,
  Check,
  User,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLang, useStoredImageMap } from "@/lib/store";
import { mesaContent, type Categoria, type MesaContent } from "@/lib/mesa-unica";
import { bonusFallbacks } from "@/lib/bonus-images";

export const Route = createFileRoute("/mesa-unica")({
  component: MesaUnica,
});

function MesaUnica() {
  const { lang } = useLang();
  const c = mesaContent[lang];
  const [cat, setCat] = useState<string | null>(null);
  const categoria = cat ? c.categorias.find((x) => x.id === cat) : null;

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {categoria ? (
          <CategoryDetail key={categoria.id} cat={categoria} c={c} onBack={() => setCat(null)} />
        ) : (
          <Landing key="landing" c={c} onPick={setCat} lang={lang} />
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
  c: MesaContent;
  onPick: (id: string) => void;
  lang: "pt" | "es";
}) {
  const img = useStoredImageMap(bonusFallbacks);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <div className="relative h-[44vh] min-h-[300px] w-full overflow-hidden">
        <img src={img["mesa-hero"]} alt={c.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background" />
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
          <h1 className="mt-2 font-serif text-[32px] leading-tight text-cream drop-shadow text-balance">
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

        {/* As 5 adaptações — grid de cards com foto */}
        <div className="mt-5 mb-2">
          <h2 className="font-serif text-xl text-foreground">{c.secCategorias}</h2>
          <p className="text-xs text-muted-foreground">{c.categoriasSub}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {c.categorias.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onPick(cat.id)}
              className="group relative overflow-hidden rounded-2xl bg-card text-left shadow-card transition-all active:scale-[0.97]"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={img[`mesa-cat-${cat.id}`]}
                  alt={cat.titulo}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-cream">
                  <p className="font-serif text-[15px] leading-tight">{cat.titulo}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mesa de Domingo — cards premium */}
        <div className="mt-7 mb-2">
          <h2 className="font-serif text-xl text-foreground">{c.secDomingo}</h2>
          <p className="text-xs text-muted-foreground">{c.domingoIntro}</p>
        </div>
        <div className="space-y-3">
          {c.pratos.map((p, i) => (
            <ExpandCard
              key={i}
              image={img[`mesa-domingo-${i + 1}`]}
              title={p.titulo}
              kicker={`${lang === "es" ? "Plato" : "Prato"} ${i + 1}`}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
            </ExpandCard>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-3 rounded-2xl bg-gradient-devotional p-4">
          <Sun className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
          <p className="text-xs leading-relaxed text-foreground">{c.domingoOrientacao}</p>
        </div>

        {/* Guia completo */}
        <div className="mt-7 mb-2">
          <h2 className="font-serif text-xl text-foreground">{c.guiaTitulo}</h2>
          <p className="text-xs text-muted-foreground">{c.guiaSub}</p>
        </div>
        <div className="space-y-2.5">
          <GuideCard icon={Sparkles} title={lang === "es" ? "Lee esto primero" : "Leia primeiro"}>
            <Abertura c={c} />
          </GuideCard>
          <GuideCard icon={Lightbulb} title={c.secLogica}>
            <Logica c={c} />
          </GuideCard>
          <GuideCard icon={Wand2} title={c.secPaladar} accent>
            <Paladar c={c} />
          </GuideCard>
          <GuideCard icon={Baby} title={c.secCriancas}>
            <Criancas c={c} />
          </GuideCard>
          <GuideCard icon={TrendingUp} title={c.secBonus} accent>
            <Bonus c={c} />
          </GuideCard>
          <GuideCard icon={BookHeart} title={c.secFinal}>
            <Final c={c} lang={lang} />
          </GuideCard>
        </div>
        <div className="h-6" />
      </div>
    </motion.div>
  );
}

/* ───────────────────────── CATEGORY DETAIL ───────────────────────── */
function CategoryDetail({
  cat,
  c,
  onBack,
}: {
  cat: Categoria;
  c: MesaContent;
  onBack: () => void;
}) {
  const img = useStoredImageMap(bonusFallbacks);
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
      <div className="relative h-[32vh] min-h-[200px] w-full overflow-hidden">
        <img src={img[`mesa-cat-${cat.id}`]} alt={cat.titulo} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-background" />
        <button
          onClick={onBack}
          className="absolute left-4 top-10 flex items-center gap-1.5 rounded-full bg-cream/85 px-3 py-2 text-xs font-medium text-foreground shadow-card backdrop-blur"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {c.voltar}
        </button>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h1 className="font-serif text-[28px] leading-tight text-cream drop-shadow">
            {cat.titulo}
          </h1>
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Desafio */}
        <div className="rounded-2xl border border-earth/20 bg-highlight/50 p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-earth">
            {c.lblDesafio}
          </p>
          <p className="text-sm leading-relaxed text-foreground">{cat.desafio}</p>
        </div>

        {/* Comparação sua versão x família */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="rounded-2xl bg-secondary/40 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {c.lblSuaVersao}
              </p>
            </div>
            <p className="text-sm text-foreground">{cat.suaVersao}</p>
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                <Users className="h-4 w-4" />
              </span>
              <p className="font-serif text-base text-foreground">{c.lblVersaoFamilia}</p>
            </div>
            <div className="space-y-2.5">
              {cat.versaoFamilia.map((v, i) => (
                <div key={i} className="rounded-xl bg-secondary/40 p-3">
                  <p className="text-sm font-medium text-earth">{v.nome}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                    {v.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Técnica-chave */}
        <div className="mt-4 rounded-2xl bg-gradient-devotional p-4">
          <div className="mb-1 flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-earth" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-earth">
              {c.lblTecnica}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{cat.tecnica}</p>
        </div>
        <div className="h-6" />
      </div>
    </motion.div>
  );
}

/* ───────────────────────── GUIDE SECTIONS ───────────────────────── */
function Abertura({ c }: { c: MesaContent }) {
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
              <p className="text-sm font-medium text-foreground">{comp.nome}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{comp.texto}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 font-serif italic text-sm text-foreground">{c.aberturaAssinatura}</p>
    </>
  );
}

function Logica({ c }: { c: MesaContent }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-muted-foreground">{c.logicaIntro}</p>
      <div className="mt-3 grid gap-2.5">
        {c.pilares.map((p, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-4">
            <p className="font-serif text-base text-foreground">{p.nome}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.texto}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Paladar({ c }: { c: MesaContent }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-muted-foreground">{c.paladarIntro}</p>
      <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-olive">
        {c.saborTitulo}
      </h4>
      <div className="space-y-2">
        {c.truquesSabor.map((t, i) => (
          <Trick key={i} n={i + 1} item={t} />
        ))}
      </div>
      <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-olive">
        {c.texturaTitulo}
      </h4>
      <div className="space-y-2">
        {c.truquesTextura.map((t, i) => (
          <Trick key={i} n={c.truquesSabor.length + i + 1} item={t} />
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-gradient-devotional p-4">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-earth">
          {c.regraOuroTitulo}
        </p>
        <p className="text-sm leading-relaxed text-foreground">{c.regraOuro}</p>
      </div>
    </>
  );
}

function Trick({ n, item }: { n: number; item: { nome: string; texto: string } }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-secondary/40 p-3.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-highlight font-serif text-xs text-earth">
        {n}
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{item.nome}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.texto}</p>
      </div>
    </div>
  );
}

function Criancas({ c }: { c: MesaContent }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-muted-foreground">{c.criancasIntro}</p>

      <h4 className="mt-4 mb-2 font-serif text-base text-foreground">{c.motivosTitulo}</h4>
      <div className="space-y-2">
        {c.motivos.map((m, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-3.5">
            <p className="text-sm font-medium text-earth">{m.titulo}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{m.solucao}</p>
          </div>
        ))}
      </div>

      <h4 className="mt-4 mb-2 font-serif text-base text-foreground">{c.estrategiasTitulo}</h4>
      <div className="space-y-2">
        {c.estrategias.map((e, i) => (
          <Trick key={i} n={i + 1} item={e} />
        ))}
      </div>

      <h4 className="mt-4 mb-1 font-serif text-base text-foreground">{c.lancheTitulo}</h4>
      <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{c.lancheIntro}</p>
      <div className="space-y-2">
        {c.swaps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-2xl bg-secondary/40 p-3">
            <span className="flex-1 text-[12px] text-muted-foreground line-through decoration-earth/40">
              {s.de}
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-olive" />
            <span className="flex-1 text-[12px] font-medium text-foreground">{s.para}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-2xl bg-highlight/50 p-3.5 text-xs leading-relaxed text-earth">
        {c.lancheRegra}
      </p>
    </>
  );
}

function Bonus({ c }: { c: MesaContent }) {
  return (
    <>
      <p className="font-serif italic text-sm text-earth">{c.bonusVersiculo}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.bonusIntro}</p>

      {/* Timeline das fases */}
      <div className="relative mt-4 pl-6">
        <span className="absolute left-[9px] top-1 bottom-1 w-px bg-border" />
        <div className="space-y-4">
          {c.fases.map((f, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[23px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-medium text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-[10px] font-medium uppercase tracking-wider text-earth">{f.fase}</p>
              <p className="font-serif text-base leading-tight text-foreground">{f.titulo}</p>
              {f.itens.length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {f.itens.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" /> {it}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <h4 className="mt-5 mb-2 font-serif text-base text-foreground">{c.regrasTitulo}</h4>
      <div className="space-y-2">
        {c.regras.map((r, i) => (
          <Trick key={i} n={i + 1} item={r} />
        ))}
      </div>
    </>
  );
}

function Final({ c, lang }: { c: MesaContent; lang: "pt" | "es" }) {
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
          ? "Ir a las recetas del Método →"
          : "Ir às receitas do Método →"}
      </Link>
    </>
  );
}

/* ───────────────────────── HELPERS ───────────────────────── */
function GuideCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: typeof Sparkles;
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

function ExpandCard({
  image,
  title,
  kicker,
  children,
}: {
  image: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-card">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 text-left">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 py-2 pr-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-earth">{kicker}</p>
          <p className="font-serif text-[15px] leading-tight text-foreground">{title}</p>
        </div>
        <ChevronRight
          className={`mr-3 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
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
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
