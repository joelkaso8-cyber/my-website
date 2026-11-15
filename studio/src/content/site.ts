// All copy and data for the page lives here, apart from the layout.
// The studio name is not final: change BRAND (and SITE_URL once there is a domain) and the whole site follows.

export const BRAND = {
  name: "Kaso Studio",
  short: "Kaso",
  founder: "Joel Kaso",
  tagline: "Websites for Albanian hotels, cafés and tours",
  whatsapp: "355685727406",
  phoneDisplay: "+355 68 572 7406",
  email: "joelkaso8@gmail.com",
  portfolio: "https://joelkaso8-cyber.github.io/portfolio/",
};

export const SITE_URL = "https://kaso-studio.netlify.app";

export const waLink = (text: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#manifesto" },
  { label: "Cases", href: "#cases" },
  { label: "Prices", href: "#pricing" },
];

export const HERO = {
  eyebrow: "Web design studio · Albania",
  // Each line is masked and revealed on load.
  lines: ["Websites for", "Albanian hotels,", "cafés & tours."],
  lead:
    "Fast, hand-designed sites that take bookings straight to your WhatsApp, in English and Albanian. No commission, no monthly lock-in.",
  cta: "Message me on WhatsApp",
  ctaText: "Hi Joel, I'd like a website for my business.",
  secondary: "See the prices",
  meta: ["From 390€", "Ready in 1 to 3 weeks", "0% booking commission"],
};

export type Work = {
  id: string;
  name: string;
  where: string;
  kind: string;
  tag: "Demo" | "Client";
};

// Real screenshots from the portfolio. All of these are demo sites, not paying clients.
export const RIBBON: Work[] = [
  { id: "ura-coffee", name: "Ura Coffee Roasters", where: "Glasgow", kind: "Coffee roastery", tag: "Demo" },
  { id: "balte-studio", name: "Baltë Studio", where: "Tirana", kind: "Pottery studio", tag: "Demo" },
  { id: "lule-kitchen", name: "Lule Balkan Kitchen", where: "London", kind: "Restaurant", tag: "Demo" },
  { id: "avull-hammam", name: "Avull Hammam & Spa", where: "Edinburgh", kind: "Hammam & spa", tag: "Demo" },
  { id: "northline-barbers", name: "Northline Barbers", where: "Manchester", kind: "Barber shop", tag: "Demo" },
  { id: "dallge-surf", name: "Dallgë Surf School", where: "Cornwall", kind: "Surf school", tag: "Demo" },
  { id: "vreshta-estate", name: "Vreshta Estate", where: "California", kind: "Winery", tag: "Demo" },
  { id: "pranvera-flowers", name: "Pranvera Flowers", where: "Bristol", kind: "Flower studio", tag: "Demo" },
  { id: "grusht-boxing", name: "Grusht Boxing Club", where: "London", kind: "Boxing gym", tag: "Demo" },
];

export const workUrl = (id: string) => `${BRAND.portfolio}work/${id}/`;

export const MANIFESTO = {
  label: "(01) The studio",
  title: ["A guesthouse in Përmet", "deserves the website", "a Riviera hotel has."],
  paragraphs: [
    "Most small businesses in Albania live on a Facebook page and a booking-site listing that takes 15% or more of every stay. Guests find you, then pay someone else to reach you.",
    "I design each site by hand around the place itself: its photos, its rooms or menu, its owner's voice. Then I build it to load in about a second on a phone with two bars of signal on a mountain road.",
  ],
  principles: [
    { k: "Direct", v: "Booking requests go to your WhatsApp or Telegram. You keep the guest and the money." },
    { k: "Bilingual", v: "English and Albanian from day one, so visitors and locals both feel at home." },
    { k: "Yours", v: "No monthly lock-in. The domain and the site belong to you." },
  ],
};

export type Case = {
  id: string;
  name: string;
  where: string;
  tag: string;
  tier: string;
  summary: string;
  points: string[];
};

export const CASES: Case[] = [
  {
    id: "kaso-ervehe",
    name: "Hotel Kaso Ervehe",
    where: "Family hotel · Përmet",
    tag: "Client · not live yet",
    tier: "Premium · 1.190€",
    summary:
      "A family hotel by the Vjosa river. Rooms, prices and photos in two languages, with booking requests landing in the family's WhatsApp and Telegram.",
    points: ["Room booking with blocked dates", "Guest page with Wi-Fi and local tips", "English and Albanian"],
  },
  {
    id: "ura-coffee",
    name: "Ura Coffee Roasters",
    where: "Coffee roastery · Glasgow",
    tag: "Demo",
    tier: "Business · 590€",
    summary:
      "A roastery site built around the coffee: a bean subscription builder, a menu you can order ahead from, and table bookings confirmed on WhatsApp.",
    points: ["Order ahead to WhatsApp", "Bean subscriptions", "Table booking"],
  },
  {
    id: "balte-studio",
    name: "Baltë Studio",
    where: "Pottery studio · Tirana",
    tag: "Demo",
    tier: "Business · 590€",
    summary:
      "A pottery studio in Tirana with a scroll film of the wheel turning, classes for beginners, couples and teams, prices from 15€, and a map to the door.",
    points: ["Scroll film hero", "Class prices", "Map and opening hours"],
  },
];

export type Plan = {
  name: string;
  price: string;
  was?: string;
  for: string;
  items: string[];
  featured?: boolean;
  wa: string;
};

export const PRICING = {
  label: "(03) Prices",
  title: ["Three packages.", "One clear price."],
  note: "Launch prices. Paid once, no monthly fee. An optional care plan for changes and checks is 25€ a month, and you can stop it any time.",
  plans: [
    {
      name: "Starter",
      price: "390€",
      was: "800€",
      for: "For cafés, barbers and trades that need to be found and contacted.",
      items: ["Designed for phones first", "WhatsApp and call buttons", "Google Maps and opening hours", "One language", "Ready in about a week"],
      wa: "Hi Joel, I'm interested in the Starter website (390€).",
    },
    {
      name: "Business",
      price: "590€",
      was: "1.000€",
      for: "For restaurants, salons and clinics that take bookings every day.",
      items: ["Everything in Starter", "Online booking with a calendar", "Orders and pre-orders to WhatsApp", "Menu or price list you can edit", "Two languages", "Google listing set up"],
      featured: true,
      wa: "Hi Joel, I'm interested in the Business website (590€).",
    },
    {
      name: "Premium",
      price: "1.190€",
      for: "For hotels and guesthouses that want everything done for them.",
      items: ["Everything in Business", "Rooms, prices and photo slides", "Booking requests to WhatsApp or Telegram, with dates you control", "Guest page with Wi-Fi and tips", "3 months of the care plan included"],
      wa: "Hi Joel, I'm interested in the Premium website (1.190€).",
    },
  ] as Plan[],
};

export const FOOTER = {
  title: ["Let's put your", "place online."],
  lead: "Tell me what you run and where. I reply the same day, in English or Albanian.",
  cta: "Start on WhatsApp",
  ctaText: "Hi Joel, I'd like to talk about a website.",
};
