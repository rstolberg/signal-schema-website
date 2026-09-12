# BUSINESS_CONTEXT.md — AI Handoff File
> Purpose: Give any AI model (Claude, Codex, etc.) fast, accurate context on this business so it can assist without re-explanation. Treat everything here as ground truth unless the user says otherwise.

## 1. Operator

- **Who:** Riley — third-year Computer Science + Psychology combined major, University of Victoria (grad 2027). Based in Greater Victoria, BC, Canada.
- **Relevant experience:** Co-op at ASC Creative (AI enablement consultancy) building and deploying MCP servers in Linux environments, Bash CRUD tooling, and AI integration consulting. Currently also a Research Assistant at UVic's Creative Experiences Lab (HCI / LLM research) — this provides HCI and user-research credibility.
- **Technical stack:** Arch Linux daily driver, Neovim, Bash, MCP (Model Context Protocol) server development, Cloudflare Tunnel + Cloudflare Access (email-gated OTP) for self-hosted endpoints (rserver.vip), Obsidian-based knowledge management. Public proof-of-work: Obsidian MCP connector repo on GitHub.
- **Working style:** Schema-first, first-principles. Prefers WHY-before-HOW explanations. Pushes back when reasoning doesn't track. Expect direct engagement, not deference.

## 2. The Business (One Paragraph)

Solo AI-integration consultancy focused on **MCP server development** for small and mid-sized businesses, using a **build-and-handoff model**: fixed-scope custom integrations delivered with full documentation and ownership transferred to the client. No hosting obligations, no retainers, no employees. Revenue model is project fees priced with value-based logic, fronted by a low-cost **productized diagnostic** as the wedge offer.

## 3. Business Model — Core Decisions (and WHY)

| Decision | Rationale |
|---|---|
| **Build-and-handoff, not hosting** | Hosting creates ongoing liability, uptime obligations, and multi-tenant infrastructure complexity. Handoff caps exposure and keeps the business lean. Structurally matches the top-quartile solo archetype in NAICS 541514 (Computer Systems Design Services) benchmark data. |
| **Sole proprietorship (initially)** | Lowest-friction BC starting structure; incorporation deferred until revenue justifies it. Liability managed via E&O insurance + clean contracts instead. |
| **No retainers** | Retainers reintroduce the ongoing-obligation problem build-and-handoff was designed to avoid. Decline gracefully; offer a paid check-in or Phase 2 instead. |
| **Fixed fees, never hourly** | Hourly caps income at hours worked and punishes efficiency. Fixed fee + tight statement of work + explicit change-order pricing shifts scope risk to the consultant in exchange for higher margin. |
| **Value-based price derivation** | Fees are derived from client outcome value (target ~10–35% of year-one value created), then presented as a single indivisible project fee. The client sees "$X for the build," not the formula. |

## 4. Sales Funnel

1. **Warm leads** — primarily from ASC Creative network and personal contacts. Cold acquisition via LinkedIn positioning ("AI Integration Consultant" — deliberately outcome-first language, because "MCP" collides with "Microsoft Certified Professional" in search).
2. **Productized diagnostic (wedge offer)** — cheap, fixed-scope, fixed-price assessment of the client's workflows/systems identifying AI integration attachment points. De-risks the client's first purchase and generates the findings that justify the build.
3. **Diagnostic delivery meeting = the negotiation.** Price is discussed in person, in that meeting, not by follow-up email. Rationale: post-diagnostic reciprocity and demonstrated competence are at their peak; email strips tone/body-language channels and gives space for a rational "no."
4. **Fixed-fee build** — scoped from the diagnostic, delivered, documented, handed off.
5. **Non-monetary closers** — 30-day check-in, documentation package, or training session reserved as final concession items.

## 5. Pricing & Negotiation Methodology (Voss / *Never Split the Difference*)

Applies to the diagnostic delivery meeting. Sequence:

1. **Deliver findings; get to "that's right."** Use labels ("It seems like this manual re-entry step is costing more than anyone realized"). Do not discuss price before the client signals feeling understood.
2. **Accusation audit** before the value question: preemptively name their objections ("You're probably wondering if this is where I name a scary number...").
3. **Calibrated questions, plural, with multi-year framing.** Get the CLIENT to state the value: "What would it mean if this bottleneck disappeared?" → "What's that in dollars over two or three years?" The value figure must come from their mouth. Multi-year framing matters: fee is one-time, margin lift recurs.
4. **Label, then anchor, then silence.** Anchor above target with a **precise non-round number** (e.g., $5,270, not $5,300 — round numbers signal negotiability). Stop talking after the number.
5. **Ackerman ladder (seller-inverted):** pre-planned retreat steps in shrinking increments (e.g., $5,270 → $4,600 → $4,100 → $3,870), final step paired with a non-monetary throw-in. Never split the difference; respond to lowballs with a label + "How am I supposed to deliver the full scope at that number?" — concede **scope, never rate** (the McKinsey pattern).
6. **Alternative soft anchor:** state a market range ("firms typically pay $4,500–$7,000 for an integration like this"); clients drift to the bottom of a range, which sits above the true target.
7. **Never use "fair" defensively.** Never pre-justify the price with ROI math — ROI math is the client's post-decision justification ammunition, not the pitch.

**Reference price points (current, subject to change):** target build fee ≈ $3,500–4,000 range for small engagements; anchor ≈ $5,270. Diagnostic priced low (hundreds, not thousands) as a wedge. Typical value story: ~2% margin improvement on a ~$500k-revenue business ≈ $10k/year recurring vs. one-time fee.

**Planned addition:** three-tier proposals (good/better/best) — top tier serves as the structural high anchor; middle tier is the intended landing zone.

## 6. Technical Positioning

- **Core deliverable:** custom MCP servers connecting AI models (Claude, etc.) to client systems and data.
- **Integration methodology for closed/proprietary software (esp. Windows):** four attachment layers, assessed in the diagnostic — UI layer (automation), data layer (files/DB), network layer (API interception/endpoints), OS layer (filesystem, processes).
- **Proof-of-work assets:** public Obsidian MCP connector repo; rserver.vip demo endpoints behind Cloudflare Access; GitHub profile README highlighting MCP work.

## 7. Constraints & Boundaries (Do Not Violate When Assisting)

- No hosting, no retainers, no employees — do not propose these as growth strategies without flagging the deliberate trade-off.
- Keep marketing language **outcome-first**, not acronym-first ("MCP" is a search-collision liability with lay audiences).
- Contracts must include: tight SOW, change-order pricing, liability limitation; E&O insurance assumed.
- Solo capacity: scope recommendations must fit one person doing sales + delivery (~half of working time is non-billable).
- Operator is a student — schedule and capacity are constrained by coursework and RA work.

## 8. How to Help (Instructions to the AI Reading This)

- Assume familiarity with MCP, Linux, Bash — skip beginner explanations of these.
- When advising on strategy, reason from the risk-transfer framing above; explain WHY before HOW.
- When drafting client-facing material: plain-language outcomes, no jargon walls, precise non-round numbers, no defensive price justification.
- When drafting proposals: single project fee onstage, value logic backstage, scope as the only concession currency.
- Flag anything that reintroduces ongoing obligations, hourly billing, or self-anchoring below target.
