# Aurelia Stone Sanctuary & Hearth (design prototype)

A cinematic 3D website prototype for a **fictional** 14-suite stone hotel and wood-fired tasting restaurant
in Southern Albania (40.2336° N, 20.3517° E). Made by Kaso Studio as a portfolio piece. It is labelled
"Demo · fictional hotel" on every screen, the booking form sends nothing, and the whole site is `noindex`
(meta robots, `X-Robots-Tag` header in `netlify.toml`, and `robots.txt`).

## Stack
Next.js 15 (App Router, static export) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis ·
three.js with React Three Fiber and drei · lucide-react. Follows `../studio/CLAUDE.md` and the repo skills
`editorial-ui-design`, `gsap-scroll-motion` and `webgl-3d-scenes`.

## Sections
1. **Hero** (`sections/Hero.tsx` + `canvas/HeroScene.tsx`): procedural travertine arches, a glass pavilion
   and a brushed-brass sun. Scrolling plays the film forward (camera walks in, stone courses lift apart,
   the sun sets) and backward going up. Poster image first; reduced motion or no WebGL keeps the poster.
2. **Curved gallery** (`sections/CurvedGallery.tsx`): concave CSS-3D ribbon of nine spaces; scroll, drag,
   sideways trackpad or arrows. Hover lifts a card and shows size and rate.
3. **Sanctuary story** (`sections/SanctuaryStory.tsx`): alabaster editorial spread, masked line reveals,
   parallax photos, facts index and the day's experiences.
4. **Gastronomy** (`sections/RestaurantShowcase.tsx` + `canvas/DecanterScene.tsx`): sticky split screen;
   a glass decanter turns with the scroll and its wine changes to each course's pairing while notes and
   dish photos crossfade. Phones get a stacked list, no pinning.
5. **Reserve + footer** (`sections/BookingFooter.tsx`): suite or table inquiry bar with a confirmation
   dialog that says it is a demo, then the architectural wordmark footer.

All copy, prices and photo ids are in `src/content/site.ts`. Photos load from `images.unsplash.com`
(allowed in `next.config.ts` `remotePatterns`); if one fails, a warm stone tone shows instead.

## Run
```
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```
Netlify: new site, base directory `aurelia`, build `npm run build`, publish `out`.
