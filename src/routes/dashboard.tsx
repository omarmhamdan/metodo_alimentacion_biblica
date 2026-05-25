import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Droplets,
  BookOpen,
  Sparkles,
  ChefHat,
  HeartHandshake,
  TrendingUp,
  Plus,
  Minus,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecipePhoto } from "@/components/RecipePhoto";
import { useDaily, useUser, versiculoDoDia, useLang, useRecipes } from "@/lib/store";
import sucoImg from "@/assets/suco-sagrado.jpg";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  // title set by AppShell bootstrap (per-language)
});

function Dashboard() {
  const { user } = useUser();
  const { daily, update } = useDaily();
  const { t, lang } = useLang();
  const recipes = useRecipes();
  const verso = versiculoDoDia(lang);
  const nome = user?.nome ?? "Amada";
  const aguaMeta = user?.aguaMeta ?? 2000;
  const aguaPct = Math.min(100, (daily.aguaMl / aguaMeta) * 100);
  const ultima = daily.ultimaReceita
    ? recipes.find((r) => r.id === daily.ultimaReceita)
    : recipes[0];

  const weekday = new Date().toLocaleDateString(lang === "es" ? "es-CO" : "pt-BR", {
    weekday: "long",
  });

  return (
    <AppShell>
      <header className="px-6 pt-16 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {weekday}
            </p>
            <h1 className="mt-1 font-serif text-[26px] leading-tight text-foreground text-balance">
              {t("dash_greeting")} {nome} <span className="text-sage">🌿</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-balance">{t("dash_subtitle")}</p>
          </div>
          <Link
            to="/perfil"
            className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-serif text-lg text-primary-foreground shadow-soft"
          >
            {nome.charAt(0).toUpperCase()}
          </Link>
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-6 mb-5 rounded-3xl bg-gradient-devotional p-5 shadow-card"
      >
        <DevBadge label={t("dash_daily")} />
        <p className="font-serif italic text-[17px] leading-snug text-foreground text-balance mt-1">
          &quot;{verso.texto}&quot;
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {verso.ref}
        </p>
        <Link
          to="/devocional"
          className="mt-3 inline-block text-xs font-medium text-earth underline-offset-4 hover:underline"
        >
          {t("dash_read_more")}
        </Link>
      </motion.section>

      <section className="mx-6 mb-5 grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-3xl bg-card p-4 shadow-card"
        >
          <div className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> {t("dash_journey")}
          </div>
          <div className="font-serif text-3xl text-foreground">
            {t("dash_day")} {daily.jornadaDia}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-medium text-olive">{daily.sequencia}</span>{" "}
            {daily.sequencia === 1 ? t("dash_day_seq") : t("dash_days_seq")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl bg-card p-4 shadow-card"
        >
          <div className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Droplets className="h-3 w-3" /> {t("dash_hydration")}
          </div>
          <div className="font-serif text-3xl text-foreground">
            {(daily.aguaMl / 1000).toFixed(1)}
            <span className="text-base text-muted-foreground">
              /{(aguaMeta / 1000).toFixed(1)}L
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full bg-gradient-primary"
              initial={false}
              animate={{ width: `${aguaPct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="mt-3 flex gap-1.5">
            <button
              onClick={() => update({ aguaMl: Math.max(0, daily.aguaMl - 250) })}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
              aria-label="Remove 250ml"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              onClick={() => update({ aguaMl: daily.aguaMl + 250 })}
              className="flex h-7 flex-1 items-center justify-center gap-1 rounded-full bg-gradient-primary text-[11px] font-medium text-primary-foreground"
            >
              <Plus className="h-3 w-3" /> 250ml
            </button>
          </div>
        </motion.div>
      </section>

      <Link to="/suco-sagrado" className="mx-6 mb-6 block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl bg-card shadow-soft"
        >
          <div className="flex items-stretch">
            <div className="flex-1 p-5">
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-highlight px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-earth">
                {t("dash_morning_ritual")}
              </div>
              <h3 className="font-serif text-xl text-foreground">{t("dash_sacred_juice")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("dash_juice_sub")}</p>
              <div
                className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${daily.sucoTomado ? "bg-sage/30 text-foreground" : "bg-gradient-primary text-primary-foreground"}`}
              >
                {daily.sucoTomado ? t("dash_juice_done") : t("dash_juice_access")}
              </div>
            </div>
            <div className="relative w-28 shrink-0">
              <img
                src={sucoImg}
                alt="Jugo Sagrado"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </Link>

      <section className="mx-6 mb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <ShortcutCard
          to="/receitas"
          icon={ChefHat}
          title={t("dash_recipes")}
          subtitle={`${recipes.length} ${lang === "es" ? "recetas" : "receitas"}`}
        />
        <ShortcutCard
          to="/fundamentos"
          icon={BookOpen}
          title={t("dash_fundamentals")}
          subtitle={t("dash_eden_table")}
        />
        <ShortcutCard
          to="/devocional"
          icon={HeartHandshake}
          title={t("dash_devotional")}
          subtitle={t("dash_daily_reflection")}
        />
        <ShortcutCard
          to="/progresso"
          icon={TrendingUp}
          title={t("dash_progress")}
          subtitle={t("dash_my_evolution")}
        />
      </section>

      {ultima && (
        <section className="mx-6 mb-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-serif text-lg text-foreground">{t("dash_continue")}</h2>
            <Link to="/receitas" className="text-xs text-muted-foreground hover:text-foreground">
              {t("dash_see_all")}
            </Link>
          </div>
          <Link
            to="/receitas/$id"
            params={{ id: ultima.id }}
            className="block overflow-hidden rounded-3xl bg-card shadow-card"
          >
            <div className="relative aspect-[16/9]">
              <RecipePhoto
                src={ultima.imagem}
                alt={ultima.titulo}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                  {ultima.categoria}
                </p>
                <h3 className="font-serif text-xl">{ultima.titulo}</h3>
              </div>
            </div>
          </Link>
        </section>
      )}
    </AppShell>
  );
}

function DevBadge({ label }: { label: string }) {
  return (
    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cream/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-earth">
      <Sparkles className="h-3 w-3" /> {label}
    </div>
  );
}

function ShortcutCard({
  to,
  icon: Icon,
  title,
  subtitle,
}: {
  to: string;
  icon: typeof Droplets;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-3xl bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-highlight text-earth">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="font-serif text-base leading-tight text-foreground">{title}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</div>
    </Link>
  );
}
