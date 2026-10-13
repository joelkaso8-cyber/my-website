# my-website

Joel's personal website: plain HTML, CSS and JavaScript, hosted for free on Netlify.

**Live site:** https://joelkaso8-website.netlify.app/

## Files

| File           | What it does                                                     |
| -------------- | ---------------------------------------------------------------- |
| `index.html`   | The page content: header, hero, About, Projects, Contact, footer |
| `styles.css`   | All styling. Colors, fonts and spacing are variables at the top  |
| `script.js`    | Mobile menu, light/dark toggle, scroll effects, footer year      |
| `favicon.svg`  | The browser-tab icon                                             |
| `netlify.toml` | Netlify settings: no build step, publish this folder as-is       |
| `robots.txt`   | Lets search engines crawl the site and points them to the sitemap |
| `sitemap.xml`  | Lists the site's pages for Google; update `lastmod` after edits  |
| `.nojekyll`    | Only used if the site is also served from GitHub Pages           |

## Editing the site

- **Text:** edit `index.html`. Each section is marked with an `id` (`about`, `projects`, `contact`).
- **Add a project:** copy one `<li data-reveal>…</li>` block inside `<ul class="project-grid">` and change its text and link.
- **Colors:** change `--color-accent` (and the other `--color-*` variables) at the top of `styles.css`. The dark theme has its own block just below.
- **Google Search Console:** the `google-site-verification` tag in the `<head>` of `index.html` proves to Google that you own the site. Leave it in, or Search Console stops trusting the site.

## Publishing

The site is the Netlify project `joelkaso8-website`. Once the project is linked to this repository
(Netlify → **Project configuration → Build & deploy → Continuous deployment → Link repository**),
every push to `main` goes live automatically within a minute. Leave the build command empty;
`netlify.toml` already sets the publish directory.

## Previewing locally

Open `index.html` in a browser, or run a small local server from this folder:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.
