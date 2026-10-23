// Questions prospects ask an AI assistant or a search box, answered plainly.
// The same list renders the visible FAQ section and the FAQPage JSON-LD, so they never drift apart.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Who builds custom automation and AI integrations for businesses in Victoria and Vancouver?",
    a: "Signal Schema is a Victoria, BC studio that builds custom software, workflow automation and AI integrations for small and mid-sized businesses on Vancouver Island and in Metro Vancouver. Every project is fixed scope and fixed fee, and you keep the source code and documentation at the end.",
  },
  {
    q: "How do I automate a repetitive process between two pieces of software?",
    a: "Start by mapping the process step by step: where the data comes from, who touches it, and where it ends up. Most manual work between systems is copying, re-keying or checking data that one system could send to the other through an API, a webhook or a small piece of middleware. Signal Schema's diagnostic does that mapping, puts a cost on the bottleneck, and then builds the integration that removes it.",
  },
  {
    q: "Should we build custom software or use off-the-shelf tools?",
    a: "Use off-the-shelf tools when one already fits your process. Custom software pays off when your team is filling the gaps between tools by hand, when the tools you have cannot talk to each other, or when the way you work is part of what makes your business different. The diagnostic tells you which case you are in before you spend anything on a build.",
  },
  {
    q: "What kinds of work can be automated?",
    a: "Common examples are moving data between a CRM, accounting, inventory or scheduling system; turning emails, forms and documents into structured records; generating quotes, reports and follow-ups; and giving an AI assistant safe, scoped access to your own systems through a custom MCP server.",
  },
  {
    q: "How is a project priced?",
    a: "Each project has a fixed scope and a fixed fee agreed before the build starts, so there are no hourly surprises or scope creep. It starts with a discovery call and a diagnostic of your workflows.",
  },
  {
    q: "Do we own what you build?",
    a: "Yes. You get the complete source code, full documentation and a walkthrough session. There are no subscriptions or lock-in, and your team can run it without Signal Schema.",
  },
  {
    q: "Do you work with businesses outside Victoria?",
    a: "Yes. Signal Schema is based in Victoria, BC and works with businesses across British Columbia, including Metro Vancouver, as well as remotely elsewhere in Canada.",
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};
