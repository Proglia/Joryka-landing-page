---
name: Joryka
description: Offline-first POS, stock and credit for Nigerian retailers and wholesalers. A bright, app-native SaaS page whose hero is a working copy of the Joryka app, surrounded by its six main features.
colors:
  navy: "#11102D"
  navy-800: "#1C1946"
  navy-700: "#2A2660"
  navy-600: "#4A4668"
  navy-500: "#6B6785"
  navy-400: "#8E8AAA"
  navy-300: "#B8B5D6"
  navy-200: "#E4E1F0"
  navy-100: "#F1F0F7"
  paper: "#F6F5FC"
  app-bg: "#F3F3F5"
  white: "#FFFFFF"
  blue: "#2E4AFF"
  blue-700: "#2238D6"
  blue-50: "#EEF1FF"
  blue-on-navy: "#7D8FFF"
  green-on-navy: "#0AEB95"
  green-700: "#008236"
  green-800: "#006B2C"
  green-200: "#B7EBD3"
  green-50: "#E7FBF3"
  amber-700: "#BB4D00"
  amber-200: "#FEE685"
  amber-50: "#FFFBEB"
  red: "#D4183D"
  red-50: "#FEF2F2"
  purple-600: "#9810FA"
  purple-50: "#FAF5FF"
  stock-ok: "#00C950"
  stock-low: "#F9B80A"
  soft-hover: "#D8D4EA"
  tile-pos: "#2E4AFF"
  tile-stock: "#AD46FF"
  tile-credit: "#FE9A00"
  tile-docs: "#00B8DB"
  tile-reports: "#FF6900"
  tile-ai: "#11102D"
  tile-offline: "#00A63E"
  app-active-from: "#1B2068"
  app-active-to: "#17184A"
  app-online-pill: "#172939"
  app-offline-pill: "#3A1630"
  app-offline-text: "#FF8FA3"
  app-dark-button: "#2B3446"
  app-navy-button: "#1C1580"
  app-pay: "#00A63E"
  app-whatsapp: "#158A2E"
  app-avatar-from: "#3B82F6"
  app-icon-blue: "#2B7FFF"
  app-icon-red: "#FB2C36"
  app-unit-tile: "#F0F6FF"
  app-unit-text: "#1F3FD1"
  app-ctn-text: "#8200DB"
  app-grid-bg: "#E8E8EA"
  app-chip: "#F0F0F2"
  app-tabs: "#E6E6EB"
  app-table-head: "#FAFAFC"
  app-red-text: "#C70036"
  app-cyan-text: "#007595"
  app-orange-text: "#CA3500"
  app-violet-tint: "#EEF0FF"
  app-violet-text: "#4338CA"
  app-red-line: "#FFC9C9"
  app-blue-line: "#BEDBFF"
  app-blue-line-strong: "#C7D0FF"
typography:
  display:
    fontFamily: "Inter, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(38px, 5vw, 64px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  heading:
    fontSize: "clamp(32px, 3.4vw, 44px)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.03em"
  title:
    fontSize: "24px"
    fontWeight: 600
  lead:
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
  app-title:
    fontSize: "20px"
    fontWeight: 700
  button-lg:
    fontSize: "17px"
    fontWeight: 600
  body:
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontSize: "14px"
  micro:
    fontSize: "13px"
  data-mono:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "13px"
  display-phone:
    fontSize: "34px"
    fontWeight: 700
  heading-phone:
    fontSize: "28px"
    fontWeight: 700
rounded:
  tail: "4px"
  sm: "8px"
  md: "10px"
  ctl: "12px"
  tile: "14px"
  card: "16px"
  window: "20px"
  form: "24px"
  pill: "999px"
spacing:
  page-margin: "56px"
  section: "48px"
  section-phone: "32px"
  card-pad: "28px"
  grid-gap: "12px"
---

# Joryka — design system

## Idea

