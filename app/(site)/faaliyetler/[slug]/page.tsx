import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faaliyet Detay",
  description: "Faaliyet hakkinda detayli bilgi, fotograflar ve ilerleme durumu.",
};

export default function FaaliyetDetayPage({
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
            <a href="/faaliyetler" className="hover:text-white">
              Faaliyetler
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">{params.slug}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Egitim
            </span>
            <span className="text-xs font-semibold bg-green-400/20 text-green-200 px-3 py-1 rounded-full">
              Devam Ediyor
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Egitim Bursu Programi
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              15 Ocak 2024
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Tum Turkiye
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
              {/* Gorsel Placeholder */}
              <div className="aspect-video bg-primary/5 rounded-[var(--border-radius)] mb-8 flex items-center justify-center border border-border">
                <svg className="w-20 h-20 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              <article className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold font-heading text-foreground mb-4">
                  Proje Hakkinda
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  Egitim Bursu Programimiz, Turkiye genelinde ihtiyac sahibi ve basarili
                  ogrencilere yonelik kapsamli bir destek programidir. Program kapsaminda
                  ogrencilere aylik burs destegi, kitap ve kirtasiye yardimi, mentorlik
                  hizmeti ve kariyer danismanligi sunulmaktadir.
                </p>
                <p className="text-muted leading-relaxed mb-6">
                  2024 yili itibariyle 500&apos;u askin ogrenciye aktif olarak burs destegi
                  saglanmaktadir. Programimiz, bagimsiz bir komisyon tarafindan degerlendirilen
                  basvurular uzerinden yurutulmekte ve tam seffaflik ilkesiyle yonetilmektedir.
                </p>

                <h3 className="text-xl font-bold font-heading text-foreground mb-3 mt-8">
                  Program Kapsamindaki Destekler
                </h3>
                <ul className="space-y-2 mb-6">
                  {[
                    "Aylik 2.000 TL burs destegi",
                    "Yillik kitap ve kirtasiye yardimi",
                    "Haftalik mentorlik gormeleri",
                    "Kariyer danismanligi ve staj imkanlari",
                    "Yaz okulu ve atölye katilim destegi",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold font-heading text-foreground mb-3 mt-8">
                  Ilerleme Durumu
                </h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-semibold">Hedef Ogrenci Sayisi</span>
                      <span className="text-primary font-bold">500 / 750</span>
                    </div>
                    <div className="w-full bg-background-alt rounded-full h-3 border border-border">
                      <div className="bg-primary h-3 rounded-full" style={{ width: "67%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-semibold">Toplanan Bagis</span>
                      <span className="text-primary font-bold">850.000 TL / 1.200.000 TL</span>
                    </div>
                    <div className="w-full bg-background-alt rounded-full h-3 border border-border">
                      <div className="bg-secondary h-3 rounded-full" style={{ width: "71%" }} />
                    </div>
                  </div>
                </div>
              </article>

              {/* Galeri */}
              <div className="mt-10">
                <h3 className="text-xl font-bold font-heading text-foreground mb-4">
                  Galeri
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-primary/5 rounded-[var(--border-radius)] border border-border flex items-center justify-center"
                    >
                      <svg className="w-10 h-10 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Proje Bilgileri
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Kategori</dt>
                    <dd className="text-foreground text-sm font-semibold">Egitim</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Baslangic</dt>
                    <dd className="text-foreground text-sm font-semibold">15 Ocak 2024</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Durum</dt>
                    <dd className="text-green-600 text-sm font-semibold">Devam Ediyor</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Bolge</dt>
                    <dd className="text-foreground text-sm font-semibold">Tum Turkiye</dd>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <dt className="text-muted text-sm">Faydalanici</dt>
                    <dd className="text-foreground text-sm font-semibold">500+ Ogrenci</dd>
                  </div>
                </dl>
              </div>

              <div className="card p-6 bg-accent">
                <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                  Bu Projeye Destek Olun
                </h3>
                <p className="text-muted text-sm mb-4">
                  Bagisiniz ile bir ogrencinin egitim hayatina isik tutun.
                </p>
                <a href="/bagis/egitim-bursu-programi" className="btn-primary w-full text-center">
                  Bagis Yap
                </a>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4">
                  Paylas
                </h3>
                <div className="flex gap-3">
                  {["Facebook", "Twitter", "WhatsApp", "LinkedIn"].map((platform) => (
                    <button
                      key={platform}
                      className="w-10 h-10 rounded-full bg-background-alt border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors text-xs font-bold"
                      title={platform}
                    >
                      {platform[0]}
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
