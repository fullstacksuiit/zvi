# Zain Ventures India website

The site at https://zainventures.in. It shows two services: the daily Rourkela ⇄ Patna AC bus, and bus and car hire.

## Files

- `index.html` — the home page, with the CSS and the JavaScript inline. No web fonts, no libraries.
- `rourkela-to-patna-bus/`, `bus-hire-rourkela/` and the other folders — one page for each route and each hire service. Each page targets one search, for example "Rourkela to Gaya bus". A script writes them.
- `pages.css` — the styles for those pages.
- `_build/pages.py` — the script that writes those pages and `sitemap.xml`. GitHub Pages does not publish folders that start with `_`.
- `_build/timetable.json` — the time at each stop and the fare for each pair of stops.
- `logo.webp` — the logo on the page. `logo.png` and `logo-96.png` are for the favicon, the manifest and social previews.
- `llms.txt` — the same facts in plain text, for AI assistants.
- `site.webmanifest`, `sitemap.xml`, `robots.txt`, `CNAME` — site metadata.

## Facts that live in more than one place

The times, the fare and the stops come from the booking page. When they change, update all of these:

- the timetable and the Questions section in `index.html`
- the structured data (`application/ld+json`) at the top of `index.html`
- `llms.txt`
- `_build/timetable.json`. Then run `python3 _build/pages.py` to write the route pages again.

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
