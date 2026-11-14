#!/usr/bin/env python3
"""Writes the route pages, the hire pages and sitemap.xml. Run from the repo root: python3 _build/pages.py

The times and fares come from _build/timetable.json. The home page (index.html) is not written by this script.
"""
import json
from datetime import date
from html import escape
from pathlib import Path
from urllib.parse import quote, urlencode

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://zainventures.in"
BOOKING = "https://fleetmanager.pythonanywhere.com/tickets/zain-ventures-india/"
PHONE, PHONE_TEXT = "+919337000323", "+91 93370 00323"
TICKET_WHATSAPP, HIRE_WHATSAPP = "16812393370", "919337000323"
MAPS = "https://www.google.com/maps?cid=4369737631760114957"

TIMETABLE = json.loads((ROOT / "_build/timetable.json").read_text())
STOPS = TIMETABLE["stops"]
FARES = TIMETABLE["fares"]

# Booking-page key: (name, name in the stop table, state, name in Hindi)
TOWNS = {
    "ROURKELA": ("Rourkela", "Rourkela", "Odisha", "राउरकेला"),
    "BIRMITRAPUR": ("Birmitrapur", "Birmitrapur", "Odisha", "बीरमित्रपुर"),
    "SIMDEGA": ("Simdega", "Simdega", "Jharkhand", "सिमडेगा"),
    "GUMLA": ("Gumla", "Gumla", "Jharkhand", "गुमला"),
    "LOHARDEGA": ("Lohardaga", "Lohardaga", "Jharkhand", "लोहरदगा"),
    "CHATRA": ("Chatra", "Chatra", "Jharkhand", "चतरा"),
    "GAYA JI": ("Gaya", "Gaya (Gayaji)", "Bihar", "गया"),
    "JEHANABAD": ("Jehanabad", "Jehanabad", "Bihar", "जहानाबाद"),
    "PATNA": ("Patna", "Patna", "Bihar", "पटना"),
}

ROUTE_PAGES = [
    ("ROURKELA", "PATNA"), ("PATNA", "ROURKELA"),
    ("ROURKELA", "GAYA JI"), ("GAYA JI", "ROURKELA"),
    ("ROURKELA", "GUMLA"), ("GUMLA", "PATNA"), ("PATNA", "GUMLA"),
    ("SIMDEGA", "PATNA"), ("LOHARDEGA", "PATNA"), ("CHATRA", "PATNA"),
]

HIRE_PAGES = [
    {
        "slug": "bus-hire-rourkela",
        "title": "Bus Hire in Rourkela: Reserve a Bus | Zain Bus",
        "description": "Hire a bus in Rourkela from Zain Ventures India. AC and non-AC buses, 20 to 50 seats, for weddings, tours, pilgrimages and corporate trips. Call or WhatsApp for a price.",
        "h1": "Bus hire in Rourkela",
        "lead": "Reserve a full bus for your group. Zain Ventures India has AC and non-AC buses with 20 to 50 seats.",
        "service": "Bus hire",
        "vehicles": [("AC buses", "20 to 50 seats"), ("Non-AC buses", "20 to 50 seats")],
        "faq": [
            ("How do I hire a bus in Rourkela?", "Call or WhatsApp {phone} with your date, route and group size. We reply with a price."),
            ("Which buses can I hire?", "AC and non-AC buses with 20 to 50 seats."),
            ("How much does it cost to reserve a bus?", "The price depends on the date, the route and the size of the bus. Send us these details and we reply with a price."),
            ("Can I hire a bus for a wedding?", "Yes. We hire out buses for weddings, tours, pilgrimages and corporate trips."),
        ],
        "hindi": "राउरकेला में बस बुकिंग: शादी, टूर, तीर्थ यात्रा और कॉर्पोरेट यात्रा के लिए 20 से 50 सीट की एसी और नॉन-एसी बस किराये पर लें। तारीख, रूट और यात्रियों की संख्या के साथ {phone} पर फ़ोन या व्हाट्सऐप करें।",
        "other": ("car-hire-rourkela", "Car hire in Rourkela"),
    },
    {
        "slug": "car-hire-rourkela",
        "title": "Car Hire in Rourkela: Sedans and SUVs | Zain Ventures",
        "description": "Hire a car in Rourkela from Zain Ventures India. Sedans and SUVs for weddings, tours, pilgrimages and corporate trips. Call or WhatsApp for a price.",
        "h1": "Car hire in Rourkela",
        "lead": "Hire a sedan or an SUV from Zain Ventures India for your trip.",
        "service": "Car hire",
        "vehicles": [("Sedans", "For small groups"), ("SUVs", "For families and longer trips")],
        "faq": [
            ("How do I hire a car in Rourkela?", "Call or WhatsApp {phone} with your date, route and group size. We reply with a price."),
            ("Which cars can I hire?", "Sedans and SUVs."),
            ("How much does it cost to hire a car?", "The price depends on the date, the route and the car. Send us these details and we reply with a price."),
            ("Do you also hire out buses?", "Yes. We have AC and non-AC buses with 20 to 50 seats."),
        ],
        "hindi": "राउरकेला में कार बुकिंग: शादी, टूर, तीर्थ यात्रा और कॉर्पोरेट यात्रा के लिए सेडान और एसयूवी किराये पर लें। तारीख, रूट और यात्रियों की संख्या के साथ {phone} पर फ़ोन या व्हाट्सऐप करें।",
        "other": ("bus-hire-rourkela", "Bus hire in Rourkela"),
    },
]

