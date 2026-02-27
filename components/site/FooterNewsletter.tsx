"use client";

import { useState } from "react";

interface FooterNewsletterProps {
  title?: string;
  description?: string;
}

export default function FooterNewsletter({ title, description }: FooterNewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    }, 800);
  };

  return (
    <div className="bg-primary">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg md:text-xl font-bold font-heading">
              {title || "Bültenimize Abone Olun"}
            </h3>
            <p className="text-white/70 text-sm mt-1">
              {description || "Faaliyetler, etkinlikler ve duyurulardan haberdar olun."}
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              required
              className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 rounded-lg bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === "loading"
                ? "..."
                : status === "success"
                ? "Abone Olundu!"
                : "Abone Ol"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
