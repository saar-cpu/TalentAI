import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
