import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SunriseProvider } from "@/lib/store";
import AuthGuard from "@/components/AuthGuard";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Sunrise • Private Space for Two",
  description: "A private digital space shared between Harit (Gujarat) & Ameera (Maharashtra), India.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Sunrise",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF6F0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sunrise" />
      </head>
      <body className="min-h-full flex flex-col selection:bg-[#EDE0D0] selection:text-[#3A342C]">
        <SunriseProvider>
          <AuthGuard>{children}</AuthGuard>
          <PWAInstallPrompt />
        </SunriseProvider>

        {/* Register PWA Service Worker */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function(err) {
                  console.log('SW registration skipped:', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
