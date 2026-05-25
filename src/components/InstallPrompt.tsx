import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Info, MoreVertical, MoreHorizontal, Plus, ChevronDown } from "lucide-react";
import { useLang } from "@/lib/store";
import { BrandIcon } from "./BrandIcon";

const DISMISSED_KEY = "mab:install_dismissed";
const BANNER_DISMISSED_KEY = "mab:install_banner_dismissed";
const DISMISS_DAYS = 3; // Show again after 3 days if dismissed (was 14)

// ── Native install (Android Chrome) ─────────────────────────────────────────
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}
let deferredPrompt: BeforeInstallPromptEvent | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
}

// ── Device detection ────────────────────────────────────────────────────────
type Device = {
  os: "ios" | "android" | "other";
  form: "mobile" | "tablet" | "desktop";
  orientation: "portrait" | "landscape";
  isStandalone: boolean;
};

function detectDevice(): Device {
  if (typeof window === "undefined") {
    return { os: "other", form: "desktop", orientation: "portrait", isStandalone: false };
  }
  const ua = navigator.userAgent.toLowerCase();
  const isIOS =
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  const maxDim = Math.max(window.innerWidth, window.innerHeight);
  const isTablet =
    /ipad/.test(ua) ||
    (/android/.test(ua) && !/mobile/.test(ua)) ||
    (minDim >= 600 && maxDim < 1366);
  const isMobile = /mobi|iphone|ipod/.test(ua) || minDim < 600;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return {
    os: isIOS ? "ios" : isAndroid ? "android" : "other",
    form: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
    orientation: window.innerHeight >= window.innerWidth ? "portrait" : "landscape",
    isStandalone,
  };
}

// ── Content ─────────────────────────────────────────────────────────────────
const content = {
  es: {
    banner: {
      title: "Notificaciones en este dispositivo",
      body: "Las notificaciones funcionan mejor si añades la app a la pantalla de inicio.",
      cta: "Cómo añadir a la pantalla de inicio",
    },
    title: "Instala la app ahora",
    subtitle:
      "Añade la plataforma a tu pantalla de inicio y ten acceso rápido siempre que necesites, sin ocupar espacio del celular.",
    nativeCta: "Instalar app",
    closeCta: "Después",
    ios: {
      menuShare: "Compartir",
      menuCopy: "Copiar",
      menuAdd: "Añadir a la Pantalla de Inicio",
      menuFav: "Favoritos",
      menuMore: "Ver Más",
      step1Pre: "Toca",
      step1Post: "···",
      step2Pre: "Toca en",
      step2Post: "Compartir",
      step3Pre: "Toca en",
      step3Post: "Ver Más",
      step4Pre: "Toca",
      step4Post: "Añadir a la Pantalla de Inicio",
      step1: 'Toca el botón "···" en la barra inferior',
      step2: 'Toca en "Compartir"',
      step3: 'Toca en "Ver Más" al final del menú',
      step4: 'Toca "Añadir a la Pantalla de Inicio"',
    },
    android: {
      menuShare: "Menú",
      menuCopy: "Copiar enlace",
      menuAdd: "Instalar app",
      menuFav: "Marcadores",
      menuMore: "",
      step1Pre: "Toca el menú",
      step1Post: "del navegador",
      step2Pre: "",
      step2Post: "",
      step3Pre: "",
      step3Post: "",
      step4Pre: "",
      step4Post: "",
      step1: "Toca el menú (⋮) del navegador",
      step2: 'Elige "Instalar app" o "Añadir a inicio"',
      step3: 'Confirma tocando en "Instalar"',
      step4: "",
    },
  },
  pt: {
    banner: {
      title: "Notificações neste aparelho",
      body: "As notificações funcionam melhor se você adicionar o app à tela inicial.",
      cta: "Como adicionar à tela inicial",
    },
    title: "Instale agora o App",
    subtitle:
      "Adicione a plataforma à tela inicial e tenha acesso rápido sempre que precisar, sem ocupar espaço do seu celular.",
    nativeCta: "Instalar app",
    closeCta: "Depois",
    ios: {
      menuShare: "Compartilhar",
      menuCopy: "Copiar",
      menuAdd: "Adicionar à Tela de Início",
      menuFav: "Favoritos",
      menuMore: "Ver Mais",
      step1Pre: "Toque",
      step1Post: "···",
      step2Pre: "Toque em",
      step2Post: "Compartilhar",
      step3Pre: "Toque em",
      step3Post: "Ver Mais",
      step4Pre: "Toque em",
      step4Post: "Adicionar à Tela de Início",
      step1: 'Toque no botão "···" na barra inferior',
      step2: 'Toque em "Compartilhar"',
      step3: 'Toque em "Ver Mais" no final do menu',
      step4: 'Toque em "Adicionar à Tela de Início"',
    },
    android: {
      menuShare: "Menu",
      menuCopy: "Copiar link",
      menuAdd: "Instalar app",
      menuFav: "Favoritos",
      menuMore: "",
      step1Pre: "Toque no menu",
      step1Post: "do navegador",
      step2Pre: "",
      step2Post: "",
      step3Pre: "",
      step3Post: "",
      step4Pre: "",
      step4Post: "",
      step1: "Toque no menu (⋮) do navegador",
      step2: 'Escolha "Instalar app" ou "Adicionar à tela inicial"',
      step3: 'Confirme tocando em "Instalar"',
      step4: "",
    },
  },
};

