import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dernek Tüzüğü",
  description:
    "Derneğimizin kuruluş amacı, faaliyet alanları, üyelik şartları ve yönetim esaslarını düzenleyen tüzüktür.",
  openGraph: {
    title: "Dernek Tüzüğü",
    description: "Derneğimizin kuruluş amacı, faaliyet alanları, üyelik şartları ve yönetim esaslarını düzenleyen tüzüktür.",
  },
  alternates: {
    canonical: "/hakkimizda/tuzuk",
  },
};

async function getPageFromDB() {
  try {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } })
      : await prisma.tenant.findFirst({ where: { isActive: true }, select: { id: true }, orderBy: { createdAt: "asc" } });

    if (!tenant) return null;

    const page = await prisma.page.findFirst({
      where: {
        slug: "tuzuk",
        tenantId: tenant.id,
        isPublished: true,
      },
    });

    return page;
  } catch {
    return null;
  }
}

/* ─── Tüzük Verileri ─── */

interface TuzukMadde {
  no: string;
  baslik: string;
  paragraflar?: string[];
  liste?: string[];
}

interface TuzukBolum {
  id: string;
  numara: number;
  baslik: string;
  maddeler: TuzukMadde[];
}

const tuzukBolumleri: TuzukBolum[] = [
  {
    id: "bolum-1",
    numara: 1,
    baslik: "Derneğin Adı ve Merkezi",
    maddeler: [
      {
        no: "Madde 1",
        baslik: "Derneğin Adı",
        paragraflar: [
          "Derneğin adı \"[Dernek Adı]\" olup, kısa adı \"[Kısa Ad]\"dır. İşbu tüzükte \"Dernek\" olarak anılacaktır.",
        ],
      },
      {
        no: "Madde 2",
        baslik: "Derneğin Merkezi",
        paragraflar: [
          "Derneğin merkezi [Şehir]'dir. Dernek, yönetim kurulu kararıyla yurt içinde ve yurt dışında şube ve temsilcilik açabilir.",
        ],
      },
    ],
  },
  {
    id: "bolum-2",
    numara: 2,
    baslik: "Derneğin Amacı",
    maddeler: [
      {
        no: "Madde 3",
        baslik: "Amaç",
        paragraflar: [
          "Dernek; toplumsal dayanışmayı güçlendirmek, eğitim ve kültür alanında faaliyetler yürütmek, ihtiyaç sahibi bireylere destek olmak ve üyeleri arasında sosyal bağları geliştirmek amacıyla kurulmuştur.",
        ],
      },
    ],
  },
  {
    id: "bolum-3",
    numara: 3,
    baslik: "Faaliyet Alanları",
    maddeler: [
      {
        no: "Madde 4",
        baslik: "Çalışma Alanları ve Biçimleri",
        paragraflar: [
          "Dernek, amacını gerçekleştirmek için aşağıdaki faaliyetlerde bulunur:",
        ],
        liste: [
          "Eğitim bursları, kurslar, seminerler ve konferanslar düzenlemek.",
          "Sosyal yardım kampanyaları ve gıda/giyim yardımları organize etmek.",
          "Kültürel etkinlikler, festivaller ve sergiler tertip etmek.",
          "Ulusal ve uluslararası kuruluşlarla iş birliği yapmak, ortak projeler yürütmek.",
          "Araştırma ve yayın faaliyetlerinde bulunmak; dergi, kitap, bülten çıkarmak.",
          "Üyelerin mesleki gelişimini destekleyecek atölye ve eğitim programları düzenlemek.",
          "Amacına uygun taşınır ve taşınmaz mal edinmek; gerektiğinde bunları satmak veya kiralamak.",
        ],
      },
    ],
  },
  {
    id: "bolum-4",
    numara: 4,
    baslik: "Üyelik Şartları",
    maddeler: [
      {
        no: "Madde 5",
        baslik: "Asıl Üyelik",
        paragraflar: [
          "Fiil ehliyetine sahip bulunan ve derneğin amaç ile ilkelerini benimseyerek bu doğrultuda çalışmayı kabul eden her gerçek kişi derneğe üye olma hakkına sahiptir. Üyelik başvurusu yazılı olarak yapılır ve yönetim kurulu başvuruyu 30 gün içinde karara bağlar.",
        ],
      },
      {
        no: "Madde 6",
        baslik: "Onursal Üyelik",
        paragraflar: [
          "Derneğe maddi ve manevi bakımdan önemli destek sağlayan kişiler, yönetim kurulu kararıyla onursal üye olarak kabul edilebilir. Onursal üyelerin oy hakları yoktur, aidat ödeme zorunlulukları bulunmaz.",
        ],
      },
    ],
  },
  {
    id: "bolum-5",
    numara: 5,
    baslik: "Üyelikten Çıkma ve Çıkarılma",
    maddeler: [
      {
        no: "Madde 7",
        baslik: "Üyelikten Çıkma",
        paragraflar: [
          "Her üye, yazılı olarak bildirmek kaydıyla dernek üyeliğinden istifa edebilir. İstifa dilekçesinin yönetim kuruluna ulaşması ile çıkış işlemi tamamlanır. Üyelikten ayrılma, üyenin birikmiş aidat borçlarını sona erdirmez.",
        ],
      },
      {
        no: "Madde 8",
        baslik: "Üyelikten Çıkarılma",
        paragraflar: [
          "Aşağıdaki durumlarda üyelik, yönetim kurulu kararıyla sona erdirilebilir:",
        ],
        liste: [
          "Dernek tüzüğüne, amaçlarına veya genel kurul kararlarına aykırı davranmak.",
          "Üst üste altı ay aidat borcunu ödememek ve yapılan yazılı uyarıya rağmen ödeme yapmamak.",
          "Derneğin itibarını zedeleyici faaliyetlerde bulunmak.",
        ],
      },
    ],
  },
  {
    id: "bolum-6",
    numara: 6,
    baslik: "Dernek Organları",
    maddeler: [
      {
        no: "Madde 9",
        baslik: "Zorunlu Organlar",
        paragraflar: [
          "Derneğin zorunlu organları şunlardır:",
        ],
        liste: [
          "Genel Kurul",
          "Yönetim Kurulu",
          "Denetim Kurulu",
        ],
      },
    ],
  },
  {
    id: "bolum-7",
    numara: 7,
    baslik: "Genel Kurul",
    maddeler: [
      {
        no: "Madde 10",
        baslik: "Toplantı Zamanı ve Yeri",
        paragraflar: [
          "Olağan genel kurul, iki yılda bir, Mart ayı içinde yönetim kurulunca belirlenecek gün, yer ve saatte toplanır. Olağanüstü genel kurul; yönetim veya denetim kurulunun gerekli gördüğü hallerde ya da dernek üyelerinin beşte birinin yazılı isteği üzerine yönetim kurulunca toplantıya çağrılır.",
        ],
      },
      {
        no: "Madde 11",
        baslik: "Toplantı ve Karar Yeter Sayısı",
        paragraflar: [
          "Genel kurul, derneğe kayıtlı üyelerin yarısından bir fazlasının katılımıyla toplanır. İlk toplantıda yeter sayı sağlanamazsa, ikinci toplantıda çoğunluk aranmaz; ancak bu toplantıya katılan üye sayısı yönetim ve denetim kurulları üye tam sayısının iki katından az olamaz. Kararlar katılanların salt çoğunluğuyla alınır. Tüzük değişikliği ve fesih kararları için toplantıya katılan üyelerin üçte iki çoğunluğu gereklidir.",
        ],
      },
      {
        no: "Madde 12",
        baslik: "Genel Kurulun Görev ve Yetkileri",
        liste: [
          "Yönetim ve denetim kurullarını seçmek.",
          "Dernek tüzüğünü değiştirmek.",
          "Yönetim ve denetim kurulları raporlarını görüşmek, yönetim kurulunu ibra etmek.",
          "Yönetim kurulunca hazırlanan bütçeyi görüşüp aynen veya değiştirerek kabul etmek.",
          "Derneğin federasyona katılması veya ayrılması hakkında karar vermek.",
          "Derneğin uluslararası faaliyette bulunması, yurt dışındaki kuruluşlara üye olması veya ayrılmasına karar vermek.",
          "Derneğin feshine karar vermek.",
          "Mevzuatta genel kurulca yapılması belirtilen diğer görevleri yerine getirmek.",
        ],
      },
    ],
  },
  {
    id: "bolum-8",
    numara: 8,
    baslik: "Yönetim Kurulu",
    maddeler: [
      {
        no: "Madde 13",
        baslik: "Oluşumu ve Görev Süresi",
        paragraflar: [
          "Yönetim kurulu, genel kurul tarafından gizli oyla seçilen 7 asıl ve 7 yedek üyeden oluşur. Görev süresi 2 yıldır. Süresi biten üye yeniden seçilebilir. Yönetim kurulu ilk toplantısında görev bölümü yaparak başkan, başkan yardımcısı, genel sekreter ve sayman seçer.",
        ],
      },
      {
        no: "Madde 14",
        baslik: "Görev ve Yetkileri",
        liste: [
          "Derneği temsil etmek veya bu konuda kendi üyelerinden bir veya birkaçına yetki vermek.",
          "Gelir ve gider hesaplarına ilişkin işlemleri yapmak, gelecek döneme ait bütçeyi hazırlayarak genel kurula sunmak.",
          "Genel kurul kararlarını uygulamak.",
          "Derneğin amaçlarını gerçekleştirmek için her türlü kararı almak ve uygulamak.",
          "Dernek tüzüğünün ve mevzuatın kendisine verdiği diğer işleri yapmak ve yetkileri kullanmak.",
        ],
      },
      {
        no: "Madde 15",
        baslik: "Toplantı Usulü",
        paragraflar: [
          "Yönetim kurulu, en az ayda bir kez başkanın çağrısıyla toplanır. Üye tam sayısının yarısından bir fazlasının hazır bulunması ile toplanır; kararlar toplantıya katılan üyelerin salt çoğunluğuyla alınır. Oyların eşitliği halinde başkanın oyu yönünde karar alınmış sayılır.",
        ],
      },
    ],
  },
  {
    id: "bolum-9",
    numara: 9,
    baslik: "Denetim Kurulu",
    maddeler: [
      {
        no: "Madde 16",
        baslik: "Oluşumu",
        paragraflar: [
          "Denetim kurulu, genel kurul tarafından seçilen 3 asıl ve 3 yedek üyeden oluşur. Görev süresi 2 yıldır.",
        ],
      },
      {
        no: "Madde 17",
        baslik: "Görev ve Yetkileri",
        paragraflar: [
          "Denetim kurulu en az yılda bir defa denetim yapar.",
        ],
        liste: [
          "Derneğin tüzüğünde gösterilen amaç ve amacın gerçekleştirilmesi için sürdürülecek çalışma konuları doğrultusunda faaliyet gösterip göstermediğini, defter, hesap ve kayıtların mevzuata ve dernek tüzüğüne uygun olarak tutulup tutulmadığını denetlemek.",
          "Denetim sonuçlarını bir rapor halinde yönetim kuruluna ve genel kurula sunmak.",
          "Gerektiğinde genel kurulu toplantıya çağırmak.",
        ],
      },
    ],
  },
  {
    id: "bolum-10",
    numara: 10,
    baslik: "Mali Hükümler",
    maddeler: [
      {
        no: "Madde 18",
        baslik: "Gelir Kaynakları",
        paragraflar: [
          "Derneğin gelir kaynakları şunlardır:",
        ],
        liste: [
          "Üye aidatları: Aylık [tutar] TL olup, yönetim kurulu kararıyla değiştirilebilir.",
          "Bağış ve yardımlar.",
          "Derneğin mal varlığından elde edilen gelirler.",
          "Etkinlik, yayın ve proje gelirleri.",
          "Yardım toplama hakkındaki mevzuat hükümlerine uygun olarak toplanacak bağış ve yardımlar.",
        ],
      },
      {
        no: "Madde 19",
        baslik: "Gelir ve Gider İşlemleri",
        paragraflar: [
          "Dernek gelirleri, alındı belgesi ile tahsil edilir. Giderler ise harcama belgesi ile yapılır. Bu belgelerin saklama süresi, özel kanunlarda gösterilen daha uzun süreye ilişkin hükümler saklı kalmak üzere, beş yıldır. Dernek gelirlerinin bankalar aracılığıyla tahsili halinde banka tarafından düzenlenen dekont veya hesap özeti gibi belgeler alındı belgesi yerine geçer.",
        ],
      },
      {
        no: "Madde 20",
        baslik: "Defter ve Kayıtlar",
        paragraflar: [
          "Dernek, 5253 sayılı Dernekler Kanunu ve ilgili mevzuat hükümleri uyarınca tutulması gereken defterleri tutar. Defterlerin noterden veya il dernekler müdürlüğünden onaylı olması zorunludur.",
        ],
      },
    ],
  },
  {
    id: "bolum-11",
    numara: 11,
    baslik: "Tüzük Değişikliği ve Fesih",
    maddeler: [
      {
        no: "Madde 21",
        baslik: "Tüzük Değişikliği",
        paragraflar: [
          "Tüzük değişikliği, genel kurul kararı ile yapılabilir. Gündemde yer almak kaydıyla veya hazır bulunan üyelerin onda birinin yazılı talebi üzerine gündem maddesi olarak görüşülür. Değişiklik için toplantıya katılan üyelerin üçte iki çoğunluğunun oyu gereklidir.",
        ],
      },
      {
        no: "Madde 22",
        baslik: "Derneğin Feshi ve Tasfiye",
        paragraflar: [
          "Dernek genel kurulu, her zaman derneğin feshine karar verebilir. Fesih kararı için genel kurula katılma hakkı bulunan üyelerin en az üçte ikisinin toplantıya katılması şarttır. Bu suretle çoğunluk sağlanamazsa ikinci toplantıda çoğunluk aranmaz; ancak toplantıya katılan üye sayısı yönetim ve denetim kurulları üye tam sayısının iki katından az olamaz. Fesih hakkındaki karar, hazır bulunan üyelerin üçte iki çoğunluğu ile verilir.",
          "Derneğin feshi halinde mevcut mal varlığı, genel kurul kararı ile belirlenen bir kurum veya kuruluşa devredilir. Bu konuda karar alınamaması halinde derneğin bulunduğu ildeki amacına en yakın ve fesih tarihinde en fazla üyeye sahip derneğe devredilir.",
        ],
      },
      {
        no: "Madde 23",
        baslik: "Hüküm Eksikliği",
        paragraflar: [
          "Bu tüzükte belirtilmemiş hususlarda 5253 sayılı Dernekler Kanunu, 4721 sayılı Türk Medeni Kanunu ve ilgili diğer mevzuat hükümleri uygulanır.",
        ],
      },
    ],
  },
];

