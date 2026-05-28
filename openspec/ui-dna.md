---
name: ui-dna
description: Design system DNA for SpecADEWeb — tokens, patterns, motion, a11y, voice, layout, anti-patterns
metadata:
  type: reference
---

# SpecADEWeb — UI DNA

## Design Tokens

**Color** — dark-first. Three surface levels create depth without shadow: `bg` (deepest) → `surface` → `raised`. Accent is cyan (`#22d3ee` dark / `#0a5f75` light). Secondary accent is purple. Text has three tiers: primary, secondary (muted prose), muted (labels, placeholders). Borders have two weights: `border` (default) and `border-strong` (hover/emphasis).

**Spacing** — 4px base, doubling scale: 4 / 8 / 16 / 24 / 32 / 48 / 64px. Section vertical padding uses `clamp()` fluid values (e.g. `clamp(72px, 9vw, 112px)`). Component internal gaps use 8–24px.

**Typography** — IBM Plex Sans (sans) + Lilex/JetBrains Mono (mono). Section titles: `clamp(1.875rem, 3.5vw, 2.75rem)`, weight 700, tracking `-0.025em`. Body: `clamp(1rem, 1.4vw, 1.0625rem)`, line-height 1.7. Labels/chips: 11px, weight 600, uppercase, tracking 0.06–0.12em. Mono used for code, metrics, and technical identifiers.

**Radius** — 4 / 6 / 8 / 12 / 16 / 24px. Cards use `radius-xl` (16px) or `radius-2xl` (24px). Buttons use `radius-md` (8px). Chips use 999px (pill).

**No box-shadow** — depth is expressed through border color changes and background level shifts, not shadows. Exception: trust cards use a very subtle accent-tinted shadow on hover only (not structural).

## Component Patterns

**Chip** — pill badge, 11px uppercase, accent-soft background, accent border. Used for section labels and status tags. Variants: warning-tinted (coming soon), accent (default).

**Button** — three variants: `btn-primary` (solid accent fill, dark text), `btn-secondary` (transparent, border), `btn-ghost` (no border, muted text). Primary lifts 1px on hover. All use `ease-out-soft` transition.

**Cards** — `glow-card` (surface bg, border, xl radius, border-strong on hover). `surface` and `surface-raised` for panels. Cards never use box-shadow as primary depth signal.

**Icon badge** — 40×40px, `radius-md`, accent-soft bg. Purple variant available. Used inline with stat/feature content.

**Section structure** — chip label → h2 title → optional subtitle paragraph. Header block has `max-width: 44rem`. Content follows below with `margin-bottom: 56px` gap.

**Comparison table** — highlighted column uses `color-mix` accent tint + left border accent. Row hover shifts bg from `bg` to `surface`.

**FAQ accordion** — `<details>/<summary>` native. Chevron rotates 180° on open. Number prefix in mono accent color.

**CopyBlock** — mono code display with clipboard icon, icon swaps to checkmark on copy.

## Interaction & Motion

**Easing** — `ease-out-soft: cubic-bezier(0.32, 0.72, 0.24, 1)` for most transitions. `ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy reveals.

**Duration** — 150ms for micro (hover bg), 200ms for buttons, 250ms for border/transform, 600–700ms for scroll reveals.

**Scroll reveal** — `.reveal` class. CSS `animation-timeline: view()` when supported; JS `IntersectionObserver` fallback for `.no-scroll-timeline`. Staggered with `animation-delay` on grid children (50–80ms increments).

**Shine sweep** — `.shine-hover::after` pseudo-element sweeps left→right on hover. Subtle (4% white in dark, 3% black in light).

**Layer hover** — architecture layer cards slide `translateX(4px)` on hover (horizontal slide, not lift).

**Reduced motion** — all animations disabled via `prefers-reduced-motion: reduce`. No exceptions.

## Accessibility Baseline

- Focus ring: `outline: 2px solid var(--color-accent)`, `outline-offset: 2px`, `radius-xs`. Inset variant for FAQ summary.
- Skip link present in BaseLayout, visually hidden until focused.
- `.sr-only` utility for screen-reader-only text.
- `aria-hidden="true"` on decorative SVGs and dividers.
- `aria-label` on sections with no visible heading (trust row, protocols panel).
- `<details>/<summary>` for FAQ — native keyboard accessible.
- Color contrast: dark theme accent cyan on dark bg passes AA. Light theme uses darker cyan (`#0a5f75`) to maintain contrast.

## Voice & Tone

- Concise, technical, confident. No marketing fluff.
- Section labels are short nouns or verbs (chip text).
- Body copy is 1–2 sentences, factual.
- Stats use mono font to signal precision.
- "Coming soon" uses warning chip, not disabled state.

## Layout & Responsive

**Containers** — `container-wide` (max 82rem) for most sections, `container-narrow` (max 64rem) for focused CTAs.

**Breakpoints** — mobile-first. Key breaks: 640px (2-col grids), 768px (4-col trust, 3-col pillars, horizontal license banner), 1024px (2-col spotlight, hero, architecture).

**Section rhythm** — alternating `bg` / `surface` backgrounds separated by `border-block` lines. Spotlights alternate `default` (bg) / `accent` (surface) tone.

**Spotlight layout** — 1fr/1fr at 1024px+. `flip` prop reverses visual/copy order on desktop only (stacks normally on mobile).

**Hero** — 1.1fr/0.9fr at 1024px+ (copy slightly wider than visual).

## Anti-Patterns

- No box-shadow as primary depth signal — use border + bg level instead.
- No inline hardcoded copy outside i18n strings (except Architecture protocols which are tech-specific and not translated).
- No `!important` except for comparison table column highlight overrides (necessary due to specificity conflict with tbody tr styles).
- No decorative gradients on text — accent color is applied directly.
- No fixed pixel font sizes for headings — always `clamp()` for fluid scaling.
- No hover effects that change layout flow (no `width`/`height` transitions that shift siblings).
