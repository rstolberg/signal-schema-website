import { useState, useEffect, type MouseEvent } from "react";
import { ArrowRight, Mail, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const CALENDLY_URL = "https://calendly.com/rileystolberg/30min";
const EMAIL = "contact@signalschema.org";

const DISPLAY = { fontFamily: '"JetBrains Mono", monospace' };
const BODY = { fontFamily: '"Figtree", sans-serif' };

function useCalendlyAssets() {
  useEffect(() => {
    if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
}

function openCalendlyPopup(event: MouseEvent<HTMLAnchorElement>) {
  if (!window.Calendly?.initPopupWidget) return;

  event.preventDefault();
  window.Calendly.initPopupWidget({ url: CALENDLY_URL });
}

function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <span style={DISPLAY} className="text-sm font-semibold tracking-[0.15em] text-foreground uppercase">
          Signal Schema
        </span>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={DISPLAY}
          >
            <Mail size={12} />
            {EMAIL}
          </a>
          <a
            href={CALENDLY_URL}
            onClick={openCalendlyPopup}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors group"
            style={DISPLAY}
          >
            Book a call
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Gradient vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(77,255,180,0.04),transparent)]" />

      <div
        className="relative max-w-7xl mx-auto w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Status pill */}
        <div className="flex items-center gap-2.5 mb-14">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Accepting new projects — Victoria, BC
          </span>
        </div>

        {/* Headline */}
        <h1
          style={DISPLAY}
          className="text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight mb-10 max-w-5xl"
        >
          <span className="block text-foreground">Your systems,</span>
          <span className="block text-muted-foreground">fluent in AI.</span>
        </h1>

        {/* Body */}
        <p
          style={BODY}
          className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mb-14"
        >
          I build custom AI integrations for small and mid-sized businesses.
          Fixed scope, fixed fee, full documentation — and the integration is
          yours when we are done.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={CALENDLY_URL}
            onClick={openCalendlyPopup}
            style={DISPLAY}
            className="flex items-center justify-center gap-2.5 px-7 py-4 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-all group"
          >
            Schedule a discovery call
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={`mailto:${EMAIL}`}
            style={DISPLAY}
            className="flex items-center justify-center gap-2.5 px-7 py-4 border border-border text-xs text-muted-foreground tracking-widest uppercase hover:border-primary/30 hover:text-primary transition-all group"
          >
            <Mail size={13} className="group-hover:scale-110 transition-transform" />
            {EMAIL}
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 right-8 md:right-12"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease 0.5s",
        }}
      >
        <span style={DISPLAY} className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase [writing-mode:vertical-rl]">
          scroll
        </span>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      num: "01",
      title: "Diagnostic",
      desc: "A focused audit of your workflows and systems. I identify where AI integration creates the most leverage and put a number on what the bottleneck is actually costing you.",
    },
    {
      num: "02",
      title: "Build",
      desc: "Custom integration developed to spec, connecting your AI tools to your real data and systems. Fixed scope, fixed fee, delivered on time. No scope creep, no surprises.",
    },
    {
      num: "03",
      title: "Handoff",
      desc: "Full source code, documentation, and a walkthrough session. The integration is yours — no subscriptions, no lock-in, no ongoing dependency on me.",
    },
  ];

  return (
    <section className="py-28 px-6 md:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <p style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-16">
          // Process
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {steps.map((step) => (
            <div key={step.num} className="py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0">
              <span style={DISPLAY} className="text-xs text-primary tracking-widest mb-8 block">
                {step.num}
              </span>
              <h3 style={DISPLAY} className="text-lg font-semibold text-foreground mb-5">
                {step.title}
              </h3>
              <p style={BODY} className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatYouGet() {
  const deliverables = [
    "Tailor made software for your companies needs",
    "Custom MCP server built for your specific systems",
    "Complete source code",
    "Full technical report on potential improvements",
    "30-day post-delivery check in availability",
  ];

  const forWhom = [
    "You are leaving margin on the table because your software does not talk to each other",
    "Your team fills the gap between your isolated software manually",
    "You want an informed diagnostic of your current system in our current tech landscape",
    "Your team spends a lot of time doing basic/menial tasks that could be automated",
  ];

  return (
    <section className="py-28 px-6 md:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <p style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-10">
            // What you get
          </p>
          <ul className="space-y-5">
            {deliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span style={DISPLAY} className="text-primary text-xs mt-0.5 shrink-0">→</span>
                <span style={BODY} className="text-sm text-muted-foreground leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-10">
            // Who this is for
          </p>
          <ul className="space-y-5 mb-10">
            {forWhom.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span style={DISPLAY} className="text-primary text-xs mt-0.5 shrink-0">→</span>
                <span style={BODY} className="text-sm text-muted-foreground leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p style={BODY} className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-5">
            You do not need to know what an MCP server is. You need to know
            what the bottleneck costs per year — I handle the rest.
          </p>
        </div>
      </div>
    </section>
  );
}

function About() {
  const facts = [
    ["Location", "Victoria, BC, Canada"],
    ["Availability", "Open to new projects"],
    ["Model", "Fixed-fee, build & handoff"],
    ["Capacity", "2–3 concurrent engagements"],
    ["Stack", "MCP, Claude API, Codex API, Bash, Linux"],
  ];

  return (
    <section className="py-28 px-6 md:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
        <div className="md:col-span-7">
          <p style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-10">
            // About
          </p>
          <p style={BODY} className="text-xl md:text-2xl leading-relaxed text-foreground mb-8 font-medium">
            Every integration gets my direct attention. Not a team of juniors — me.
          </p>
          <p style={BODY} className="text-sm text-muted-foreground leading-relaxed mb-5">
            I am a CS + Psychology student at UVic and a working AI integration
            consultant. I have built and deployed MCP servers in production
            environments, run AI enablement projects at a consultancy, and conduct
            human-computer interaction research at UVic&apos;s Creative Experiences Lab.
          </p>
          <p style={BODY} className="text-sm text-muted-foreground leading-relaxed">
            Signal Schema is deliberately solo. That keeps costs lean, accountability
            direct, and the work honest. The build-and-handoff model means I have
            every incentive to make the documentation good — your team needs to
            be able to run it without me.
          </p>
        </div>

        <div className="md:col-span-5">
          <p style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-10 md:mt-[3.25rem]">
            // At a glance
          </p>
          <div className="space-y-0">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-center py-4 border-b border-border last:border-0"
              >
                <span style={DISPLAY} className="text-xs text-muted-foreground tracking-wider">
                  {label}
                </span>
                <span style={DISPLAY} className="text-xs text-foreground text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-32 px-6 md:px-12 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(77,255,180,0.04),transparent)]" />
      <div className="relative max-w-7xl mx-auto">
        <p style={DISPLAY} className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-12">
          // Start here
        </p>
        <h2
          style={DISPLAY}
          className="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-tight mb-8 max-w-3xl"
        >
          <span className="block text-foreground">What is your most</span>
          <span className="block text-muted-foreground">expensive bottleneck?</span>
        </h2>
        <p style={BODY} className="text-sm text-muted-foreground mb-14 max-w-md leading-relaxed">
          Book a discovery call. We will figure out whether an AI integration
          makes sense for your situation — before you commit to anything.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={CALENDLY_URL}
            onClick={openCalendlyPopup}
            style={DISPLAY}
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-all group"
          >
            Book a discovery call
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={`mailto:${EMAIL}`}
            style={DISPLAY}
            className="flex items-center justify-center gap-2.5 px-8 py-4 border border-border text-xs text-muted-foreground tracking-widest uppercase hover:border-primary/30 hover:text-primary transition-all group"
          >
            <Mail size={13} />
            Send an email
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <span style={DISPLAY} className="text-xs text-muted-foreground tracking-wider">
          Signal Schema — Victoria, BC
        </span>
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${EMAIL}`}
            style={DISPLAY}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail size={11} />
            {EMAIL}
          </a>
          <a
            href={CALENDLY_URL}
            onClick={openCalendlyPopup}
            style={DISPLAY}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={11} />
            Calendly
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  useCalendlyAssets();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav scrolled={scrolled} />
      <Hero />
      <Process />
      <WhatYouGet />
      <About />
      <FinalCTA />
      <Footer />
    </div>
  );
}
