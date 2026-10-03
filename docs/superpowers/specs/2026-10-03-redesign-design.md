# Zain Ventures site redesign

Date: 2026-10-03
Branch: `redesign-services`

## Goal

Rebuild www.zainventures.in as a minimal, fast, one-page site. The two services are the centre of the page:

1. **Bus tickets** on the daily Rourkela ⇄ Patna route.
2. **Reservations** of a whole bus or car.

A visitor on a phone sees both services in the first screen and can act on either one with one tap.

## Business facts

| Fact | Value |
|---|---|
| Route | Rourkela → Gumla → Chatra → Gaya → Patna, and the reverse |
| Frequency | Daily |
| Bus | AC, 2+2 pushback seats |
| Times and fares | Only on the booking page. The site does not show them. |
| Online booking | https://fleetmanager.pythonanywhere.com/tickets/zain-ventures-india/ |
| Reservation fleet | AC and non-AC buses (20–50 seats), sedans, SUVs |
| Phone and WhatsApp | +91 93370 00323 (`tel:+919337000323`, `https://wa.me/919337000323`) |
| Email | zainventures@outlook.com |
| Address | Rahmans Colony, Bisra, Rourkela, Sundargarh District, Odisha 769001 |

Use only the one phone number. Remove +91 80935 52723 from every file.

## Page structure

The page is the journey. Top to bottom:

1. **Tricolour stripe.** A 4 px saffron, white and green band at the top of the page.
2. **Nav.** The logo and "Zain Ventures" on the left. On the right: the links Tickets (`#tickets`), Reserve (`#reserve`) and FAQ (`#faq`), and a gold **Book ticket** button (booking page). On a phone (≤ 640 px), show only the logo, a call icon and Book ticket. Below 380 px, hide the name.
3. **Hero.** The small line "Daily · AC · 2+2 pushback", the headline "Rourkela to Patna, every day.", one supporting line, a gold **Book ticket** button and an outlined **Hire a bus or car** button (`#reserve`). A neutral white sheen sweeps once across the hero on load. No gold glow. A "Take the journey" link points down to the route.
4. **Journey (`#tickets`).** A vertical gold route with five stops. Each stop has the place name, its state and one line:
   - Rourkela (Odisha): "Board in comfort." AC bus, 2+2 pushback seats, every day.
   - Gumla (Jharkhand): "Through the green hills of Jharkhand."
   - Chatra (Jharkhand): "Forests and quiet roads."
   - Gaya (Bihar): "Past Bodh Gaya, where the Buddha found enlightenment."
   - Patna (Bihar): "On the banks of the Ganga. You've arrived." Then a gold **Book your seat** button, and call or WhatsApp.
5. **Reserve (`#reserve`).** "Hire a bus or car": AC and non-AC buses with 20–50 seats, sedans and SUVs; weddings, tours, pilgrimages and corporate trips; **Call** and **WhatsApp** buttons.
6. **FAQ (`#faq`).** Five questions in `<details>` elements, only about the two services.
7. **Footer.** Contact details, the address, a short saffron-white-green rule, and a copyright line with a fixed year.
8. **Phone bar.** Fixed to the bottom on screens ≤ 640 px: Book ticket · Call · WhatsApp.

## Journey motion

- As the visitor scrolls, a glowing gold light moves down the route, and the line fills in gold behind it. A "reading line" at 60 % of the screen height sets the light's position.
- When the reading line passes a stop, its dot fills gold, its state label turns gold and its name turns from muted to full white. Text never drops below WCAG AA contrast.
- The light eases toward its target position, so it never jumps.
- The content is visible by default, and the script only adds the animated state (progressive enhancement). Without JavaScript, or with `prefers-reduced-motion`, all stops show at full opacity on a static route line, and the light is hidden.

## Visual system

- **Surfaces:** every section is shiny black: deep black `#050505` with a soft white sheen at the top and a 1 px highlight edge. A faint gold hairline marks each seam. The reserve panel uses the same gloss. No matte or white sections.
- **Text:** warm white `#f4f1ea`. **Muted text:** `#a39e94`. **Rules:** `#262626`.
- **Accent:** gold `#C9A227` for decoration: buttons, the route line, stop dots and thin rules. No gold halos or glows. Gold buttons have near-black text.
- **Tricolour:** colours only, in the top stripe, short rules above section labels and a short footer rule. No flag symbols, no Ashoka Chakra and no map of India anywhere.
- **Fonts:** system fonts only. Serif headings (`"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`), sans-serif body (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). No web fonts.
- **Motion:** slow and eased; no bounces. Animate only `transform` and `opacity`.
- **Tap targets:** at least 44 × 44 px.

## Performance budget

- Whole page under 30 KB transferred on first load.
- Lighthouse mobile performance score ≥ 95, and cumulative layout shift (CLS) of 0.
- CSS and JavaScript inlined in the page. CSS under 10 KB. JavaScript under 2 KB, with no libraries.
- No web fonts and no third-party requests.
- The logo at 80 px in WebP (about 3 KB), with `width` and `height` set.
- The scroll handler is passive and updates at most once per frame (`requestAnimationFrame`).

## Files

| File | Change |
|---|---|
| `index.html` | Rewrite with inline CSS and JavaScript. |
| `styles.css`, `script.js` | Delete. |
| `logo.webp` | Add (80 px). |
| `logo.png`, `logo-96.png` | Keep for the favicon, the manifest and social previews. |
| `images/logo.jpeg` | Delete if nothing references it. |
| `site.webmanifest` | Update the name, description and colours (white and black). |
| `sitemap.xml` | Update `lastmod`. Remove the anchors that no longer exist. |
| `llms.txt` | Rewrite for the two services and the one phone number. |
| `README.md` | Rewrite in short: what the site is and how to deploy it. |
| `CNAME`, `robots.txt` | No change. |

## SEO

- Keep the title, the meta description, Open Graph, the canonical link and the `hreflang` links. Rewrite the text for the two services.
- JSON-LD: keep `LocalBusiness` (with the one phone number) and `FAQPage` (matching the visible FAQ). Add one `BusTrip` or `Service` for the Patna route and one `Service` for reservations. Remove the old routes, the trucks and the tempo travellers.

## Out of scope

- Ticket times, fares and seat selection (they stay on the fleetmanager page).
- An enquiry form for reservations.
- Other routes, trucks and tempo travellers.

## Deploy

Work on `redesign-services`. Check the result locally at 390 px and 1280 px widths, and run Lighthouse mobile. Merge into `gh-pages` only after you approve the result.
