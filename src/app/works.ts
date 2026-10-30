import all from "virtual:works";

// Shape produced by scripts/works/parse.mjs from each file in content/works.
export type Work = {
  slug: string;
  title: string;
  kind: "tool" | "essay";
  summary: string;
  date: string;
  updated: string;
  status: string;
  access: string;
  audience: string;
  stack: string[];
  topics: string[];
  related: string[];
  featured: boolean;
  cta: string;
  minutes: number;
  html: string;
};

export const WORKS: Work[] = all;

export const workUrl = (w: Work) => `/works/${w.slug}/`;

export function relatedWorks(w: Work, n = 3): Work[] {
  const picked = w.related.map((s) => WORKS.find((x) => x.slug === s)).filter((x): x is Work => !!x);
  const rest = WORKS.filter((x) => x !== w && !picked.includes(x));
  // Pad with the other kind first, so a tool page leads into writing and the reverse.
  rest.sort((a, b) => Number(a.kind === w.kind) - Number(b.kind === w.kind));
  return [...picked, ...rest].slice(0, n);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Formatted by hand so the server render and the browser always produce the same text.
export function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
