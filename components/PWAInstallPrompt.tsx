"use client";

import React, { useState, useEffect } from "react";
import { Share, PlusSquare, X, Download, Smartphone } from "lucide-react";

export default function PWAInstallPrompt() {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS Safari
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = (window.navigator as any).standalone === true;

    if (isIOS && !isStandalone) {
      const hasDismissed = localStorage.getItem("sunrise_pwa_ios_dismissed");
      if (!hasDismissed) {
        setShowIOSPrompt(true);
      }
    }

    // Android/Chrome beforeinstallprompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowAndroidPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const dismissIOS = () => {
    setShowIOSPrompt(false);
    localStorage.setItem("sunrise_pwa_ios_dismissed", "true");
  };

  return (
    <>
      {/* iOS Safari Home Screen Banner */}
      {showIOSPrompt && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92vw] bg-[#FAF6F0] dark:bg-[#1E1A16] p-4 rounded-2xl shadow-2xl border border-[#D4A857] space-y-3 font-sans text-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4A857] text-white flex items-center justify-center text-base">
                ☀️
              </div>
              <div>
                <h4 className="font-serif font-medium text-[#3A342C] dark:text-[#F7F3ED]">
                  Install Sunrise on iPhone
                </h4>
                <p className="text-[10px] text-[#7A7267]">For morning letter notifications</p>
              </div>
            </div>
            <button onClick={dismissIOS} className="text-[#7A7267] p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#3A342C] dark:text-[#F7F3ED] leading-snug">
            To get morning letters like a native app:
            <br />
            1. Tap the <Share className="w-3.5 h-3.5 inline text-[#D4A857]" /> <strong>Share</strong> button below.
            <br />
            2. Scroll & select <PlusSquare className="w-3.5 h-3.5 inline text-[#D4A857]" /> <strong>Add to Home Screen</strong>.
          </p>
        </div>
      )}

      {/* Android/Chrome Native Install Button */}
      {showAndroidPrompt && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92vw] bg-[#FAF6F0] dark:bg-[#1E1A16] p-4 rounded-2xl shadow-2xl border border-[#D4A857] flex items-center justify-between gap-3 font-sans text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#D4A857]" />
            <div>
              <p className="font-medium text-[#3A342C] dark:text-[#F7F3ED]">Install Sunrise App</p>
              <p className="text-[10px] text-[#7A7267]">Install on home screen</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleInstallAndroid}
              className="px-3.5 py-1.5 rounded-full bg-[#D4A857] text-white font-semibold text-[11px] shadow-xs flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Install
            </button>
            <button onClick={() => setShowAndroidPrompt(false)} className="p-1 text-[#7A7267]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
