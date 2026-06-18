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
  HeartPulse,
  ChefHat,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLang, useStoredImageMap } from "@/lib/store";
import { mesaContent, type Categoria, type MesaContent } from "@/lib/mesa-unica";
import { bonusFallbacks } from "@/lib/bonus-images";
import { Ed, EditImage } from "@/components/Editable";
import { Locked } from "@/components/Locked";

const PT = mesaContent.pt;
const ES = mesaContent.es;

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
      <Locked product="mesa-unica">
        <AnimatePresence mode="wait">
          {categoria ? (
            <CategoryDetail key={categoria.id} cat={categoria} c={c} onBack={() => setCat(null)} />
          ) : (
            <Landing key="landing" c={c} onPick={setCat} lang={lang} />
          )}
        </AnimatePresence>
      </Locked>
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
        <EditImage
          id="mesa-hero"
          src={img["mesa-hero"]}
          alt={c.title}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background" />
        <Link
          to="/dashboard"
          className="absolute left-4 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream/85 text-foreground shadow-card backdrop-blur"
          aria-label={c.back}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-earth px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cream shadow-soft">
            <Sparkles className="h-3 w-3" /> <Ed k="mesa.badge" pt={PT.badge} es={ES.badge} />
          </span>
          <Ed
            as="h1"
            k="mesa.title"
            pt={PT.title}
            es={ES.title}
            className="mt-2 block font-serif text-[32px] leading-tight text-cream drop-shadow text-balance"
          />
          <Ed
            as="p"
            k="mesa.subtitle"
            pt={PT.subtitle}
            es={ES.subtitle}
            className="mt-1 block text-sm text-cream/90 drop-shadow text-balance"
          />
        </div>
      </div>

      <div className="px-5 pt-4">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-sage/30 px-3 py-1 text-[11px] font-medium text-earth">
          <Ed k="mesa.unlocked" pt={PT.unlocked} es={ES.unlocked} />
        </p>
        <Ed
          as="p"
          k="mesa.author"
          pt={PT.author}
          es={ES.author}
          className="mt-2 block text-[11px] uppercase tracking-wider text-muted-foreground"
        />

        {/* As 5 adaptações — grid de cards com foto */}
        <div className="mt-5 mb-2">
          <Ed
            as="h2"
            k="mesa.secCategorias"
            pt={PT.secCategorias}
            es={ES.secCategorias}
            className="block font-serif text-xl text-foreground"
          />
          <Ed
            as="p"
            k="mesa.categoriasSub"
            pt={PT.categoriasSub}
            es={ES.categoriasSub}
            className="block text-xs text-muted-foreground"
          />
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
                <EditImage
                  id={`mesa-cat-${cat.id}`}
                  src={img[`mesa-cat-${cat.id}`]}
                  alt={cat.titulo}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-cream">
                  <Ed
                    as="p"
                    k={`mesa.cat.${cat.id}.titulo`}
                    pt={PT.categorias[i].titulo}
                    es={ES.categorias[i].titulo}
                    className="block font-serif text-[15px] leading-tight"
                  />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mesa de Domingo — cards premium */}
        <div className="mt-7 mb-2">
          <Ed
            as="h2"
            k="mesa.secDomingo"
            pt={PT.secDomingo}
            es={ES.secDomingo}
            className="block font-serif text-xl text-foreground"
          />
          <Ed
            as="p"
            k="mesa.domingoIntro"
            pt={PT.domingoIntro}
            es={ES.domingoIntro}
            className="block text-xs text-muted-foreground"
          />
        </div>
        <div className="space-y-3">
          {c.pratos.map((p, i) => (
            <ExpandCard
              key={i}
              imageId={`mesa-domingo-${i + 1}`}
              image={img[`mesa-domingo-${i + 1}`]}
              title={p.titulo}
              kicker={`${lang === "es" ? "Plato" : "Prato"} ${i + 1}`}
            >
              <Ed
                as="p"
                k={`mesa.domingo.${i + 1}.texto`}
                pt={PT.pratos[i].texto}
                es={ES.pratos[i].texto}
                className="block text-sm leading-relaxed text-muted-foreground"
              />
              <h5 className="mb-1.5 mt-3 text-[11px] font-medium uppercase tracking-wider text-foreground">
                {c.lblIngredientes}
              </h5>
              <ul className="space-y-1">
                {p.ingredientes.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-olive" />
                    <Ed
                      k={`mesa.domingo.${i + 1}.ing.${j}`}
                      pt={PT.pratos[i].ingredientes[j]}
                      es={ES.pratos[i].ingredientes[j]}
                    />
                  </li>
                ))}
              </ul>
              <h5 className="mb-1.5 mt-3 text-[11px] font-medium uppercase tracking-wider text-foreground">
                {c.lblPreparo}
              </h5>
              <ol className="space-y-1.5">
                {p.preparo.map((s, j) => (
                  <li key={j} className="flex gap-2.5 text-[13px] text-muted-foreground">
                    <span className="font-serif text-xs text-earth">{j + 1}.</span>
                    <Ed
                      k={`mesa.domingo.${i + 1}.prep.${j}`}
                      pt={PT.pratos[i].preparo[j]}
                      es={ES.pratos[i].preparo[j]}
                      className="leading-relaxed"
                    />
                  </li>
                ))}
              </ol>
            </ExpandCard>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-3 rounded-2xl bg-gradient-devotional p-4">
          <Sun className="mt-0.5 h-4 w-4 shrink-0 text-earth" />
          <Ed
            as="p"
            k="mesa.domingoOrientacao"
            pt={PT.domingoOrientacao}
            es={ES.domingoOrientacao}
            className="block text-xs leading-relaxed text-foreground"
          />
        </div>

        {/* Guia completo */}
        <div className="mt-7 mb-2">
          <Ed
            as="h2"
            k="mesa.guiaTitulo"
            pt={PT.guiaTitulo}
            es={ES.guiaTitulo}
            className="block font-serif text-xl text-foreground"
          />
          <Ed
            as="p"
            k="mesa.guiaSub"
            pt={PT.guiaSub}
            es={ES.guiaSub}
            className="block text-xs text-muted-foreground"
          />
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
  const ci = PT.categorias.findIndex((x) => x.id === cat.id);
  const cp = PT.categorias[ci];
  const ce = ES.categorias[ci];
  const base = `mesa.cat.${cat.id}`;
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative h-[32vh] min-h-[200px] w-full overflow-hidden">
        <EditImage
          id={`mesa-cat-${cat.id}`}
          src={img[`mesa-cat-${cat.id}`]}
          alt={cat.titulo}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-background" />
        <button
          onClick={onBack}
          className="absolute left-4 top-10 flex items-center gap-1.5 rounded-full bg-cream/85 px-3 py-2 text-xs font-medium text-foreground shadow-card backdrop-blur"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {c.voltar}
        </button>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <Ed
            as="h1"
            k={`${base}.titulo`}
            pt={cp.titulo}
            es={ce.titulo}
            className="block font-serif text-[28px] leading-tight text-cream drop-shadow"
          />
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Desafio */}
        <div className="rounded-2xl border border-earth/20 bg-highlight/50 p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-earth">
            {c.lblDesafio}
          </p>
          <Ed
            as="p"
            k={`${base}.desafio`}
            pt={cp.desafio}
            es={ce.desafio}
            className="block text-sm leading-relaxed text-foreground"
          />
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
            <Ed
              as="p"
              k={`${base}.suaVersao`}
              pt={cp.suaVersao}
              es={ce.suaVersao}
              className="block text-sm text-foreground"
            />
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
                  <Ed
                    as="p"
                    k={`${base}.vf.${i}.nome`}
                    pt={cp.versaoFamilia[i].nome}
                    es={ce.versaoFamilia[i].nome}
                    className="block text-sm font-medium text-earth"
                  />
                  <Ed
                    as="p"
                    k={`${base}.vf.${i}.texto`}
                    pt={cp.versaoFamilia[i].texto}
                    es={ce.versaoFamilia[i].texto}
                    className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground"
                  />
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
          <Ed
            as="p"
            k={`${base}.tecnica`}
            pt={cp.tecnica}
            es={ce.tecnica}
            className="block text-sm leading-relaxed text-foreground"
          />
        </div>

        {/* Por que funciona — ciência */}
        <div className="mt-4 rounded-2xl bg-secondary/40 p-4">
          <div className="mb-1 flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-olive" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-olive">
              {c.lblPorque}
            </p>
          </div>
          <Ed
            as="p"
            k={`${base}.porque`}
            pt={cp.porque}
            es={ce.porque}
            className="block text-sm leading-relaxed text-muted-foreground"
          />
        </div>

        {/* Receitas completas */}
        <div className="mt-5 mb-2 flex items-center gap-2">
          <ChefHat className="h-4 w-4 text-earth" />
          <h2 className="font-serif text-lg text-foreground">{c.lblReceitas}</h2>
        </div>
        <div className="space-y-3">
          {cat.receitas.map((r, ri) => (
            <div key={ri} className="overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="border-b border-border/50 bg-secondary/40 px-4 py-2.5">
                <Ed
                  as="p"
                  k={`${base}.rec.${ri}.titulo`}
                  pt={cp.receitas[ri].titulo}
                  es={ce.receitas[ri].titulo}
                  className="block font-serif text-base text-foreground"
                />
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {r.tempo} · {r.rende}
                </p>
              </div>
              <div className="px-4 py-3">
                <h5 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground">
                  {c.lblIngredientes}
                </h5>
                <ul className="space-y-1">
                  {r.ingredientes.map((it, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[13px] text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-olive" />
                      <Ed
                        k={`${base}.rec.${ri}.ing.${j}`}
                        pt={cp.receitas[ri].ingredientes[j]}
                        es={ce.receitas[ri].ingredientes[j]}
                      />
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
                      <Ed
                        k={`${base}.rec.${ri}.prep.${j}`}
                        pt={cp.receitas[ri].preparo[j]}
                        es={ce.receitas[ri].preparo[j]}
                        className="leading-relaxed"
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
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
      <Ed
        as="h3"
        k="mesa.aberturaTitulo"
        pt={PT.aberturaTitulo}
        es={ES.aberturaTitulo}
        className="block font-serif text-lg text-foreground"
      />
      {c.aberturaTexto.map((p, i) => (
        <Ed
          key={i}
          as="p"
          k={`mesa.aberturaTexto.${i}`}
          pt={PT.aberturaTexto[i]}
          es={ES.aberturaTexto[i]}
          className="mt-2 block text-sm leading-relaxed text-muted-foreground"
        />
      ))}
      <div className="mt-4 grid gap-2.5">
        {c.compromissos.map((comp, i) => (
          <div key={i} className="flex gap-3 rounded-2xl bg-secondary/40 p-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-serif text-sm text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <Ed
                as="p"
                k={`mesa.compromisso.${i}.nome`}
                pt={PT.compromissos[i].nome}
                es={ES.compromissos[i].nome}
                className="block text-sm font-medium text-foreground"
              />
              <Ed
                as="p"
                k={`mesa.compromisso.${i}.texto`}
                pt={PT.compromissos[i].texto}
                es={ES.compromissos[i].texto}
                className="mt-0.5 block text-xs leading-relaxed text-muted-foreground"
              />
            </div>
          </div>
        ))}
      </div>
      <Ed
        as="p"
        k="mesa.aberturaAssinatura"
        pt={PT.aberturaAssinatura}
        es={ES.aberturaAssinatura}
        className="mt-3 block font-serif italic text-sm text-foreground"
      />
    </>
  );
}

function Logica({ c }: { c: MesaContent }) {
  return (
    <>
      <Ed
        as="p"
        k="mesa.logicaIntro"
        pt={PT.logicaIntro}
        es={ES.logicaIntro}
        className="block text-sm leading-relaxed text-muted-foreground"
      />
      <div className="mt-3 grid gap-2.5">
        {c.pilares.map((p, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-4">
            <Ed
              as="p"
              k={`mesa.pilar.${i}.nome`}
              pt={PT.pilares[i].nome}
              es={ES.pilares[i].nome}
              className="block font-serif text-base text-foreground"
            />
            <Ed
              as="p"
              k={`mesa.pilar.${i}.texto`}
              pt={PT.pilares[i].texto}
              es={ES.pilares[i].texto}
              className="mt-1 block text-xs leading-relaxed text-muted-foreground"
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Paladar({ c }: { c: MesaContent }) {
  return (
    <>
      <Ed
        as="p"
        k="mesa.paladarIntro"
        pt={PT.paladarIntro}
        es={ES.paladarIntro}
        className="block text-sm leading-relaxed text-muted-foreground"
      />
      <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-olive">
        {c.saborTitulo}
      </h4>
      <div className="space-y-2">
        {c.truquesSabor.map((t, i) => (
          <Trick
            key={i}
            n={i + 1}
            k={`mesa.sabor.${i}`}
            pt={PT.truquesSabor[i]}
            es={ES.truquesSabor[i]}
          />
        ))}
      </div>
      <h4 className="mt-4 mb-2 text-xs font-medium uppercase tracking-wider text-olive">
        {c.texturaTitulo}
      </h4>
      <div className="space-y-2">
        {c.truquesTextura.map((t, i) => (
          <Trick
            key={i}
            n={c.truquesSabor.length + i + 1}
            k={`mesa.textura.${i}`}
            pt={PT.truquesTextura[i]}
            es={ES.truquesTextura[i]}
          />
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-gradient-devotional p-4">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-earth">
          {c.regraOuroTitulo}
        </p>
        <Ed
          as="p"
          k="mesa.regraOuro"
          pt={PT.regraOuro}
          es={ES.regraOuro}
          className="block text-sm leading-relaxed text-foreground"
        />
      </div>
    </>
  );
}

function Trick({
  n,
  k,
  pt,
  es,
}: {
  n: number;
  k: string;
  pt: { nome: string; texto: string };
  es: { nome: string; texto: string };
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-secondary/40 p-3.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-highlight font-serif text-xs text-earth">
        {n}
      </span>
      <div>
        <Ed
          as="p"
          k={`${k}.nome`}
          pt={pt.nome}
          es={es.nome}
          className="block text-sm font-medium text-foreground"
        />
        <Ed
          as="p"
          k={`${k}.texto`}
          pt={pt.texto}
          es={es.texto}
          className="mt-0.5 block text-xs leading-relaxed text-muted-foreground"
        />
      </div>
    </div>
  );
}

function Criancas({ c }: { c: MesaContent }) {
  return (
    <>
      <Ed
        as="p"
        k="mesa.criancasIntro"
        pt={PT.criancasIntro}
        es={ES.criancasIntro}
        className="block text-sm leading-relaxed text-muted-foreground"
      />

      <h4 className="mt-4 mb-2 font-serif text-base text-foreground">{c.motivosTitulo}</h4>
      <div className="space-y-2">
        {c.motivos.map((m, i) => (
          <div key={i} className="rounded-2xl bg-secondary/40 p-3.5">
            <Ed
              as="p"
              k={`mesa.motivo.${i}.titulo`}
              pt={PT.motivos[i].titulo}
              es={ES.motivos[i].titulo}
              className="block text-sm font-medium text-earth"
            />
            <Ed
              as="p"
              k={`mesa.motivo.${i}.solucao`}
              pt={PT.motivos[i].solucao}
              es={ES.motivos[i].solucao}
              className="mt-0.5 block text-xs leading-relaxed text-muted-foreground"
            />
          </div>
        ))}
      </div>

      <h4 className="mt-4 mb-2 font-serif text-base text-foreground">{c.estrategiasTitulo}</h4>
      <div className="space-y-2">
        {c.estrategias.map((e, i) => (
          <Trick
            key={i}
            n={i + 1}
            k={`mesa.estrategia.${i}`}
            pt={PT.estrategias[i]}
            es={ES.estrategias[i]}
          />
        ))}
      </div>

      <h4 className="mt-4 mb-1 font-serif text-base text-foreground">{c.lancheTitulo}</h4>
      <Ed
        as="p"
        k="mesa.lancheIntro"
        pt={PT.lancheIntro}
        es={ES.lancheIntro}
        className="mb-2 block text-xs leading-relaxed text-muted-foreground"
      />
      <div className="space-y-2">
        {c.swaps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-2xl bg-secondary/40 p-3">
            <Ed
              k={`mesa.swap.${i}.de`}
              pt={PT.swaps[i].de}
              es={ES.swaps[i].de}
              className="flex-1 text-[12px] text-muted-foreground line-through decoration-earth/40"
            />
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-olive" />
            <Ed
              k={`mesa.swap.${i}.para`}
              pt={PT.swaps[i].para}
              es={ES.swaps[i].para}
              className="flex-1 text-[12px] font-medium text-foreground"
            />
          </div>
        ))}
      </div>
      <Ed
        as="p"
        k="mesa.lancheRegra"
        pt={PT.lancheRegra}
        es={ES.lancheRegra}
        className="mt-3 block rounded-2xl bg-highlight/50 p-3.5 text-xs leading-relaxed text-earth"
      />
    </>
  );
}

function Bonus({ c }: { c: MesaContent }) {
  return (
    <>
      <Ed
        as="p"
        k="mesa.bonusVersiculo"
        pt={PT.bonusVersiculo}
        es={ES.bonusVersiculo}
        className="block font-serif italic text-sm text-earth"
      />
      <Ed
        as="p"
        k="mesa.bonusIntro"
        pt={PT.bonusIntro}
        es={ES.bonusIntro}
        className="mt-2 block text-sm leading-relaxed text-muted-foreground"
      />

      {/* Timeline das fases */}
      <div className="relative mt-4 pl-6">
        <span className="absolute left-[9px] top-1 bottom-1 w-px bg-border" />
        <div className="space-y-4">
          {c.fases.map((f, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[23px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-medium text-primary-foreground">
                {i + 1}
              </span>
              <Ed
                as="p"
                k={`mesa.fase.${i}.fase`}
                pt={PT.fases[i].fase}
                es={ES.fases[i].fase}
                className="block text-[10px] font-medium uppercase tracking-wider text-earth"
              />
              <Ed
                as="p"
                k={`mesa.fase.${i}.titulo`}
                pt={PT.fases[i].titulo}
                es={ES.fases[i].titulo}
                className="block font-serif text-base leading-tight text-foreground"
              />
              {f.itens.length > 0 && (
                <ul className="mt-1.5 space-y-1">
                  {f.itens.map((it, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[13px] text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" />
                      <Ed
                        k={`mesa.fase.${i}.item.${j}`}
                        pt={PT.fases[i].itens[j]}
                        es={ES.fases[i].itens[j]}
                      />
                    </li>
                  ))}
                </ul>
              )}
              <Ed
                as="p"
                k={`mesa.fase.${i}.texto`}
                pt={PT.fases[i].texto}
                es={ES.fases[i].texto}
                className="mt-1.5 block text-xs leading-relaxed text-muted-foreground"
              />
            </div>
          ))}
        </div>
      </div>

      <h4 className="mt-5 mb-2 font-serif text-base text-foreground">{c.regrasTitulo}</h4>
      <div className="space-y-2">
        {c.regras.map((r, i) => (
          <Trick key={i} n={i + 1} k={`mesa.regra.${i}`} pt={PT.regras[i]} es={ES.regras[i]} />
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
          <Ed
            key={i}
            as="p"
            k={`mesa.final.${i}`}
            pt={PT.finalTexto[i]}
            es={ES.finalTexto[i]}
            className="mb-2.5 block text-sm leading-relaxed text-foreground last:mb-0"
          />
        ))}
        <Ed
          as="p"
          k="mesa.finalAssinatura"
          pt={PT.finalAssinatura}
          es={ES.finalAssinatura}
          className="mt-4 block font-serif italic text-sm text-earth"
        />
      </div>
      <Link
        to="/receitas"
        className="mt-4 block w-full rounded-2xl bg-gradient-primary px-5 py-4 text-center text-sm font-medium text-primary-foreground shadow-soft transition-all active:scale-[0.98]"
      >
        {lang === "es" ? "Ir a las recetas del Método →" : "Ir às receitas do Método →"}
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
  imageId,
  title,
  kicker,
  children,
}: {
  image: string;
  imageId?: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="relative h-20 w-24 shrink-0 overflow-hidden">
          {imageId ? (
            <EditImage
              id={imageId}
              src={image}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
          )}
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