Joryka's main features are the page's signature. In the hero, six coloured feature tiles
orbit a working copy of the real Joryka app. Clicking a tile opens that feature in the app
window, with a dashed wire drawn from the tile to the window in the tile's colour. The
window is not an illustration: it reproduces the shipped app's screens (from
the app's screenshots), runs on one sample shop, and every action carries across pages.
Everything below the hero is a calm, bright SaaS page in the app's own visual language.

## Source of truth for the app window

- The shipped app's screenshots (desktop, mobile, flows) were the source for every screen in
  the window; they are no longer kept in this folder. Anything not in the app does not go in
  the playground.
- The Figma "Design handoff" page is an older first version (TrackForce, Ledger, Audit Log).
  It is used only for the offline banner / sync states and the Point of Sale payment and
  receipt step, restyled to the screenshots and renamed to the current module names.
- Module names follow the app exactly: Dashboard, Point of Sale, Inventory, Customers,
  Quotations, Invoices, Money Record, Reports, AI Insights, Activity History, Warehouses,
  User Management, Settings, Search. The feature itself is called "Joryka AI".

## The playground

- **Tiles (main features only):** Point of Sale (blue), Inventory (purple: Inventory and
  Warehouses pages), Customers & Credit (amber: Customers and Money Record), Quotes &
  Invoices (cyan: Quotations and Invoices), Reports (orange: Reports and Dashboard),
  Joryka AI (navy: AI Insights). Supporting modules live in the sidebar and in the strip.
- **Window:** the app's navy sidebar collapsed to an icon rail (logo, all 14 modules with
  tooltips, green active marker, Online/Offline pill at the bottom), over the `app-bg` work
  area. Modules outside the six features say they're in the full app.
- **Offline is an annotation, not a tile:** a callout under the window points at the
  sidebar pill. Offline shows the red "You're offline … N pending" banner; reconnecting
  shows the blue "Syncing changes…" banner, then clears.
- **Modals and side panel** cover the whole window, as in the app: Payment (Cash, Digital,
  Partial, Full Credit), Transaction Complete receipt, New Quotation, invoice payment, and
  the AI side panel with "How this was calculated".
- **Scale:** the app inside the window is drawn smaller than the screenshots (CSS `zoom`:
  0.86 on desktop, 0.9 on tablet, 0.92 on phones) so a full screen of the app fits the
  smaller window without feeling cramped. The page around it keeps the full type ramp.
  Inside the app, pages get 22px padding and 14px gaps between cards so the grey and
  navy areas breathe.
- **Layouts by width:** from 1200px the tiles float around the window (the default
  desktop view); 1200–1439px uses slightly smaller tiles and a window that narrows to
  680px. On tablets (721–1199px) the tiles still float: three in an arc above the
  window, three in an arc below it, the dashed wire running vertically to the window's
  edge, and the offline callout centred underneath. On phones they become a 3 × 2 grid
  of floating icons, each over its label pill. At every width a selected tile's label gets a light
  tint of its feature colour and a thin outline, never a dark fill; on desktop its icon
  gets a 6px ring in the same tint (it does not grow). There is no caption under the
  window.
- **Scroll bars** inside the window are hidden; a thin navy-300 thumb shows only while
  the pointer is over a scrolling area.
- **Phone:** the window on the page is a 440px preview with a "Try the app" button; it,
  a feature tile, the offline callout and every "Try it" link open the app full screen.
  Full screen copies the mobile app: navy top bar with menu, logo, Online pill and Close;
  the menu slides in from the left with every module, as in the app's open-menu screen.
  The browser Back button and Escape close it and return to the same place on the page,
  and everything done in it is kept. Features with two pages get a page switcher.

## How offline works

The navy band's picture is a tilted product shot built in HTML, not a screenshot, so it
uses the sample shop: one card, the offline cart, with the network pill beside it (no
window or product cards behind it, so the picture reads as one simple, familiar screen). While it is on screen it plays the offline story in a loop:
three sale lines are added with the red "You're offline … N pending" banner, the pill
turns Online, the banner turns blue "Syncing changes…", then clears. The banner wording
is the app's. On touch screens, where there is no hover, the scene also sways slowly
between its tilted and flatter angles on its own. With reduced motion it holds the
offline state with all three lines and does not move.

