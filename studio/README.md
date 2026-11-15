# Kaso Studio

Joel Kaso's studio site: premium websites for Albanian hotels, cafés and tours.
Next.js 15 (static export), Tailwind v4, GSAP + Lenis, React Three Fiber.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

- All copy, prices, links and the studio name: `src/content/site.ts`.
- Hero: a glass sculpture of a real client site that comes apart as you scroll and reassembles on the way up.
  Poster stills in `public/hero-poster*.webp` show for reduced motion, Data Saver or no WebGL.
- Deploy on Netlify with base directory `studio` (build `npm run build`, publish `out`), see `netlify.toml`.
- Rules for working on it: `CLAUDE.md` here, the repo-root `CLAUDE.md`, and the skills in `../.claude/skills/`.
