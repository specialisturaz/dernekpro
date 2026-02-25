import type { Metadata } from "next";
import MemberRegistrationForm from "@/components/site/MemberRegistrationForm";

export const metadata: Metadata = {
  title: "Üye Ol",
  description:
    "Derneğimize üye olarak toplumsal değişimin bir parçası olun. Üyelik formu ve avantajları.",
};

const avantajlar = [
  {
    baslik: "Etkinliklere Öncelikli Katılım",
    aciklama: "Tüm etkinliklerimize öncelikli kayıt hakkı elde edin.",
  },
  {
    baslik: "Özel İçerik Erişimi",
    aciklama: "Üyelere özel rapor, analiz ve eğitim içeriklerine erişin.",
  },
  {
    baslik: "Oy Kullanma Hakkı",
    aciklama: "Genel kurul toplantısında oy kullanarak yönetime katkın.",
  },
  {
    baslik: "Networking Fırsatları",
    aciklama: "Farklı sektörlerden binlerce üye ile tanışın ve ağ kurun.",
  },
  {
    baslik: "İndirim ve Avantajlar",
    aciklama: "Anlaşmalı kurumlarda özel indirim ve avantajlardan yararlanın.",
  },
  {
    baslik: "Sertifika Programları",
    aciklama: "Ücretsiz eğitim ve sertifika programlarına katılın.",
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
            <span className="text-white">Üye Ol</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              Ailemize Katılın
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              2.500+ aktif üyemizle birlikte toplumsal değişimin bir parçası
              olun. Üyelik başvurunuzu şimdi yapın.
            </p>
          </div>
        </div>
      </section>

      {/* Üyelik Avantajları */}
      <section className="section-padding bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Üyelik Avantajları
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Üye olarak elde edebileceğiniz avantajları keşfedin.
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

      {/* Üyelik Formu */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
                Üyelik Başvuru Formu
              </h2>
              <p className="text-muted">
                Aşağıdaki formu doldurarak üyelik başvurunuzu gerçekleştirebilirsiniz.
                Başvurunuz yönetim kurulu tarafından değerlendirilecektir.
              </p>
            </div>

            <MemberRegistrationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
