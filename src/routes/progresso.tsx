import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useDaily, useUser, useLang } from "@/lib/store";

export const Route = createFileRoute("/progresso")({
  component: ProgressoPage,
  // title set by AppShell bootstrap (per-language)
});

const content = {
  es: {
    badge: "Tu jornada",
    title: "Progreso",
    subtitle: "Cuidarte con gentileza es la forma más bíblica de florecer.",
    statDay: "Día",
    statSeq: "Racha",
    statFav: "Favoritas",
    weightTitle: "Peso",
    registro: "registro",
    registros: "registros",
    weightPlaceholder: "Peso de hoy (kg)",
    btnRegister: "Registrar",
    energyTitle: "¿Cómo te sientes hoy?",
    energySubtitle: "Energía · 1 = baja, 10 = vibrante",
    btnEnergy: "Registrar cómo me siento",
    verse: "El que comenzó en vosotros la buena obra, la perfeccionará.",
    verseRef: "Filipenses 1:6",
  },
  pt: {
    badge: "Sua jornada",
    title: "Progresso",
    subtitle: "Cuidar com gentileza é a forma mais bíblica de florescer.",
    statDay: "Dia",
    statSeq: "Sequência",
    statFav: "Favoritos",
    weightTitle: "Peso",
    registro: "registro",
    registros: "registros",
    weightPlaceholder: "Peso de hoje (kg)",
    btnRegister: "Registrar",
    energyTitle: "Como você se sente hoje?",
    energySubtitle: "Energia · 1 = baixa, 10 = vibrante",
    btnEnergy: "Registrar como me sinto",
    verse: "Aquele que começou a boa obra em vós há de completá-la.",
    verseRef: "Filipenses 1:6",
  },
};

function ProgressoPage() {
  const { user } = useUser();
  const { daily, update } = useDaily();
  const { lang } = useLang();
  const c = content[lang];
  const [peso, setPeso] = useState<string>("");
  const [energia, setEnergia] = useState<number>(user?.energia ?? 5);

  const registrarPeso = () => {
    const v = Number(peso);
    if (!v) return;
    const hist = [...daily.pesoHistorico, { date: new Date().toISOString().slice(0, 10), peso: v }];
    update({ pesoHistorico: hist });
    setPeso("");
  };

  const registrarEnergia = () => {
    const hist = [
      ...daily.energiaHistorico,
      { date: new Date().toISOString().slice(0, 10), valor: energia },
    ];
    update({ energiaHistorico: hist });
  };

  const pesoData =
    daily.pesoHistorico.length > 0
      ? daily.pesoHistorico
      : [{ date: lang === "es" ? "inicio" : "início", peso: user?.pesoAtual ?? 70 }];

  return (
    <AppShell>
      <header className="px-6 pt-10 pb-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{c.badge}</p>
        <h1 className="mt-1 font-serif text-3xl text-foreground">{c.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground text-balance">{c.subtitle}</p>
      </header>

      <section className="mx-6 mb-4 grid grid-cols-3 gap-3">
        <Stat label={c.statDay} value={String(daily.jornadaDia)} />
        <Stat label={c.statSeq} value={`${daily.sequencia}d`} />
        <Stat label={c.statFav} value={String(daily.favoritos.length)} />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 mb-4 rounded-3xl bg-card p-5 shadow-card"
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-serif text-lg text-foreground">{c.weightTitle}</h2>
          <span className="text-xs text-muted-foreground">
            {pesoData.length} {pesoData.length === 1 ? c.registro : c.registros}
          </span>
        </div>
        <div className="h-36 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pesoData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={28}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="var(--olive)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--gold)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder={c.weightPlaceholder}
            className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-olive/50"
          />
          <button
            onClick={registrarPeso}
            className="rounded-2xl bg-gradient-primary px-5 text-sm font-medium text-primary-foreground shadow-soft"
          >
            {c.btnRegister}
          </button>
        </div>
      </motion.section>

      <section className="mx-6 mb-4 rounded-3xl bg-card p-5 shadow-card">
        <h2 className="mb-3 font-serif text-lg text-foreground">{c.energyTitle}</h2>
        <p className="mb-3 text-xs text-muted-foreground">{c.energySubtitle}</p>
        <div className="flex items-center justify-between gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setEnergia(i + 1)}
              className={`h-9 flex-1 rounded-lg text-xs font-medium transition-all ${
                i < energia
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={registrarEnergia}
          className="mt-4 w-full rounded-2xl border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-secondary"
        >
          {c.btnEnergy}
        </button>
      </section>

      <section className="mx-6 mb-6 rounded-3xl bg-gradient-devotional p-6 text-center shadow-card">
        <p className="font-serif italic text-sm text-foreground text-balance">
          &quot;{c.verse}&quot;
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {c.verseRef}
        </p>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 text-center shadow-card">
      <div className="font-serif text-2xl text-foreground">{value}</div>
      <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
