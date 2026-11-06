# Joryka landing page

The pre-launch marketing site for **Joryka**, business management software for retailers and wholesalers in Nigeria: point of sale, inventory, customer credit and reports in one system that keeps selling when the internet goes down.

> **Know your stock. Track your money. Grow your business.**
> Smarter. Faster. Better.

The page explains the product, lets visitors try a sample of the app in the browser, plays a 77-second product tour, and gives them three ways forward: **Request a Demo**, **Chat on WhatsApp** and **Login**.

## Tech

Plain static files with no framework, build step or dependencies:

| File | What it is |
| --- | --- |
| `index.html` | The whole page, including the inline SVG icon sprite |
| `styles.css` | All styles, mobile-first, with breakpoints at 720px and 1199px |
| `app.js` | The interactive playground (sample shop data and logic), demo form, WhatsApp/login links, reveal animations and video player |
| `assets/` | Logos and the product tour (`joryka-tour.mp4`, its captions `.vtt` and poster `.jpg`) |

The font is Inter, loaded from Google Fonts.

## Run it locally

Serve the folder with any static server, for example:

```bash
npx serve .
```

Then open the address it prints (usually http://localhost:3000). Opening `index.html` straight from the file system also works, but the video captions need a server.

## Before launch: configuration

Open `app.js` and fill in the `CONFIG` block at the top:

```js
const CONFIG = {
  loginUrl: '',        // the Joryka app URL, used by every "Login" link
  whatsappNumber: '',  // international format, digits only, e.g. '2348000000000'
  whatsappText: 'Hello Joryka, I would like to know more about the POS for my business.',
  demoEndpoint: '',    // form / CRM endpoint that accepts a JSON POST
};
```

- **`loginUrl`:** until it's set, the Login links stay on the page.
- **`whatsappNumber`:** until it's set, WhatsApp buttons scroll to the contact section instead of opening `wa.me`. Use the official business number the client has approved for the site.
- **`demoEndpoint`:** until it's set, the demo form validates but shows "Preview only… nothing was sent." Once set, it POSTs the form fields as JSON, plus `source_page` and `created_at`.

**Analytics.** Buttons and links carry `data-track` names. If a `window.dataLayer` exists (for example, Google Tag Manager), each click is pushed as `{ event, placement }`. No personal data is sent.

## Deploying

The live site needs only these files:

```
index.html
styles.css
app.js
assets/
```

Upload them to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages or S3). `docs/`, `DESIGN.md` and `PRODUCT.md` are reference material for the team and don't need to be published.

## Documentation

| File | Contents |
| --- | --- |
| `DESIGN.md` | Design spec for this page: colours, type, spacing per breakpoint, and the rules and decisions for every section |
| `PRODUCT.md` | Product brief: audience, brand voice, and what the page may and may not claim |
| `docs/PRD.md` | Product requirements for the landing page |
| `docs/Joryka - SRS.md` | Software requirements for the Joryka app itself |
| `docs/joryka-design-system.md` | The app's colour and type values, which this page follows |

The Figma file (page **"Landing page"**) holds the desktop and mobile designs and matches this code.

## Content rules

- No invented prices, testimonials, customer logos, metrics or contact details. Pricing shows plan structure only, until real prices are approved.
- Name the AI feature **Joryka AI**.
- Keep to WCAG AA contrast, and make every hover effect also work on touch screens.

## Updating the product tour

The video is produced in a separate Remotion project, not stored in this repo. When it changes, replace these three files in `assets/`, keeping the names:

- `joryka-tour.mp4`: web encode, 1920×1080
- `joryka-tour.vtt`: captions
- `joryka-tour-poster.jpg`: poster frame

Then update the running time in the tour section of `index.html` (the `aria-label` and the "1:17 · captions available" line).
