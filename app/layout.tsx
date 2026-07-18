import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/app/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "Andres Landazabal",
  description: "Personal website of Andres Landazabal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
