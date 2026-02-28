"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/hesabim";
  const errorParam = searchParams.get("error");

  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"user" | "member">("member");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(email, password, loginType, rememberMe);
    if (success) {
      if (loginType === "user") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirect);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background-alt flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold font-heading text-primary">
              Dernek<span className="text-secondary">Pro</span>
            </span>
          </Link>
          <p className="text-muted text-sm mt-2">Hesabınıza giriş yapın</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          {/* Login Type Toggle */}
          <div className="flex rounded-xl bg-background-alt p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginType("member")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                loginType === "member"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Üye Girişi
            </button>
            <button
              type="button"
              onClick={() => setLoginType("user")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                loginType === "user"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Yönetim Paneli
            </button>
          </div>

          <h1 className="text-2xl font-bold font-heading text-foreground mb-6 text-center">
            {loginType === "user" ? "Yönetim Girişi" : "Üye Girişi"}
          </h1>

          {/* Error Messages */}
          {(error || errorParam) && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error || (errorParam === "unauthorized" ? "Bu alana erişim yetkiniz yok" : "Oturum süreniz dolmuş")}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* E-posta */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  className="w-full px-4 py-3 pl-11 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <svg
                  className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Şifre */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">Şifre</label>
                <Link href="#" className="text-xs text-primary hover:underline font-semibold">
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi giriniz"
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <svg
                  className="w-5 h-5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Beni Hatırla */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-muted">Beni hatırla</span>
            </label>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>

        {/* Kayıt Linki */}
        <p className="text-center text-sm text-muted mt-6">
          Hesabınız yok mu?{" "}
          <Link href="/uye-ol" className="text-primary font-semibold hover:underline">
            Üye Olun
          </Link>
        </p>

        {/* Ana Sayfa Linki */}
        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-muted hover:text-primary transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-alt flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
