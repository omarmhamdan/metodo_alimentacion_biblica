import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#8B7355" },
      // title is set by the bootstrap script (per-language)
      {
        name: "description",
        content:
          "App devocional culinario con recetas bíblicas, hidratación y reconexión con Dios por la alimentación.",
      },
      // PWA / Add to Home Screen support
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      // apple-mobile-web-app-title and application-name are set by the inline
      // bootstrap script in RootShell (so iOS reads them before React mounts).
      // Open Graph
      { property: "og:title", content: "Método Alimentación Bíblica" },
      { property: "og:description", content: "La mesa que Dios creó, al alcance de tu cocina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      // iOS Safari needs PNG apple-touch-icons at multiple sizes (it ignores SVG)
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "apple-touch-icon", sizes: "167x167", href: "/apple-touch-icon-167.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-touch-icon-152.png" },
      { rel: "apple-touch-icon", sizes: "120x120", href: "/apple-touch-icon-120.png" },
      // Browser favicon
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Inline bootstrap that fires before React mounts. iOS Safari reads
// apple-mobile-web-app-title at page load time (it ignores later JS updates),
// so we MUST set it synchronously here based on the user's stored language.
const BOOTSTRAP_PWA_META = `
(function(){
  try {
    var lang = localStorage.getItem('mab:lang');
    if (lang !== 'pt' && lang !== 'es') {
      lang = 'es'; // first visit defaults to Spanish (primary audience)
    }
    var title = lang === 'pt' ? 'Método Alimentação Bíblica' : 'Método Alimentación Bíblica';
    document.documentElement.lang = lang;
    document.title = title;
    function setMeta(name, content) {
      var m = document.querySelector('meta[name="' + name + '"]');
      if (!m) { m = document.createElement('meta'); m.name = name; document.head.appendChild(m); }
      m.content = content;
    }
    setMeta('apple-mobile-web-app-title', title);
    setMeta('application-name', title);
    var link = document.querySelector('link[rel="manifest"]');
    if (!link) { link = document.createElement('link'); link.rel = 'manifest'; document.head.appendChild(link); }
    link.href = '/manifest-' + lang + '.json';
  } catch (e) {}

  // Pre-warm the IndexedDB image cache as early as possible so recipe lists
  // don't briefly flash stock photos before swapping to user uploads.
  try {
    var req = indexedDB.open('mab_imgs', 1);
    req.onupgradeneeded = function () {
      try { req.result.createObjectStore('photos'); } catch (e) {}
    };
    req.onsuccess = function () {
      var db = req.result;
      if (!db.objectStoreNames.contains('photos')) return;
      try {
        var cache = {};
        var cur = db.transaction('photos', 'readonly').objectStore('photos').openCursor();
        cur.onsuccess = function (e) {
          var c = e.target.result;
          if (c) { cache[c.key] = c.value; c.continue(); }
          else { window.__MAB_IMG_PREWARM__ = cache; }
        };
      } catch (e3) {}
    };
  } catch (e2) {}
})();
`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    // lang is set client-side by the bootstrap script based on the user's
    // language; the SSR default differs intentionally, so suppress the warning.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP_PWA_META }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
