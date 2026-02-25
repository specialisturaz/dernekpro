import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iletisim",
  description:
    "Dernegimizle iletisime gecin. Adres, telefon, e-posta bilgileri ve iletisim formu.",
};

const iletisimBilgileri = [
  {
    baslik: "Adres",
    icerik: "Besiktas Mahallesi, Dernek Sokak No:42/A\n34353 Besiktas / Istanbul",
    ikon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    baslik: "Telefon",
    icerik: "+90 (212) 555 0 123\n+90 (212) 555 0 124",
    ikon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  {
    baslik: "E-posta",
    icerik: "info@dernekpro.com\ndestek@dernekpro.com",
    ikon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    baslik: "Calisma Saatleri",
    icerik: "Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 14:00",
    ikon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const konular = [
  "Genel Bilgi Talebi",
  "Uyelik Hakkinda",
  "Bagis ve Destek",
  "Etkinlik Bilgisi",
  "Is Birligi Teklifi",
  "Sikayet ve Oneri",
  "Basin ve Medya",
  "Diger",
];

export default function IletisimPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">Iletisim</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Iletisim
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Her turlu soru, oneri ve is birligi teklifleriniz icin bizimle
            iletisime gecebilirsiniz.
          </p>
        </div>
      </section>

      {/* Iletisim Bilgileri */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {iletisimBilgileri.map((bilgi) => (
              <div key={bilgi.baslik} className="card p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={bilgi.ikon}
                    />
                  </svg>
                </div>
                <h3 className="font-bold font-heading text-foreground mb-2">
                  {bilgi.baslik}
                </h3>
                <p className="text-muted text-sm whitespace-pre-line">
                  {bilgi.icerik}
                </p>
              </div>
            ))}
          </div>

          {/* Iletisim Formu + Harita */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
                Bize Mesaj Gonderin
              </h2>
              <p className="text-muted mb-8">
                Formu doldurarak bize ulasabilirsiniz. En kisa surede size donecegiz.
              </p>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Ad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Adiniz"
                      className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Soyadiniz"
                      className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    placeholder="0 (5XX) XXX XX XX"
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Konu <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                    <option value="">Konu seciniz</option>
                    {konular.map((konu) => (
                      <option key={konu} value={konu}>
                        {konu}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Mesajiniz <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Mesajinizi buraya yaziniz..."
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-muted">
                    <a href="#" className="text-primary underline">
                      KVKK Aydinlatma Metnini
                    </a>{" "}
                    okudum ve kabul ediyorum.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <button className="btn-primary w-full sm:w-auto">
                  Mesaj Gonder
                </button>
              </div>
            </div>

            {/* Harita */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
                Bizi Ziyaret Edin
              </h2>
              <p className="text-muted mb-8">
                Merkez ofisimiz Besiktas, Istanbul&apos;da yer almaktadir.
              </p>
              <div className="aspect-square lg:aspect-auto lg:h-[500px] bg-background-alt rounded-[var(--border-radius)] border border-border flex items-center justify-center">
                <div className="text-center p-8">
                  <svg
                    className="w-16 h-16 text-muted mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-muted text-sm mb-2">
                    Google Maps burada gosterilecek
                  </p>
                  <p className="text-foreground font-semibold text-sm">
                    Besiktas Mah., Dernek Sok. No:42/A
                    <br />
                    34353 Besiktas / Istanbul
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-4 hover:underline"
                  >
                    Google Maps&apos;te Ac
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sosyal Medya */}
      <section className="section-padding bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-4">
            Sosyal Medyada Bizi Takip Edin
          </h2>
          <p className="text-muted mb-8">
            Guncel gelismelerden haberdar olmak icin sosyal medya hesaplarimizi takip edin.
          </p>
          <div className="flex justify-center gap-4">
            {[
              { ad: "Facebook", harf: "F" },
              { ad: "Twitter", harf: "X" },
              { ad: "Instagram", harf: "I" },
              { ad: "YouTube", harf: "Y" },
              { ad: "LinkedIn", harf: "L" },
            ].map((platform) => (
              <a
                key={platform.ad}
                href="#"
                className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary hover:shadow-md transition-all font-bold"
                title={platform.ad}
              >
                {platform.harf}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
