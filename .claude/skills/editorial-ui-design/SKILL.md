---
name: editorial-ui-design
description: Build Awwwards-caliber editorial layouts, curved 3D perspective card ribbons, floating glass pill navbars, magnetic buttons, and film-grain overlays.
---

# Editorial UI design

Use this when building or restyling sections of a high-craft marketing site (React + Tailwind v4).
Reference implementation: `studio/src/components/` in this repo.

## Before writing markup
1. Put all copy, prices and lists in `src/content/site.ts`. Components only read from it.
2. Confirm the palette tokens in `globals.css` `@theme`: base (`ink` #09090B or alabaster #F5F5F3), type
   (`bone` / near-black), one accent (`copper` or the brand's). The accent is only for the primary action and
   active states.
3. Pick fonts with `next/font/google`: an editorial display face, a neo-grotesque body face, a mono for labels.

## Type utilities (globals.css)
```css
.display { font-family: var(--font-display); font-weight: 400; line-height: .92; letter-spacing: -.04em; }
.micro   { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; }
.mask    { display: block; overflow: hidden; padding-bottom: .08em; margin-bottom: -.08em; }
.mask > span { display: block; will-change: transform; }
```
Headline sizes use `clamp()`: `text-[clamp(2.6rem,6.6vw,6.5rem)]`. Micro-labels get `text-bone/60`.

## Asymmetric 12-column editorial grid
Label in the margin, headline offset, copy columns deliberately out of line, ruled index below.
```tsx
<section className="py-24 md:py-36">
  <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-5 md:px-10">
    <div data-rule className="col-span-12 h-px bg-white/10" />
    <p className="micro col-span-12 text-bone/60 md:col-span-3">(01) The studio</p>
    <MaskedTitle lines={title} italicLast className="col-span-12 text-[clamp(2.6rem,6.6vw,6.5rem)] md:col-span-9" />
    <p className="col-span-12 max-w-[62ch] md:col-span-4 md:col-start-4 md:mt-8">{a}</p>
    <p className="col-span-12 max-w-[62ch] md:col-span-4 md:col-start-9 md:mt-28">{b}</p>
    <ol className="col-span-12 md:col-span-9 md:col-start-4">
      {items.map((p, i) => (
        <li key={p.k}>
          <div data-rule className="h-px bg-white/10" />
          <div className="grid grid-cols-12 items-baseline gap-x-6 py-7 md:py-9">
            <span className="micro col-span-2 text-bone/50">0{i + 1}</span>
            <h3 className="display col-span-10 text-[clamp(2rem,3.6vw,3.25rem)] md:col-span-4">{p.k}</h3>
            <p className="col-span-10 col-start-3 md:col-span-6">{p.v}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
</section>
```
Bento case studies: `md:grid-cols-12 md:grid-rows-2`, one `md:col-span-8 md:row-span-2` feature, two `md:col-span-4`.
Pricing: ruled columns (`md:border-l border-white/10`), not boxes; only the featured tier gets an accent tint.

## Floating glass pill navbar
Top-centre on desktop, bottom-centre on phones (thumb zone). Primary action always visible.
```tsx
<header className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:bottom-auto md:top-5">
  <nav aria-label="Main" className="flex w-full max-w-[640px] items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 pl-5 backdrop-blur-md backdrop-saturate-150">
    <a href="#top" className="mr-auto py-2 text-[15px] font-medium">{BRAND.name}</a>
    <ul className="hidden sm:flex">{/* links: rounded-full px-3.5 py-2, active = bg-white/[0.07] text-bone, aria-current */}</ul>
    <a href={wa} className="min-h-11 rounded-full bg-copper px-4 text-ink transition-colors duration-300 ease-out hover:bg-copper-2">WhatsApp</a>
  </nav>
</header>
```
Track the active link with one `ScrollTrigger.create({ trigger: section, start: "top 55%", end: "bottom 55%", onToggle })` per section.

## Magnetic button
`gsap.quickTo` on x/y for the link and a smaller factor for its inner label; spring back with `expo.out`.
Only on `(hover: hover) and (pointer: fine)`; touch and keyboard get a plain link.
```tsx
const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect();
  xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.35); });
el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "expo.out" }));
```
Minimum height 48px, `rounded-full`, solid accent for the primary action, hairline glass for secondary.

## Film grain overlay
Fixed SVG `feTurbulence` noise, `pointer-events-none`, `opacity-[0.03]` to `0.04`, `mix-blend-overlay`, `z-[60]`,
`aria-hidden`. Pair it with a slow, low-opacity radial light layer behind content so dark bases feel alive
(no visible blobs; 30 s+ drift, disabled under reduced motion).

## Spotlight cards
Set `--mx/--my` on `pointermove` and paint `radial-gradient(420px circle at var(--mx) var(--my), accent/10%, transparent 65%)`
in an absolutely positioned layer that fades in on hover. No shadows.

## Curved concave 3D ribbon (CSS 3D, real links)
Cards sit on the inside of a cylinder around the viewer. Pure CSS transforms, so cards stay accessible `<a>`s.
```ts
// measure(): cardW = clamp(250, w * (w < 768 ? .74 : .34), 460); R = max(cardW * 1.9, w * .85)
// step = 2 * atan(cardW / 2 / R) in degrees + gap; stage.style.perspective = `${max(R * 1.15, 900)}px`
const wrap = (a: number) => { const s = n * step; return (((a + s / 2) % s) + s) % s - s / 2; };
card.style.transform = `translate(-50%,-50%) translateZ(${R}px) rotateY(${a}deg) translateZ(${-R}px)`;
card.style.opacity = String(abs > 72 ? 0 : 1 - Math.max(0, abs - 40) / 32); // fade at the edges
```
Input with inertia, all in one `gsap.ticker` callback:
- Pointer drag: `target += dx / cardW * step`, keep `vel` on release, `vel *= 0.92` each tick, `rot += (target - rot) * 0.12`.
- Wheel: only when `|deltaX| > |deltaY|` (trackpad sideways); never `preventDefault` vertical wheel.
- A drag over 6px cancels the click on the card it ended on.
- Prev/next buttons snap `target` to the nearest step; `onFocus` of a card rotates it to centre.
- Scroll drift: a ScrollTrigger over the section adds `(0.5 - progress) * step * 2.2` so it moves while passing.
- Section gets `overflow-x-clip`, the stage `touch-pan-y select-none cursor-grab`.

## Checklist
- No `shadow-*`, no lorem ipsum, no three centred icon cards, no white page background.
- Every image: `alt`, `width`/`height`, `loading="lazy"` below the fold. Every control: focus ring, 44px target.
- 375px check: no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`).
