# Zain Ventures India website

The one-page site at https://zainventures.in. It shows two services: the daily Rourkela ⇄ Patna AC bus, and bus and car hire.

## Files

- `index.html` — the whole page, with the CSS and the JavaScript inline. No build step, no web fonts, no libraries.
- `logo.webp` — the logo on the page. `logo.png` and `logo-96.png` are for the favicon, the manifest and social previews.
- `llms.txt` — the same facts in plain text, for AI assistants.
- `site.webmanifest`, `sitemap.xml`, `robots.txt`, `CNAME` — site metadata.

## Facts that live in more than one place

The times, the fare and the stops come from the booking page. When they change, update all of these:

- the timetable and the Questions section in `index.html`
- the structured data (`application/ld+json`) at the top of `index.html`
- `llms.txt`

## How the page works

- The page works without JavaScript. The script only adds motion.
- One scroll-progress number drives the route section: the bus, the sky, the lights and the map.
- The search in the hero loads its result in the booking card lower on the page.

## Credits

The state outlines in the route section come from DataMeet India (Election Commission of India boundaries), licence CC BY 2.5 IN.

## Preview

Open `index.html` in a browser.

## Deploy

GitHub Pages publishes the `gh-pages` branch. A push to `gh-pages` updates the live site in a few minutes.
