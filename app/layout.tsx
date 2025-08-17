import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { Noto_Serif, Quicksand } from "next/font/google";

const noto = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-noto",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-quick",
});

export const metadata: Metadata = {
  title: "TripyFin",
  description: "Track expenses with friends during travel",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${noto.variable} ${quicksand.variable}`}>
        <Providers>
          <NavBar />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
