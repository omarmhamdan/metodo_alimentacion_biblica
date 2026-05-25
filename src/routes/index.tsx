import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import heroMesa from "@/assets/hero-mesa.jpg";
import { useUser, useLang, findUserByEmail } from "@/lib/store";
import { fetchProfileByEmail, upsertProfile, fetchRecipePhotos } from "@/lib/sync";
import { mergeCloudImages } from "@/lib/image-store";

export const Route = createFileRoute("/")({
  component: LandingLogin,
});

function LandingLogin() {
  const { user, save } = useUser();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLang();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<"" | "empty" | "invalid">("");

  // Translated on render so language toggle updates the message live.
  const emailErrorMsg = !emailError
    ? ""
    : emailError === "empty"
      ? lang === "es"
        ? "Escribe tu email para continuar."
        : "Digite seu email para continuar."
      : lang === "es"
        ? "Email inválido. Verifica el formato (ej.: nombre@gmail.com)."
        : "Email inválido. Verifique o formato (ex.: nome@gmail.com).";

  // Email needs local-part + "@" + domain + "." + TLD (any TLD: .com, .br, .net, .io, .ai…)
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  // PWA standalone mode? Show a friendly "restore your data" banner.
  const [isStandalone, setIsStandalone] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
  }, []);

  useEffect(() => {
    if (user?.onboarded) navigate({ to: "/dashboard" });
    else if (user) navigate({ to: "/onboarding" });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setEmailError("empty");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setEmailError("invalid");
      return;
    }
    setEmailError("");
    setLoading(true);

    // 1) Try local first (fastest)
    const local = findUserByEmail(cleanEmail);
    if (local) {
      save(local.user);
      if (local.daily && typeof window !== "undefined") {
        localStorage.setItem("mab:daily", JSON.stringify(local.daily));
        window.dispatchEvent(new CustomEvent("mab:storage", { detail: "mab:daily" }));
      }
      navigate({ to: local.user.onboarded ? "/dashboard" : "/onboarding" });
      return;
    }

    // 2) Try cloud (covers PWA-vs-Safari, incognito, multi-device)
    try {
      const cloud = await fetchProfileByEmail(cleanEmail);
      if (cloud) {
        save(cloud.user);
        if (cloud.daily && typeof window !== "undefined") {
          localStorage.setItem("mab:daily", JSON.stringify(cloud.daily));
          window.dispatchEvent(new CustomEvent("mab:storage", { detail: "mab:daily" }));
        }
        // Pull global recipe photos from cloud and merge into local cache
        fetchRecipePhotos()
          .then((urls) => mergeCloudImages(urls))
          .catch(() => {});
        navigate({ to: cloud.user.onboarded ? "/dashboard" : "/onboarding" });
        return;
      }
    } catch (err) {
      console.warn("[Login] cloud lookup failed, falling back to new user", err);
    }

    // 3) Brand-new user — start onboarding with blank name
    const newUser = {
      nome: mode === "signup" ? nome : "",
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      onboarded: false,
    };
    save(newUser);
    upsertProfile(newUser).catch(() => {}); // fire-and-forget cloud insert
    setLoading(false);
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-background">
      {/* Prominent language picker — pinned to the top of the screen */}
      <div className="sticky top-0 z-20 flex items-center justify-center gap-2 bg-cream/95 backdrop-blur px-4 py-2.5 border-b border-border/40">
        <button
          onClick={() => setLang("es")}
          className={`flex-1 max-w-[170px] flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
            lang === "es"
              ? "bg-gradient-primary text-primary-foreground shadow-soft"
              : "bg-card text-muted-foreground border border-border hover:border-olive/40"
          }`}
          aria-pressed={lang === "es"}
        >
          <span className="text-base">🇨🇴</span> Español
          {lang === "es" && <span className="text-[10px]">✓</span>}
        </button>
        <button
          onClick={() => setLang("pt")}
          className={`flex-1 max-w-[170px] flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
            lang === "pt"
              ? "bg-gradient-primary text-primary-foreground shadow-soft"
              : "bg-card text-muted-foreground border border-border hover:border-olive/40"
          }`}
          aria-pressed={lang === "pt"}
        >
          <span className="text-base">🇧🇷</span> Português
          {lang === "pt" && <span className="text-[10px]">✓</span>}
        </button>
      </div>

      {/* PWA standalone banner — first time opening the installed app */}
      {isStandalone && !user && (
        <div className="mx-4 mt-3 rounded-2xl border border-olive/40 bg-highlight/60 p-4">
          <p className="font-serif text-sm text-foreground">🌿 {t("login_pwa_banner_title")}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-snug">
            {t("login_pwa_banner_body")}
          </p>
        </div>
      )}

      <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden">
        <img
          src={heroMesa}
          alt="Mesa mediterrânea bíblica"
          className="h-full w-full object-cover"
          width={1280}
          height={1600}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/30 to-cream" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-x-0 bottom-6 px-6 text-center"
        >
          <p className="font-serif italic text-sm text-earth/80">{t("login_verse")}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="px-6 pt-2 pb-10"
      >
        <div className="mb-7 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-earth">
            <Sparkles className="h-3 w-3" /> {t("login_badge")}
          </div>
          <h1 className="font-serif text-[28px] leading-tight text-foreground text-balance">
            {t("login_title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-balance">{t("login_subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {mode === "signup" && (
            <Field
              icon={<Sparkles className="h-4 w-4" />}
              placeholder={t("login_name_placeholder")}
              value={nome}
              onChange={setNome}
            />
          )}
          <Field
            icon={<Mail className="h-4 w-4" />}
            placeholder={t("login_email_placeholder")}
            type="text"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (emailError) setEmailError("");
            }}
          />
          {emailError && <p className="px-1 text-xs text-terracotta">{emailErrorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {loading
                ? t("login_loading")
                : mode === "login"
                  ? t("login_enter")
                  : t("login_create")}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </span>
          </button>

          <p className="pt-5 text-center text-xs text-muted-foreground">
            {mode === "login" ? t("login_no_account") : t("login_have_account")}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-earth underline-offset-4 hover:underline"
            >
              {mode === "login" ? t("login_create") : t("login_signin")}
            </button>
          </p>
        </form>

        <Link
          to="/dashboard"
          className="mt-6 block text-center text-[11px] text-muted-foreground/70 hover:text-foreground"
        >
          {t("login_explore")}
        </Link>
      </motion.div>
    </div>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-card transition-all focus-within:border-olive/50 focus-within:ring-2 focus-within:ring-olive/15">
      <span className="text-muted-foreground">{icon}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
      />
    </label>
  );
}
