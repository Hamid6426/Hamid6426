import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { aboutData } from "@/data/about.data";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../fonts/Inter/static/Inter_18pt-Regular.ttf", weight: "400" },
    { path: "../fonts/Inter/static/Inter_18pt-Medium.ttf", weight: "500" },
    { path: "../fonts/Inter/static/Inter_18pt-SemiBold.ttf", weight: "600" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = localFont({
  src: [
    {
      path: "../fonts/Bricolage_Grotesque/static/BricolageGrotesque-Bold.ttf",
      weight: "700",
    },
    {
      path: "../fonts/Bricolage_Grotesque/static/BricolageGrotesque-ExtraBold.ttf",
      weight: "800",
    },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

function siteUrl(): string {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL!;
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: `${aboutData.fullName} | ${aboutData.role}`,
  description: aboutData.shortSummary,
  authors: [{ name: aboutData.fullName }],
  keywords: [
    aboutData.fullName,
    "Full Stack Developer",
    "Team Lead",
    "Next.js",
    "SaaS",
    "Islamabad",
  ],
  openGraph: {
    title: `${aboutData.fullName} | ${aboutData.role}`,
    description: aboutData.shortSummary,
    type: "website",
    locale: "en_US",
    siteName: `${aboutData.preferredName}.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${aboutData.fullName} | ${aboutData.role}`,
    description: aboutData.shortSummary,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
