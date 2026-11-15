import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { BRAND, PRICING, SITE_URL } from "@/content/site";
import "./globals.css";

const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin", "latin-ext"], weight: "400", style: ["normal", "italic"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const title = `${BRAND.name} · ${BRAND.tagline}`;
const description =
  "Hand-designed websites for hotels, guesthouses, cafés and tour operators in Albania. Direct booking to WhatsApp, English and Albanian, no commission. From 390€.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: BRAND.name, title, description, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${BRAND.name}: glass website panes over an obsidian background` }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#09090b", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: BRAND.name,
  url: SITE_URL,
  description,
  founder: { "@type": "Person", name: BRAND.founder },
  telephone: `+${BRAND.whatsapp}`,
  address: { "@type": "PostalAddress", addressCountry: "AL" },
  areaServed: "Albania",
  knowsLanguage: ["en", "sq"],
  priceRange: "390€–1.190€",
  makesOffer: PRICING.plans.map((p) => ({
    "@type": "Offer",
    name: `${p.name} website`,
    price: p.price.replace(/[^\d]/g, ""),
    priceCurrency: "EUR",
  })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrument.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
