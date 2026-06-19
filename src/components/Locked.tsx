// Gate de acesso pago. Envolve o conteúdo de um upsell.
// Liberado → mostra children. Bloqueado → tela de venda (pitch + checkout + restaurar).

import { useState } from "react";
import { Lock, Check, ArrowRight, RotateCcw } from "lucide-react";
import { useLang } from "@/lib/store";
import {
  useEntitlement,
  restoreByEmail,
  CHECKOUT_URLS,
  type Produto,
} from "@/lib/entitlements";

interface Pitch {
  titulo: string;
  subtitulo: string;
  bullets: string[];
  cta: string;
}

const PITCH: Record<Produto, { pt: Pitch; es: Pitch }> = {
  "anti-inflamacao": {
    pt: {
      titulo: "Anti-Inflamação 7 Dias",
      subtitulo: "O protocolo bíblico de 7 dias para desinchar, ganhar energia e destravar o corpo.",
      bullets: [
        "Cardápio dia a dia, do despertar à ceia",
        "Água do Jordão + Ritual de Drenagem (bônus secreto)",
        "Ciência de cada dia, lista de compras e guia de alimentos",
        "Acesso vitalício, no seu ritmo",
      ],
      cta: "Liberar acesso",
    },
    es: {
      titulo: "Antiinflamación 7 Días",
      subtitulo: "El protocolo bíblico de 7 días para desinflamar, ganar energía y destrabar el cuerpo.",
      bullets: [
        "Menú día a día, del despertar a la cena",
        "Agua del Jordán + Ritual de Drenaje (bono secreto)",
        "Ciencia de cada día, lista de compras y guía de alimentos",
        "Acceso de por vida, a tu ritmo",
      ],
      cta: "Liberar acceso",
    },
  },
  "mesa-unica": {
    pt: {
      titulo: "Guia Mesa Única",
      subtitulo: "Como a família inteira come bem sem desconfiar — uma só panela, zero brigas.",
      bullets: [
        "Receitas completas por categoria, com versão da família",
        "Truques de sabor e textura que enganam o paladar",
        "Mesa de Domingo + estratégias para as crianças",
        "Acesso vitalício, no seu ritmo",
      ],
      cta: "Liberar acesso",
    },
    es: {
      titulo: "Guía Mesa Única",
      subtitulo: "Cómo toda la familia come bien sin sospechar — una sola olla, cero peleas.",
      bullets: [
        "Recetas completas por categoría, con versión de la familia",
        "Trucos de sabor y textura que engañan al paladar",
        "Mesa de Domingo + estrategias para los niños",
        "Acceso de por vida, a tu ritmo",
      ],
      cta: "Liberar acceso",
    },
  },
};

const COPY = {
  pt: {
    locked: "Conteúdo bloqueado",
    haveBought: "Já comprei",
    restoreHint: "Digite o email usado na compra para liberar neste aparelho.",
    emailPh: "seu@email.com",
    restore: "Restaurar acesso",
    notFound: "Não encontramos uma compra ativa nesse email. Verifique ou aguarde alguns minutos após o pagamento.",
    found: "Acesso liberado! 🎉",
    foundOther: "Esse email tem acesso a outro produto, mas não a este. Se acha que é engano, fale com o suporte abaixo.",
    soon: "Checkout em breve. Fale com o suporte para liberar.",
    support: "Não funcionou? Mande um email para metodoalimentacionbiblica@gmail.com que liberamos seu acesso em poucos minutos.",
  },
  es: {
    locked: "Contenido bloqueado",
    haveBought: "Ya compré",
    restoreHint: "Escribe el email usado en la compra para liberar en este dispositivo.",
    emailPh: "tu@email.com",
    restore: "Restaurar acceso",
    notFound: "No encontramos una compra activa con ese email. Verifica o espera unos minutos tras el pago.",
    found: "¡Acceso liberado! 🎉",
    foundOther: "Ese email tiene acceso a otro producto, pero no a este. Si crees que es un error, contacta al soporte abajo.",
    soon: "Checkout próximamente. Habla con soporte para liberar.",
    support: "¿No funcionó? Escribe a metodoalimentacionbiblica@gmail.com y liberamos tu acceso en pocos minutos.",
  },
};

export function Locked({ product, children }: { product: Produto; children: React.ReactNode }) {
  const ok = useEntitlement(product);
  if (ok) return <>{children}</>;
  return <Paywall product={product} />;
}

function Paywall({ product }: { product: Produto }) {
  const { lang } = useLang();
  const p = PITCH[product][lang];
  const t = COPY[lang];
  const [showRestore, setShowRestore] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  // Store the message KIND (not the resolved string) so it follows language changes.
  const [msg, setMsg] = useState<{ ok: boolean; kind: "found" | "foundOther" | "notFound" | "soon" } | null>(
    null,
  );

  const checkout = () => {
    const url = CHECKOUT_URLS[product];
    if (url) window.open(url, "_blank", "noopener");
    else setMsg({ ok: false, kind: "soon" });
  };

  const restore = async () => {
    setBusy(true);
    setMsg(null);
    const granted = await restoreByEmail(email);
    setBusy(false);
    if (granted.includes(product)) setMsg({ ok: true, kind: "found" });
    else if (granted.length > 0) setMsg({ ok: false, kind: "foundOther" });
    else setMsg({ ok: false, kind: "notFound" });
  };

  return (
    <div className="mx-auto max-w-md px-6 pb-10 pt-16">
      <div className="rounded-3xl bg-gradient-devotional p-6 text-center shadow-card">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-earth/10 text-earth">
          <Lock className="h-5 w-5" />
        </span>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t.locked}</p>
        <h1 className="mt-1 font-serif text-2xl leading-tight text-foreground text-balance">
          {p.titulo}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-balance">{p.subtitulo}</p>
      </div>

      <ul className="mt-5 space-y-2.5">
        {p.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 rounded-2xl bg-card p-3.5 shadow-card">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
            <span className="text-sm text-foreground">{b}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={checkout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-5 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
      >
        {p.cta} <ArrowRight className="h-4 w-4" />
      </button>

      <button
        onClick={() => setShowRestore((v) => !v)}
        className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        {t.haveBought}
      </button>

      {showRestore && (
        <div className="mt-3 rounded-2xl bg-card p-4 shadow-card">
          <p className="mb-2 text-xs text-muted-foreground">{t.restoreHint}</p>
          <input
            type="email"
            inputMode="email"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder={t.emailPh}
            style={{ fontSize: "16px" }}
            className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-olive/50"
          />
          <button
            onClick={restore}
            disabled={busy}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-olive py-2.5 text-sm font-medium text-cream disabled:opacity-60"
          >
            <RotateCcw className="h-3.5 w-3.5" /> {t.restore}
          </button>

          {msg && (
            <p
              className={`mt-3 rounded-xl p-3 text-center text-xs ${msg.ok ? "bg-sage/30 text-foreground" : "bg-terracotta/15 text-terracotta"}`}
            >
              {t[msg.kind]}
            </p>
          )}

          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            {t.support.split("metodoalimentacionbiblica@gmail.com").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <a
                    href="mailto:metodoalimentacionbiblica@gmail.com"
                    className="font-medium text-olive underline underline-offset-2"
                  >
                    metodoalimentacionbiblica@gmail.com
                  </a>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
