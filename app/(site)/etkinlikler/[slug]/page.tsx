import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etkinlik Detay",
  description: "Etkinlik detaylari, program bilgileri ve kayit formu.",
};

export default function EtkinlikDetayPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main>
      {/* Breadcrumb */}
      <section className="bg-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <a href="/etkinlikler" className="hover:text-white">
              Etkinlikler
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">{params.slug}</span>
          </nav>
          <span className="inline-block text-xs font-semibold bg-blue-400/20 text-blue-200 px-3 py-1 rounded-full mb-4">
            Bulusma
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Gonullu Bulusmasi 2024
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              15 Mart 2024
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              14:00 - 18:00
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              DernekPro Merkez, Istanbul
            </span>
          </div>
        </div>
      </section>

      {/* Icerik */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ana Icerik */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-primary/5 rounded-[var(--border-radius)] mb-8 flex items-center justify-center border border-border">
                <svg className="w-20 h-20 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              <article className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-4">
                  Etkinlik Hakkinda
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  Yillik Gonullu Bulusmamiz, dernegimizin en beklenen etkinliklerinden
                  biridir. Bu ozel gunde tum gonullulerimiz bir araya gelerek gecmis
                  donem deneyimlerini paylasmakta, yeni donem planlarini tartismakta ve
                  sosyal bir ortamda keyifli vakit gecirmektedir.
                </p>
                <p className="text-muted leading-relaxed mb-6">
                  Bu yilki bulusmamizda ayrica motivasyon konusmacimiz Doktor Ayse Yildiz
                  &ldquo;Gonulluluk ve Kisisel Gelisim&rdquo; konulu bir sunum yapacaktir.
                </p>

                <h3 className="text-xl font-bold font-heading text-foreground mb-3 mt-8">
                  Program Akisi
                </h3>
                <div className="bg-background-alt rounded-[var(--border-radius)] border border-border overflow-hidden">
                  {[
                    { saat: "14:00 - 14:30", etkinlik: "Kayit ve Karsilama" },
                    { saat: "14:30 - 15:00", etkinlik: "Acilis Konusmasi - Genel Baskan" },
                    { saat: "15:00 - 16:00", etkinlik: "Konuk Konusmaci: Dr. Ayse Yildiz" },
                    { saat: "16:00 - 16:30", etkinlik: "Ara / Ikram" },
                    { saat: "16:30 - 17:30", etkinlik: "Atolye Calismalari" },
                    { saat: "17:30 - 18:00", etkinlik: "Kapanis ve Grup Fotograf" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex gap-4 p-4 ${
                        i % 2 === 0 ? "bg-background" : "bg-background-alt"
                      }`}
                    >
                      <span className="text-sm font-bold text-primary min-w-[130px]">
                        {item.saat}
                      </span>
                      <span className="text-sm text-foreground">{item.etkinlik}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold font-heading text-foreground mb-3 mt-8">
                  Konum
                </h3>
                <div className="aspect-[16/9] bg-background-alt rounded-[var(--border-radius)] border border-border flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-muted text-sm">Harita burada gosterilecek</p>
                    <p className="text-foreground text-sm font-semibold mt-1">
                      DernekPro Merkez, Besiktas, Istanbul
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Etkinlik Bilgileri
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Tarih</dt>
                    <dd className="text-foreground text-sm font-semibold">15 Mart 2024</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Saat</dt>
                    <dd className="text-foreground text-sm font-semibold">14:00 - 18:00</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Konum</dt>
                    <dd className="text-foreground text-sm font-semibold">Istanbul</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Kontenjan</dt>
                    <dd className="text-foreground text-sm font-semibold">150 Kisi</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Kayitli</dt>
                    <dd className="text-primary text-sm font-semibold">87 Kisi</dd>
                  </div>
                </dl>

                {/* Kontenjan Cubugu */}
                <div className="mt-4">
                  <div className="w-full bg-background-alt rounded-full h-2 border border-border">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "58%" }} />
                  </div>
                  <p className="text-xs text-muted mt-1 text-right">
                    63 kisilik yer mevcut
                  </p>
                </div>
              </div>

              <div className="card p-6 bg-accent">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                  Etkinlige Kayit Ol
                </h3>
                <p className="text-muted text-sm mb-4">
                  Etkinlige katilmak icin asagidaki formu doldurun.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="email"
                    placeholder="E-posta"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    className="w-full px-4 py-2.5 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <button className="btn-primary w-full text-sm">
                    Kayit Ol
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Paylas
                </h3>
                <div className="flex gap-3">
                  {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((p) => (
                    <button
                      key={p}
                      className="w-10 h-10 rounded-full bg-background-alt border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors text-xs font-bold"
                      title={p}
                    >
                      {p[0]}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