// ── Top notification banner ─────────────────────────────────────────────────
export function InstallBanner({ onOpenPrompt }: { onOpenPrompt: () => void }) {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const d = detectDevice();
    setDevice(d);
    if (d.isStandalone) return;
    const dismissedAt = Number(localStorage.getItem(BANNER_DISMISSED_KEY) ?? 0);
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    if (dismissedAt && daysSince < DISMISS_DAYS) return;
    setVisible(true);
  }, []);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(BANNER_DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!device || device.isStandalone || !visible) return null;
  const c = content[lang].banner;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="fixed inset-x-0 top-0 z-[55] flex justify-center px-3 pt-3"
      >
        <div
          className="w-full max-w-md md:max-w-lg rounded-2xl border-t-[3px] border-olive bg-cream px-4 py-3"
          style={{ boxShadow: "0 8px 28px -8px rgba(139,94,60,0.35)" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-highlight text-earth">
              <Info className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-tight text-foreground">{c.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{c.body}</p>
            </div>
            <button
              onClick={dismiss}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-highlight/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={onOpenPrompt}
            className="mt-3 w-full rounded-xl bg-gradient-primary py-2.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-soft transition-all hover:opacity-95 active:scale-[0.98]"
          >
            {c.cta}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Install Prompt Modal ────────────────────────────────────────────────────
export function InstallPrompt({
  forceOpen,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [animStep, setAnimStep] = useState(0);
  const nativeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const d = detectDevice();
    setDevice(d);
    if (d.isStandalone) return;
    if (forceOpen) {
      setOpen(true);
      return;
    }
    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) ?? 0);
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    if (dismissedAt && daysSince < DISMISS_DAYS) return;
    const t = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(t);
  }, [forceOpen]);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  useEffect(() => {
    if (!open) return;
    const cycle = device?.os === "ios" ? 4 : 2;
    const id = setInterval(() => setAnimStep((s) => (s + 1) % cycle), 2000);
    return () => clearInterval(id);
  }, [open, device?.os]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const triggerNativeInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
      setOpen(false);
      onClose?.();
    }
    deferredPrompt = null;
  }, [onClose]);

  if (!device || device.isStandalone) return null;
  const c = content[lang];
  const isIOS = device.os === "ios";
  const steps = isIOS ? c.ios : c.android;
  const canNativeInstall = device.os === "android" && deferredPrompt !== null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-earth/60 backdrop-blur-sm p-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden rounded-3xl border-t-[3px] border-olive bg-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-highlight text-earth hover:bg-highlight/70"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pt-6 pb-7">
              {/* Header */}
              <h2 className="font-serif text-xl md:text-2xl leading-tight text-foreground pr-10">
                {c.title}
              </h2>
              <p className="mt-2 text-[13px] md:text-sm leading-snug text-muted-foreground">
                {c.subtitle}
              </p>

              {/* Phone mockup */}
              <div className="mt-5 flex justify-center">
                <PhoneMockup animStep={animStep} isIOS={isIOS} labels={steps} />
              </div>

              {/* Step instructions */}
              <div className="mt-5 rounded-2xl bg-highlight/40 border border-border/40 p-4 space-y-3">
                {isIOS ? (
                  <>
                    <Step n={1} active={animStep === 0}>
                      <span className="text-[13px] md:text-sm text-foreground">
                        {steps.step1Pre}{" "}
                        <Chip>
                          <MoreHorizontal className="h-3.5 w-3.5 text-olive" />
                        </Chip>
                      </span>
                    </Step>
                    <Step n={2} active={animStep === 1}>
                      <span className="text-[13px] md:text-sm text-foreground">
                        {steps.step2Pre}{" "}
                        <Chip>
                          <Share className="h-3 w-3 text-olive" />
                          <span className="text-[11px] font-medium text-earth">
                            {steps.step2Post}
                          </span>
                        </Chip>
                      </span>
                    </Step>
                    <Step n={3} active={animStep === 2}>
                      <span className="text-[13px] md:text-sm text-foreground">
                        {steps.step3Pre}{" "}
                        <Chip>
                          <span className="text-[11px] font-medium text-earth">
                            {steps.step3Post}
                          </span>
                          <ChevronDown className="h-3 w-3 text-olive" />
                        </Chip>
                      </span>
                    </Step>
                    <Step n={4} active={animStep === 3}>
                      <span className="text-[13px] md:text-sm text-foreground">
                        {steps.step4Pre}{" "}
                        <Chip highlighted>
                          <Plus className="h-3 w-3 text-primary-foreground" />
                          <span className="text-[11px] font-medium text-primary-foreground">
                            {steps.step4Post}
                          </span>
                        </Chip>
                      </span>
                    </Step>
                  </>
                ) : (
                  <>
                    <Step n={1}>
                      <span className="text-[13px] md:text-sm text-foreground">
                        {steps.step1Pre}{" "}
                        <Chip>
                          <MoreVertical className="h-3.5 w-3.5 text-olive" />
                          <span className="text-[11px] font-medium text-earth">
                            {steps.step1Post}
                          </span>
                        </Chip>
                      </span>
                    </Step>
                    <Step n={2}>
                      <span className="text-[13px] md:text-sm text-foreground">{steps.step2}</span>
                    </Step>
                    <Step n={3}>
                      <span className="text-[13px] md:text-sm text-foreground">{steps.step3}</span>
                    </Step>
                  </>
                )}
              </div>

              {/* Native Android Install button (only when supported) */}
              {canNativeInstall && (
                <button
                  ref={nativeBtnRef}
                  onClick={triggerNativeInstall}
                  className="mt-5 w-full rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all active:scale-[0.98]"
                >
                  {c.nativeCta}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Step({ n, children, active }: { n: number; children: React.ReactNode; active?: boolean }) {
  // active=undefined → no dimming (Android default). Only iOS passes explicit bool.
  const dimmed = active === false;
  return (
    <motion.div
      className="flex items-start gap-3"
      animate={dimmed ? { opacity: 0.55 } : { opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.span
        animate={active === true ? { scale: 1.12 } : { scale: 1 }}
        transition={{ duration: 0.35 }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-bold text-[11px] text-primary-foreground"
      >
        {n}
      </motion.span>
      <div className="flex-1 pt-0.5">{children}</div>
    </motion.div>
  );
}

function Chip({ children, highlighted }: { children: React.ReactNode; highlighted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 align-middle border ${
        highlighted ? "bg-gradient-primary border-olive/60" : "bg-highlight border-border/50"
      }`}
    >
      {children}
    </span>
  );
}

function PhoneMockup({
  animStep,
  isIOS,
  labels,
}: {
  animStep: number;
  isIOS: boolean;
  labels: {
    menuShare: string;
    menuCopy: string;
    menuAdd: string;
    menuFav: string;
    menuMore: string;
  };
}) {
  return (
    <div
      className="relative w-[230px] h-[400px] md:w-[260px] md:h-[450px] rounded-[36px] border-[3px] border-earth/30 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FFFDF8 0%, #EFE7DD 100%)",
        boxShadow: "0 0 30px rgba(107,142,35,0.12)",
      }}
    >
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-earth/80 z-10" />

      {/* App icon with olive-green glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 12px rgba(107,142,35,0.35))",
              "drop-shadow(0 0 22px rgba(107,142,35,0.55))",
              "drop-shadow(0 0 12px rgba(107,142,35,0.35))",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl"
        >
          <BrandIcon size={60} className="rounded-2xl" />
        </motion.div>
      </div>

      {isIOS ? (
        <PhoneIOSAnim animStep={animStep} labels={labels} />
      ) : (
        <PhoneAndroidAnim animStep={animStep} labels={labels} />
      )}
    </div>
  );
}

// ── iOS 4-step anim: Safari bar → small "···" menu → Share sheet → Expanded ─
function PhoneIOSAnim({
  animStep,
  labels,
}: {
  animStep: number;
  labels: {
    menuShare: string;
    menuCopy: string;
    menuAdd: string;
    menuFav: string;
    menuMore: string;
  };
}) {
  return (
    <AnimatePresence mode="wait">
      {/* STATE 0 — Safari bottom toolbar with "···" pulsing on the right */}
      {animStep === 0 && (
        <motion.div
          key="safari-bar"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-3 inset-x-3"
        >
          <div className="flex items-center gap-1.5 rounded-full bg-stone-300/40 backdrop-blur px-2 py-1.5">
            <div className="h-5 w-5 flex items-center justify-center text-earth/50">‹</div>
            <div className="flex-1 rounded-full bg-cream/80 px-2 py-1 text-center text-[8px] text-earth/70 truncate">
              ●●●●●
            </div>
            <div className="h-5 w-5 flex items-center justify-center text-earth/50 text-[10px]">
              ⟳
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(107,142,35,0.6)",
                  "0 0 0 10px rgba(107,142,35,0)",
                  "0 0 0 0 rgba(107,142,35,0)",
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary"
            >
              <MoreHorizontal className="h-3.5 w-3.5 text-primary-foreground" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* STATE 1 — small "···" popover with "Compartilhar" pulsing */}
      {animStep === 1 && (
        <motion.div
          key="dots-menu"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="absolute bottom-3 right-3 w-[55%]"
        >
          <div
            className="rounded-2xl bg-cream/97 backdrop-blur p-1 border border-border/60"
            style={{ boxShadow: "0 -8px 24px rgba(139,94,60,0.22)" }}
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <MenuItem
                label={labels.menuShare}
                icon={<Share className="h-3 w-3 text-primary-foreground" />}
                highlighted
              />
            </motion.div>
            <MenuItem label={labels.menuCopy} icon="□" />
            <MenuItem label={labels.menuFav} icon="☆" />
          </div>
        </motion.div>
      )}

      {/* STATE 2 — full Share Sheet with "Ver Mais" pulsing at the bottom */}
      {animStep === 2 && (
        <motion.div
          key="share-sheet"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="absolute bottom-0 inset-x-2 rounded-t-2xl bg-cream/97 backdrop-blur p-2 border-t border-x border-border/60"
          style={{ boxShadow: "0 -8px 24px rgba(139,94,60,0.22)" }}
        >
          <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-earth/30" />
          {/* Top row: brand icon + title + URL */}
          <div className="flex items-center gap-2 px-1">
            <div className="h-7 w-7 rounded-md overflow-hidden shrink-0">
              <BrandIcon size={28} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[8px] font-semibold text-foreground">Método A. Bíblica</p>
            </div>
          </div>
          {/* App suggestions row */}
          <div className="mt-2 flex gap-1.5 px-1 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-6 rounded-full bg-stone-300/50 shrink-0" />
            ))}
          </div>
          {/* Action icons row */}
          <div className="mt-2 flex gap-1.5 px-1 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 w-5 rounded-md bg-stone-300/50 shrink-0" />
            ))}
          </div>
          {/* Pulsing "Ver Mais" w/ chevron at the bottom */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2 flex items-center justify-between rounded-lg bg-gradient-primary px-2 py-1.5"
          >
            <span className="text-[9px] font-semibold text-primary-foreground">
              {labels.menuMore}
            </span>
            <ChevronDown className="h-3 w-3 text-primary-foreground" />
          </motion.div>
        </motion.div>
      )}

      {/* STATE 3 — Expanded menu w/ "Adicionar à Tela de Início" pulsing */}
      {animStep === 3 && (
        <motion.div
          key="expanded-menu"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-0 inset-x-2 rounded-t-2xl bg-cream/97 backdrop-blur p-2 border-t border-x border-border/60"
          style={{ boxShadow: "0 -8px 24px rgba(139,94,60,0.22)" }}
        >
          <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-earth/30" />
          <div className="space-y-0.5">
            <MenuItem label={labels.menuCopy} icon="□" />
            <MenuItem label={labels.menuFav} icon="☆" />
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <MenuItem
                label={labels.menuAdd}
                icon={<Plus className="h-3 w-3 text-primary-foreground" />}
                highlighted
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Android 2-step animation (browser menu → install option) ────────────────
function PhoneAndroidAnim({
  animStep,
  labels,
}: {
  animStep: number;
  labels: { menuShare: string; menuCopy: string; menuAdd: string; menuFav: string };
}) {
  return (
    <AnimatePresence mode="wait">
      {animStep < 2 ? (
        <motion.div
          key="menu-btn"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-3 right-3"
        >
          <motion.div
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary"
          >
            <MoreVertical className="h-3.5 w-3.5 text-primary-foreground" />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="install-menu"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[82%]"
        >
          <div className="rounded-2xl bg-cream/95 backdrop-blur p-2 border border-border/60">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-earth/30" />
            <MenuItem label={labels.menuCopy} icon="□" />
            <MenuItem
              label={labels.menuAdd}
              icon={<Plus className="h-3 w-3 text-primary-foreground" />}
              highlighted
            />
            <MenuItem label={labels.menuFav} icon="□" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuItem({
  label,
  icon,
  highlighted,
}: {
  label: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-2.5 py-2 my-0.5 ${
        highlighted ? "bg-gradient-primary" : "bg-transparent"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded text-[10px] ${
          highlighted
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "text-earth/60 border border-earth/30"
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-[10px] md:text-[11px] font-semibold ${
          highlighted ? "text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export { InstallPrompt as default };
