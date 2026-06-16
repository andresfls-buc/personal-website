import type { Metadata } from "next";
import { Cinzel, EB_Garamond, IM_Fell_English } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/app/components/layout/SmoothScroll";

/* Cinzel — inscriptional Roman caps, the FromSoftware / Bloodborne title feel */
const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* EB Garamond — clean old-book serif for body copy */
const garamond = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/* IM Fell English — digitized 17th-c. type, used for diary / quote moments */
const fell = IM_Fell_English({
  variable: "--font-fell",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Andres Landazabal — AI Software Engineer",
  description:
    "AI software engineer at the edge of physics and machines. Building intelligent systems, quantum & classical mechanics explorations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${garamond.variable} ${fell.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void font-[family-name:var(--font-body)] text-bone">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
