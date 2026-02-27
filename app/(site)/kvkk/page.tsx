import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KVKK Aydinlatma Metni",
  description:
    "6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda aydinlatma metni.",
  alternates: {
    canonical: "/kvkk",
  },
};

const sections = [
  {
    title: "1. Veri Sorumlusu",
    content:
      "6698 sayili Kisisel Verilerin Korunmasi Kanunu (\"KVKK\") uyarinca, kisisel verileriniz veri sorumlusu olarak DernekPro tarafindan asagida aciklanan amaclar kapsaminda islenebilecektir. Bu aydinlatma metni, KVKK'nin 10. maddesi ile Aydinlatma Yukumlulugunun Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkinda Teblig kapsaminda hazirlanmistir.",
  },
  {
    title: "2. Kisisel Verilerin Islenme Amaci",
    content:
      "Toplanan kisisel verileriniz; uyelik islemlerinin yurutulmesi, bagis ve aidat islemlerinin gerceklestirilmesi, etkinlik ve faaliyet bilgilendirmelerinin yapilmasi, yasal yukumluluklerin yerine getirilmesi, iletisim faaliyetlerinin yurutulmesi, internet sitesinin islevselliginin saglanmasi, istatistiksel analizlerin yapilmasi ve hukuki sureclerin takibi amaclariyla KVKK'nin 5. ve 6. maddelerinde belirtilen kisisel veri isleme sart ve amaclarina uygun olarak islenmektedir.",
  },
  {
    title: "3. Kisisel Verilerin Aktarilmasi",
    content:
      "Toplanan kisisel verileriniz; yasal yukumluluklerimizin yerine getirilmesi amaciyla yetkili kamu kurum ve kuruluslarina, hukuki sureclerin takibi amaciyla avukatlar ve hukuk danismanlarina, odeme islemlerinin gerceklestirilmesi amaciyla bankalara ve odeme kuruluslarina, bilgi teknolojileri altyapi hizmetlerinin saglanmasi amaciyla teknoloji sirketlerine KVKK'nin 8. ve 9. maddelerinde belirtilen kisisel veri isleme sart ve amaclarina uygun olarak aktarilabilecektir.",
  },
  {
    title: "4. Kisisel Veri Toplamanin Yontemi ve Hukuki Sebebi",
    content:
      "Kisisel verileriniz; internet sitemiz, mobil uygulamalarimiz, sosyal medya hesaplarimiz, e-posta, telefon ve fiziksel ortamlar araciligiyla toplanmaktadir. Bu veriler; acik rizaniz, bir sozlesmenin kurulmasi veya ifasiyla dogrudan dogruya ilgili olmasi, hukuki yukumlulugun yerine getirilmesi icin zorunlu olmasi, ilgili kisinin kendisi tarafindan alenilesmis olmasi ve ilgili kisinin temel hak ve ozgurluklerine zarar vermemek kaydiyla veri sorumlusunun mesru menfaatleri icin veri islenmesinin zorunlu olmasi hukuki sebeplerine dayanilarak islenmektedir.",
  },
  {
    title: "5. Ilgili Kisinin Haklari (KVKK md. 11)",
    content: null,
    list: [
      "Kisisel verilerinizin islenip islenmedigini ogrenme",
      "Kisisel verileriniz islenmisse buna iliskin bilgi talep etme",
      "Kisisel verilerinizin islenme amacini ve bunlarin amacina uygun kullanilip kullanilmadigini ogrenme",
      "Yurt icinde veya yurt disinda kisisel verilerinizin aktarildigi ucuncu kisileri bilme",
      "Kisisel verilerinizin eksik veya yanlis islenmis olmasi halinde bunlarin duzeltilmesini isteme",
      "KVKK'nin 7. maddesinde ongoulen sartlar cercevesinde kisisel verilerinizin silinmesini veya yok edilmesini isteme",
      "Yapilan islemlerin kisisel verilerinizin aktarildigi ucuncu kisilere bildirilmesini isteme",
      "Islenen verilerin munhasiran otomatik sistemler vasitasiyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya cikmasina itiraz etme",
      "Kisisel verilerinizin kanuna aykiri olarak islenmesi sebebiyle zarara ugramaniz halinde zararin giderilmesini talep etme",
    ],
  },
  {
    title: "6. Iletisim",
    content:
      "KVKK'nin 11. maddesi kapsamindaki taleplerinizi, kimliginizi tespit edici belgeler ile birlikte asagidaki iletisim adreslerimize yazili olarak veya kayitli elektronik posta (KEP) adresi, guvenli elektronik imza ya da mobil imza kullanarak iletebilirsiniz.",
  },
];

export default function KVKKPage() {
  return (
    <main>
      {/* Hero / Breadcrumb */}
      <section className="bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">
              Ana Sayfa
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">KVKK Aydinlatma Metni</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            KVKK Aydinlatma Metni
          </h1>
          <p className="text-white/70 mt-3 max-w-2xl">
            6698 Sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda
            kisisel verilerinizin islenmesine iliskin aydinlatma metni.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="card p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold font-heading text-foreground mb-4">
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-muted text-sm leading-relaxed">
                    {section.content}
                  </p>
                )}
                {section.list && (
                  <ul className="space-y-2 mt-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* İletişim Kutusu */}
            <div className="card p-6 md:p-8 bg-primary/5 border-primary/20">
              <h3 className="font-bold text-foreground mb-3">Basvuru Iletisim Bilgileri</h3>
              <div className="space-y-2 text-sm text-muted">
                <p><strong>Adres:</strong> Merkez Mah. Cumhuriyet Cad. No: 42, Besiktas / Istanbul</p>
                <p><strong>E-posta:</strong> kvkk@dernekpro.com</p>
                <p><strong>Telefon:</strong> +90 (212) 123 45 67</p>
              </div>
            </div>

            <p className="text-xs text-muted text-center">
              Bu aydinlatma metni en son 01.01.2025 tarihinde guncellenmistir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
