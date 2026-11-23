import type { Metadata } from "next";
import { Fraunces, Outfit, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-source",
});

export const metadata: Metadata = {
  title: "Mandara journeys",
  description: "Spa managers write a team member’s story and print it as an A5 card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${fraunces.variable} ${sourceSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