ICONS = """<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="call" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></symbol><symbol id="wa" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></symbol></svg>"""
WA_ICON = '<svg class="wa-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa" /></svg>'
CALL_ICON = '<svg class="call-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#call" /></svg>'

# "See seats" opens the booking page on today's date in India (UTC+5:30). Without the script the link still works.
DATE_SCRIPT = """<script>
  document.querySelectorAll("[data-seats]").forEach(function (a) {
    a.href += "&date=" + new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
  });
</script>"""


def name(key): return TOWNS[key][0]
def slug(a, b): return f"{name(a).lower()}-to-{name(b).lower()}-bus"
def whatsapp(number, text): return f"https://wa.me/{number}?text={quote(text)}"


def minutes(clock):
    time, half = clock.split()
    hour, minute = map(int, time.split(":"))
    return (hour % 12 + (12 if half == "PM" else 0)) * 60 + minute


def trip(a, b):
    """The stops from a to b, each with its clock time and its day (0 = the day the bus starts)."""
    forward = STOPS.index(a) < STOPS.index(b)
    order = STOPS if forward else STOPS[::-1]
    times = TIMETABLE["to_patna"] if forward else TIMETABLE["to_rourkela"][::-1]
    day, rows = 0, []
    for i, key in enumerate(order):
        if i and minutes(times[i]) < minutes(times[i - 1]):
            day += 1
        rows.append((key, times[i], day))
    rows = rows[order.index(a):order.index(b) + 1]
    first_day = rows[0][2]
    rows = [(key, clock, day - first_day) for key, clock, day in rows]
    total = minutes(rows[-1][1]) + rows[-1][2] * 1440 - minutes(rows[0][1])
    hours, mins = divmod(total, 60)
    return {
        "rows": rows, "leave": rows[0][1], "arrive": rows[-1][1], "next_day": rows[-1][2] > 0,
        "duration": f"{hours}h {mins}m" if mins else f"{hours}h", "fare": FARES[f"{a}>{b}"],
    }


def iso_time(clock):
    return f"{minutes(clock) // 60:02d}:{minutes(clock) % 60:02d}:00+05:30"


def hindi_time(clock):
    hour = minutes(clock) // 60
    part = "रात" if hour < 4 or hour >= 20 else "सुबह" if hour < 12 else "दोपहर" if hour < 16 else "शाम"
    return f"{part} {clock.split()[0]} बजे"


def booking_link(a, b):
    return BOOKING + "results/?" + urlencode({"from": a, "to": b})


