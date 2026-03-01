import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Providers from "@/components/Providers";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ברק שירותים - גיוס והשמה באילת",
  description: "מערכת גיוס חכמה מבוססת AI להשמת עובדים באילת",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
