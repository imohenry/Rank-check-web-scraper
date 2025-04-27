import type { Metadata } from "next";
// import localFont from "next/font/local";
import "/styles/globals.css";

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], // the weights i need
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Free Content Rank Checker",
  description: "Analyze your website's SEO health in seconds and get actionable tips for higher search engine rankings.",
  icons: {
    icon: "/favicon.ico", //avicon here
  },
  openGraph: {
    title: "RankRite",
    description: "Analyze your website's SEO health in seconds and get actionable tips for higher search engine rankings.",
    url: "https://www.rankrite.io", // Update this with your actual site URL
    images: [
      {
        url: "/images/og-image.png", // Your Open Graph image path
        width: 1200, // Recommended size for og:image
        height: 630,
        alt: "RankRite - SEO Analysis Tool",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}
