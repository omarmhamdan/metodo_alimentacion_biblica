import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Image,
  FileText,
  Users,
  Download,
  Trash2,
  ChefHat,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  BarChart3,
  Heart,
  Droplets,
  BookOpen,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  adminLogin,
  adminLogout,
  isAdminLoggedIn,
  loadOverrides,
  saveOverrides,
  exportOverrides,
  clearOverrides,
  getUserSnapshot,
  type ContentOverrides,
} from "@/lib/admin-store";
import {
  saveImage,
  deleteImage,
  clearImages,
  initImages,
  getCachedImages,
} from "@/lib/image-store";
import {
  uploadRecipePhoto,
  deleteRecipePhoto,
  adminListUsers,
  adminStats,
  adminDeleteUser,
  supabaseEnabled,
  type AdminUserRow,
} from "@/lib/sync";
import { useUser } from "@/lib/store";
import { recipes } from "@/lib/recipes";
import { recipeTranslationsES } from "@/lib/recipes-es";
import { bonusSlots } from "@/lib/bonus-images";
import { setEditMode } from "@/lib/edit-store";
import {
  setEntitlement,
  adminFetchEntitlements,
  adminListAllEntitlements,
  adminListWebhookLogs,
  adminDeleteWebhookLog,
  PRODUTOS,
  type Produto,
  type EntState,
  type EntitlementRow,
  type WebhookLogRow,
} from "@/lib/entitlements";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  // title set by AppShell bootstrap (per-language)
});

type Tab = "dashboard" | "receitas" | "bonus" | "conteudo" | "logs" | "usuarios" | "exportar";

function AdminPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const [loggedIn, setLoggedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [overrides, setOverrides] = useState<ContentOverrides>(loadOverrides);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const user = getUserSnapshot();

  // ── Cloud (Supabase) — populated when supabaseEnabled ────────────────────
  const [cloudUsers, setCloudUsers] = useState<AdminUserRow[]>([]);
  const [cloudStats, setCloudStats] = useState({
    totalUsers: 0,
    onboardedUsers: 0,
    totalPhotos: 0,
    byLang: {} as Record<string, number>,
  });
  const [cloudLoading, setCloudLoading] = useState(false);
  // email → { product → {active, restoredFrom} } (Supabase entitlements, per-user view)
  const [entMap, setEntMap] = useState<Record<string, Partial<Record<Produto, EntState>>>>({});

  const refreshCloud = useCallback(async () => {
    if (!supabaseEnabled) return;
    setCloudLoading(true);
    try {
      const [u, s] = await Promise.all([adminListUsers(), adminStats()]);
      setCloudUsers(u);
      setCloudStats(s);
      setEntMap(await adminFetchEntitlements(u.map((x) => x.email)));
    } finally {
      setCloudLoading(false);
    }
  }, []);

  const toggleEntitlement = useCallback(
    async (email: string, product: Produto, active: boolean) => {
      const r = await setEntitlement(email, product, active);
      if (!r.ok) {
        alert(r.error ?? "Falha ao salvar acesso.");
        return;
      }
      // Optimistic local update so the badge flips instantly.
      const key = email.trim().toLowerCase();
      setEntMap((prev) => {
        const base = prev[key] ?? {};
        const prevState = base[product];
        return {
          ...prev,
          [key]: { ...base, [product]: { active, restoredFrom: prevState?.restoredFrom ?? null } },
        };
      });
    },
    [],
  );

  useEffect(() => {
    if (loggedIn) refreshCloud();
  }, [loggedIn, refreshCloud]);

  const [saveError, setSaveError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [imgSizes, setImgSizes] = useState<Record<string, number>>({});
  // IDB images for admin preview (id → dataUrl)
  const [adminImages, setAdminImages] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoggedIn(isAdminLoggedIn());
    // Load IDB images for preview
    initImages().then(() => setAdminImages({ ...getCachedImages() }));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLogging(true);
    const result = await adminLogin(authEmail, password);
    setLogging(false);
    if (result.ok) {
      setLoggedIn(true);
      setPassword("");
    } else {
      setError(result.error ?? "Login falhou.");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setLoggedIn(false);
  };

  const updateRecipeOverride = useCallback(
    (id: string, field: "imagem" | "titulo" | "titulo_es", value: string) => {
      setOverrides((prev) => ({
        ...prev,
        recipes: { ...prev.recipes, [id]: { ...prev.recipes[id], [field]: value } },
      }));
    },
    [],
  );

  // Compress to max 350px WebP/JPEG, then save straight to IndexedDB (no localStorage)
  const handlePhotoUpload = useCallback((id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Higher quality target (~200-500KB) — IndexedDB has no quota constraint
        const MAX = 1000;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // WebP @ 0.85 keeps texture and color fidelity while still ~30% smaller than JPEG
        let dataUrl = canvas.toDataURL("image/webp", 0.85);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        }
        const kb = Math.round((dataUrl.length * 0.75) / 1024);
        console.log(`[Admin] Compressed ${file.name}: ${canvas.width}×${canvas.height} → ${kb}KB`);
        setImgSizes((prev) => ({ ...prev, [id]: kb }));
        // Save to IDB (instant local preview)
        saveImage(id, dataUrl).then(() => setAdminImages((prev) => ({ ...prev, [id]: dataUrl })));
        // Upload to Supabase Storage — global photo visible to ALL users.
        setUploadError("");
        uploadRecipePhoto(id, dataUrl)
          .then((url) => {
            if (url) {
              // Swap IDB entry to the cloud URL — same key, much smaller payload
              saveImage(id, url).then(() => setAdminImages((prev) => ({ ...prev, [id]: url })));
              console.log(`[Admin] Cloud uploaded: ${url}`);
            }
          })
          .catch((e) => {
            console.warn("[Admin] cloud upload failed", e);
            const msg = e instanceof Error ? e.message : String(e);
            setUploadError(
              `A foto "${id}" ficou salva só neste dispositivo — a publicação para todos falhou. ${msg}`,
            );
          });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    setSaveError("");
    // Use functional setState to get latest overrides
    setOverrides((latest) => {
      const result = saveOverrides(latest);
      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setSaveError(result.error ?? "Erro ao salvar");
        setTimeout(() => setSaveError(""), 5000);
      }
      return latest; // no change
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportOverrides());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-900 to-stone-800 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-olive/20">
              <Lock className="h-8 w-8 text-olive" />
            </div>
            <h1 className="font-serif text-2xl text-white">Painel Admin</h1>
            <p className="mt-1 text-sm text-stone-400">Método Alimentación Bíblica</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              autoComplete="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="Email do admin"
              required
              className="w-full rounded-2xl border border-stone-600 bg-stone-700 px-4 py-3.5 text-sm text-white placeholder:text-stone-400 outline-none focus:border-olive"
            />
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                className="w-full rounded-2xl border border-stone-600 bg-stone-700 px-4 py-3.5 pr-12 text-sm text-white placeholder:text-stone-400 outline-none focus:border-olive"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={logging}
              className="w-full rounded-2xl bg-olive py-3.5 text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {logging ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-4 w-full text-center text-xs text-stone-500 hover:text-stone-300"
          >
            ← Voltar ao app
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof ChefHat }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "receitas", label: "Receitas", icon: ChefHat },
    { id: "bonus", label: "Bônus", icon: Sparkles },
    { id: "conteudo", label: "Conteúdo", icon: FileText },
    { id: "logs", label: "Logs Webhook", icon: BarChart3 },
    { id: "usuarios", label: "Usuários", icon: Users },
    { id: "exportar", label: "Exportar", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-olive/20">
              <Lock className="h-4 w-4 text-olive" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-white">Admin Panel</h1>
              <p className="truncate text-[10px] text-stone-500">Método Alimentación Bíblica</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-1 text-xs text-green-400"
              >
                <Check className="h-3 w-3" /> <span className="hidden sm:inline">Salvo</span>
              </motion.span>
            )}
            <button
              onClick={() => {
                setEditMode(true);
                navigate({ to: "/dashboard" });
              }}
              className="flex items-center gap-1.5 rounded-xl bg-olive px-2.5 py-1.5 text-xs font-medium text-cream hover:opacity-90"
            >
              <Image className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Editar no app</span>
            </button>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="hidden rounded-xl border border-stone-700 px-3 py-1.5 text-xs text-stone-400 hover:text-white sm:block"
            >
              Ver app
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-2.5 py-1.5 text-xs text-stone-400 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
        {/* Nav tabs — horizontally scrollable on mobile */}
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-1 pb-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition-all sm:px-4 ${tab === id ? "border-olive text-olive" : "border-transparent text-stone-500 hover:text-stone-300"}`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-1 text-xl font-semibold">Visão Geral</h2>
                <p className="text-sm text-stone-400">
                  {supabaseEnabled
                    ? "Dados reais do Supabase (todos os usuários)"
                    : "Modo local — Supabase não configurado"}
                </p>
              </div>
              {supabaseEnabled && (
                <button
                  onClick={refreshCloud}
                  disabled={cloudLoading}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-700 px-3 py-1.5 text-xs text-stone-400 hover:text-white disabled:opacity-50"
                >
                  {cloudLoading ? "Atualizando..." : "↻ Atualizar"}
                </button>
              )}
            </div>

            {!supabaseEnabled && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-400/90">
                  Crie um projeto Supabase e adicione VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY em
                  .env.local para ver analytics reais.
                </p>
              </div>
            )}

            {/* Cloud stats */}
            {supabaseEnabled && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Stat
                    icon={Users}
                    label="Total de usuários"
                    value={String(cloudStats.totalUsers)}
                    color="text-olive"
                  />
                  <Stat
                    icon={Check}
                    label="Onboarded"
                    value={String(cloudStats.onboardedUsers)}
                    color="text-green-400"
                  />
                  <Stat
                    icon={Image}
                    label="Fotos enviadas"
                    value={String(cloudStats.totalPhotos)}
                    color="text-purple-400"
                  />
                  <Stat
                    icon={ChefHat}
                    label="Receitas no app"
                    value={String(recipes.length)}
                    color="text-cyan-400"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Stat
                    icon={Globe}
                    label="Usuários em ES"
                    value={String(cloudStats.byLang.es ?? 0)}
                    color="text-blue-400"
                  />
                  <Stat
                    icon={Globe}
                    label="Usuários em PT"
                    value={String(cloudStats.byLang.pt ?? 0)}
                    color="text-amber-400"
                  />
                </div>
              </>
            )}

            {/* This-device card (still useful for debugging) */}
            <div className="rounded-2xl border border-stone-700 bg-stone-900 p-5">
              <h3 className="mb-3 text-sm font-semibold text-stone-200">Este dispositivo</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat label="Idioma" value={user?.lang?.toUpperCase() ?? "—"} />
                <MiniStat label="Favoritas" value={String(user?.favoritos?.length ?? 0)} />
                <MiniStat
                  label="Água hoje"
                  value={user ? `${(user.aguaMl / 1000).toFixed(1)}L` : "—"}
                />
                <MiniStat label="Dia jornada" value={String(user?.jornadaDia ?? 0)} />
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-stone-300">Ações rápidas</h3>
              <div className="grid gap-2 sm:grid-cols-3">
                <QuickAction
                  onClick={() => setTab("receitas")}
                  icon={Image}
                  label="Editar foto de receita"
                />
                <QuickAction
                  onClick={() => setTab("usuarios")}
                  icon={Users}
                  label="Ver lista de usuários"
                />
                <QuickAction
                  onClick={() => setTab("exportar")}
                  icon={Download}
                  label="Exportar CSV de emails"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── RECEITAS ── */}
        {tab === "receitas" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Editar Receitas</h2>
                <p className="mt-1 text-sm text-stone-400">
                  Upar foto ou colar URL. Edite títulos em PT e ES. Clique em "Salvar todas".
                </p>
              </div>
              <button
                onClick={handleSave}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${saved ? "bg-green-600 text-white" : "bg-olive text-cream hover:opacity-90"}`}
              >
                {saved ? "✓ Salvo!" : "Salvar todas"}
              </button>
            </div>

            {/* Storage usage indicator */}
            <StorageBar />

            {saveError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 space-y-1">
                <p className="font-medium">⚠️ {saveError}</p>
                <p className="text-red-400/80">
                  Dica: use no máximo 3-4 fotos customizadas por vez. Para mais fotos, remova as
                  antigas antes de adicionar novas.
                </p>
              </div>
            )}

            {uploadError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
                <p className="font-medium">⚠️ {uploadError}</p>
              </div>
            )}

            <div className="space-y-3">
              {recipes.map((r) => {
                const ov = overrides.recipes[r.id] ?? {};
                // IDB image takes priority, then URL override, then default
                const currentImg =
                  adminImages[r.id] ||
                  (ov.imagem && !ov.imagem.startsWith("data:") ? ov.imagem : "") ||
                  r.imagem;
                const hasCustomImg = Boolean(
                  adminImages[r.id] || (ov.imagem?.trim() && !ov.imagem.startsWith("data:")),
                );
                const trES = recipeTranslationsES[r.id];
                const currentTitlePT = ov.titulo?.trim() ? ov.titulo : r.titulo;
                const currentTitleES = ov.titulo_es?.trim()
                  ? ov.titulo_es
                  : (trES?.titulo ?? r.titulo);

                return (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    ov={ov}
                    currentImg={currentImg}
                    hasCustomImg={hasCustomImg}
                    currentTitlePT={currentTitlePT}
                    currentTitleES={currentTitleES}
                    imgKb={imgSizes[r.id]}
                    onImgChange={(v) => updateRecipeOverride(r.id, "imagem", v)}
                    onPhotoUpload={(file) => handlePhotoUpload(r.id, file)}
                    onRestoreImg={() => {
                      deleteImage(r.id).then(() =>
                        setAdminImages((prev) => {
                          const n = { ...prev };
                          delete n[r.id];
                          return n;
                        }),
                      );
                      updateRecipeOverride(r.id, "imagem", "");
                      deleteRecipePhoto(r.id).catch(() => {});
                    }}
                    onTitlePTChange={(v) => updateRecipeOverride(r.id, "titulo", v)}
                    onTitleESChange={(v) => updateRecipeOverride(r.id, "titulo_es", v)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── BÔNUS (imagens dos guias Anti-Inflamação + Mesa Única) ── */}
        {tab === "bonus" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Imagens dos Bônus</h2>
              <p className="mt-1 text-sm text-stone-400">
                Fotos das páginas Anti-Inflamação 7 Dias e Guia Mesa Única. Upe a foto e ela é
                publicada para todos automaticamente (via Supabase).
              </p>
            </div>

            {!supabaseEnabled && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-400/90">
                  Supabase não configurado neste ambiente — uploads ficam só neste dispositivo. Em
                  produção (com Supabase), as fotos sobem para todos.
                </p>
              </div>
            )}

            {uploadError && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-xs text-red-300">⚠️ {uploadError}</p>
              </div>
            )}

            {Array.from(new Set(bonusSlots.map((s) => s.group))).map((group) => (
              <div key={group} className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-200">{group}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {bonusSlots
                    .filter((s) => s.group === group)
                    .map((slot) => (
                      <BonusImageCard
                        key={slot.id}
                        slot={slot}
                        currentImg={adminImages[slot.id] || slot.fallback}
                        hasCustom={Boolean(adminImages[slot.id])}
                        imgKb={imgSizes[slot.id]}
                        onUpload={(file) => handlePhotoUpload(slot.id, file)}
                        onRestore={() => {
                          deleteImage(slot.id).then(() =>
                            setAdminImages((prev) => {
                              const n = { ...prev };
                              delete n[slot.id];
                              return n;
                            }),
                          );
                          deleteRecipePhoto(slot.id).catch(() => {});
                        }}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CONTEÚDO ── */}
        {tab === "conteudo" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Editar Conteúdo Global</h2>
                <p className="mt-1 text-sm text-stone-400">
                  Textos gerais do app. As mudanças ficam salvas localmente.
                </p>
              </div>
              <button
                onClick={handleSave}
                className="rounded-xl bg-olive px-4 py-2 text-sm font-medium text-cream hover:opacity-90"
              >
                {saved ? "✓ Salvo!" : "Salvar"}
              </button>
            </div>

            <div className="rounded-2xl border border-stone-700 bg-stone-900 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-stone-200">Identidade do app</h3>
              <Field
                label="Nome do app"
                value={overrides.global.appName ?? ""}
                placeholder="Método Alimentación Bíblica"
                onChange={(v) =>
                  setOverrides({ ...overrides, global: { ...overrides.global, appName: v } })
                }
              />
              <Field
                label="Tagline (ES)"
                value={overrides.global.tagline_es ?? ""}
                placeholder="La mesa que Dios creó, al alcance de tu cocina."
                onChange={(v) =>
                  setOverrides({ ...overrides, global: { ...overrides.global, tagline_es: v } })
                }
              />
              <Field
                label="Tagline (PT)"
                value={overrides.global.tagline_pt ?? ""}
                placeholder="A mesa que Deus criou, ao alcance da sua cozinha."
                onChange={(v) =>
                  setOverrides({ ...overrides, global: { ...overrides.global, tagline_pt: v } })
                }
              />
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300">
              <strong>Nota:</strong> Overrides de texto afetam apenas este dispositivo enquanto não
              há backend. Para propagar para todos os usuários, exporte o JSON e aplique no código.
            </div>
          </div>
        )}

        {/* ── ACESSOS (liberação manual dos upsells por email) ── */}
        {tab === "logs" && <LogsPanel />}

        {/* ── USUÁRIOS ── */}
        {tab === "usuarios" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Usuários</h2>
                <p className="mt-1 text-sm text-stone-400">
                  {supabaseEnabled
                    ? `${cloudUsers.length} cadastrados no Supabase`
                    : "Modo local — sem Supabase"}
                </p>
              </div>
              {supabaseEnabled && (
                <div className="flex gap-2">
                  <button
                    onClick={refreshCloud}
                    disabled={cloudLoading}
                    className="rounded-xl border border-stone-700 px-3 py-1.5 text-xs text-stone-400 hover:text-white disabled:opacity-50"
                  >
                    {cloudLoading ? "..." : "↻ Atualizar"}
                  </button>
                  <button
                    onClick={() => downloadEmailsCsv(cloudUsers)}
                    className="flex items-center gap-1.5 rounded-xl bg-olive px-3 py-1.5 text-xs text-cream hover:opacity-90"
                  >
                    <Download className="h-3.5 w-3.5" /> CSV de emails
                  </button>
                </div>
              )}
            </div>

            {/* All cloud users (full list) */}
            {supabaseEnabled && (
              <div className="overflow-hidden rounded-2xl border border-stone-700 bg-stone-900">
                {cloudUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="mx-auto mb-3 h-8 w-8 text-stone-600" />
                    <p className="text-sm text-stone-400">
                      {cloudLoading ? "Carregando..." : "Nenhum usuário cadastrado ainda."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-800">
                    {cloudUsers.map((u) => (
                      <CloudUserRow
                        key={u.email}
                        u={u}
                        recipesMap={Object.fromEntries(recipes.map((r) => [r.id, r.titulo]))}
                        ent={entMap[u.email.trim().toLowerCase()]}
                        onToggle={(product, active) =>
                          toggleEntitlement(u.email, product, active)
                        }
                        onDelete={async () => {
                          if (
                            !confirm(`Apagar usuário ${u.email}? Esta ação não pode ser desfeita.`)
                          )
                            return;
                          const ok = await adminDeleteUser(u.email);
                          if (ok) refreshCloud();
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* This-device user (legacy view) */}
            {user && (
              <div className="rounded-2xl border border-stone-700 bg-stone-900 p-5">
                <h3 className="mb-3 text-sm font-semibold text-stone-200">Este dispositivo</h3>
                <p className="text-xs text-stone-400 mb-3">
                  {user.nome} · {user.email}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <InfoPill label="Idioma" value={user.lang.toUpperCase()} />
                  <InfoPill label="Dia na jornada" value={String(user.jornadaDia)} />
                  <InfoPill label="Sequência" value={String(user.sequencia)} />
                  <InfoPill label="Água hoje" value={`${(user.aguaMl / 1000).toFixed(1)}L`} />
                  <InfoPill label="Favoritos" value={String(user.favoritos.length)} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EXPORTAR ── */}
        {tab === "exportar" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Exportar Mudanças</h2>
              <p className="mt-1 text-sm text-stone-400">
                Copie o JSON abaixo e envie para o desenvolvedor aplicar no código.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-700 bg-stone-900 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-stone-300">content_overrides.json</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl bg-stone-700 px-3 py-1.5 text-xs text-stone-300 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([exportOverrides()], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "mab_overrides.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-olive px-3 py-1.5 text-xs text-cream hover:opacity-90"
                  >
                    <Download className="h-3.5 w-3.5" /> Baixar
                  </button>
                </div>
              </div>
              <pre className="max-h-80 overflow-auto rounded-xl bg-stone-950 p-4 text-xs text-stone-300">
                {exportOverrides()}
              </pre>
            </div>

            <div className="rounded-2xl border border-stone-700 bg-stone-900 p-5">
              <h3 className="mb-2 text-sm font-semibold">Como aplicar as mudanças para todos:</h3>
              <ol className="space-y-2 text-xs text-stone-400">
                <li className="flex gap-2">
                  <span className="font-bold text-olive">1.</span> Edite receitas ou conteúdo nas
                  abas acima
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-olive">2.</span> Clique "Baixar" para obter o JSON
                  com as mudanças
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-olive">3.</span> Envie o arquivo para o
                  desenvolvedor
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-olive">4.</span> Com Supabase (Fase 2), você edita
                  diretamente e todos veem na hora
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof ChefHat;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-700 bg-stone-900 p-4">
      <Icon className={`mb-2 h-5 w-5 ${color}`} />
      <div className={`font-serif text-2xl font-semibold ${color}`}>{value}</div>
      <div className="mt-0.5 text-xs text-stone-500">{label}</div>
    </div>
  );
}

function QuickAction({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: typeof Image;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-stone-700 bg-stone-900 p-4 text-left text-sm text-stone-300 transition-colors hover:border-olive/40 hover:text-white"
    >
      <Icon className="h-5 w-5 text-olive" /> {label}
    </button>
  );
}

function LogsPanel() {
  const [logs, setLogs] = useState<WebhookLogRow[]>([]);
  const [ents, setEnts] = useState<EntitlementRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabaseEnabled) return;
    setLoading(true);
    try {
      const [l, e] = await Promise.all([adminListWebhookLogs(100), adminListAllEntitlements()]);
      setLogs(l);
      setEnts(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  const resultStyle: Record<string, string> = {
    granted: "bg-green-500/20 text-green-400",
    revoked: "bg-amber-500/20 text-amber-400",
    skipped: "bg-stone-700 text-stone-400",
    unauthorized: "bg-red-500/20 text-red-400",
    error: "bg-red-500/20 text-red-400",
  };
  const prodLabel = (id: string | null) =>
    id ? (PRODUTOS.find((p) => p.id === id)?.pt ?? id) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Logs de Webhook</h2>
          <p className="mt-1 text-sm text-stone-400">
            Cada chamada da Hotmart ao nosso servidor + estado atual dos acessos.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading || !supabaseEnabled}
          className="rounded-xl border border-stone-700 px-3 py-1.5 text-xs text-stone-400 hover:text-white disabled:opacity-50"
        >
          {loading ? "..." : "↻ Atualizar"}
        </button>
      </div>

      {!supabaseEnabled && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs text-amber-400/90">
            Supabase não configurado neste ambiente — logs só aparecem em produção.
          </p>
        </div>
      )}

      {/* ── Webhooks recebidos ── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-stone-200">
          Webhooks recebidos ({logs.length})
        </h3>
        <div className="overflow-hidden rounded-2xl border border-stone-700 bg-stone-900">
          {logs.length === 0 ? (
            <p className="p-6 text-center text-sm text-stone-400">
              {loading ? "Carregando..." : "Nenhum webhook recebido ainda."}
            </p>
          ) : (
            <div className="divide-y divide-stone-800">
              {logs.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-xs">
                  <span className="text-stone-500">{fmt(l.received_at)}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${resultStyle[l.result ?? ""] ?? "bg-stone-700 text-stone-400"}`}
                  >
                    {l.result}
                  </span>
                  <span className="text-stone-300">{l.event}</span>
                  <span className="min-w-0 flex-1 truncate text-stone-400">{l.email ?? "—"}</span>
                  <span className="text-stone-500">
                    {l.mapped_product ? prodLabel(l.mapped_product) : (l.product_name ?? l.product_id ?? "")}
                  </span>
                  <button
                    onClick={async () => {
                      if (!confirm("Apagar esta linha do log?")) return;
                      if (await adminDeleteWebhookLog(l.id)) setLogs((prev) => prev.filter((x) => x.id !== l.id));
                      else alert("Falha ao apagar.");
                    }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 p-1 text-red-400 hover:bg-red-500/20"
                    aria-label="Apagar log"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  {l.detail && <span className="w-full text-stone-600">↳ {l.detail}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Acessos na tabela (fonte da verdade) ── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-stone-200">
          Acessos liberados ({ents.filter((e) => e.active).length} ativos de {ents.length})
        </h3>
        <div className="overflow-hidden rounded-2xl border border-stone-700 bg-stone-900">
          {ents.length === 0 ? (
            <p className="p-6 text-center text-sm text-stone-400">
              {loading ? "Carregando..." : "Nenhum acesso na tabela."}
            </p>
          ) : (
            <div className="divide-y divide-stone-800">
              {ents.map((e) => (
                <div
                  key={`${e.email}-${e.product}`}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-xs"
                >
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${e.active ? "bg-green-500/20 text-green-400" : "bg-stone-700 text-stone-500"}`}
                  >
                    {e.active ? "ativo" : "inativo"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-stone-300">
                    {e.email}
                    {e.restored_from && (
                      <span className="text-stone-500"> · compra: {e.restored_from}</span>
                    )}
                  </span>
                  <span className="text-stone-400">{prodLabel(e.product)}</span>
                  <span className="text-stone-600">{e.source ?? "—"}</span>
                  <span className="text-stone-600">{fmt(e.updated_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function StorageBar() {
  const measure = () => {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += (localStorage.getItem(key)?.length ?? 0) * 2;
      }
    }
    return Math.round(total / 1024);
  };
  const [usedKb, setUsedKb] = useState(measure);
  useEffect(() => {
    const refresh = () => setUsedKb(measure());
    window.addEventListener("mab:overrides", refresh);
    return () => window.removeEventListener("mab:overrides", refresh);
  }, []);
  const limitKb = 5120; // 5MB
  const pct = Math.min(100, (usedKb / limitKb) * 100);
  const color = pct > 85 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-green-500";
  return (
    <div className="rounded-2xl border border-stone-700 bg-stone-900 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-stone-400">
        <span>Armazenamento local usado</span>
        <span className={pct > 85 ? "text-red-400 font-medium" : ""}>
          {usedKb}KB / {limitKb}KB
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-700">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct > 75 && (
        <p className="mt-2 text-[11px] text-amber-400">
          ⚠️ Espaço limitado. Remova fotos antigas antes de adicionar novas.
        </p>
      )}
    </div>
  );
}

function RecipeCard({
  recipe: r,
  ov,
  currentImg,
  hasCustomImg,
  currentTitlePT,
  currentTitleES,
  imgKb,
  onImgChange,
  onPhotoUpload,
  onRestoreImg,
  onTitlePTChange,
  onTitleESChange,
}: {
  recipe: import("@/lib/recipes").Receita;
  ov: { imagem?: string; titulo?: string; titulo_es?: string };
  currentImg: string;
  hasCustomImg: boolean;
  currentTitlePT: string;
  currentTitleES: string;
  imgKb?: number;
  onImgChange: (v: string) => void;
  onPhotoUpload: (f: File) => void;
  onRestoreImg: () => void;
  onTitlePTChange: (v: string) => void;
  onTitleESChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgPreviewErr, setImgPreviewErr] = useState(false);

  // Local input state — pre-filled with current values so user can select/copy/edit
  const [titlePT, setTitlePT] = useState(currentTitlePT);
  const [titleES, setTitleES] = useState(currentTitleES);
  const [urlInput, setUrlInput] = useState(ov.imagem?.startsWith("data:") ? "" : (ov.imagem ?? ""));

  // Sync from parent when overrides change externally
  useEffect(() => {
    setTitlePT(currentTitlePT);
  }, [currentTitlePT]);
  useEffect(() => {
    setTitleES(currentTitleES);
  }, [currentTitleES]);

  // hasCustomImg comes from parent (checks IDB + URL overrides)

  return (
    <div className="rounded-2xl border border-stone-700 bg-stone-900 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-stone-700 px-2 py-0.5 text-[10px] text-stone-300">
          {r.id}
        </span>
        <span className="text-[10px] text-stone-500">{r.categoria}</span>
        {hasCustomImg && (
          <span className="rounded-full bg-olive/20 px-2 py-0.5 text-[10px] text-olive">
            foto customizada
          </span>
        )}
      </div>

      <div className="flex items-start gap-4">
        {/* Photo preview + upload */}
        <div className="shrink-0 space-y-2">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-stone-800">
            {!imgPreviewErr ? (
              <img
                src={currentImg}
                alt={r.titulo}
                className="h-full w-full object-cover"
                onError={() => setImgPreviewErr(true)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-600 text-xs text-center p-1">
                Sem foto
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            // Reset value so same file can be uploaded again
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImgPreviewErr(false);
                onPhotoUpload(file);
              }
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-24 items-center justify-center gap-1 rounded-lg border border-olive/30 bg-olive/20 px-2 py-1.5 text-[10px] text-olive hover:bg-olive/30"
          >
            <Image className="h-3 w-3" /> Upar foto
          </button>
          {imgKb != null && (
            <span
              className={`w-24 text-center text-[10px] ${imgKb > 800 ? "text-amber-400" : "text-green-400"}`}
            >
              ✓ {imgKb}KB
            </span>
          )}
          {hasCustomImg && (
            <button
              onClick={() => {
                onRestoreImg();
                setUrlInput("");
                setImgPreviewErr(false);
              }}
              className="flex w-24 items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-[10px] text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-3 w-3" /> Restaurar
            </button>
          )}
        </div>

        {/* Fields — inputs pre-filled so user can select/copy/edit */}
        <div className="flex-1 space-y-2">
          <div>
            <label className="mb-1 block text-[10px] text-stone-500">
              URL da foto (deixe vazio para usar o padrão)
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                const v = e.target.value;
                setUrlInput(v);
                setImgPreviewErr(false);
                onImgChange(v);
              }}
              placeholder="https://..."
              className="w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-xs text-white placeholder:text-stone-500 outline-none focus:border-olive/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-stone-500">
              Título PT — clique para editar/copiar
            </label>
            <input
              type="text"
              value={titlePT}
              onChange={(e) => {
                setTitlePT(e.target.value);
                onTitlePTChange(e.target.value);
              }}
              className="w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-xs text-white outline-none focus:border-olive/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-stone-500">
              Título ES — clique para editar/copiar
            </label>
            <input
              type="text"
              value={titleES}
              onChange={(e) => {
                setTitleES(e.target.value);
                onTitleESChange(e.target.value);
              }}
              className="w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-xs text-white outline-none focus:border-olive/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BonusImageCard({
  slot,
  currentImg,
  hasCustom,
  imgKb,
  onUpload,
  onRestore,
}: {
  slot: { id: string; label: string };
  currentImg: string;
  hasCustom: boolean;
  imgKb?: number;
  onUpload: (f: File) => void;
  onRestore: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState(false);
  return (
    <div className="flex gap-3 rounded-2xl border border-stone-700 bg-stone-900 p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-800">
        {!err ? (
          <img
            src={currentImg}
            alt={slot.label}
            className="h-full w-full object-cover"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-1 text-center text-[10px] text-stone-600">
            Sem foto
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-white">{slot.label}</span>
          {hasCustom && (
            <span className="shrink-0 rounded-full bg-olive/20 px-2 py-0.5 text-[10px] text-olive">
              custom
            </span>
          )}
        </div>
        <span className="mb-2 text-[10px] text-stone-500">{slot.id}</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onClick={(e) => {
            (e.target as HTMLInputElement).value = "";
          }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setErr(false);
              onUpload(file);
            }
          }}
        />
        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-1 rounded-lg border border-olive/30 bg-olive/20 px-2.5 py-1.5 text-[10px] text-olive hover:bg-olive/30"
          >
            <Image className="h-3 w-3" /> Upar foto
          </button>
          {hasCustom && (
            <button
              onClick={() => {
                onRestore();
                setErr(false);
              }}
              className="flex items-center justify-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[10px] text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-3 w-3" /> Restaurar
            </button>
          )}
          {imgKb != null && (
            <span className={`text-[10px] ${imgKb > 800 ? "text-amber-400" : "text-green-400"}`}>
              ✓ {imgKb}KB
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-stone-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2.5 text-sm text-white placeholder:text-stone-500 outline-none focus:border-olive/50"
      />
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-800 p-3">
      <div className="text-[10px] uppercase tracking-wider text-stone-500">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-800 px-3 py-2">
      <div className="text-[9px] uppercase tracking-wider text-stone-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function CloudUserRow({
  u,
  recipesMap,
  ent,
  onToggle,
  onDelete,
}: {
  u: AdminUserRow;
  recipesMap: Record<string, string>;
  ent?: Partial<Record<Produto, EntState>>;
  onToggle: (product: Produto, active: boolean) => void | Promise<void>;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const favoritos = (u.daily?.favoritos ?? []) as string[];
  const aguaMl = u.daily?.aguaMl ?? 0;
  return (
    <div className="px-4 py-3 hover:bg-stone-800/40">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olive/20 text-sm font-bold text-olive">
          {(u.nome || u.email).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{u.nome || "—"}</p>
          <p className="truncate text-xs text-stone-400">{u.email}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${u.onboarded ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}
          >
            {u.onboarded ? "Onboarded" : "Pendente"}
          </span>
          <span className="rounded-full bg-stone-800 px-2 py-0.5 text-[10px] text-stone-400">
            {(u.lang ?? "es").toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-stone-700 px-2 py-1 text-[10px] text-stone-400 hover:text-white"
        >
          {open ? "Ocultar" : "Detalhes"}
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20"
          aria-label="Apagar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Acessos aos upsells (clique pra liberar/revogar) ── */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-12">
        <span className="text-[10px] uppercase tracking-wider text-stone-500">Acessos:</span>
        {PRODUTOS.map((p) => {
          const state = ent?.[p.id];
          const active = state?.active === true;
          const restoredFrom = state?.restoredFrom;
          return (
            <button
              key={p.id}
              onClick={() => {
                if (active && !confirm(`Revogar "${p.pt}" de ${u.email}?`)) return;
                onToggle(p.id, !active);
              }}
              title={
                restoredFrom
                  ? `Comprado com ${restoredFrom} — clique pra revogar`
                  : active
                    ? "Comprado — clique pra revogar"
                    : "Bloqueado — clique pra liberar"
              }
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "border border-stone-700 text-stone-500 hover:text-stone-300"
              }`}
            >
              {active ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {p.pt}
              {active && restoredFrom && (
                <span className="ml-1 hidden font-normal opacity-80 sm:inline">
                  · {restoredFrom}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label="Cadastro" value={new Date(u.created_at).toLocaleDateString("pt-BR")} />
          <MiniStat label="Idade" value={u.idade != null ? `${u.idade}` : "—"} />
          <MiniStat label="Peso" value={u.peso_atual != null ? `${u.peso_atual}kg` : "—"} />
          <MiniStat label="Água hoje" value={`${(aguaMl / 1000).toFixed(1)}L`} />
          <MiniStat label="Objetivo" value={u.objetivo ?? "—"} />
          <MiniStat label="Meta água" value={`${(u.agua_meta / 1000).toFixed(1)}L`} />
          <MiniStat label="Favoritos" value={String(favoritos.length)} />
          <MiniStat label="Jornada" value={`Dia ${u.daily?.jornadaDia ?? 0}`} />
          {favoritos.length > 0 && (
            <div className="col-span-2 sm:col-span-4 mt-1">
              <div className="text-[9px] uppercase tracking-wider text-stone-500 mb-1">
                Favoritos
              </div>
              <div className="flex flex-wrap gap-1">
                {favoritos.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-stone-800 px-2 py-0.5 text-[10px] text-stone-300"
                  >
                    {recipesMap[id] ?? id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function downloadEmailsCsv(users: AdminUserRow[]) {
  const header = "email,nome,onboarded,lang,created_at\n";
  const rows = users
    .map(
      (u) =>
        `"${u.email}","${(u.nome ?? "").replace(/"/g, '""')}",${u.onboarded},${u.lang ?? "es"},${u.created_at}`,
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mab-users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
