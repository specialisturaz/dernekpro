export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-alt">
      {/* Ust Bar */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold font-heading text-primary">
                Dernek<span className="text-secondary">Pro</span>
              </span>
            </a>

            {/* Navigasyon */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="/hesabim"
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                Panel
              </a>
              <a
                href="/"
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                Ana Sayfa
              </a>
            </nav>

            {/* Kullanici */}
            <div className="flex items-center gap-3">
              {/* Bildirimler */}
              <button className="relative w-10 h-10 rounded-full bg-background-alt border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">AY</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    Ahmet Yilmaz
                  </p>
                  <p className="text-xs text-muted">Uye</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="card p-4 sticky top-24 space-y-1">
              {[
                {
                  href: "/hesabim",
                  etiket: "Genel Bakis",
                  ikon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                  aktif: true,
                },
                {
                  href: "/hesabim/profil",
                  etiket: "Profilim",
                  ikon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  aktif: false,
                },
                {
                  href: "/hesabim/bagislarim",
                  etiket: "Bagislarim",
                  ikon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                  aktif: false,
                },
                {
                  href: "/hesabim/etkinliklerim",
                  etiket: "Etkinliklerim",
                  ikon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                  aktif: false,
                },
                {
                  href: "/hesabim/aidatlar",
                  etiket: "Aidat Odemeleri",
                  ikon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
                  aktif: false,
                },
                {
                  href: "/hesabim/ayarlar",
                  etiket: "Hesap Ayarlari",
                  ikon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                  aktif: false,
                },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-sm font-medium transition-colors ${
                    item.aktif
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:bg-background-alt hover:text-foreground"
                  }`}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.ikon}
                    />
                  </svg>
                  {item.etiket}
                </a>
              ))}

              <hr className="border-border my-2" />

              <a
                href="/giris"
                className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--border-radius)] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cikis Yap
              </a>
            </nav>
          </aside>

          {/* Icerik */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
