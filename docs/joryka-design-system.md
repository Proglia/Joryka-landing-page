# Joryka — Design System (extracted from dev.joryka.com)

Source: compiled stylesheet `assets/index-BE5ECkrH.css` (Tailwind v4.1.12, shadcn/ui-style tokens, Radix primitives). Values below are read directly from it.

## Colors — semantic tokens

| Token | Value | Role |
|---|---|---|
| `--background` | `#fff` | Page background |
| `--foreground` | `oklch(14.5% 0 0)` | Body text |
| `--card` / `--card-foreground` | `#fff` / `oklch(14.5% 0 0)` | Cards |
| `--popover` / `--popover-foreground` | `oklch(100% 0 0)` / `oklch(14.5% 0 0)` | Popovers, menus |
| `--primary` | `#2e4aff` | Primary actions |
| `--primary-foreground` | `#fff` | Text on primary |
| `--secondary` | `#f1f0f7` | Secondary surface |
| `--secondary-foreground` | `#11102d` | Text on secondary |
| `--muted` | `#ececf0` | Muted surface |
| `--muted-foreground` | `#6b6785` | Secondary text |
| `--accent` / `--accent-foreground` | `#2e4aff` / `#2e4aff` | Accent |
| `--destructive` / `--destructive-foreground` | `#d4183d` / `#fff` | Errors, delete |
| `--border` | `oklch(0% 0 0 / 0.1)` | Borders (10% black) |
| `--input` | `transparent` | Input border |
| `--input-background` | `#f3f3f5` | Input fill |
| `--switch-background` | `#cbced4` | Switch off state |
| `--ring` | `#2e4aff` | Focus ring (50% mix applied) |

## Colors — sidebar

| Token | Value |
|---|---|
| `--sidebar` | `#11102d` |
| `--sidebar-foreground` | `#e5e3f5` |
| `--sidebar-primary` | `#425bff` |
| `--sidebar-primary-foreground` | `#fff` |
| `--sidebar-accent` | `#2a2660` |
| `--sidebar-accent-foreground` | `#fff` |
| `--sidebar-border` | `#2a2660` |
| `--sidebar-ring` | `#0aeb95` |

## Colors — brand and charts

| Token | Value |
|---|---|
| `--brand-primary` | `#2e4aff` |
| `--brand-primary-dark-bg` | `#425bff` |
| `--brand-secondary` | `#11d58a` |
| `--brand-secondary-dark-bg` | `#0aeb95` |
| `--brand-neutral-dark` | `#11102d` |
| `--brand-neutral-light` | `#fff` |
| `--chart-1` … `--chart-5` | `#2e4aff`, `#11d58a`, `#11102d`, `#6d82ff`, `#5fe3b3` |

## Typography

| Item | Value |
|---|---|
| Font stack | `ui-sans-serif, system-ui, sans-serif` (+ emoji fonts); mono: `ui-monospace, SFMono-Regular, Menlo, …` |
| Some components | `font-['Inter:Regular' / 'Inter:Medium' / 'Inter:Semi_Bold' / 'Inter:Bold']` (Figma-export classes; no Inter font-face is loaded by the stylesheet) |
| Root size | `--font-size: 16px` |
| Weights | normal 400 · medium 500 · semibold 600 · bold 700 |
| Tracking | tight −0.025em · wide 0.025em · wider 0.05em · widest 0.1em |
| Leading | tight 1.25 · snug 1.375 · relaxed 1.625 |

| Scale | Size | Line height |
|---|---|---|
| `text-xs` | 0.75rem (12px) | 1.333 |
| `text-sm` | 0.875rem (14px) | 1.429 |
| `text-base` | 1rem (16px) | 1.5 |
| `text-lg` | 1.125rem (18px) | 1.556 |
| `text-xl` | 1.25rem (20px) | 1.4 |
| `text-2xl` | 1.5rem (24px) | 1.333 |
| `text-3xl` | 1.875rem (30px) | 1.2 |

Off-scale sizes also in use: 9, 10, 11, 12, 13, 14, 20px and 0.8rem.

Base element styles: `h1` 24px/500 · `h2` 20px/500 · `h3` 18px/500 · `h4`, `label`, `button` 16px/500 · `input` 16px/400 · all line-height 1.5.

## Spacing, radius, layout

| Item | Value |
|---|---|
| Spacing unit | `--spacing: 0.25rem` (4px) |
| `--radius` | `0.625rem` (10px) |
| `rounded-sm` / `md` / `lg` / `xl` | 6px / 8px / 10px / 14px |
| `rounded-2xl` | 1rem (16px) |
| Containers | xs 20rem · sm 24 · md 28 · lg 32 · xl 36 · 2xl 42 · 3xl 48 · 4xl 56 · 7xl 80 |
| Transition default | 150ms, `cubic-bezier(0.4, 0, 0.2, 1)` |

## Directly used hex colors (outside tokens)

`#2E4AFF` brand blue · `#11102D` navy · `#11D58A` green · `#2A2660` · `#E4E1F0` · `#F6F5FC` · `#F3F3F5` · `#040484` · `#155DFC` · `#00A63E` · `#00C950` · `#DCFCE7` · `#F3E8FF` · `#FAF5FF` · `#EFF6FF` · `#F9B80A` · `#84D4F6` · `#353A58` · `#787C81` · `#050C1C` · `#E2E8F0`

Tailwind palette steps in use: red, orange, amber, green, emerald, teal, cyan, blue, indigo, violet, purple, pink, rose, slate, gray.

## Notes

- No `.dark` token block exists, so dark mode is not themed (`dark:` utilities are present but undefined).
- Animations: spin, pulse, bounce, enter, exit, accordion-down, accordion-up, caret-blink.
- `--accent` and `--primary` are the same blue; `--accent-foreground` is also that blue (not a contrasting color).