def page(path, title, description, json_ld, nav_book, body, bar):
    url = f"{SITE}/{path}/"
    graph = json.dumps({"@context": "https://schema.org", "@graph": json_ld}, ensure_ascii=False, indent=1)
    return f"""<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<title>{escape(title)}</title>
<meta name="description" content="{escape(description)}" />
<link rel="canonical" href="{url}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="theme-color" content="#ffffff" />
<link rel="icon" type="image/png" href="/logo-96.png" />
<link rel="apple-touch-icon" href="/logo-96.png" />
<link rel="stylesheet" href="/pages.css" />
<meta property="og:title" content="{escape(title)}" />
<meta property="og:description" content="{escape(description)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{SITE}/logo.png" />
<meta property="og:locale" content="en_IN" />
<meta property="og:site_name" content="Zain Ventures India" />
<meta name="twitter:card" content="summary" />
<script type="application/ld+json">
{graph}
</script>
</head>
<body>
{ICONS}
<header class="nav">
  <div class="wrap">
    <a class="brand" href="/"><img src="/logo.webp" alt="" width="28" height="28" />Zain Ventures India</a>
    <nav class="nav-links" aria-label="Primary"><a href="/rourkela-to-patna-bus/">Rourkela to Patna</a><a href="/patna-to-rourkela-bus/">Patna to Rourkela</a><a href="/bus-hire-rourkela/">Bus hire</a><a href="/car-hire-rourkela/">Car hire</a></nav>
    {nav_book}
  </div>
</header>

<main>
{body}
</main>

<footer class="foot">
  <div class="wrap">
    <div><strong>Zain Ventures India (Zain bus)</strong>Rourkela, Odisha 769001<br /><a class="map-link" href="{MAPS}" rel="noopener">Find us on Google Maps</a></div>
    <div><strong>Contact</strong><span class="reach"><a href="tel:{PHONE}">{PHONE_TEXT}</a><a class="ico" href="tel:{PHONE}" aria-label="Call {PHONE_TEXT}">{CALL_ICON}</a><a class="ico" href="https://wa.me/{HIRE_WHATSAPP}" aria-label="WhatsApp {PHONE_TEXT}">{WA_ICON}</a></span><a href="mailto:zainventures@outlook.com">zainventures@outlook.com</a></div>
    <div class="legal">© 2026 Zain Ventures India · Made by <a href="https://strix.co.in" rel="noopener">Strix</a></div>
  </div>
</footer>

<nav class="bar" aria-label="Quick actions">
  {bar}
</nav>
{DATE_SCRIPT}
</body>
</html>
"""


def breadcrumb(path, label):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Zain Ventures India", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": label, "item": f"{SITE}/{path}/"},
        ],
    }


def faq_parts(faq):
    """Returns the FAQ as HTML and as schema.org data. The phone number is a link in the HTML only."""
    link = f'<a href="tel:{PHONE}">{PHONE_TEXT}</a>'
    html = "\n".join(
        f"      <details><summary>{escape(q)}</summary><p>{escape(a).replace('{phone}', link)}</p></details>" for q, a in faq)
    data = {
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a.replace("{phone}", PHONE_TEXT)}}
            for q, a in faq
        ],
    }
    return html, data


def more_links(skip):
    links = [(slug(a, b), f"{name(a)} to {name(b)} bus") for a, b in ROUTE_PAGES]
    links += [(h["slug"], h["h1"]) for h in HIRE_PAGES]
    return "\n".join(f'        <li><a href="/{path}/">{label}</a></li>' for path, label in links if path != skip)


