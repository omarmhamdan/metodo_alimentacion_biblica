import { ReactNode, useState, useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import { InstallPrompt, InstallBanner } from "./InstallPrompt";
import { EditModeBar } from "./Editable";
import { useLang, useUser } from "@/lib/store";
import { initTextOverrides } from "@/lib/edit-store";
import { initEntitlements } from "@/lib/entitlements";

/**
 * Responsive strategy:
 *  • Mobile (<768px):                full-width, bottom nav
 *  • Tablet portrait (768-1023px):   full-width content w/ generous padding, bottom nav
 *  • Tablet landscape & desktop (≥1024px):  side nav (left) + flexible content
 *
 *  Inner page components use responsive grids (grid-cols-2 md:grid-cols-3 lg:grid-cols-4)
 *  so cards expand naturally to use the available space.
 */
export function AppShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const { lang, setLang } = useLang();
  const { user } = useUser();
  const [forceInstall, setForceInstall] = useState(false);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Load inline-edit text overrides (cloud + local) once on mount
  useEffect(() => {
    initTextOverrides();
  }, []);

  // Load purchase entitlements for the logged-in email (per-product paywall)
  useEffect(() => {
    initEntitlements(user?.email);
  }, [user?.email]);

  // PWA: serve the per-language manifest + update the iOS "Add to Home Screen" name
  useEffect(() => {
    const appTitle = lang === "es" ? "Método Alimentación Bíblica" : "Método Alimentação Bíblica";
    const manifestHref = lang === "es" ? "/manifest-es.json" : "/manifest-pt.json";

    // Switch manifest link
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "manifest";
      document.head.appendChild(link);
    }
    link.href = manifestHref;

    // Update iOS home-screen title
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("apple-mobile-web-app-title", appTitle);
    setMeta("application-name", appTitle);
    document.documentElement.lang = lang;
    // Keep document.title aligned — iOS Safari can use it for the home-screen label
    document.title = appTitle;
  }, [lang]);

  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className={isWide ? "flex" : ""}>
        {/* Side nav (desktop + large tablet landscape) */}
        {isWide && !hideNav && <SideNav />}

        {/* Main content area */}
        <div
          className={[
            "relative flex-1 min-h-screen",
            // Padding adapts to screen size
            "px-0",
            // Constrain reading width on very wide screens for legibility
            isWide ? "max-w-[1400px] mx-auto" : "",
          ].join(" ")}
        >
          {/* Language toggle (top-right) */}
          <button
            onClick={() => setLang(lang === "es" ? "pt" : "es")}
            className="absolute right-4 top-4 z-50 flex h-8 items-center gap-1.5 rounded-full bg-cream/90 px-3 text-[11px] font-medium text-earth shadow-card backdrop-blur border border-border/40"
            aria-label="Cambiar idioma / Trocar idioma"
          >
            <span className="text-sm">{lang === "es" ? "🇨🇴" : "🇧🇷"}</span>
            <span>{lang === "es" ? "ES" : "PT"}</span>
          </button>

          <main className={isWide ? "pb-10" : "pb-28"}>{children}</main>

          {/* Bottom nav only on mobile + small tablet */}
          {!isWide && !hideNav && <BottomNav />}
        </div>
      </div>

      {/* Install banner (top) + popup modal */}
      <InstallBanner onOpenPrompt={() => setForceInstall(true)} />
      <InstallPrompt forceOpen={forceInstall} onClose={() => setForceInstall(false)} />

      {/* Admin inline-edit mode bar */}
      <EditModeBar />
    </div>
  );
}
