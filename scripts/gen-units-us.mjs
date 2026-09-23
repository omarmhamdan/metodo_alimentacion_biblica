// Gera src/lib/recipes-units-us.ts a partir de recipes.ts (PT) e recipes-es.ts (ES),
// convertendo gramas→oz/lb, ml→fl oz, litros→tazas, kg→lb, °C→°F.
// Regra fixa (decidida): peso sempre em oz/lb (nunca em "tazas" para sólidos),
// porque densidade por xícara varia por ingrediente e não dá pra garantir sem
// checar cada um manualmente — oz/lb é sempre correto e é comum em receitas dos EUA.

import fs from "node:fs";

const PT_PATH = "/Users/omar/Desktop/Método Alimentação Bíblica/Método Alimentação Bíblica - Espanhol/app_receitas_biblicas/src/lib/recipes.ts";
const ES_PATH = "/Users/omar/Desktop/Método Alimentação Bíblica/Método Alimentação Bíblica - Espanhol/app_receitas_biblicas/src/lib/recipes-es.ts";
const OUT_PATH = "/Users/omar/Desktop/Método Alimentação Bíblica/Método Alimentação Bíblica - Espanhol/app_receitas_biblicas/src/lib/recipes-units-us.ts";

function roundHalf(n) {
  return Math.round(n * 2) / 2;
}
function fmt(n) {
  // remove .0, mantém .5
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function convertLine(line, cupsWord) {
  let out = line;

  // kg -> lb
  out = out.replace(/(\d+(?:[.,]\d+)?)\s?kg\b/gi, (_, num) => {
    const kg = parseFloat(num.replace(",", "."));
    return `${fmt(roundHalf(kg * 2.20462))} lb`;
  });

  // gramas -> oz (ou lb se >= 454g)
  out = out.replace(/(\d+(?:[.,]\d+)?)\s?g\b(?!\w)/gi, (_, num) => {
    const grams = parseFloat(num.replace(",", "."));
    if (grams >= 454) {
      return `${fmt(roundHalf(grams / 453.592))} lb`;
    }
    return `${fmt(roundHalf(grams * 0.035274))} oz`;
  });

  // litro(s) -> tazas/xícaras
  out = out.replace(/(\d+(?:[.,]\d+)?)\s?(litros?|l)\b/gi, (_, num) => {
    const liters = parseFloat(num.replace(",", "."));
    return `${fmt(roundHalf(liters * 4.22675))} ${cupsWord}`;
  });

  // ml -> fl oz
  out = out.replace(/(\d+(?:[.,]\d+)?)\s?ml\b/gi, (_, num) => {
    const ml = parseFloat(num.replace(",", "."));
    return `${fmt(roundHalf(ml * 0.033814))} fl oz`;
  });

  // °C -> °F
  out = out.replace(/(\d+(?:[.,]\d+)?)\s?°\s?C\b/g, (_, num) => {
    const c = parseFloat(num.replace(",", "."));
    return `${Math.round((c * 9) / 5 + 32)} °F`;
  });

  return out;
}

function extractRecipesFromArrayFile(src) {
  // Formato recipes.ts: objetos com `id: "...",` ... `ingredientes: [...]` ... `preparo: [...]`
  const out = {};
  const blockRe = /id:\s*"([a-z0-9\-]+)"[\s\S]*?ingredientes:\s*\[([\s\S]*?)\],\s*preparo:\s*\[([\s\S]*?)\],\s*dicaBeatriz/g;
  let m;
  while ((m = blockRe.exec(src))) {
    const [, id, ingBody, prepBody] = m;
    out[id] = {
      ingredientes: extractStrings(ingBody),
      preparo: extractStrings(prepBody),
    };
  }
  return out;
}

function extractRecipesFromMapFile(src) {
  // Formato recipes-es.ts: `"id": { ... ingredientes: [...] ... preparo: [...] ... }`
  const out = {};
  const blockRe = /"([a-z0-9\-]+)":\s*\{[\s\S]*?ingredientes:\s*\[([\s\S]*?)\],\s*preparo:\s*\[([\s\S]*?)\],\s*dicaBeatriz/g;
  let m;
  while ((m = blockRe.exec(src))) {
    const [, id, ingBody, prepBody] = m;
    out[id] = {
      ingredientes: extractStrings(ingBody),
      preparo: extractStrings(prepBody),
    };
  }
  return out;
}

function extractStrings(body) {
  const strRe = /"((?:[^"\\]|\\.)*)"/g;
  const lines = [];
  let s;
  while ((s = strRe.exec(body))) {
    lines.push(s[1].replace(/\\"/g, '"'));
  }
  return lines;
}

const ptSrc = fs.readFileSync(PT_PATH, "utf8");
const esSrc = fs.readFileSync(ES_PATH, "utf8");

const ptRecipes = extractRecipesFromArrayFile(ptSrc);
const esRecipes = extractRecipesFromMapFile(esSrc);

console.log(`PT: ${Object.keys(ptRecipes).length} receitas extraídas`);
console.log(`ES: ${Object.keys(esRecipes).length} receitas extraídas`);

function buildConverted(recipesMap, cupsWord) {
  const result = {};
  for (const [id, { ingredientes, preparo }] of Object.entries(recipesMap)) {
    result[id] = {
      ingredientes: ingredientes.map((l) => convertLine(l, cupsWord)),
      preparo: preparo.map((l) => convertLine(l, cupsWord)),
    };
  }
  return result;
}

const ptUS = buildConverted(ptRecipes, "xícaras");
const esUS = buildConverted(esRecipes, "tazas");

function serialize(obj) {
  const lines = ["{"];
  for (const [id, { ingredientes, preparo }] of Object.entries(obj)) {
    lines.push(`  "${id}": {`);
    lines.push(`    ingredientes: [`);
    for (const s of ingredientes) lines.push(`      ${JSON.stringify(s)},`);
    lines.push(`    ],`);
    lines.push(`    preparo: [`);
    for (const s of preparo) lines.push(`      ${JSON.stringify(s)},`);
    lines.push(`    ],`);
    lines.push(`  },`);
  }
  lines.push("}");
  return lines.join("\n");
}

const header = `// Gerado automaticamente a partir de recipes.ts e recipes-es.ts.
// Converte gramas→oz/lb, ml→fl oz, litros→tazas, kg→lb, °C→°F.
// Regra: peso de sólidos sempre em oz/lb (nunca "tazas"), porque densidade por
// xícara varia por ingrediente — oz/lb é sempre correto. Unidades já "americanas"
// no texto original (cucharada, cucharadita, taza, unidades) ficam sem alteração.
// Para regenerar: node scripts/gen-units-us.mjs

export interface RecipeUnitsUS {
  ingredientes: string[];
  preparo: string[];
}

export const recipeUnitsUS_PT: Record<string, RecipeUnitsUS> = ${serialize(ptUS)};

export const recipeUnitsUS_ES: Record<string, RecipeUnitsUS> = ${serialize(esUS)};
`;

fs.writeFileSync(OUT_PATH, header, "utf8");
console.log(`Escrito em ${OUT_PATH}`);
