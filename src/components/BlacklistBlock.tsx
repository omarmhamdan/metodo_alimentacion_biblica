// Bloqueio de acesso por reembolso do produto principal.
// Mostrado quando o email do lead está na blacklist (pediu cancelamento/reembolso).
// Tela vermelha de erro + botão pra finalizar a compra de novo.

import { ShieldAlert, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/store";

// Checkout do "Método Alimentación Bíblica" (produto principal).
export const REBUY_CHECKOUT_URL = "https://pay.hotmart.com/E106250747Q?checkoutMode=10";

const COPY = {
  pt: {
    badge: "Acesso bloqueado",
    title: "Seu acesso foi bloqueado",
    body: "Identificamos um pedido de reembolso feito por você. Por isso, o acesso ao material está bloqueado.",
    cta_intro: "Quer liberar seu acesso novamente? Clique no botão abaixo e finalize sua compra.",
    cta: "Finalizar compra e liberar acesso",
  },
  es: {
    badge: "Acceso bloqueado",
    title: "Tu acceso fue bloqueado",
    body: "Identificamos una solicitud de reembolso hecha por ti. Por eso, el acceso al material está bloqueado.",
    cta_intro: "¿Quieres recuperar tu acceso? Haz clic en el botón de abajo y finaliza tu compra.",
    cta: "Finalizar compra y liberar acceso",
  },
};

export function BlacklistBlock() {
  const { lang } = useLang();
  const t = COPY[lang];
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-12">
      <div className="w-full rounded-3xl border-2 border-red-500/40 bg-red-500/5 p-6 text-center shadow-card">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600">
          {t.badge}
        </p>
        <h1 className="mt-1 font-serif text-2xl leading-tight text-red-700 text-balance">
          {t.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-red-700/90">{t.body}</p>
      </div>

      <p className="mt-6 px-2 text-center text-sm text-muted-foreground">{t.cta_intro}</p>

      <a
        href={REBUY_CHECKOUT_URL}
        target="_blank"
        rel="noopener"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-5 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
      >
        {t.cta} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
