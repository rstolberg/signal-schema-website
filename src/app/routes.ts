import { WORKS, workUrl, type Work } from "./works";

// Every page the site serves. The prerender script writes one HTML file per entry,
// and the browser uses the same table to pick which page to hydrate.
export type Route =
  | { page: "home"; path: "/" }
  | { page: "works"; path: string; title: string; description: string }
  | { page: "work"; path: string; title: string; description: string; work: Work };

export function routes(): Route[] {
  const out: Route[] = [{ page: "home", path: "/" }];
  if (!WORKS.length) return out;
  out.push({
    page: "works",
    path: "/works/",
    title: "Works: custom AI tools and writing | Signal Schema",
    description: "Custom AI tools and automations built by Signal Schema in Victoria, BC: what each one does, who it is for, and how your business can use it.",
  });
  for (const work of WORKS) {
    out.push({ page: "work", path: workUrl(work), title: `${work.title} | Signal Schema`, description: work.summary || work.title, work });
  }
  return out;
}

export function matchRoute(pathname: string): Route {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return routes().find((r) => r.path === path) ?? routes()[0];
}
