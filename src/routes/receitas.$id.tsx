import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Clock, ChefHat, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecipePhoto } from "@/components/RecipePhoto";
import { getRecipeLang, categoriaES, dificuldadeES } from "@/lib/recipes";
import { useDaily, useLang } from "@/lib/store";

import { getRecipe as _getRecipe } from "@/lib/recipes";

export const Route = createFileRoute("/receitas/$id")({
  component: ReceitaDetalhe,
  loader: ({ params }) => {
    const r = _getRecipe(params.id);
    if (!r) throw notFound();
    return { recipe: r };
  },
  // title set by AppShell bootstrap (per-language)
  notFoundComponent: NotFoundRecipe,
});

function NotFoundRecipe() {
  const { lang } = useLang();
  return (
    <AppShell>
      <div className="p-10 text-center">
        <h1 className="font-serif text-2xl">
          {lang === "es" ? "Receta no encontrada" : "Receita não encontrada"}
        </h1>
        <Link to="/receitas" className="mt-4 inline-block text-sm text-earth underline">
          {lang === "es" ? "Volver" : "Voltar"}
        </Link>
      </div>
    </AppShell>
  );
}

function ReceitaDetalhe() {
  const { recipe: base } = Route.useLoaderData() as { recipe: import("@/lib/recipes").Receita };
  const navigate = useNavigate();
  const { daily, toggleFavorito, update } = useDaily();
  const { t, lang } = useLang();
  // Apply language translation at render time
  const r = getRecipeLang(base.id, lang) ?? base;
  const catLabel = lang === "es" ? categoriaES[base.categoria] : base.categoria;
  const difLabel = lang === "es" ? dificuldadeES[base.dificuldade] : base.dificuldade;
  const isFav = daily.favoritos.includes(r.id);

  useEffect(() => {
    update({ ultimaReceita: r.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r.id]);

  return (
    <AppShell>
      <div className="relative">
        <div className="relative h-[44vh] min-h-[280px] w-full overflow-hidden">
          <RecipePhoto src={r.imagem} alt={r.titulo} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-cream" />
          <button
            onClick={() => navigate({ to: "/receitas" })}
            className="absolute left-4 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-cream/85 text-foreground backdrop-blur shadow-card"
            aria-label={t("rd_back")}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleFavorito(r.id)}
            className={`absolute right-4 top-20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur shadow-card ${isFav ? "bg-terracotta text-cream" : "bg-cream/85 text-earth"}`}
            aria-label="Favoritar"
          >
            <Heart className="h-4 w-4" fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="-mt-6 rounded-t-3xl bg-background px-6 pt-6"
        >
          <p className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            {catLabel}
          </p>
          <h1 className="mt-1 font-serif text-3xl leading-tight text-foreground text-balance">
            {r.titulo}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {r.tempo} {t("rec_min")}
            </span>
            <span className="inline-flex items-center gap-1">
              <ChefHat className="h-3.5 w-3.5" /> {difLabel}
            </span>
            {r.rendimento && (
              <span className="inline-flex items-center gap-1">🍽 {r.rendimento}</span>
            )}
          </div>

          <blockquote className="mt-5 rounded-2xl bg-gradient-devotional p-4">
            <p className="font-serif italic text-sm text-foreground text-balance">
              “{r.descricao}”
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              {r.versiculo}
            </p>
          </blockquote>

          <Section title={t("rd_ingredients")}>
            <ul className="space-y-2">
              {r.ingredientes.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />
                  {i}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t("rd_steps")}>
            <ol className="space-y-3">
              {r.preparo.map((p, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-highlight font-serif text-xs text-earth">
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-relaxed">{p}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title={t("rd_tip")} icon={<Sparkles className="h-3.5 w-3.5" />}>
            <p className="rounded-2xl bg-devotional p-4 text-sm italic leading-relaxed text-foreground">
              {r.dicaBeatriz}
            </p>
          </Section>

          <Section title={t("rd_benefits")}>
            <div className="flex flex-wrap gap-2">
              {r.beneficios.map((b) => (
                <span key={b} className="rounded-full bg-highlight px-3 py-1.5 text-xs text-earth">
                  {b}
                </span>
              ))}
            </div>
          </Section>
        </motion.div>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 inline-flex items-center gap-1.5 font-serif text-lg text-foreground">
        {icon && <span className="text-earth">{icon}</span>} {title}
      </h2>
      {children}
    </section>
  );
}
