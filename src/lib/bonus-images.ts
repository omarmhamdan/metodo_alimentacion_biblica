// Slots de imagem dos bônus (Anti-Inflamação 7 Dias + Mesa Única).
// Fonte única usada pelas páginas (fallback) e pelo painel admin (lista de upload).
// Cada slot é editável via admin → sobe para o Supabase (tabela recipe_photos),
// igual às fotos de receita. As páginas leem getCachedImages()[id] ?? fallback.

import heroMesa from "@/assets/hero-mesa.jpg";
import suco from "@/assets/suco-sagrado.jpg";
import sopa from "@/assets/recipe-sopa.jpg";
import salada from "@/assets/recipe-salada.jpg";
import lentilhas from "@/assets/recipe-lentilhas.jpg";
import peixe from "@/assets/recipe-peixe.jpg";
import pao from "@/assets/recipe-pao.jpg";
import figos from "@/assets/recipe-figos.jpg";

export interface BonusSlot {
  id: string;
  label: string;
  group: string;
  fallback: string;
}

const G_PROTO = "Anti-Inflamação 7 Dias";
const G_MESA = "Guia Mesa Única";

export const bonusSlots: BonusSlot[] = [
  // ── Anti-Inflamação 7 Dias ──
  { id: "protocolo-hero", label: "Capa (hero)", group: G_PROTO, fallback: heroMesa },
  { id: "protocolo-agua", label: "Água do Jordão", group: G_PROTO, fallback: suco },
  { id: "protocolo-dia-1", label: "Dia 1 — O Preparo", group: G_PROTO, fallback: suco },
  { id: "protocolo-dia-2", label: "Dia 2 — A Limpeza Começa", group: G_PROTO, fallback: sopa },
  { id: "protocolo-dia-3", label: "Dia 3 — O Pico da Drenagem", group: G_PROTO, fallback: salada },
  { id: "protocolo-dia-4", label: "Dia 4 — A Estabilização", group: G_PROTO, fallback: lentilhas },
  { id: "protocolo-dia-5", label: "Dia 5 — A Leveza Instalada", group: G_PROTO, fallback: peixe },
  { id: "protocolo-dia-6", label: "Dia 6 — Vida Nova", group: G_PROTO, fallback: pao },
  { id: "protocolo-dia-7", label: "Dia 7 — A Renovação", group: G_PROTO, fallback: figos },

  // ── Guia Mesa Única ──
  { id: "mesa-hero", label: "Capa (hero)", group: G_MESA, fallback: heroMesa },
  { id: "mesa-cat-lentilhas", label: "Categoria · Lentilhas e grãos", group: G_MESA, fallback: lentilhas },
  { id: "mesa-cat-peixes", label: "Categoria · Peixes", group: G_MESA, fallback: peixe },
  { id: "mesa-cat-legumes", label: "Categoria · Legumes", group: G_MESA, fallback: salada },
  { id: "mesa-cat-paes", label: "Categoria · Pães", group: G_MESA, fallback: pao },
  { id: "mesa-cat-sobremesas", label: "Categoria · Sobremesas", group: G_MESA, fallback: figos },
  { id: "mesa-domingo-1", label: "Domingo · Cordeiro/pernil", group: G_MESA, fallback: lentilhas },
  { id: "mesa-domingo-2", label: "Domingo · Frango dourado", group: G_MESA, fallback: sopa },
  { id: "mesa-domingo-3", label: "Domingo · Tábua de pães", group: G_MESA, fallback: pao },
  { id: "mesa-domingo-4", label: "Domingo · Peixe inteiro", group: G_MESA, fallback: peixe },
  { id: "mesa-domingo-5", label: "Domingo · Figos, mel e nozes", group: G_MESA, fallback: figos },
];

/** Map id → fallback asset, for useStoredImageMap. */
export const bonusFallbacks: Record<string, string> = Object.fromEntries(
  bonusSlots.map((s) => [s.id, s.fallback]),
);
