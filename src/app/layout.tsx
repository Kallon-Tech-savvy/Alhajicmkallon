import { THEME_BOOTSTRAP } from '@/lib/theme.mjs';
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidgetLoader } from "@/components/ChatWidgetLoader";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import { serializeJsonLd } from "@/lib/serialize-json-ld";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://alhajikallon.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alhaji C.M. Kallon | Design Engineer",
    template: "%s | Alhaji C.M. Kallon",
  },
  description:
    "Alhaji C.M. Kallon is a Sierra Leonean design engineer helping founders, businesses and organisations turn unclear ideas into useful digital products.",
  applicationName: "Alhaji C.M. Kallon",
  authors: [{ name: "Alhaji C.M. Kallon", url: siteUrl }],
  creator: "Alhaji C.M. Kallon",
  publisher: "Alhaji C.M. Kallon",
  keywords: [
    "Alhaji C.M. Kallon",
    "Alhaji Kallon",
    "design engineer",
    "product discovery",
    "product thinking",
    "experience design",
    "web development",
    "Sierra Leone",
    "Freetown",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Alhaji C.M. Kallon | Design Engineer",
    description:
      "From understanding the problem to designing and engineering useful digital products.",
    url: siteUrl,
    siteName: "Alhaji C.M. Kallon",
    type: "website",
    locale: "en_SL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alhaji C.M. Kallon | Design Engineer",
    description:
      "I help founders, businesses and organisations turn unclear ideas into useful digital products.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Alhaji C.M. Kallon",
      alternateName: ["Alhaji Kallon", "Alhaji C M Kallon", "alhajikallon", "cmkallon"],
      url: siteUrl,
      image: `${siteUrl}/assets/kallon1.png`,
      jobTitle: "Design Engineer",
      description:
        "Sierra Leonean design engineer helping founders, businesses and organisations turn unclear ideas into useful digital products through problem discovery, product thinking, experience design and engineering.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Freetown",
        addressCountry: "SL",
      },
      knowsAbout: [
        "Problem discovery",
        "Product thinking",
        "Digital product design",
        "Experience design",
        "Web development",
        "React",
        "TypeScript",
        "Next.js",
        "Vite",
        "Supabase",
        "Cloudflare Workers",
        "Web accessibility",
        "Web performance",
        "Design systems",
      ],
      sameAs: [
        "https://linkedin.com/in/alhaji-c-m-k-8b79a225b",
        "https://github.com/Kallon-Tech-savvy",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Alhaji C.M. Kallon",
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} /></head>
      <body className="editorial-page min-h-full flex flex-col bg-midnight text-ivory">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-pride-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--ui-on-action)]"
        >
          Skip to content
        </a>
        <div id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </div>
        {process.env.WEB_VITALS_ENABLED === '1' && <WebVitalsReporter />}
        <ChatWidgetLoader />
      </body>
    </html>
  );
}