def route_page(a, b):
    path, there, back = slug(a, b), trip(a, b), trip(b, a)
    A, B = name(a), name(b)
    label = f"{A} to {B} bus"
    arrive_day = ", next day" if there["next_day"] else ""
    arrive_text = f"{there['arrive']} the next day" if there["next_day"] else there["arrive"]
    seats = booking_link(a, b)
    wa = whatsapp(TICKET_WHATSAPP, f"Hi, I want to book a ticket from {A} to {B}.")

    rows = []
    for key, clock, day in there["rows"]:
        fare = FARES.get(f"{a}>{key}")
        cell = "Boarding" if key == a else f"₹{fare}" if fare else "Not sold online"
        when = clock + ("<small>Next day</small>" if day else "")
        rows.append(f"          <tr><td>{TOWNS[key][1]}<small>{TOWNS[key][2]}</small></td><td>{when}</td><td>{cell}</td></tr>")

    faq_html, faq_data = faq_parts([
        (f"What time does the bus leave {A} for {B}?",
         f"The Zain bus leaves {A} at {there['leave']} and reaches {B} at {arrive_text}. The trip takes {there['duration']}."),
        (f"How much is a bus ticket from {A} to {B}?",
         f"A seat costs ₹{there['fare']}. The booking page shows the current fare for each date."),
        ("Which days does the bus run?",
         "The booking page shows the days with a bus. Choose your date there, or call {phone}."),
        (f"How do I book the {A} to {B} bus?",
         "Book online on the booking page, or call or WhatsApp {phone}. Pay by UPI or card. The e-ticket is instant."),
        ("Which type of bus is it?", "An AC bus with 2+2 pushback seats."),
    ])
    return_link = (f'<a class="more" href="/{slug(b, a)}/">{B} to {A} bus</a>' if (b, a) in ROUTE_PAGES
                   else f'<a class="more" href="{escape(booking_link(b, a))}" data-seats>See seats</a>')
    back_arrive = f"{back['arrive']} the next day" if back["next_day"] else back["arrive"]
    hindi_next = "अगले दिन " if there["next_day"] else ""

    body = f"""  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> › {label}</p>
    <div class="hero">
      <h1>{label}</h1>
      <p class="lead">The Zain bus leaves {A} at {there['leave']} and reaches {B} at {arrive_text}. A seat costs ₹{there['fare']}.</p>
      <div class="cta"><a class="pill" href="{escape(seats)}" data-seats>See seats</a><a class="wa" href="{wa}">{WA_ICON}Book on WhatsApp</a></div>
    </div>
    <article class="leg">
      <div class="clock">
        <div><b>{there['leave']}</b><span>{A}</span></div>
        <div class="dur"><i>{there['duration']}</i></div>
        <div class="end"><b>{there['arrive']}</b><span>{B}{arrive_day}</span></div>
      </div>
      <p class="fare"><b>₹{there['fare']}</b> per seat. The booking page shows the days with a bus and the current fare.</p>
    </article>
  </div>

  <section>
    <div class="wrap">
      <h2>Stops and times</h2>
      <table>
        <thead><tr><th>Stop</th><th>Time</th><th>Fare from {A}</th></tr></thead>
        <tbody>
{chr(10).join(rows)}
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>On the bus</h2>
      <dl class="facts">
        <div><dt>AC bus</dt><dd>On every trip</dd></div>
        <div><dt>2+2 seats</dt><dd>Pushback</dd></div>
        <div><dt>Pay online</dt><dd>UPI and cards</dd></div>
        <div><dt>E-ticket</dt><dd>Instant</dd></div>
      </dl>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>The return trip</h2>
      <p>The bus from {B} to {A} leaves at {back['leave']} and arrives at {back_arrive}. A seat costs ₹{back['fare']}.</p>
      {return_link}
    </div>
  </section>

  <section class="faq">
    <div class="wrap">
      <h2>Questions</h2>
{faq_html}
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2 lang="hi">{TOWNS[a][3]} से {TOWNS[b][3]} बस</h2>
      <p class="hindi" lang="hi">ज़ैन बस (Zain Ventures India) की एसी बस {TOWNS[a][3]} से {hindi_time(there['leave'])} चलती है और {hindi_next}{hindi_time(there['arrive'])} {TOWNS[b][3]} पहुँचती है। किराया ₹{there['fare']} प्रति सीट है। टिकट ऑनलाइन बुक करें, या <a href="tel:{PHONE}">{PHONE_TEXT}</a> पर फ़ोन या व्हाट्सऐप करें।</p>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>More routes</h2>
      <ul class="links">
{more_links(path)}
      </ul>
    </div>
  </section>"""

    def bus_stop(key):
        return {"@type": "BusStop", "name": name(key),
                "address": {"@type": "PostalAddress", "addressLocality": name(key), "addressRegion": TOWNS[key][2], "addressCountry": "IN"}}

    json_ld = [
        breadcrumb(path, label),
        {
            "@type": "BusTrip", "@id": f"{SITE}/{path}/#trip", "name": f"{A} to {B} AC bus",
            "provider": {"@id": f"{SITE}/#business"},
            "departureBusStop": bus_stop(a), "arrivalBusStop": bus_stop(b),
            "departureTime": iso_time(there["leave"]), "arrivalTime": iso_time(there["arrive"]),
            "description": f"AC bus with 2+2 pushback seats from {A} to {B}. The trip takes {there['duration']}.",
            "offers": {"@type": "Offer", "price": str(there["fare"]), "priceCurrency": "INR", "url": seats},
        },
        faq_data,
    ]
    title = f"{A} to {B} Bus: Time, Fare and Booking | Zain Bus"
    description = (f"Zain bus from {A} to {B}: leaves {there['leave']}, arrives {arrive_text}. ₹{there['fare']} per seat. "
                   "AC bus with 2+2 pushback seats. Book online or on WhatsApp.")
    nav_book = f'<a class="pill" href="{escape(seats)}" data-seats>Book</a>'
    bar = (f'<a class="pill" href="{escape(seats)}" data-seats>Book ticket</a>\n'
           f'  <a class="ghost" href="tel:{PHONE}" aria-label="Call">{CALL_ICON}<span>Call</span></a>\n'
           f'  <a class="ghost" href="{wa}" aria-label="Book on WhatsApp">{WA_ICON}<span>WhatsApp</span></a>')
    return path, page(path, title, description, json_ld, nav_book, body, bar)


