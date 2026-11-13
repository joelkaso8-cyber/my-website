# my-website

Joel's personal website: plain HTML, CSS and JavaScript, hosted for free on GitHub Pages.

**Live site:** https://joelkaso8-cyber.github.io/my-website/

## Files

| File          | What it does                                                    |
| ------------- | --------------------------------------------------------------- |
| `index.html`  | The page content: header, hero, About, Projects, Contact, footer |
| `styles.css`  | All styling. Colors, fonts and spacing are variables at the top  |
| `script.js`   | Mobile menu, light/dark toggle, scroll effects, footer year     |
| `favicon.svg` | The browser-tab icon                                            |
| `.nojekyll`   | Tells GitHub Pages to serve the files as-is                     |

## Editing the site

- **Text:** edit `index.html`. Each section is marked with an `id` (`about`, `projects`, `contact`).
- **Add a project:** copy one `<li data-reveal>…</li>` block inside `<ul class="project-grid">` and change its text and link.
- **Colors:** change `--color-accent` (and the other `--color-*` variables) at the top of `styles.css`. The dark theme has its own block just below.

Every push to `main` republishes the site within a minute or two.

## Turning on GitHub Pages (one time)

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Pick **main** and **/ (root)**, then **Save**.

## Previewing locally

Open `index.html` in a browser, or run a small local server from this folder:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.
