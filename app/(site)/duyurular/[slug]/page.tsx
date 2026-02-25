import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Duyuru Detay",
  description: "Duyuru iceriginin detayli sayfasi.",
};

export default function DuyuruDetayPage({
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
            <a href="/duyurular" className="hover:text-white">
              Duyurular
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">{params.slug}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold bg-red-400/20 text-red-200 px-3 py-1 rounded-full">
              Onemli
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            2024 Olagan Genel Kurul Toplanti Daveti
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              1 Subat 2024
            </span>
          </div>
        </div>
      </section>

      {/* Icerik */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <article className="prose prose-lg max-w-none">
            <div className="bg-accent border border-primary/20 rounded-[var(--border-radius)] p-6 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-foreground font-semibold mb-1">Onemli Bilgi</p>
                  <p className="text-muted text-sm">
                    Genel Kurul toplantisina katilim icin uyelik aidatlarinizin
                    guncel olmasi gerekmektedir.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted leading-relaxed mb-6">
              Degerli Uyelerimiz,
            </p>
            <p className="text-muted leading-relaxed mb-6">
              Dernegimizin 2024 yili olagan genel kurul toplantisi asagida belirtilen
              tarih, saat ve adreste gerceklestirilecektir. Tum uyelerimizin katilimini
              rica ederiz.
            </p>

            <h2 className="text-2xl font-bold font-heading text-foreground mb-4 mt-8">
              Toplanti Bilgileri
            </h2>
            <div className="bg-background-alt rounded-[var(--border-radius)] p-6 border border-border mb-6">
              <dl className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-semibold text-foreground min-w-[120px]">Tarih:</dt>
                  <dd className="text-muted">15 Mart 2024, Cuma</dd>
                </div>
                <hr className="border-border" />
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-semibold text-foreground min-w-[120px]">Saat:</dt>
                  <dd className="text-muted">14:00 - 17:00</dd>
                </div>
                <hr className="border-border" />
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <dt className="font-semibold text-foreground min-w-[120px]">Yer:</dt>
                  <dd className="text-muted">DernekPro Konferans Salonu, Istanbul</dd>
                </div>
              </dl>
            </div>

            <h2 className="text-2xl font-bold font-heading text-foreground mb-4 mt-8">
              Gundem Maddeleri
            </h2>
            <ol className="space-y-2 mb-6 list-decimal list-inside">
              {[
                "Acilis ve yoklama",
                "Divan heyetinin olusturulmasi",
                "2023 yili faaliyet raporunun okunmasi",
                "2023 yili mali raporunun okunmasi",
                "Denetim kurulu raporunun okunmasi",
                "Yonetim kurulunun ibra edilmesi",
                "2024 yili butce ve faaliyet planinin gorululmesi",
                "Dilek ve temenniler",
                "Kapanis",
              ].map((madde, i) => (
                <li key={i} className="text-muted pl-2">
                  {madde}
                </li>
              ))}
            </ol>

            <p className="text-muted leading-relaxed mb-6">
              Toplantiya bizzat katilamayacak uyelerimiz, noter onayli vekaletname ile
              baska bir uye araciligiyla temsil edilebilirler. Vekalet formu asagidaki
              linkten indirilebilir.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <button className="btn-primary">
                Vekalet Formunu Indir
              </button>
              <button className="btn-outline">
                Katilim Bildir
              </button>
            </div>
          </article>

          {/* Paylas */}
          <div className="mt-10 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-semibold">Bu duyuruyu paylas:</span>
              <div className="flex gap-3">
                {["Facebook", "Twitter", "WhatsApp"].map((p) => (
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
          </div>
        </div>
      </section>
    </main>
  );
}
