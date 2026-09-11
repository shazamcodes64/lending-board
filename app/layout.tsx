import type { Metadata } from "next";
import { DM_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GC SRM Lending Board",
  description:
    "Borrow what you need, lend what you have — a peer-to-peer campus resource sharing board for SRM Kattankulathur students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmMono.variable} ${instrumentSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
