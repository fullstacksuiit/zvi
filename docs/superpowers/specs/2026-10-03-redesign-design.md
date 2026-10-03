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

Top to bottom:

1. **Tricolour stripe.** A 4 px saffron, white and green band at the top of the page.
2. **Nav.** The logo and "Zain Ventures" on the left. On the right are the links Tickets (`#tickets`), Reserve (`#reserve`) and FAQ (`#faq`), and a gold **Book ticket** button that goes to the booking page. On a phone (≤ 640 px), show only the logo, Book ticket and a call icon. The nav has no menu toggle.
3. **Hero.** One short headline and one supporting line. Below them are two service cards: side by side on desktop, stacked on a phone.
   - **Tickets card (`#tickets`).** Title "Rourkela ⇄ Patna". The route line with five stops. "Daily · AC 2+2 pushback". A gold **Book online** button (booking page), then Call and WhatsApp as secondary links.
   - **Reserve card (`#reserve`).** Title "Hire a bus or car". The fleet list: AC and non-AC buses with 20–50 seats, and sedans and SUVs. One use-case line: weddings, tours, pilgrimages, corporate trips. **Call** and **WhatsApp** buttons.
4. **FAQ (`#faq`).** 4–5 questions in `<details>` elements, only about the two services. Example questions: how to book a ticket, where the bus stops, how to reserve a bus, which vehicles you can hire, how to pay.
5. **Footer.** Contact details, the address, a small flag mark next to "India", and a copyright line with a fixed year.
6. **Phone bar.** Fixed to the bottom on screens ≤ 640 px: Book ticket · Call · WhatsApp. Add bottom padding to the page so the bar does not hide content.

The cards hold the full service detail. The page has no separate route, fleet or "why us" sections.

## Visual system

- **Background:** white `#fff`. **Text:** near-black `#111`. **Muted text:** `#555`. **Rules:** `#e5e5e5`.
- **Accent:** gold `#C9A227`. Use it only as a fill, a line or a dot: buttons, the route line, stop dots and card top borders. Never use gold for text on white, because it fails contrast. Gold buttons have black text.
- **Tricolour:** only the top stripe and the footer flag mark.
- **Font:** the system font stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`). No web fonts.
- **Motion:** none, except a hover colour change on buttons. Respect `prefers-reduced-motion`.
- **Tap targets:** at least 44 × 44 px.

## Performance budget

- Whole page under 30 KB transferred on first load.
- Lighthouse mobile performance score ≥ 95, and cumulative layout shift (CLS) of 0.
- CSS inlined in `<head>`, under 8 KB.
- No JavaScript.
- No web fonts and no third-party requests.
- The logo resized to 80 px and saved as WebP (about 3 KB), with `width` and `height` set.
- The route line drawn in inline SVG or CSS (about 1 KB).

## Files

| File | Change |
|---|---|
| `index.html` | Rewrite with inline CSS. |
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
