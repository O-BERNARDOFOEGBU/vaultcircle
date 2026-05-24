import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "VaultCircle – Savings Circles",
  description: "Join savings circles, grow together",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "VaultCircle" },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
