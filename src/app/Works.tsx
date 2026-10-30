import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { BODY, CALENDLY_URL, DISPLAY, EMAIL } from "./site";
import { WORKS, formatDate, relatedWorks, workUrl, type Work } from "./works";

const KIND_LABEL = { tool: "Tool", essay: "Writing" } as const;

function Chips({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} style={DISPLAY} className="text-[11px] text-muted-foreground border border-border px-2 py-0.5">
          {s}
        </li>
      ))}
    </ul>
  );
}

export function WorkRow({ work }: { work: Work }) {
  const meta = work.kind === "tool" ? work.status : `${work.minutes} min read`;
  return (
    <li>
      <a
        href={workUrl(work)}
        className="group grid grid-cols-12 gap-x-6 gap-y-3 py-8 border-b border-border transition-colors"
      >
        <div style={DISPLAY} className="col-span-12 md:col-span-3 flex md:flex-col flex-wrap gap-x-4 gap-y-1.5 text-xs tracking-wider">
          <span className="text-primary uppercase tracking-[0.2em]">{KIND_LABEL[work.kind]}</span>
          {meta && <span className="text-muted-foreground">{meta}</span>}
          {work.date && <span className="text-muted-foreground">{formatDate(work.date)}</span>}
        </div>
        <div className="col-span-11 md:col-span-8">
          <h3 style={DISPLAY} className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2.5 leading-snug">
            {work.title}
          </h3>
          {work.summary && (
            <p style={BODY} className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
              {work.summary}
            </p>
          )}
          <Chips items={work.kind === "tool" ? work.stack : work.topics} />
        </div>
        <div className="col-span-1 flex justify-end items-start pt-1">
          <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </a>
    </li>
  );
}

// Homepage section: the three pieces to show first. Absent until something is published.
export function SelectedWorks() {
  if (!WORKS.length) return null;
  return (
    <section className="py-28 px-6 md:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between gap-6 mb-10">
          <h2 style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
            // Selected works
          </h2>
          {WORKS.length > 3 && (
            <a href="/works/" style={DISPLAY} className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-primary tracking-widest uppercase transition-colors">
              All works <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
        <ul className="border-t border-border">
          {WORKS.slice(0, 3).map((w) => (
            <WorkRow key={w.slug} work={w} />
          ))}
        </ul>
      </div>
    </section>
  );
}

type Filter = "all" | Work["kind"];

export function WorksIndex() {
  const [filter, setFilter] = useState<Filter>("all");
  const counts = { all: WORKS.length, tool: WORKS.filter((w) => w.kind === "tool").length, essay: WORKS.filter((w) => w.kind === "essay").length };
  const shown = filter === "all" ? WORKS : WORKS.filter((w) => w.kind === filter);
  const tabs: [Filter, string][] = [["all", "All"], ["tool", "Tools"], ["essay", "Writing"]];

  return (
    <section className="pt-36 md:pt-44 pb-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <p style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-10">
          // Works
        </p>
        <h1 style={DISPLAY} className="text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight mb-8 max-w-4xl">
          <span className="block text-foreground">Tools I&apos;ve built,</span>
          <span className="block text-muted-foreground">and how they work.</span>
        </h1>
        <p style={BODY} className="text-base text-muted-foreground leading-relaxed max-w-xl mb-14">
          Custom AI tools built for real work, mine and my clients&apos;. Each tool page covers what
          it does, who it is for, and how your business can get one. The writing explains the
          thinking behind them.
        </p>

        {counts.tool > 0 && counts.essay > 0 && (
          <div role="group" aria-label="Filter works" className="inline-flex border border-border mb-2">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                style={DISPLAY}
                className={`min-h-11 px-5 text-xs tracking-widest uppercase transition-colors border-r border-border last:border-r-0 ${
                  filter === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label} <span className="opacity-60 ml-1">{counts[key]}</span>
              </button>
            ))}
          </div>
        )}

        <ul className="border-t border-border mt-6">
          {shown.map((w) => (
            <WorkRow key={w.slug} work={w} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Dossier({ work }: { work: Work }) {
  const rows: [string, ReactNode][] =
    work.kind === "tool"
      ? [
          ["Status", work.status],
          ["Available as", work.access],
          ["Built for", work.audience],
          ["Stack", work.stack.length ? <Chips items={work.stack} /> : null],
          ["Published", formatDate(work.date)],
        ]
      : [
          ["Published", formatDate(work.date)],
          ["Updated", work.updated && work.updated !== work.date ? formatDate(work.updated) : ""],
          ["Reading time", `${work.minutes} min`],
          ["Topics", work.topics.length ? <Chips items={work.topics} /> : null],
        ];
  const ask = work.cta || (work.kind === "tool" ? "Ask about this tool" : "Talk it through");
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`About: ${work.title}`)}`;

  return (
    <div className="border border-border bg-card">
      <dl className="px-6">
        {rows
          .filter(([, v]) => v)
          .map(([label, value]) => (
            <div key={label} className="py-4 border-b border-border flex flex-col gap-2">
              <dt style={DISPLAY} className="text-[11px] text-muted-foreground tracking-[0.2em] uppercase">
                {label}
              </dt>
              <dd style={BODY} className="text-sm text-foreground leading-snug">
                {value}
              </dd>
            </div>
          ))}
      </dl>
      <div className="p-6 flex flex-col gap-2.5">
        <a
          href={mailto}
          style={DISPLAY}
          className="flex items-center justify-center gap-2.5 min-h-12 px-5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors group"
        >
          <Mail size={13} />
          {ask}
        </a>
        <a
          href={CALENDLY_URL}
          style={DISPLAY}
          className="flex items-center justify-center gap-2.5 min-h-12 px-5 border border-border text-xs text-muted-foreground tracking-widest uppercase hover:border-primary/30 hover:text-primary transition-colors group"
        >
          Book a call
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}

export function WorkPage({ work }: { work: Work }) {
  const related = relatedWorks(work);
  return (
    <article className="pt-32 md:pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <a href="/works/" style={DISPLAY} className="group inline-flex items-center gap-2 min-h-11 text-xs text-muted-foreground hover:text-primary tracking-widest uppercase transition-colors">
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          All works
        </a>

        <header className="mt-8 mb-14 max-w-4xl">
          <p style={DISPLAY} className="text-xs text-primary tracking-[0.2em] uppercase mb-6">
            {KIND_LABEL[work.kind]}
          </p>
          <h1 style={DISPLAY} className="text-[clamp(2.1rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-foreground mb-7">
            {work.title}
          </h1>
          {work.summary && (
            <p style={BODY} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {work.summary}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 border-t border-border pt-12">
          {/* Body first: on a phone the reader gets the content, then the facts and the ask. */}
          <div className="md:col-span-8 work-prose" style={BODY} dangerouslySetInnerHTML={{ __html: work.html }} />
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Dossier work={work} />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-28">
            <h2 style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-10">
              // Keep reading
            </h2>
            <ul className="border-t border-border">
              {related.map((w) => (
                <WorkRow key={w.slug} work={w} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
