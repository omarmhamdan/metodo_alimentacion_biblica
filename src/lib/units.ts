export type Units = "metric" | "us";

const KEY = "mab:units";

export function getUnits(): Units {
  if (typeof window === "undefined") return "metric";
  const stored = localStorage.getItem(KEY) as Units | null;
  if (stored === "metric" || stored === "us") return stored;
  return "metric";
}

export function setUnits(u: Units) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, u);
  window.dispatchEvent(new CustomEvent("mab:units"));
}
