// Every string, price, photo and list on the page lives here. Components only read from this file.
// Aurelia is a fictional hotel: a design prototype by Kaso Studio. Nothing here is a real business.

export const BRAND = {
  name: "Aurelia",
  full: "Aurelia Stone Sanctuary & Hearth",
  short: "Aurelia Sanctuary",
  region: "Southern Albania",
  coords: "40.2336° N · 20.3517° E",
  suites: 14,
  studio: "Kaso Studio",
  studioUrl: "https://joelkaso8-cyber.github.io/portfolio/",
};

export const DEMO_NOTE =
  "Design prototype. Aurelia is a fictional hotel created by Kaso Studio to show a cinematic 3D website. No bookings are taken.";

// Unsplash serves resized, compressed copies straight from its CDN.
export const unsplash = (id: string, w: number, q = 78) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
export const unsplashSet = (id: string, widths: number[]) =>
  widths.map((w) => `${unsplash(id, w)} ${w}w`).join(", ");

export const NAV = [
  { href: "#suites", label: "Suites" },
  { href: "#gastronomy", label: "Gastronomy" },
  { href: "#experiences", label: "Experiences" },
  { href: "#reserve", label: "Reserve" },
];

export const HERO = {
  eyebrow: "Stone sanctuary & wood-fired hearth",
  lines: ["Fourteen suites", "carved from", "warm stone."],
  lead:
    "A restored hillside of travertine rooms above the Vjosa valley, with a tasting kitchen that cooks over olive wood and a cellar dug into the rock.",
  cta: "Book your stay",
  secondary: "Tonight's menu",
  meta: ["14 suites", "1 hearth, 9 courses", "Open April to November"],
};

export type Room = {
  id: string;
  photo: string;
  title: string;
  kind: "Suite" | "Hearth" | "Cellar" | "Grounds";
  size: string;
  rate: string;
  alt: string;
};

// The curved ribbon. Rates use the € after the number.
export const RIBBON: Room[] = [
  { id: "panorama", photo: "1719687384656-07e524f9797e", title: "Panorama Suite", kind: "Suite", size: "62 m²", rate: "640€ / night", alt: "A pale suite with a wide window opening onto the sea" },
  { id: "travertine", photo: "1790419683322-b08a7050c424", title: "Travertine Room", kind: "Suite", size: "38 m²", rate: "380€ / night", alt: "A bedroom with a bare stone wall, a round mirror and white linen" },
  { id: "pool", photo: "1789593847389-80805c7ea5ab", title: "Cistern Pool", kind: "Grounds", size: "Spring-fed", rate: "For suite guests", alt: "Two wooden loungers on a stone terrace beside a round pool" },
  { id: "hearth", photo: "1536392706976-e486e2ba97af", title: "The Long Table", kind: "Hearth", size: "18 seats", rate: "165€ tasting", alt: "A long dinner table laid with candles and flowers" },
  { id: "cellar", photo: "1765850258613-9e671f59a9ad", title: "Rock Cellar", kind: "Cellar", size: "1,200 bottles", rate: "Pairing 90€", alt: "Rows of wine bottles resting in a cellar" },
  { id: "olive", photo: "1731336478850-6bce7235e320", title: "Olive Grove Suite", kind: "Suite", size: "44 m²", rate: "460€ / night", alt: "A calm bedroom with white bedding and a timber headboard" },
  { id: "oven", photo: "1636581563748-dcb80f710950", title: "Olive-Wood Oven", kind: "Hearth", size: "480 °C", rate: "Chef's counter", alt: "Flames burning inside a brick oven" },
  { id: "terrace", photo: "1783101514857-7e50266c60b8", title: "Horizon Terrace", kind: "Grounds", size: "Sunset bar", rate: "From 18:00", alt: "An infinity pool with loungers looking out over the water" },
  { id: "valley", photo: "1753172512618-92e65807c52d", title: "Valley Walks", kind: "Grounds", size: "3 trails", rate: "Guided daily", alt: "Green mountain slopes rising under a soft sky" },
];

