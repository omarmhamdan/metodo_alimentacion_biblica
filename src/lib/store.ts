import { useEffect, useState, useMemo } from "react";
import { getLang, setLang as setLangStorage, type Lang, T } from "./i18n";
import { getUnits, setUnits as setUnitsStorage, type Units } from "./units";
import { getRecipesLang, type Receita } from "./recipes";
import { initImages, isImagesReady, getCachedImages } from "./image-store";
import { upsertProfile, upsertDaily } from "./sync";
import { clearEntitlements } from "./entitlements";

export interface UserProfile {
  nome: string;
  email?: string;
  idade?: number;
  pesoAtual?: number;
  objetivo?: string;
  energia?: number;
  aguaMeta?: number;
  oracao?: string;
  restricoes?: string;
  onboarded?: boolean;
  createdAt?: string;
  notifications?: { morning: boolean; afternoon: boolean; devotional: boolean };
}

export interface DailyState {
  date: string;
  aguaMl: number;
  sucoTomado: boolean;
  jornadaDia: number;
  /** Highest journey day the user ever reached. Lets them freely move back and
   *  forth between day 1 and this peak without ever advancing past where they
   *  actually got. Always >= jornadaDia. */
  jornadaDiaMax: number;
  sequencia: number;
  ultimaReceita?: string;
  favoritos: string[];
  pesoHistorico: { date: string; peso: number }[];
  energiaHistorico: { date: string; valor: number }[];
}

const today = () => new Date().toISOString().slice(0, 10);

const KEY_USER = "mab:user";
const KEY_DAILY = "mab:daily";
const KEY_USERS_BY_EMAIL = "mab:users"; // Record<email, { user, daily }>

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("mab:storage", { detail: k }));
}

// ── Per-email user store ─────────────────────────────────────────────────────
// Persists each user's profile + daily snapshot keyed by email so the same
// person who logs out and back in (or who installs the PWA after onboarding)
// gets all of their data restored instead of becoming a "visitor" again.

type UsersByEmail = Record<string, { user: UserProfile; daily?: DailyState }>;

function readUsersByEmail(): UsersByEmail {
  return read<UsersByEmail>(KEY_USERS_BY_EMAIL, {});
}

function writeUsersByEmail(m: UsersByEmail) {
  write(KEY_USERS_BY_EMAIL, m);
}

function normalizeEmail(e: string | undefined): string {
  return (e ?? "").trim().toLowerCase();
}

/** Look up a previously-saved profile by email. Returns null if not found. */
export function findUserByEmail(email: string): { user: UserProfile; daily?: DailyState } | null {
  const key = normalizeEmail(email);
  if (!key) return null;
  return readUsersByEmail()[key] ?? null;
}

/** Snapshot current user/daily into the by-email store. */
function snapshotByEmail(u: UserProfile, daily?: DailyState) {
  const key = normalizeEmail(u.email);
  if (!key) return;
  const all = readUsersByEmail();
  all[key] = { user: u, daily: daily ?? read<DailyState | undefined>(KEY_DAILY, undefined) };
  writeUsersByEmail(all);
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(() =>
    read<UserProfile | null>(KEY_USER, null),
  );
  useEffect(() => {
    const sync = () => setUser(read<UserProfile | null>(KEY_USER, null));
    window.addEventListener("mab:storage", sync);
    return () => window.removeEventListener("mab:storage", sync);
  }, []);
  const save = (u: UserProfile | null) => {
    if (u) {
      write(KEY_USER, u);
      // Persist to by-email store + cloud
      snapshotByEmail(u);
      const daily = read<DailyState | undefined>(KEY_DAILY, undefined);
      upsertProfile(u, daily).catch(() => {});
    } else if (typeof window !== "undefined") {
      // Logout: snapshot under previous email + push to cloud first, then clear
      const prev = read<UserProfile | null>(KEY_USER, null);
      const daily = read<DailyState | undefined>(KEY_DAILY, undefined);
      if (prev?.email) {
        snapshotByEmail(prev, daily);
        upsertProfile(prev, daily).catch(() => {});
      }
      localStorage.removeItem(KEY_USER);
      clearEntitlements(); // don't leak upsell access to the next login on this device
    }
    setUser(u);
  };
  return { user, save };
}

const defaultDaily = (): DailyState => ({
  date: today(),
  aguaMl: 0,
  sucoTomado: false,
  jornadaDia: 1,
  jornadaDiaMax: 1,
  sequencia: 1,
  favoritos: [],
  pesoHistorico: [],
  energiaHistorico: [],
});

// Load daily from storage, ALWAYS merged over defaults so array fields
// (favoritos, pesoHistorico, energiaHistorico) are never undefined — a partial
// daily (e.g. cloud-synced JSON missing fields) used to crash .includes/.map.
const loadDaily = (): DailyState => {
  const d: DailyState = {
    ...defaultDaily(),
    ...read<Partial<DailyState>>(KEY_DAILY, {}),
  };
  // Backfill the peak for users saved before this field existed: it must never
  // be lower than the day they're currently on.
  d.jornadaDiaMax = Math.max(d.jornadaDiaMax ?? 0, d.jornadaDia ?? 1, 1);
  return d;
};

// Difference in whole days between two "YYYY-MM-DD" dates (timezone-safe).
function daysBetween(prev: string, curr: string): number {
  const a = new Date(prev + "T00:00:00").getTime();
  const b = new Date(curr + "T00:00:00").getTime();
  return Math.round((b - a) / 86_400_000);
}

