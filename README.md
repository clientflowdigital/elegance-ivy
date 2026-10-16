# Elegance Ivy website

Plain HTML/CSS/JS, no build step. Deployed on Vercel (`vercel.json` gives clean URLs: `/about`, `/projects/odyssey-lodge` …).

## Preview locally
```
npx serve .
```
then open http://localhost:3000 (pages use root paths like `/css/…`, so opening the files directly won't work).

## Where things live
| What | File |
|---|---|
| Contact details, projects, services, testimonials, **Facebook videos** | `js/data.js` |
| Header, menu, footer, WhatsApp button, back button | `js/layout.js` |
| Cards and galleries built from the data | `js/render.js` |
| Photo viewer | `js/lightbox.js` |
| Contact form (email app + WhatsApp) | `js/contact.js` |
| Design tokens, tones, type, animations | `css/base.css` |
| Header / footer / page hero styles | `css/layout.css` |
| Buttons, cards, galleries, form | `css/components.css` |
| Home-only styles (hero, philosophy, detail lens, films) | `css/home.css` |
| Page text | the page's own `.html` file |

## Design system ("The Monograph")
The site is styled like a printed hotel or architecture book.
- **Type:** Bodoni Moda for headings (capitals, with italic brass accent words written as `<em>`), Jost for text. Both load from Google Fonts.
- **Tones:** sections are dark (espresso) by default. Add `tone-paper` (ivory) or `tone-stone` (travertine) to a `<section>` to make it light. Components use only the semantic tokens in `css/base.css` (`--bg`, `--fg`, `--accent` …), so they work on either tone. Don't hard-code colours.
- **Page furniture:** `.folio` (numbered running header at the top of a section), `.ghost` (giant outlined word), `.ornament`, `.dropcap`, `.plate` (full-bleed background picture).
- **Brand mark:** `images/brand/mark.png` is the round crest cut from the logo; the header pairs it with the name set in type. Replace it with a vector logo when the client supplies one.
- **Photo grading:** `--grade` in `css/base.css` slightly warms and calms photos so site and interior shots sit together. Set it to `none` to switch it off.
- **Feature images:** `images/feature/` holds client-supplied mood images (pavilion, tower, bar). Use them only as backgrounds, not as Elegance Ivy projects, until the client confirms they are their own work.

## Common edits
- **Add a Facebook video:** add an entry to `EI.videos` in `js/data.js` (title, Facebook URL, cover photo). The Videos page and a "Watch our work" strip on the home page appear automatically.
- **Contact form:** "Open in email app" opens the visitor's own email app with the enquiry pre-written, and "Send on WhatsApp" does the same in WhatsApp. No form service is used, so enquiries are never stored by a third party.
- **Project cover:** set `cover: 'NN'` on a project in `js/data.js` to choose the photo shown on cards and home page spreads (default `01`).
- **Home page projects:** edit the slugs in `data-project-spreads="…"` in `index.html`.
- **Add photos to a project:** add `NN.jpg` (max ~2000px) and `NN-sm.jpg` (~900px) to `images/projects/<project>/`, then raise that project's `count` in `js/data.js`.
- **Add a project:** new folder in `images/projects/`, an entry in `EI.projects`, and a page in `projects/` (copy an existing one).
- **Films** (home page "On site, on film" and top of Videos): `videos/karanda-maternity.mp4` (cover `images/videos/karanda-maternity-poster.jpg`) and `videos/builder-crew.mp4` (cover `images/videos/builder-crew-poster.jpg`). Videos are cached for a year, so to replace it use a **new file name** and update both pages. Convert phone footage first, e.g. `ffmpeg -i IN.MOV -vf "scale=720:-2,fps=30" -c:v libx264 -crf 29 -preset slow -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart OUT.mp4`.
- **Security headers** live in `vercel.json`. The Content-Security-Policy allows the two inline `<script>` blocks (the `js` class one-liner on every page, and the old-link redirect on the home page) by their SHA-256 hash. If you edit either script, update its hash in `vercel.json` or the browser will block it.

## Not deployed
`uploads/` (original photos) and `_old-site/` (the previous single-file site) are excluded by `.vercelignore`.