The band's own Request a Demo is the white `btn-light` (navy text), never the blue
primary: the cart's blue Proceed to Payment is part of the picture and must not look
like the same kind of control as the page's call to action.

## Header and hero buttons

At 1100px and below the section links and Login leave the bar: it keeps the logo,
Request a Demo and a 44px hamburger, which opens a panel under the bar with the four
links (52px ruled rows, 17px) and Login. Tapping a link, outside the panel or Escape
closes it. Figma: "Mobile · menu open" next to the mobile frame.

The hero's Request a Demo and Chat on WhatsApp sit side by side on tablet and desktop
(561px and up) and stack full width on every phone (560px and below).

The Point of Sale feature card shows two products (Instant Noodles 70g, Sugar 500g) and
the cart: beside them on desktop, under them up to 1000px. Phones (560px and below) show
Instant Noodles 70g only, above the cart.

## Product tour

Between the modules strip and Features: the promo film (`assets/joryka-tour.mp4`, the
1:17 web cut rebuilt on the client's narration, 2026-11-06, Nigerian English voice) in a
window styled like the playground's, with a dashboard poster frame and a navy "Watch the
tour" pill. Heading: "See Joryka run a shop in just over a minute". It loads only when played;
captions (`assets/joryka-tour.vtt`) are generated from the film's own caption cues in
`../Joryka promo video/src/timeline.ts`, so re-export both whenever the film changes.

## Colour

- **Ground:** white, with `paper` bands for Features and Contact, and one `navy` band for
  "How offline works". The hero runs a soft `paper → white` fade.
- **Ink:** `navy` for headings and labels; `navy-500` for secondary text (5.4:1 on white).
- **Action:** `blue` for every primary button, link and active state.
- **Headings:** every section heading carries one phrase in `blue` ("Grow your
  business.", "just over a minute", "in one place", "tailored to you", "Joryka"); on the navy
  band it is `blue-on-navy` (#7D8FFF, 6.4:1) so it stays readable.
- **Status (never decorative):** green = online / in stock / paid; amber = low / watch /
  partly paid; red = owing / out of stock / offline / urgent.
- **Feature tiles:** one colour per main feature, used for its tile, its wire and its card
  in Features.
- **App window colours** (`app-*`) are sampled from the shipped app's screenshots and used
  only inside the window and the feature mocks.
- **Prices:** unit price on `app-unit-tile`, carton price on `purple-50`, as in the app.

## Type

Inter throughout; monospace only where the app uses it (document numbers, dates in
records, receipts). Display 64px bold with the second line in blue; section headings 44px;
card titles 24px; lead 20px; app page titles 20px; buttons 17px; body 16px; UI 14px;
micro 13px. Nothing readable goes below 13px.

## Pricing

Three placeholder plans as plain, minimal SaaS cards: white card, 24px radius, plan
name (24px), one line on who it's for, a large "₦ —" with "Price announced at launch",
a divider, a checklist with blue checks, a full-width button and a small placeholder
note. Starter and Business use the navy button; Growth is the recommended plan, set apart
only by a soft cloudy fill (`blue-50` with pale blue-white clouds, after the Figma
shader fill), a blue outline, a lilac shadow (rgba(165, 162, 252, …)), a blue
"Recommended" pill and the blue button. There is no separate placeholder notice; the
"₦ —", "Price announced at launch" and the note on each card carry it. No prices, billing
periods or customer claims until launch.

Section rhythm (set in Figma, 2026-10-29; `--sec-pad` / `--head-gap`): sections are padded
48px top and bottom on desktop, 40px on tablet, 32px on phones, and every section heading
sits 48 / 36 / 24px above its content (tour video, feature grid, plans, stacked offline and
contact columns). The Features heading's two columns are 64px apart. The hero runs 80px above
and 40px below (56/48 on phones); its headline, lead and buttons are 28px apart (20px on
phones), and on phones the playground starts 40px below with the tiles 16px above the window.
Hero copy is the client-approved line (2026-11-04): headline "Know your stock. Track your
money. Grow your business." with the last sentence in blue, each sentence kept whole
(`.nowrap`), so it sets as two lines from tablet up and one sentence a line on phones. The
tagline "Smarter. Faster. Better." sits under it at 24px / 600 navy (20px on phones), 20px
below the headline and 16px above the lead; the footer repeats it under the logo.
On phones the footer is the brand and tagline, then one ruled row per link group: the small
uppercase label in a 116px left column and its links stacked on the right, baseline-aligned;
the copyright lines sit 6px apart under a final rule.

WhatsApp prompt (contact column, option B chosen 2026-10-29): no card. A hairline, the
question "Rather chat?" (28px bold, 24px on phones) and one green (`green-700`) underlined
link, "Message the Joryka team on WhatsApp →" (20px, 17px on phones), which opens WhatsApp
with `CONFIG.whatsappText`. "WhatsApp →" never wraps apart. Figma component: "WhatsApp line"
(the rejected options A and C stay on the options board beside the mobile frame).

Request a demo form (from Figma): full name and business name, phone number or email,
an optional message, and the button. There is no business-type field. The modules
strip sits on `paper` with its "One system for" label in `blue`.

## Shape and depth

Pill buttons (999px) on the page; 10px app buttons; 8px chips, icon buttons and small
squares; 12px controls; 14px tiles and app cards; 16px cards and modals; 20px app window;
24px form. Hairline `navy-200` borders on page cards. Shadows: a soft card shadow and one
large lift for floating objects (the app window, modals, the offline cart, the demo form).

## Motion

Entrances fade and rise once. Tiles bob; the wire marches; the strip scrolls every module
in a continuous loop (pauses on hover). App pages fade in over 320ms; modals rise; the AI
side panel slides in from the right. All motion stops under `prefers-reduced-motion`, and
the strip becomes a wrapped list.

## Notifications

The demo form's result also shows as a toast that looks like the Joryka dashboard's: top
right, just under the sticky header (full width with 16px sides on phones), a 356px card
with a 12px radius, hairline border, soft card shadow, a type icon, 14px / 500 text and a ✕
in the top-right corner (muted at rest, light tint on hover, 44px tap area). Colours come
from the status tokens: success `green-50` / `green-200` / `green-700`; error `red-50` /
`red` mixed with white for the border / `red`; spare warning (`amber-*`) and info
(`blue-50` / `navy-300` / `blue`). Success stays 4s, errors 8s; the timer pauses on hover,
while the ✕ has focus and while the tab is hidden; a new toast replaces the old one. It
fades in and drops 8px over 200ms, with no motion under `prefers-reduced-motion`.
Toasts are only for the send result: none for field errors (they stay under each field)
and none while sending (the button says "Sending…"). The inline message under the form
stays as the screen-reader announcement and the lasting record, green on success and red
on errors, and it keeps the WhatsApp link, which never goes in a toast. The playground's
own navy toast (bottom centre, inside the sample app's story) is separate and unchanged.

## Content rules

- One sample shop across the page, the playground and the promo video (`../Joryka promo video/sample-shop.json`; the playground keeps its own copy of
  the figures in `app.js`):
  generic product names, ₦ prices, Primary and Secondary Warehouse, Aisha Bello owing
  ₦15,000, Tunde Adeyemi ₦7,500, Tin Tomato out of stock, Sugar low.
- No invented prices for Joryka, testimonials, metrics, contact details or login URLs.
  Pricing is labelled as placeholders until launch.
- Joryka AI answers show what they're based on and say plainly when the records can't
  explain something. All AI copy is written fresh from the sample data, never lifted
  from briefs.
