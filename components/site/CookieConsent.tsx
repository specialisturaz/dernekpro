"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Kısa gecikme ile göster (sayfa yüklendikten sonra)
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* İkon + Metin */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-foreground font-semibold mb-1">
                Cerez Kullanimi
              </p>
              <p className="text-xs text-muted leading-relaxed">
                Bu web sitesi, deneyiminizi iyilestirmek icin cerezleri kullanmaktadir.
                Siteyi kullanmaya devam ederek{" "}
                <Link href="/cerez-politikasi" className="text-primary underline hover:text-primary-dark">
                  Cerez Politikamizi
                </Link>{" "}
                ve{" "}
                <Link href="/kvkk" className="text-primary underline hover:text-primary-dark">
                  KVKK Aydinlatma Metnimizi
                </Link>{" "}
                kabul etmis sayilirsiniz.
              </p>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={handleReject}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted hover:text-foreground hover:bg-gray-50 transition-colors"
            >
              Reddet
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
