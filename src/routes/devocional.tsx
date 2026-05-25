import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { versiculoDoDia, useLang } from "@/lib/store";

export const Route = createFileRoute("/devocional")({
  component: DevocionalPage,
  // title set by AppShell bootstrap (per-language)
});

function DevocionalPage() {
  const { t, lang } = useLang();
  const v = versiculoDoDia(lang);

  return (
    <AppShell>
      <header className="px-6 pt-10 pb-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {t("dev_subtitle")}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-foreground">{t("dev_title")}</h1>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-6 mt-3 rounded-3xl bg-gradient-devotional p-7 text-center shadow-soft"
      >
        <Sparkles className="mx-auto h-5 w-5 text-gold" />
        <p className="mt-4 font-serif italic text-xl leading-snug text-foreground text-balance">
          "{v.texto}"
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {v.ref}
        </p>
      </motion.section>

      <section className="mx-6 mt-6 rounded-3xl bg-card p-6 shadow-card">
        <h2 className="font-serif text-xl text-foreground">{t("dev_reflection")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {v.reflexao}
        </p>
      </section>

      <section className="mx-6 mt-4 mb-6 rounded-3xl bg-highlight p-6 shadow-card">
        <p className="text-[11px] uppercase tracking-[0.22em] text-earth">
          {t("dev_prayer_title")}
        </p>
        <p className="mt-3 font-serif italic text-base leading-relaxed text-foreground text-balance">
          {v.oracao}
        </p>
      </section>
    </AppShell>
  );
}
