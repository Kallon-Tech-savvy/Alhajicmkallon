import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Alhaji Kallon | Design Engineer",
  description:
    "Design Engineer & Software Developer building Africa's innovation future from Sierra Leone.",
  keywords: ["design engineer", "software developer", "Sierra Leone", "Africa", "innovation"],
  openGraph: {
    title: "Alhaji Kallon | Design Engineer",
    description: "Design Engineer building Africa's innovation future.",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}