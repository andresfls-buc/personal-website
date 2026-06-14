import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/app/components/layout/SmoothScroll";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Andres Landazabal — AI Software Engineer",
  description:
    "AI software engineer building responsive, intelligent systems with great UI/UX. 8+ years shipping AI-powered products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f7f5f2] font-sans text-[#141414]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
