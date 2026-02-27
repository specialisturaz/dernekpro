import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bağış Yap",
  description: "Derneğimize bağış yaparak toplumsal projelere destek olun.",
  openGraph: {
    title: "Bağış Yap",
    description: "Derneğimize bağış yaparak toplumsal projelere destek olun.",
  },
  alternates: {
    canonical: "/bagis",
  },
};

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  targetAmount: number;
  collectedAmount: number;
  deadline: string | null;
  isActive: boolean;
}

async function getKampanyalar(): Promise<Campaign[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/campaigns`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) return json.data;
  } catch { /* fallback */ }
  return [];
}

const bagisSecenekleri = [50, 100, 250, 500, 1000, 2500];

export default async function BagisPage() {
  const kampanyalar = await getKampanyalar();

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Bağış</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Bağış Yapın, Hayat Değiştirin</h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl">Her bağış, ihtiyaç sahibi birinin hayatında anlamlı bir değişim yaratır.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a href="#bagis-formu" className="btn-secondary">Hemen Bağış Yap</a>
              {kampanyalar.length > 0 && (
                <a href="#kampanyalar" className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-[var(--border-radius)] hover:bg-white hover:text-primary transition-all duration-200">Kampanyaları Gör</a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Neden Bağış */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Bağışlarınız Nasıl Kullanılır?</h2>
            <p className="text-muted max-w-2xl mx-auto">Tam şeffaflık ilkesiyle yönetilen bağış sistemimiz ile her kuruşun nereye harcandığı takip edilebilir.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { ikon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", baslik: "Eğitim", aciklama: "Bağışınızın %40'ı öğrenci bursları, kitap yardımı ve eğitim programlarına aktarılır.", yuzde: 40 },
              { ikon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", baslik: "Sağlık", aciklama: "Bağışınızın %30'u sağlık taraması, tedavi desteği ve sağlık eğitimi projelerine ayrılır.", yuzde: 30 },
              { ikon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", baslik: "Çevre", aciklama: "Bağışınızın %30'u çevre koruma, ağaçlandırma ve sürdürülebilirlik projelerine harcanır.", yuzde: 30 },
            ].map((item) => (
              <div key={item.baslik} className="card p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.ikon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">{item.baslik}</h3>
                <p className="text-muted text-sm mb-4">{item.aciklama}</p>
                <div className="w-full bg-background-alt rounded-full h-2 border border-border">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${item.yuzde}%` }} />
                </div>
                <p className="text-primary font-bold text-sm mt-2">%{item.yuzde}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kampanyalar */}
      {kampanyalar.length > 0 && (
        <section id="kampanyalar" className="section-padding bg-background-alt">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Aktif Kampanyalar</h2>
              <p className="text-muted max-w-2xl mx-auto">Belirli bir projeye destek olmak istiyorsanız aktif kampanyalarımızdan birini seçebilirsiniz.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {kampanyalar.map((kampanya) => {
                const yuzde = kampanya.targetAmount > 0 ? Math.round((kampanya.collectedAmount / kampanya.targetAmount) * 100) : 0;
                return (
                  <div key={kampanya.id} className="card group">
                    <div className="aspect-video bg-primary/5 flex items-center justify-center overflow-hidden">
                      {kampanya.coverImage ? (
                        <img src={kampanya.coverImage} alt={kampanya.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <svg className="w-12 h-12 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold font-heading text-foreground mb-2">{kampanya.title}</h3>
                      <p className="text-muted text-sm mb-4">{kampanya.description}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground font-semibold">{kampanya.collectedAmount.toLocaleString("tr-TR")} TL</span>
                          <span className="text-muted">{kampanya.targetAmount.toLocaleString("tr-TR")} TL</span>
                        </div>
                        <div className="w-full bg-background-alt rounded-full h-2.5 border border-border">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min(yuzde, 100)}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>%{yuzde} tamamlandı</span>
                        {kampanya.deadline && <span>Son: {new Date(kampanya.deadline).toLocaleDateString("tr-TR")}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bağış Formu */}
      <section id="bagis-formu" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">Genel Bağış</h2>
              <p className="text-muted">Genel bağış fonumuza katkı yaparak tüm projelerimize destek olabilirsiniz.</p>
            </div>
            <div className="card p-8">
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">Bağış Tipi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-3 rounded-[var(--border-radius)] border-2 border-primary bg-primary/5 text-primary font-semibold text-sm">Tek Seferlik</button>
                  <button className="px-4 py-3 rounded-[var(--border-radius)] border-2 border-border text-muted font-semibold text-sm hover:border-primary hover:text-primary transition-colors">Aylık Düzenli</button>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">Bağış Tutarı (TL)</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {bagisSecenekleri.map((tutar) => (
                    <button key={tutar} className={`px-4 py-3 rounded-[var(--border-radius)] border-2 font-semibold text-sm transition-colors ${tutar === 250 ? "border-primary bg-primary text-white" : "border-border text-foreground hover:border-primary hover:text-primary"}`}>
                      {tutar.toLocaleString("tr-TR")} TL
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">TL</span>
                  <input type="number" placeholder="Diğer tutar giriniz" className="w-full pl-10 pr-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">Kişisel Bilgiler</label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Adınız" className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <input type="text" placeholder="Soyadınız" className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <input type="email" placeholder="E-posta adresiniz" className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="tel" placeholder="Telefon numaranız" className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-muted">Bağışımı anonim olarak yapmak istiyorum</span>
                </label>
              </div>
              <button className="btn-primary w-full text-lg py-4">Bağış Yap</button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                256-bit SSL ile güvenli ödeme altyapısı
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banka Bilgileri */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Banka Havalesi ile Bağış</h2>
            <p className="text-muted mb-8">Online ödeme yerine banka havalesi tercih ediyorsanız aşağıdaki hesap bilgilerini kullanabilirsiniz.</p>
            <div className="card p-6 text-left">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted">Hesap Sahibi</dt>
                  <dd className="text-foreground font-semibold">DernekPro Derneği</dd>
                </div>
                <hr className="border-border" />
                <div>
                  <dt className="text-sm text-muted">Banka</dt>
                  <dd className="text-foreground font-semibold">Türkiye İş Bankası</dd>
                </div>
                <hr className="border-border" />
                <div>
                  <dt className="text-sm text-muted">IBAN</dt>
                  <dd className="text-foreground font-semibold font-mono text-sm">TR00 0000 0000 0000 0000 0000 00</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