def hire_page(h):
    path = h["slug"]
    wa = whatsapp(HIRE_WHATSAPP, f"Hi, I want to hire a {'bus' if 'bus' in path else 'car'}.")
    faq_html, faq_data = faq_parts(h["faq"])
    vehicles = "\n".join(f"        <li><b>{kind}</b> <span>· {detail}</span></li>" for kind, detail in h["vehicles"])
    other_path, other_label = h["other"]
    body = f"""  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> › {h['h1']}</p>
    <div class="hero">
      <h1>{h['h1']}</h1>
      <p class="lead">{h['lead']}</p>
      <div class="cta"><a class="pill" href="tel:{PHONE}">Call {PHONE_TEXT}</a><a class="wa" href="{wa}">{WA_ICON}WhatsApp</a></div>
    </div>
  </div>

  <section>
    <div class="wrap">
      <h2>Vehicles</h2>
      <ul class="list">
{vehicles}
      </ul>
      <a class="more" href="/{other_path}/">{other_label}</a>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>What we hire for</h2>
      <ul class="list">
        <li><b>Weddings</b></li>
        <li><b>Tours</b></li>
        <li><b>Pilgrimages</b></li>
        <li><b>Corporate trips</b></li>
      </ul>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>How to get a price</h2>
      <p>Call or WhatsApp <a href="tel:{PHONE}">{PHONE_TEXT}</a>. Tell us the date, the route and the group size. We reply with a price.</p>
    </div>
  </section>

  <section class="faq">
    <div class="wrap">
      <h2>Questions</h2>
{faq_html}
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2 lang="hi">{'राउरकेला में बस बुकिंग' if 'bus' in path else 'राउरकेला में कार बुकिंग'}</h2>
      <p class="hindi" lang="hi">{h['hindi'].replace('{phone}', f'<a href="tel:{PHONE}">{PHONE_TEXT}</a>')}</p>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>Bus tickets</h2>
      <ul class="links">
{more_links(path)}
      </ul>
    </div>
  </section>"""
    json_ld = [
        breadcrumb(path, h["h1"]),
        {
            "@type": "Service", "@id": f"{SITE}/{path}/#service", "name": h["h1"], "serviceType": h["service"],
            "description": h["description"], "provider": {"@id": f"{SITE}/#business"},
            "areaServed": {"@type": "City", "name": "Rourkela"},
            "availableChannel": {"@type": "ServiceChannel", "servicePhone": PHONE},
        },
        faq_data,
    ]
    nav_book = f'<a class="pill" href="tel:{PHONE}">Call</a>'
    bar = (f'<a class="pill" href="tel:{PHONE}">Call for a price</a>\n'
           f'  <a class="ghost" href="{wa}" aria-label="WhatsApp">{WA_ICON}<span>WhatsApp</span></a>')
    return path, page(path, h["title"], h["description"], json_ld, nav_book, body, bar)


def sitemap(paths):
    today = date.today().isoformat()
    urls = [("", "1.0")] + [(p + "/", "0.8") for p in paths]
    items = "".join(
        f"  <url>\n    <loc>{SITE}/{p}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>{priority}</priority>\n  </url>\n"
        for p, priority in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}</urlset>\n'


def main():
    pages = [route_page(a, b) for a, b in ROUTE_PAGES] + [hire_page(h) for h in HIRE_PAGES]
    for path, html in pages:
        (ROOT / path).mkdir(exist_ok=True)
        (ROOT / path / "index.html").write_text(html)
        print("wrote", f"{path}/index.html")
    (ROOT / "sitemap.xml").write_text(sitemap([path for path, _ in pages]))
    print("wrote sitemap.xml")


if __name__ == "__main__":
    main()