export const STORY = {
  label: "(02) The sanctuary",
  title: ["A house that", "was built to", "hold the heat."],
  a:
    "The walls are sixty centimetres of local limestone, laid by hand without a visible joint of cement. They drink the afternoon sun and give it back after dark, so the rooms stay cool in August and warm in late October.",
  b:
    "We kept what the hillside already knew: deep window reveals, shaded courtyards, a cistern that becomes the pool. Brass fittings are brushed, never polished. Linen is washed in spring water and dried on the terrace.",
  facts: [
    { k: "Stone", v: "Limestone and travertine quarried within twelve kilometres, cut on site." },
    { k: "Light", v: "Every suite faces south-west. The longest evening light in the valley falls on the terraces." },
    { k: "Quiet", v: "No televisions, thick walls, and a strict hour of silence from ten." },
  ],
  photos: [
    { id: "1612027368396-ec58893ecd21", alt: "A stone building half hidden by green planting", w: 1200, h: 1500 },
    { id: "1784288196030-ad230afe95ca", alt: "A stone farmhouse with a pool surrounded by green hills", w: 1400, h: 1000 },
    { id: "1507038772120-7fff76f79d79", alt: "Two wooden armchairs in a sunlit room", w: 1000, h: 1250 },
  ],
  numbers: [
    { n: "14", l: "Suites" },
    { n: "60cm", l: "Stone walls" },
    { n: "1,200", l: "Bottles in the rock" },
  ],
};

export type Course = {
  n: string;
  title: string;
  dish: string;
  pairing: string;
  note: string;
  photo: string;
  alt: string;
  tint: string; // wine colour inside the decanter for this course
};

export const RESTAURANT = {
  label: "(03) Hearth · tasting kitchen",
  title: ["Nine courses,", "one fire."],
  lead:
    "Hearth seats eighteen guests around a single olive-wood oven. The menu follows what the valley gives that week, and the cellar answers each course with a glass.",
  price: "165€ tasting · 90€ pairing",
  courses: [
    { n: "I", title: "Ember", dish: "River trout, smoked over vine cuttings, wild fennel", pairing: "Pulës white, 2023", note: "Cold smoke, bright acid", photo: "1676471926534-d5c9771909fa", alt: "A white plate of fish and vegetables", tint: "#d9c27a" },
    { n: "II", title: "Hearth", dish: "Lamb shoulder, twelve hours in the oven, yoghurt and sumac", pairing: "Shesh i Zi, 2019", note: "Slow fire, deep fruit", photo: "1663530761401-15eefb544889", alt: "A chef pouring sauce over a plated cut of meat", tint: "#5e1620" },
    { n: "III", title: "Stone", dish: "Flatbread from the oven floor, mountain butter, honey", pairing: "Kallmet reserve, 2018", note: "Bread from the oven floor", photo: "1607018244619-dab6235709dd", alt: "A loaf of bread on a wooden board", tint: "#7a1d1d" },
    { n: "IV", title: "Cellar", dish: "Aged sheep's cheese, fig leaf, burnt honey", pairing: "Vjosa raki, single cask", note: "Kept below ground", photo: "1765850257843-aa029ab7769c", alt: "Dark wine bottles stacked on shelves in a cellar", tint: "#b07a3a" },
  ] as Course[],
};

export const EXPERIENCES = {
  label: "(04) Experiences",
  items: [
    { k: "Dawn walk", v: "Two hours up the old shepherd path, coffee on the ridge.", t: "06:30" },
    { k: "Cellar hour", v: "Taste six bottles in the rock with our sommelier.", t: "17:00" },
    { k: "Oven class", v: "Bake the morning bread with the kitchen team.", t: "05:45" },
    { k: "River swim", v: "A guided descent to the green pools of the Vjosa.", t: "11:00" },
  ],
};

export const BOOKING = {
  label: "(05) Reserve",
  title: ["Stay with", "the stone."],
  lead: "Send an inquiry and the house replies within a day with availability and a hold on your dates.",
  modes: [
    { id: "suite", label: "Suite" },
    { id: "table", label: "Table" },
  ] as const,
  suites: ["Any suite", "Panorama Suite", "Olive Grove Suite", "Travertine Room"],
  photo: "1766832255363-c9f060ade8b0",
  photoAlt: "Dining tables set in a warm, low-lit restaurant",
};

export const FOOTER = {
  columns: [
    { h: "Visit", lines: ["Southern Albania", BRAND.coords, "Open April to November"] },
    { h: "House", lines: ["14 suites", "Hearth restaurant", "Rock cellar"] },
  ],
};
