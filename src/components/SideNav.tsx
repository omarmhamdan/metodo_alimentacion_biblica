import { Link, useLocation } from "@tanstack/react-router";
import { Home, ChefHat, HeartHandshake, User, Sparkles, Utensils } from "lucide-react";
import { useLang } from "@/lib/store";
import { BrandIcon } from "./BrandIcon";

/** Vertical sidebar nav for desktop and large-tablet landscape (≥1024px). */
export function SideNav() {
  const loc = useLocation();
  const { t, lang } = useLang();

  const items = [
    { to: "/dashboard", label: t("nav_inicio"), icon: Home },
    { to: "/receitas", label: t("nav_recetas"), icon: ChefHat },
    { to: "/protocolo", label: t("nav_protocolo"), icon: Sparkles },
    { to: "/mesa-unica", label: t("nav_mesa_unica"), icon: Utensils },
    { to: "/devocional", label: t("nav_devocion"), icon: HeartHandshake },
    { to: "/perfil", label: t("nav_perfil"), icon: User },
  ] as const;

  return (
    <aside
      className="sticky top-0 h-screen w-60 shrink-0 border-r border-border/60 bg-cream/60 backdrop-blur-md py-8 px-5 flex flex-col"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <Link to="/dashboard" className="flex items-center gap-3 px-2 mb-8">
        <BrandIcon size={36} className="rounded-xl shadow-soft" />
        <div className="min-w-0">
          <p className="font-serif text-base leading-tight text-foreground truncate">
            {lang === "es" ? "Método" : "Método"}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground truncate">
            {lang === "es" ? "Alimentación Bíblica" : "Alimentação Bíblica"}
          </p>
        </div>
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to || loc.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-gradient-primary text-primary-foreground shadow-soft font-medium"
                  : "text-muted-foreground hover:bg-highlight hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              <span>{label.replace(/\n/g, "")}</span>
            </Link>
          );
        })}
      </nav>

      {/* Verse footer */}
      <p className="mt-auto px-2 font-serif italic text-[11px] leading-snug text-muted-foreground text-balance">
        {lang === "es"
          ? '"La mesa que Dios creó, al alcance de tu cocina."'
          : '"A mesa que Deus criou, ao alcance da sua cozinha."'}
      </p>
    </aside>
  );
}
