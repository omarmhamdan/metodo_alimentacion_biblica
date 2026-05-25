// IndexedDB storage for recipe photos.
// localStorage is capped at ~5 MB by the browser; IndexedDB has no practical limit.
// Images are kept in an in-memory cache so the rest of the app can read them synchronously.

const DB_NAME = "mab_imgs";
const STORE = "photos";

let _cache: Record<string, string> = {};
let _ready = false;
let _readyPromise: Promise<void> | null = null;

export function isImagesReady(): boolean {
  return _ready;
}

/** Returns a promise that resolves once IDB images are loaded into cache. */
export function waitImagesReady(): Promise<void> {
  if (_ready) return Promise.resolve();
  if (!_readyPromise) _readyPromise = initImages();
  return _readyPromise;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

/** Load all stored images into the in-memory cache. Call once at app startup. */
export async function initImages(): Promise<void> {
  if (typeof indexedDB === "undefined") {
    _ready = true;
    return;
  }
  try {
    // Fast path — root.tsx bootstrap may have pre-warmed the cache before React mounted
    const prewarm = (window as Window & { __MAB_IMG_PREWARM__?: Record<string, string> })
      .__MAB_IMG_PREWARM__;
    if (prewarm && Object.keys(prewarm).length) {
      _cache = prewarm;
      _ready = true;
      window.dispatchEvent(new CustomEvent("mab:images-ready"));
    }

    await migrateFromLocalStorage();
    const db = await openDB();
    const result: Record<string, string> = {};
    await new Promise<void>((res, rej) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) {
          result[c.key as string] = c.value as string;
          c.continue();
        } else res();
      };
      req.onerror = () => rej(req.error);
    });
    _cache = { ..._cache, ...result };

    // Pull GLOBAL cloud photos. Cloud is authoritative — it OVERWRITES the
    // local cache for every recipe_id the cloud knows about. Also purges any
    // stale legacy data: URLs from IDB so they don't shadow the cloud URLs.
    try {
      const { fetchRecipePhotos } = await import("./sync");
      const cloud = await fetchRecipePhotos();
      console.log(`[ImageStore] cloud returned ${Object.keys(cloud).length} photo URLs`);
      if (Object.keys(cloud).length) {
        // 1) Purge legacy data: URLs from IDB — they can shadow real cloud URLs
        for (const [id, value] of Object.entries(_cache)) {
          if (typeof value === "string" && value.startsWith("data:")) {
            delete _cache[id];
            deleteImage(id).catch(() => {});
          }
        }
        // 2) Cloud always wins
        _cache = { ..._cache, ...cloud };
        // 3) Persist to IDB for fast next-load
        for (const [id, url] of Object.entries(cloud)) saveImage(id, url).catch(() => {});
        window.dispatchEvent(new CustomEvent("mab:images"));
      }
    } catch (e) {
      console.warn("[ImageStore] cloud fetch failed", e);
    }
  } catch (e) {
    console.warn("[ImageStore] init failed", e);
  } finally {
    _ready = true;
    window.dispatchEvent(new CustomEvent("mab:images-ready"));
  }
}

// Refresh photos when window regains focus (catches admin uploads on other devices)
if (typeof window !== "undefined") {
  let lastRefresh = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    if (Date.now() - lastRefresh < 30_000) return; // throttle 30s
    lastRefresh = Date.now();
    import("./sync").then(({ fetchRecipePhotos }) => {
      fetchRecipePhotos().then((cloud) => {
        if (!Object.keys(cloud).length) return;
        // Purge stale data: URLs first, then merge cloud
        for (const [id, value] of Object.entries(_cache)) {
          if (typeof value === "string" && value.startsWith("data:")) {
            delete _cache[id];
            deleteImage(id).catch(() => {});
          }
        }
        _cache = { ..._cache, ...cloud };
        for (const [id, url] of Object.entries(cloud)) saveImage(id, url).catch(() => {});
        window.dispatchEvent(new CustomEvent("mab:images"));
      });
    });
  });
}

/** One-time migration: moves base64 images from localStorage overrides → IndexedDB. */
async function migrateFromLocalStorage(): Promise<void> {
  try {
    const raw = localStorage.getItem("mab:content_overrides");
    if (!raw) return;
    const overrides = JSON.parse(raw);
    const recipes: Record<string, { imagem?: string }> = overrides?.recipes ?? {};
    let migrated = false;
    const db = await openDB();
    for (const [id, ov] of Object.entries(recipes)) {
      if (ov.imagem?.startsWith("data:")) {
        // Move to IDB
        await new Promise<void>((res, rej) => {
          const tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).put(ov.imagem, id);
          tx.oncomplete = () => res();
          tx.onerror = () => rej(tx.error);
        });
        // Strip from localStorage payload
        delete ov.imagem;
        migrated = true;
        console.log(`[ImageStore] migrated ${id} from localStorage → IDB`);
      }
    }
    if (migrated) {
      localStorage.setItem("mab:content_overrides", JSON.stringify(overrides));
    }
  } catch (e) {
    console.warn("[ImageStore] migration failed", e);
  }
}

/** Synchronous read — only valid after initImages() has resolved. */
export function getCachedImages(): Record<string, string> {
  return _cache;
}

export async function saveImage(id: string, dataUrl: string): Promise<void> {
  _cache[id] = dataUrl;
  window.dispatchEvent(new CustomEvent("mab:images"));
  try {
    const db = await openDB();
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(dataUrl, id);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (e) {
    console.error("[ImageStore] save failed", e);
  }
}

export async function deleteImage(id: string): Promise<void> {
  delete _cache[id];
  window.dispatchEvent(new CustomEvent("mab:images"));
  try {
    const db = await openDB();
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (e) {
    console.error("[ImageStore] delete failed", e);
  }
}

/** Bulk-merge cloud photo URLs into the local cache (called after login). */
export function mergeCloudImages(urls: Record<string, string>): void {
  for (const [id, url] of Object.entries(urls)) {
    if (!url) continue;
    _cache[id] = url;
    // Persist URL to IDB so it survives reload without another network hop
    saveImage(id, url).catch(() => {});
  }
  if (Object.keys(urls).length) window.dispatchEvent(new CustomEvent("mab:images"));
}

export async function clearImages(): Promise<void> {
  _cache = {};
  window.dispatchEvent(new CustomEvent("mab:images"));
  try {
    const db = await openDB();
    await new Promise<void>((res, rej) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (e) {
    console.error("[ImageStore] clear failed", e);
  }
}
