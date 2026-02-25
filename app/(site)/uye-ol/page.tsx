import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uye Ol",
  description:
    "Dernegimize uye olarak toplumsal degisimin bir parcasi olun. Uyelik formu ve avantajlari.",
};

const avantajlar = [
  {
    baslik: "Etkinliklere Oncelikli Katilim",
    aciklama: "Tum etkinliklerimize oncelikli kayit hakki elde edin.",
  },
  {
    baslik: "Ozel Icerik Erisimi",
    aciklama: "Uyelere ozel rapor, analiz ve egitim iceriklerine erisin.",
  },
  {
    baslik: "Oy Kullanma Hakki",
    aciklama: "Genel kurul toplantisinda oy kullanarak yonetime katkin.",
  },
  {
    baslik: "Networking Firsatlari",
    aciklama: "Farkli sektorlerden binlerce uye ile tanisin ve ag kurun.",
  },
  {
    baslik: "Indirim ve Avantajlar",
    aciklama: "Anlasmayli kurumlarda ozel indirim ve avantajlardan yararlanin.",
  },
  {
    baslik: "Sertifika Programlari",
    aciklama: "Ucretsiz egitim ve sertifika programlarina katilin.",
  },
];

export default function UyeOlPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <a href="/" className="hover:text-white">
              Ana Sayfa
            </a>
            <span className="mx-2">/</span>
            <span className="text-white">Uye Ol</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              Ailemize Katilin
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              2.500+ aktif uyemizle birlikte toplumsal degisimin bir parcasi
              olun. Uyelik basvurunuzu simdi yapin.
            </p>
          </div>
        </div>
      </section>

      {/* Uyelik Avantajlari */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Uyelik Avantajlari
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Uye olarak elde edebileceginiz avantajlari kesfet.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {avantajlar.map((avantaj) => (
              <div
                key={avantaj.baslik}
                className="flex items-start gap-4 p-5 card"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    {avantaj.baslik}
                  </h3>
                  <p className="text-muted text-sm">{avantaj.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uyelik Formu */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
                Uyelik Basvuru Formu
              </h2>
              <p className="text-muted">
                Asagidaki formu doldurarak uyelik basvurunuzu gerceklestirebilirsiniz.
                Basvurunuz yonetim kurulu tarafindan degerlendirilecektir.
              </p>
            </div>

            <div className="card p-8">
              {/* Kisisel Bilgiler */}
              <div className="mb-8">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4 pb-2 border-b border-border">
                  Kisisel Bilgiler
                </h3>
                <div className="space-y-4">
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
                      T.C. Kimlik No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="11 haneli T.C. kimlik numaraniz"
                      maxLength={11}
                      className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Dogum Tarihi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Cinsiyet <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                        <option value="">Seciniz</option>
                        <option value="erkek">Erkek</option>
                        <option value="kadin">Kadin</option>
                        <option value="belirtmek-istemiyorum">
                          Belirtmek Istemiyorum
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Iletisim Bilgileri */}
              <div className="mb-8">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4 pb-2 border-b border-border">
                  Iletisim Bilgileri
                </h3>
                <div className="space-y-4">
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
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="0 (5XX) XXX XX XX"
                      className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ikamet adresiniz"
                      className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Il <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                        <option value="">Il seciniz</option>
                        <option>Istanbul</option>
                        <option>Ankara</option>
                        <option>Izmir</option>
                        <option>Bursa</option>
                        <option>Antalya</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        Meslek
                      </label>
                      <input
                        type="text"
                        placeholder="Mesleginiz"
                        className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ek Bilgiler */}
              <div className="mb-8">
                <h3 className="text-lg font-bold font-heading text-foreground mb-4 pb-2 border-b border-border">
                  Ek Bilgiler
                </h3>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Neden uye olmak istiyorsunuz?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Uyelik motivasyonunuzu kisaca anlatiniz..."
                    className="w-full px-4 py-3 rounded-[var(--border-radius)] border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Onaylar */}
              <div className="space-y-3 mb-8">
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
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-muted">
                    <a href="#" className="text-primary underline">
                      Dernek tuzugunu
                    </a>{" "}
                    okudum ve kabul ediyorum.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-muted">
                    Dernekten e-posta ve SMS ile bilgilendirme almak istiyorum.
                  </span>
                </label>
              </div>

              <button className="btn-primary w-full text-lg py-4">
                Basvurumu Gonder
              </button>

              <p className="text-xs text-muted text-center mt-4">
                Basvurunuz en gec 7 is gunu icerisinde degerlendirilecektir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
