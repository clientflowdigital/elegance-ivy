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
| Contact details, projects, services, testimonials, **Facebook videos**, **Formspree ID** | `js/data.js` |
| Header, menu, footer, WhatsApp button, back button | `js/layout.js` |
| Cards and galleries built from the data | `js/render.js` |
| Photo viewer | `js/lightbox.js` |
| Contact form (email + WhatsApp) | `js/contact.js` |
| Design tokens, type, animations | `css/base.css` |
| Header / footer / page hero styles | `css/layout.css` |
| Buttons, cards, galleries, form | `css/components.css` |
| Home-only styles (hero video) | `css/home.css` |
| Page text | the page's own `.html` file |

## Common edits
- **Add a Facebook video:** add an entry to `EI.videos` in `js/data.js` (title, Facebook URL, cover photo). The Videos page and a "Watch our work" strip on the home page appear automatically.
- **Turn on email enquiries:** create a form at formspree.io (send to sales@eleganceivy.co.zw), then paste its ID into `formspreeId` in `js/data.js`. Until then, "Send by email" opens the visitor's email app.
- **Add photos to a project:** add `NN.jpg` (max ~2000px) and `NN-sm.jpg` (~900px) to `images/projects/<project>/`, then raise that project's `count` in `js/data.js`.
- **Add a project:** new folder in `images/projects/`, an entry in `EI.projects`, and a page in `projects/` (copy an existing one).

## Not deployed
`uploads/` (original photos) and `_old-site/` (the previous single-file site) are excluded by `.vercelignore`.