export function useDaily() {
  const [daily, setDaily] = useState<DailyState>(() => {
    const d = loadDaily();
    if (d.date !== today()) {
      const gap = daysBetween(d.date, today());
      // gap === 1 (consecutive day) → streak continues; otherwise → reset to 1
      const newStreak = gap === 1 ? (d.sequencia ?? 0) + 1 : 1;
      const newDay = (d.jornadaDia ?? 0) + 1;
      const nd: DailyState = {
        ...d,
        date: today(),
        aguaMl: 0,
        sucoTomado: false,
        jornadaDia: newDay,
        jornadaDiaMax: Math.max(d.jornadaDiaMax ?? 0, newDay),
        sequencia: newStreak,
      };
      write(KEY_DAILY, nd);
      return nd;
    }
    return d;
  });

  useEffect(() => {
    const sync = () => setDaily(loadDaily());
    window.addEventListener("mab:storage", sync);
    return () => window.removeEventListener("mab:storage", sync);
  }, []);

  const update = (patch: Partial<DailyState>) => {
    const next = { ...daily, ...patch };
    write(KEY_DAILY, next);
    setDaily(next);
    // Cloud sync (best-effort, debounced via microtask coalescing)
    const u = read<UserProfile | null>(KEY_USER, null);
    if (u?.email) upsertDaily(u.email, next).catch(() => {});
  };

  const toggleFavorito = (id: string) => {
    const set = new Set(daily.favoritos);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    update({ favoritos: Array.from(set) });
  };

  return { daily, update, toggleFavorito };
}

// ── Language hook ─────────────────────────────────────────────────────────────
export function useLang() {
  // Initial state must match the server's SSR default ("es") exactly, never read
  // localStorage here — doing so makes the client's first render diverge from
  // the server-rendered HTML and React throws a hydration error. The real
  // stored value is applied in the effect below, which only runs after hydration.
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    setLangState(getLang());
    const sync = () => setLangState(getLang());
    window.addEventListener("mab:lang", sync);
    return () => window.removeEventListener("mab:lang", sync);
  }, []);

  const setLang = (l: Lang) => {
    setLangStorage(l);
    setLangState(l);
  };

  const t = (key: keyof typeof T.es): string => T[lang][key] as string;

  return { lang, setLang, t };
}

// ── Units hook ─────────────────────────────────────────────────────────────
export function useUnits() {
  // Same hydration-safety rule as useLang above: initial state must match the
  // server's SSR default ("metric"), the real value is synced post-hydration.
  const [units, setUnitsState] = useState<Units>("metric");

  useEffect(() => {
    setUnitsState(getUnits());
    const sync = () => setUnitsState(getUnits());
    window.addEventListener("mab:units", sync);
    return () => window.removeEventListener("mab:units", sync);
  }, []);

  const setUnits = (u: Units) => {
    setUnitsStorage(u);
    setUnitsState(u);
  };

  return { units, setUnits };
}

/** Resolve a set of image ids → URL, falling back to bundled stock assets.
 *  Reactive to admin uploads (cloud/IDB) via the `mab:images` events.
 *  Pass a STABLE (module-level) fallbacks object to keep the effect stable. */
export function useStoredImageMap(fallbacks: Record<string, string>): Record<string, string> {
  const resolve = () => {
    const cache = getCachedImages();
    const out: Record<string, string> = {};
    for (const id in fallbacks) out[id] = cache[id] ?? fallbacks[id];
    return out;
  };
  const [imgs, setImgs] = useState<Record<string, string>>(resolve);
  useEffect(() => {
    const fn = () => setImgs(resolve());
    fn();
    window.addEventListener("mab:images", fn);
    window.addEventListener("mab:images-ready", fn);
    initImages();
    return () => {
      window.removeEventListener("mab:images", fn);
      window.removeEventListener("mab:images-ready", fn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallbacks]);
  return imgs;
}

/** True once the IndexedDB image cache is populated. Components can use this
 *  to avoid showing the default stock photo for ~1s before the user upload swaps in. */
export function useImagesReady(): boolean {
  const [ready, setReady] = useState<boolean>(() => isImagesReady());
  useEffect(() => {
    if (isImagesReady()) {
      setReady(true);
      return;
    }
    const fn = () => setReady(true);
    window.addEventListener("mab:images-ready", fn);
    // Safety: if init hasn't been kicked off yet, do it now
    initImages();
    return () => window.removeEventListener("mab:images-ready", fn);
  }, []);
  return ready;
}

// ── Recipes hook (reactive to lang + admin overrides + IDB images) ───────────
export function useRecipes(): Receita[] {
  const { lang } = useLang();
  const [list, setList] = useState<Receita[]>(() => getRecipesLang(lang));

  // Load IDB images into cache on first mount, then rebuild
  useEffect(() => {
    initImages().then(() => setList(getRecipesLang(getLang())));
  }, []);

  // Re-compute when language changes
  useEffect(() => {
    setList(getRecipesLang(lang));
  }, [lang]);

  // Re-compute when admin saves text overrides or uploads/deletes images
  useEffect(() => {
    const fn = () => setList(getRecipesLang(getLang()));
    window.addEventListener("mab:overrides", fn);
    window.addEventListener("mab:images", fn);
    return () => {
      window.removeEventListener("mab:overrides", fn);
      window.removeEventListener("mab:images", fn);
    };
  }, []);

  return list;
}

// Devocional do dia (dataset único bilíngue) — ver src/lib/devocional.ts
export { versiculoDoDia, devocionais, type Devocional } from "./devocional";
