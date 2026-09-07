import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });


export const metadata: Metadata = {
  title: {
    default: "MoortiBazaar — Handcrafted Statues & Idols Marketplace",
    template: "%s · MoortiBazaar",
  },
  description:
    "India's inquiry-based marketplace for handcrafted Moorti, statues and idols. Search by material, deity, city and finish, then send an inquiry directly to verified artisans.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
