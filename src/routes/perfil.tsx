import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Settings,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { EdI18n } from "@/components/Editable";
import { useDaily, useUser, useLang, useRecipes } from "@/lib/store";
import { categoriaES } from "@/lib/recipes";
import { RecipePhoto } from "@/components/RecipePhoto";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
  // title set by AppShell bootstrap (per-language)
});

type Modal = "preferences" | "edit_goal" | "help" | null;

const SUPPORT_EMAIL = "metodoalimentacionbiblica@gmail.com";

function PerfilPage() {
  const { user, save } = useUser();
  const { daily, toggleFavorito } = useDaily();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLang();
  const allRecipes = useRecipes();
  const nome = user?.nome ?? (lang === "es" ? "Visitante" : "Visitante");
  const favRecipes = allRecipes.filter((r) => (daily.favoritos ?? []).includes(r.id));
  const [modal, setModal] = useState<Modal>(null);
  const [goalDraft, setGoalDraft] = useState("");

  return (
    <AppShell>
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary font-serif text-2xl text-primary-foreground shadow-soft">
            {nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <EdI18n
              as="p"
              k="prof_subtitle"
              className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            />
            <h1 className="font-serif text-2xl leading-tight text-foreground">{nome}</h1>
            {user?.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
          </div>
        </div>
      </header>

      <section className="mx-6 mb-4 grid grid-cols-3 gap-3">
        <Mini label={t("prof_age")} value={user?.idade ? `${user.idade}` : "—"} />
        <Mini label={t("prof_weight")} value={user?.pesoAtual ? `${user.pesoAtual}kg` : "—"} />
        <Mini label={t("prof_water")} value={`${((user?.aguaMeta ?? 2000) / 1000).toFixed(1)}L`} />
      </section>

      <section className="mx-6 mb-4 rounded-3xl bg-gradient-devotional p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-earth">
            <Target className="h-3 w-3" /> {t("prof_goal_label")}
          </div>
          <button
            onClick={() => {
              setGoalDraft(user?.objetivo ?? "");
              setModal("edit_goal");
            }}
            className="flex items-center gap-1 rounded-full bg-cream/60 px-2.5 py-1 text-[10px] font-medium text-earth hover:bg-cream/90 transition-colors"
          >
            {user?.objetivo ? (
              <>
                <Pencil className="h-3 w-3" /> {t("prof_goal_edit")}
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" /> {t("prof_goal_add")}
              </>
            )}
          </button>
        </div>
        {user?.objetivo ? (
          <p className="mt-2 font-serif text-lg text-foreground">{user.objetivo}</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground italic">{t("prof_goal_placeholder")}</p>
        )}
      </section>

      <section className="mx-6 mb-4 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 font-serif text-lg text-foreground">
            <Heart className="h-4 w-4 text-terracotta" /> <EdI18n k="prof_favorites" />
          </h2>
          {favRecipes.length > 0 && (
            <span className="text-[10px] italic text-muted-foreground">{t("prof_fav_hint")}</span>
          )}
        </div>
        {favRecipes.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("prof_no_fav")}</p>
        ) : (
          <ul className="space-y-2">
            {favRecipes.map((r) => (
              <FavRow
                key={r.id}
                id={r.id}
                titulo={r.titulo}
                imagem={r.imagem}
                categoria={lang === "es" ? (categoriaES[r.categoria] ?? r.categoria) : r.categoria}
                onRemove={() => toggleFavorito(r.id)}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="mx-6 mb-4 divide-y divide-border rounded-3xl bg-card shadow-card">
        <Row
          icon={Settings}
          label={t("prof_preferences")}
          hint={t("prof_preferences_hint")}
          onClick={() => setModal("preferences")}
        />
        <Row
          icon={HelpCircle}
          label={t("prof_help")}
          hint={t("prof_help_hint")}
          onClick={() => setModal("help")}
        />
      </section>

      <button
        onClick={() => {
          save(null);
          navigate({ to: "/" });
        }}
        className="mx-6 mb-6 inline-flex w-[calc(100%-3rem)] items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-4 w-4" /> {t("prof_signout")}
      </button>

      <EdI18n
        as="p"
        k="prof_verse"
        className="mb-2 block px-6 text-center font-serif italic text-xs text-muted-foreground text-balance"
      />

      {/* ── Modals ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full max-w-md rounded-t-3xl bg-background p-6 pb-24 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {modal === "preferences" && (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-serif text-xl text-foreground">{t("pref_title")}</h2>
                    <button
                      onClick={() => setModal(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                    {t("pref_lang")}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <LangBtn
                      flag="🇨🇴"
                      code="es"
                      label={t("pref_lang_es")}
                      active={lang === "es"}
                      onClick={() => setLang("es")}
                    />
                    <LangBtn
                      flag="🇧🇷"
                      code="pt"
                      label={t("pref_lang_pt")}
                      active={lang === "pt"}
                      onClick={() => setLang("pt")}
                    />
                  </div>
                  <button
                    onClick={() => setModal(null)}
                    className="mt-6 w-full rounded-2xl bg-gradient-primary py-3 text-sm font-medium text-primary-foreground"
                  >
                    {t("pref_close")}
                  </button>
                </>
              )}

              {modal === "edit_goal" && (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-serif text-xl text-foreground">{t("prof_goal_label")}</h2>
                    <button
                      onClick={() => setModal(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={goalDraft}
                    onChange={(e) => setGoalDraft(e.target.value)}
                    placeholder={t("prof_goal_placeholder")}
                    rows={3}
                    className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-olive/50 focus:ring-2 focus:ring-olive/10 resize-none"
                  />
                  <button
                    onClick={() => {
                      save({ ...user!, objetivo: goalDraft.trim() || undefined });
                      setModal(null);
                    }}
                    className="mt-4 w-full rounded-2xl bg-gradient-primary py-3 text-sm font-medium text-primary-foreground"
                  >
                    {t("prof_goal_save")}
                  </button>
                </>
              )}

              {modal === "help" && (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-serif text-xl text-foreground">{t("help_title")}</h2>
                    <button
                      onClick={() => setModal(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="max-h-[55vh] overflow-y-auto -mx-1 px-1">
                    <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                      {t("help_faq_label")}
                    </p>
                    <div className="space-y-2">
                      {(
                        [
                          ["faq_access_q", "faq_access_a"],
                          ["faq_install_q", "faq_install_a"],
                          ["faq_data_q", "faq_data_a"],
                          ["faq_refund_q", "faq_refund_a"],
                        ] as const
                      ).map(([q, a]) => (
                        <FaqItem key={q} question={t(q)} answer={t(a)} />
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl bg-gradient-devotional p-5 shadow-card">
                      <p className="font-serif text-base text-foreground">{t("help_contact_label")}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{t("help_contact_body")}</p>
                      <a
                        href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t("help_email_subject"))}`}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-medium text-primary-foreground"
                      >
                        <Mail className="h-4 w-4" /> {t("help_email_btn")}
                      </a>
                      <p className="mt-3 text-center text-[11px] text-muted-foreground">
                        {SUPPORT_EMAIL}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setModal(null)}
                    className="mt-5 w-full rounded-2xl border border-border bg-card py-3 text-sm font-medium text-muted-foreground"
                  >
                    {t("help_close")}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function FavRow({
  id,
  titulo,
  imagem,
  categoria,
  onRemove,
}: {
  id: string;
  titulo: string;
  imagem: string;
  categoria: string;
  onRemove: () => void;
}) {
  const [removing, setRemoving] = useState(false);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Trigger removal if dragged left past threshold OR swiped fast
    if (info.offset.x < -100 || info.velocity.x < -500) {
      setRemoving(true);
      setTimeout(onRemove, 200);
    }
  };

  return (
    <li className="relative overflow-hidden rounded-2xl">
      {/* Red destructive background revealed when dragging */}
      <div className="absolute inset-0 flex items-center justify-end rounded-2xl bg-terracotta/90 pr-5">
        <Trash2 className="h-5 w-5 text-cream" />
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        animate={removing ? { x: -400, opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        className="relative bg-background rounded-2xl"
        style={{ touchAction: "pan-y" }}
      >
        <Link
          to="/receitas/$id"
          params={{ id }}
          className="flex items-center gap-3 p-2 active:bg-secondary/60"
        >
          <RecipePhoto
            id={id}
            src={imagem}
            alt={titulo}
            className="h-12 w-12 rounded-xl object-cover pointer-events-none"
            loading="lazy"
            draggable={false}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm text-foreground">{titulo}</p>
            <p className="text-[11px] text-muted-foreground">{categoria}</p>
          </div>
          <span className="text-muted-foreground shrink-0">›</span>
        </Link>
      </motion.div>
    </li>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  // Render the answer with the support email turned into a clickable mailto link.
  const linkifyEmail = (text: string) => {
    if (!text.includes(SUPPORT_EMAIL)) return text;
    return text.split(SUPPORT_EMAIL).flatMap((part, i, arr) =>
      i < arr.length - 1
        ? [
            part,
            <a
              key={i}
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-earth underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>,
          ]
        : [part],
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="flex-1 text-sm font-medium text-foreground">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
              {linkifyEmail(answer)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 text-center shadow-card">
      <div className="font-serif text-xl text-foreground">{value}</div>
      <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: typeof Settings;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/50 active:bg-secondary"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-highlight text-earth">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <span className="text-muted-foreground">›</span>
    </button>
  );
}

function LangBtn({
  flag,
  label,
  active,
  onClick,
}: {
  flag: string;
  code: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
        active ? "border-olive bg-highlight" : "border-border bg-card"
      }`}
    >
      <span className="text-2xl">{flag}</span>
      <span className={`text-sm font-medium ${active ? "text-earth" : "text-foreground"}`}>
        {label}
      </span>
      {active && <span className="ml-auto text-olive">✓</span>}
    </button>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-card p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-olive" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
