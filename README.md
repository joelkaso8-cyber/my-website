# my-website

Joel Kaso's personal hub: who Joel is, his websites for small businesses and PC Remote, and a WhatsApp chat one tap away. Plain HTML, CSS and JavaScript, hosted for free on Netlify.

**Live site:** https://joelkaso8-website.netlify.app/

The design is a port departures board ("Nisjet / Departures"). The board at the top flips its letters as you scroll down and back as you scroll up.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page: header, departures board, What I make, How I work, First departure, boarding-pass contact, footer |
| `content.js` | All texts in English and Albanian, the board rows, phone, email and links. **Change texts here.** |
| `script.js` | The flipping board, the Tirana clock, the language switch, WhatsApp links, the phone WhatsApp bar |
| `styles.css` | Colours, fonts, sizes and layout. Colours are variables at the top. |
| `fonts/` | Sofia Sans Extra Condensed (board and headings) and Sofia Sans (text), served from this repo |
| `img/` | Screenshots of the sites and of PC Remote. Each image has a `.json` note saying where it came from. |
| `og.jpg` | The picture shown when the link is shared |
| `favicon.svg` | The browser-tab icon |
| `CLAUDE.md` | Joel's rules for every website |
| `netlify.toml` | Netlify settings: no build step, publish this folder, security and cache headers |
| `robots.txt`, `sitemap.xml` | Tell search engines what to crawl; update `lastmod` in the sitemap after big edits |
| `.nojekyll` | Only used if the site is also served from GitHub Pages |

## Change a text

Open `content.js`. Every text is there twice, under `en:` and `sq:`. Change both. The English texts are also written in `index.html`, which is what shows before JavaScript runs; if you change an English text, change it there too.

## Change the board

The rows are in `content.js` under `board`. Each row has `service`, `to`, `gate` and `status`. Keep them in capitals. The longest values that fit are 14 letters for service, 19 for to, 2 for gate and 15 for status.

## Phone, WhatsApp, email

Change `wa`, `waDisplay` and `email` at the top of `content.js`. The number also appears in `index.html` (the `tel:` link and the JSON-LD block); change it there too.

## Previewing locally

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000 and check phone width, both languages (`?lang=sq`), and scroll the board up and down.

## Publishing

The site is the Netlify project `joelkaso8-website`. Once that project is linked to this repository (Netlify: Project configuration, Build & deploy, Continuous deployment, Link repository), every push to `main` goes live within a minute. Leave the build command empty; `netlify.toml` sets the publish folder.
