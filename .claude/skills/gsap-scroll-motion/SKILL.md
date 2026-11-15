---
name: gsap-scroll-motion
description: Implement Lenis smooth inertia scrolling synced with GSAP ScrollTrigger, masked line-by-line text reveals, and mobile-safe matchMedia choreography.
---

# GSAP scroll motion

Use this for any scroll or entrance animation in a React site. Reference: `studio/src/components/layout/SmoothScroll.tsx`,
`studio/src/lib/reveal.ts`, `studio/src/components/sections/Hero.tsx`.

## Rules
1. Register plugins once, client-side only:
   ```ts
   "use client";
   import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger"; import { useGSAP } from "@gsap/react";
   if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);
   export { gsap, ScrollTrigger, useGSAP };
   ```
2. Every tween, timeline and ScrollTrigger is created inside `useGSAP(() => { … }, { scope: ref })`. Manual
   listeners added there are removed in the returned cleanup. Never call `gsap.to` in a bare `useEffect`.
3. Eases: `power3.out` (UI, body copy), `power4.out` (rules, larger moves), `expo.out` (headlines, springs back).
   `ease: "none"` only for scrubbed scroll links. No `linear` entrances, no `back`/`elastic`/`bounce`.
4. Durations 0.9 to 1.4 s for reveals; stagger `0.06` for lines, `0.06 to 0.08` for groups.
5. Animate transforms and opacity only (`x`, `y`, `yPercent`, `scale`, `autoAlpha`). Never width/height/top.

## Lenis + GSAP ticker (one clock)
```tsx
useEffect(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // native scroll
  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -24 } });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); lenis.destroy(); };
}, []);
```
CSS: `html.lenis, html.lenis body { height: auto } .lenis.lenis-smooth { scroll-behavior: auto !important }`.
Lenis smooths the native scroll; it must never lock the page or capture the wheel.

## Masked line reveal
Markup: each line is `<span class="mask"><span>Line</span></span>` (mask = `overflow-hidden`, block).
```ts
gsap.from(block.querySelectorAll(".mask > span"), {
  yPercent: 100, duration: 1.2, ease: "expo.out", stagger: 0.06,
  scrollTrigger: { trigger: block, start: "top 82%" },
});
```
On load (hero), same tween with `delay: 0.15` and no ScrollTrigger. Body copy follows with
`{ y: 18-36, autoAlpha: 0, ease: "power3.out" }`. Hairlines draw with `scaleX: 0 → 1, transformOrigin: "left center", ease: "power4.out"`.
Keep the selectors in a shared `revealIn(scope)` helper driven by `data-reveal`, `data-rise`, `data-rule` attributes.

## Scroll-scrubbed hero (the "film")
The hero section is taller than the viewport (`h-[165svh] md:h-[210svh]`) and its stage is `sticky top-0 h-svh`,
so the hero holds still while its film plays and the page keeps scrolling normally. Progress goes 0 → 1 going
down and back to 0 going up:
```ts
ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom",
  onUpdate: (s) => { heroState.progress = s.progress; root.current!.style.setProperty("--p", s.progress.toFixed(4)); } });
```
The film can be a scrubbed `<video>` (seek `currentTime`, whole file fetched as a blob for smooth seeks), an
image sequence on a canvas, or a WebGL scene reading `heroState.progress` with damping. Headline and primary CTA
stay readable the whole time; reduced motion or a failed load shows a still poster and hides nothing.

## Parallax and scrub
```ts
gsap.fromTo(el, { yPercent: 18 }, { yPercent: -10, ease: "none",
  scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
```

## Responsive choreography with gsap.matchMedia()
```ts
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
    const { desktop, reduce } = ctx.conditions!;
    if (reduce) return;                       // content is already visible: nothing hidden
    gsap.from(".hero-line > span", { yPercent: 100, stagger: 0.06, duration: desktop ? 1.3 : 1, ease: "expo.out" });
    if (desktop) { /* pins, horizontal sections, heavier parallax */ }
  });
  return () => mm.revert();
}, { scope });
```
Phones: shorter distances, no pinning of long sections, no horizontal scroll-jacking, fewer simultaneous tweens.

## Reduced motion and safety
- `prefers-reduced-motion: reduce`: no Lenis, no reveals (elements stay in their final state), no auto drift.
- Never use `from()` tweens on content that would stay hidden if JS fails; the static HTML must be readable.
- After layout changes (fonts, images), `ScrollTrigger.refresh()` runs automatically on load; call it after
  injecting content dynamically.
- Test: scroll down and back up; the hero film must reverse, nothing may flash or stay hidden.
