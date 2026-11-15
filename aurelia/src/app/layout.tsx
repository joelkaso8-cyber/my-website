import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { BRAND, DEMO_NOTE } from "@/content/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin", "latin-ext"], weight: ["300", "400", "500"], style: ["normal", "italic"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const title = `${BRAND.full} · Design prototype`;
const description = `A cinematic 3D website prototype for a fictional 14-suite stone hotel and wood-fired tasting restaurant in ${BRAND.region}. ${DEMO_NOTE}`;

export const metadata: Metadata = {
  title,
  description,
  // Demo prototype: never indexed (also sent as an X-Robots-Tag header in netlify.toml).
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: "website", siteName: `${BRAND.name} (demo)`, title, description, images: [{ url: "og.jpg", width: 1200, height: 630, alt: "A travertine arch and a glass pavilion lit warm against a dark background" }] },
  twitter: { card: "summary_large_image", title, description, images: ["og.jpg"] },
  icons: { icon: "icon.svg" },
};

export const viewport: Viewport = { themeColor: "#0a0a09", colorScheme: "dark" };

// Structured data stays honest: a WebSite describing the prototype, not a Hotel that does not exist.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${BRAND.full} (design prototype)`,
  description,
  creator: { "@type": "Organization", name: BRAND.studio, url: BRAND.studioUrl },
  inLanguage: "en",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <noscript><style>{".photo img{opacity:1}"}</style></noscript>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
