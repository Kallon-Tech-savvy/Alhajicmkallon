import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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


export const metadata: Metadata = {
  metadataBase: new URL("https://alhajicmkallon.vercel.app"),
  title: "Alhaji Kallon | Digital Product Design & Engineering",
  description:
    "I help founders, businesses, and organisations clarify product ideas, shape user experiences, and build useful digital products from Sierra Leone.",
  keywords: ["digital product development", "product design", "software development", "design engineer", "Sierra Leone"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Alhaji Kallon | Design Engineer",
    description: "From product questions to working digital products. Explore Alhaji Kallon's approach, projects, and product thinking.",
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
      jobTitle: "Design Engineer and Software Developer",
      description:
        "Helps founders, businesses, and organisations clarify product ideas, design digital experiences, and build useful digital products.",
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
      className={`${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
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