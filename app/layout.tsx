import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SunriseProvider } from "@/lib/store";
import UserSwitcher from "@/components/UserSwitcher";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";

export const metadata: Metadata = {
  title: "Sunrise • Private Space for Two",
  description: "A private digital space shared between two people in Gujarat & Maharashtra, India.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col selection:bg-amber-200 selection:text-amber-900">
        <SunriseProvider>
          <header className="sticky top-0 z-30 bg-[#FAF7F2]/80 dark:bg-[#1C1917]/80 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60">
            <UserSwitcher />
          </header>
          <main className="flex-1 pb-24 pt-4">{children}</main>
          <Navbar />
          <LoginModal />
        </SunriseProvider>
      </body>
    </html>
  );
}
