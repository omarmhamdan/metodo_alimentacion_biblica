import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, ChefHat, HeartHandshake, User, Sparkles, Utensils } from "lucide-react";
import { useLang } from "@/lib/store";

export function BottomNav() {
  const loc = useLocation();
  const { t } = useLang();

  const items = [
    { to: "/dashboard", label: t("nav_inicio"), icon: Home },
    { to: "/receitas", label: t("nav_recetas"), icon: ChefHat },
    { to: "/protocolo", label: t("nav_protocolo"), icon: Sparkles },
    { to: "/mesa-unica", label: t("nav_mesa_unica"), icon: Utensils },
    { to: "/fundamentos", label: t("nav_mesa"), icon: BookOpen },
    { to: "/devocional", label: t("nav_devocion"), icon: HeartHandshake },
    { to: "/perfil", label: t("nav_perfil"), icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-cream/85 backdrop-blur-xl lg:hidden">
      <ul className="mx-auto flex max-w-3xl items-stretch justify-between px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to || loc.pathname.startsWith(to + "/");
          const small = to === "/protocolo" || to === "/mesa-unica"; // nome longo: 2 linhas
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="group flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[11px] transition-colors"
              >
                <span
                  className={`flex h-9 w-11 items-center justify-center rounded-full transition-all ${
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <span
                  className={`text-center ${small ? "line-clamp-2 leading-[1.1]" : "whitespace-nowrap"} ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
