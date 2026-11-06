# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS single page (user choice, 27 Oct 2026). After the page is final, the Figma file "Joryka" (page "Landing page") must be updated to hold the finalized design; Figma variables mirror the CSS tokens.

## Users

Primary: Nigerian wholesalers and distributors — owners and managers running larger catalogues, cartons and units, multiple warehouses, staff at the counter, and repeat buyers who take goods on credit. They evaluate on a phone or laptop and want to know quickly whether JORYKA fits how they already trade.

Secondary: retail shop owners, store managers/staff leads who may share the page with the owner, and existing JORYKA users who only need the Login link.

## Product Purpose

The public pre-launch landing page for JORYKA, an offline-first retail POS, inventory and customer-credit platform. It explains the product and converts interested businesses into demo requests (primary) or WhatsApp enquiries (secondary). Success = qualified demo requests; existing users reach Login without friction.

## Positioning

Offline-first: sales, stock and credit record without internet and sync when the connection returns (confirmed by user, 27 Oct 2026). Sales, inventory and customer credit live in one system instead of notebooks, spreadsheets and separate tools. Competitors (TrakPoints, Timart, Tazroo, MartPoint) also mention offline mode, so the page must show the practical workflow, not just claim it.

## Operating Context

- Unreliable connectivity and power; work at the counter cannot wait for a signal.
- Goods sold both per unit and per carton ("3 ctn · 11 units", ₦/unit and ₦/ctn prices).
- Credit sales are routine; the app calls the balance "Still Owing" and the ledger "Money Record". "Walk-in Customer" is the default buyer.
- Multiple warehouses (Primary / Secondary) and multiple staff roles.
- Currency: Nigerian naira (₦), with NGN/USD/EUR display in the app.

## Capabilities and Constraints

Confirmed scope: sales processing (POS), inventory, offline functionality with later sync, customer credit sales and ledgers (Money Record), customer management, payments, reporting, multi-user store operations, multiple warehouses (visible in the app).

The landing page's centrepiece is one interactive demo of the whole product (Sell, Stock, Customers, Ask AI) on a shared sample shop: sales lower stock, credit sales raise balances, offline records queue and sync, and JORYKA AI answers are computed from that same demo state. JORYKA AI (the app's AI Insights): JORYKA calculates the figures, the AI explains them, and it says so when the records can't explain something. The landing page runs no AI model. Quotations, Invoices and Activity History are not on the landing page.

Undecided / must not be invented: final pricing (show provisional placeholders or "announced at launch"), WhatsApp number, login URL, demo-request destination and lead owner, privacy notice text, exact sync mechanics and which functions beyond sales work offline, supported devices.

Required CTA labels: "Request a Demo", "Chat on WhatsApp", "Login".

## Brand Commitments

- Name JORYKA; logo = two interlocking J's forming a diamond with a negative-space lightning bolt; wordmark built on Syncopate. Final logo files on the Figma page "Logo and brand" and in the project root SVGs.
- Brand colours: primary blue #2E4AFF (#425BFF on dark), secondary green #11D58A (#0AEB95 on dark), navy #11102D, white. Body type Inter.
- The web app's look (navy sidebar with green active bar, white cards on light grey, coloured stat tiles) is the visual reference the landing page should reflect (`docs/joryka-design-system.md`).

## Evidence on Hand

- Real product screenshots (desktop + mobile) were the reference (no longer kept here) — demo data is messy and uses $, so interface fragments must be rebuilt with clean Nigerian sample data.
- PRD with draft copy and FAQ answers (`docs/PRD.md`).
- No customers, testimonials, logos, press, metrics or certifications exist. Never fabricate them.

## Product Principles

1. Clarity before decoration: a visitor should say what JORYKA does after five seconds.
2. One dominant action: Request a Demo; WhatsApp is the low-friction alternative; Login is a utility.
3. Trust through accuracy: every claim traceable to confirmed product facts; provisional things labelled provisional.
4. Local and practical: naira, cartons and units, credit as people actually say it.
5. Mobile-first: everything works on a narrow phone with a thumb.

## Accessibility & Inclusion

WCAG 2.2 AA target; persistent form labels, visible focus, keyboard reachable, 44px touch targets, reduced-motion respected, plain language for a broad range of digital confidence.
