# Creative web architecture (Kaso Studio and every high-craft site)

These rules apply to everything under `studio/` and to any new site built the same way. The repo-root
`CLAUDE.md` still applies on top of this file: the scroll-driven hero brief, the Obsidian vault workflow,
conversion, SEO and accessibility rules. Where the two overlap, the stricter rule wins.

## Stack
- React with Next.js (App Router, `output: "export"` for static hosting) or Vite. TypeScript in strict mode.
- Tailwind CSS v4, tokens declared in `@theme` inside `src/app/globals.css`. No inline hex values in components.
- Motion: `gsap`, `@gsap/react` (`useGSAP`), `gsap/ScrollTrigger`, `lenis` for inertia scrolling.
- 3D: `three`, `@react-three/fiber`, `@react-three/drei`. Icons: `lucide-react`.
- Copy and data live in `src/content/*.ts`, never inside layout markup. The brand name is one constant.

## Folder structure
```
src/
  app/            layout.tsx (fonts, metadata, JSON-LD), page.tsx (assembles sections), globals.css
  content/        site.ts: every string, price, link and list
  lib/            gsap.ts (plugin registration), reveal.ts (shared scroll reveals), heroState.ts (DOM↔WebGL refs)
  components/
    layout/       SmoothScroll, PillNavbar, Footer
    ui/           GrainOverlay, MagneticButton, MaskedTitle
    canvas/       One file per <Canvas> scene, client-only, loaded with next/dynamic { ssr: false }
    sections/     Hero, CurvedGallery, EditorialShowcase, CaseStudies, Pricing …
```

## Visual system
- **Palette:** a monochrome high-contrast base, either obsidian `#09090B` or warm alabaster `#F5F5F3`, plus
  exactly one accent used only for the primary action and active states (60 / 30 / 10).
- Joel's taste on top of that: muted, never neon; no white page backgrounds; a dark base must not read as a
  flat dead black, so add a slow, very low-opacity light layer (`.aura`) and film grain.
- Never pure `#000` on `#FFF`. Body text on dark is a warm bone (`#ECE8E1`), secondary text at 60 to 75% opacity.
- **Typography:**
  - Display headings: an editorial face (Instrument Serif, Syne or Plus Jakarta Sans), `leading-[0.92]`,
    `tracking-[-0.04em]`, fluid size up to `lg:text-[6.5rem]` (use `clamp()`), weight 400.
  - Body: Inter or Satoshi, `leading-[1.6]`, `tracking-[-0.01em]`, 60 to 70ch line length.
  - Micro-labels and metadata: JetBrains Mono or Geist Mono, `text-[11px] uppercase tracking-[0.12em]`, 60% opacity.
- **Surfaces:** hairline `1px` borders (`border-white/10` on dark, `border-black/10` on light) and light glass
  (`bg-white/5 backdrop-blur-md`). Radius 18 to 22px for cards, `rounded-full` for pills and buttons.
- **Rhythm:** sections `py-24 md:py-36`; asymmetric `grid-cols-12 gap-6` layouts; content max width 1440px with
  `px-5 md:px-10` gutters.
- **Interaction:** every interactive element gets `transition-* duration-300 ease-out`, a visible focus ring and
  a hit area of at least 44px.

## Forbidden
- Generic SaaS templates, Bootstrap or Material cards, three centred icon cards in a row.
- Heavy drop shadows (`shadow-md`, `shadow-lg`, `shadow-xl`). Depth comes from borders, glass and light.
- Stock gradient blobs, purple/blue neon gradients, stock photo grids.
- `lorem ipsum`, filler copy ("Elevate", "Seamless", "Unleash"), invented clients, reviews or scarcity.
  Demo work is labelled "Demo".
- `useState` inside `useFrame`, scroll hijacking or wheel capture on vertical scroll, `// TODO` placeholders.

## Motion
- Lenis is created once in `SmoothScroll.tsx` and driven by `gsap.ticker`; `lenis.on("scroll", ScrollTrigger.update)`.
- All GSAP code runs inside `useGSAP(() => …, { scope })` so it is reverted on unmount.
- Eases: `power3.out`, `power4.out`, `expo.out`. Never `linear` (except scrubbed scroll links) or bouncy eases.
- Display headlines are split into `overflow-hidden` line masks and revealed `yPercent: 100 → 0`, stagger `0.06`.
- Responsive choreography uses `gsap.matchMedia()`; `prefers-reduced-motion: reduce` disables Lenis and reveals.

## 3D
- Each `<Canvas>` lives in its own client component with `dpr={[1, 2]}` (`[1, 1.5]` on phones) and
  `gl={{ antialias: true, alpha: true }}`; pause it with `frameloop="never"` when off screen.
- Per-frame values are refs; pointer parallax uses `THREE.MathUtils.lerp`/`damp`.
- Studio lighting via `<Environment>`; prefer `<Lightformer>` rigs so nothing is fetched from a CDN at runtime.
- Without `.glb` or `.mp4` assets, build procedural geometry (refractive glass, brushed metal) so nothing is broken.
- A poster image always sits under the canvas: shown for reduced motion, Data Saver, no WebGL, or until the
  first frame renders.

## Done means
- `npx tsc --noEmit`, `npm run lint` and `npm run build` pass with zero errors.
- Checked at 375px and 1440px: no horizontal scroll, headline and primary CTA readable the whole time.
- Lighthouse target 95+: hero poster `fetchpriority="high"`, everything below the fold `loading="lazy"`,
  explicit width/height on every image, WebP/AVIF.

## Skills in this repo
- `editorial-ui-design`: grids, pill navbar, magnetic button, grain, curved 3D ribbon.
- `gsap-scroll-motion`: Lenis + ScrollTrigger, masked reveals, matchMedia, scroll-scrubbed heroes.
- `webgl-3d-scenes`: R3F canvases, procedural glass/metal sculptures, GLB loading, parallax.
