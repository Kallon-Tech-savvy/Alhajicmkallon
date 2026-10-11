import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidgetLoader } from "@/components/ChatWidgetLoader";

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

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alhajicmkallon.vercel.app"),
  title: "Alhaji Kallon | Design Engineer",
  description:
    "Design Engineer & Software Developer building Africa's innovation future from Sierra Leone.",
  keywords: ["design engineer", "software developer", "Sierra Leone", "Africa", "innovation"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Alhaji Kallon | Design Engineer",
    description: "Design Engineer building Africa's innovation future.",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://alhajicmkallon.vercel.app/#person",
      name: "Alhaji C. M. Kallon",
      url: "https://alhajicmkallon.vercel.app",
      jobTitle: "Design Engineer",
      description:
        "Design engineer and software developer focused on clarifying business ideas and building digital products.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "SL",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://alhajicmkallon.vercel.app/#website",
      url: "https://alhajicmkallon.vercel.app",
      name: "Alhaji Kallon | Design Engineer",
      inLanguage: "en",
      publisher: { "@id": "https://alhajicmkallon.vercel.app/#person" },
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
      className={`${jetbrainsMono.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-midnight text-ivory">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-pride-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <div id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </div>
        <ChatWidgetLoader />
      </body>
    </html>
  );
}