/* ─── Bileşenler ─── */

function TOCIcon() {
  return (
    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  );
}

function ArticleContent({ madde }: { madde: TuzukMadde }) {
  return (
    <div className="border-b border-border last:border-b-0 pb-5 mb-5 last:pb-0 last:mb-0">
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-white whitespace-nowrap">
          {madde.no}
        </span>
        <h3 className="font-bold text-[15px] text-foreground">{madde.baslik}</h3>
      </div>
      <div className="text-sm text-muted leading-relaxed">
        {madde.paragraflar?.map((p, i) => (
          <p key={i} className={i < (madde.paragraflar?.length ?? 0) - 1 ? "mb-2" : ""}>
            {p}
          </p>
        ))}
        {madde.liste && (
          <ul className="mt-2.5 space-y-1.5">
            {madde.liste.map((item, i) => (
              <li key={i} className="relative pl-5 text-sm text-muted">
                <span className="absolute left-1.5 top-[9px] w-[5px] h-[5px] rounded-full bg-primary/40" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SectionCard({ bolum }: { bolum: TuzukBolum }) {
  return (
    <div
      id={bolum.id}
      className="group card p-8 md:p-9 relative overflow-hidden transition-all duration-300 hover:shadow-lg scroll-mt-24"
    >
      {/* Left accent line on hover */}
      <div className="absolute top-0 left-0 w-[3px] h-full bg-transparent group-hover:bg-primary transition-all duration-300" />

      <div className="w-9 h-9 rounded-[10px] bg-accent flex items-center justify-center mb-3.5">
        <span className="text-sm font-extrabold text-primary">{bolum.numara}</span>
      </div>

      <h2 className="text-xl font-bold font-heading text-primary mb-5 tracking-tight">
        {bolum.baslik}
      </h2>

      {bolum.maddeler.map((madde) => (
        <ArticleContent key={madde.no} madde={madde} />
      ))}
    </div>
  );
}

/* ─── Sayfa ─── */

export default async function TuzukPage() {
  const dbPage = await getPageFromDB();

  if (dbPage) {
    return (
      <main>
        <section className="relative overflow-hidden bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
          </div>
          <div className="relative container mx-auto px-4">
            <nav className="text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>
              <span className="mx-2">/</span>
              <Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Dernek Tüzüğü</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
              {dbPage.title}
            </h1>
            {dbPage.metaDesc && (
              <p className="text-base md:text-lg text-white/80 max-w-2xl">
                {dbPage.metaDesc}
              </p>
            )}
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-4xl mx-auto text-foreground">
              <div dangerouslySetInnerHTML={{ __html: dbPage.content }} />
            </div>
          </div>
        </section>

        {dbPage.customCss && (
          <style dangerouslySetInnerHTML={{ __html: dbPage.customCss }} />
        )}
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Dernek Tüzüğü</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
            Dernek Tüzüğü
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl">
            Derneğimizin kuruluş amacı, faaliyet alanları, üyelik şartları ve yönetim esaslarını düzenleyen tüzüktür.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="section-padding bg-background">
        <div className="max-w-[860px] mx-auto px-4">

          {/* İçindekiler */}
          <div className="card p-8 mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

            <div className="flex items-center gap-2.5 mb-5">
              <TOCIcon />
              <h2 className="text-lg font-bold font-heading text-primary">İçindekiler</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {tuzukBolumleri.map((bolum) => (
                <a
                  key={bolum.id}
                  href={`#${bolum.id}`}
                  className="flex items-baseline gap-2.5 py-1.5 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-xs font-bold text-primary min-w-[20px]">
                    {String(bolum.numara).padStart(2, "0")}
                  </span>
                  <span className="font-medium">{bolum.baslik}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Bölümler */}
          <div className="space-y-6">
            {tuzukBolumleri.map((bolum) => (
              <SectionCard key={bolum.id} bolum={bolum} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-accent p-8 md:p-10 text-center">
            <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground mb-2">
              Sorularınız mı Var?
            </h2>
            <p className="text-muted text-sm max-w-lg mx-auto mb-5">
              Tüzüğümüz hakkında detaylı bilgi almak veya üyelik başvurusunda bulunmak için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/uye-ol" className="btn-primary">Üye Ol</Link>
              <Link href="/iletisim" className="btn-outline">Bize Ulaşın</Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
