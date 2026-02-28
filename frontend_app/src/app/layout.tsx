import type { Metadata } from "next";
import "./globals.css";
import { ThemeBootstrap } from "@/components/ThemeBootstrap";

export const metadata: Metadata = {
  title: "Resident Directory",
  description:
    "A retro-themed resident directory with privacy controls and admin tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeBootstrap />
        {children}
      </body>
    </html>
  );
}
