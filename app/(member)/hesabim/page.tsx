import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesabim",
  description: "Uyelik paneliniz - bagislarinizi, etkinliklerinizi ve aidat durumunuzu yonetin.",
};

const istatistikler = [
  {
    etiket: "Toplam Bagis",
    deger: "4.250 TL",
    degisim: "+500 TL bu ay",
    renk: "text-green-600",
    ikon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    etiket: "Katildigi Etkinlik",
    deger: "12",
    degisim: "3 yaklasiyor",
    renk: "text-blue-600",
    ikon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    etiket: "Uyelik Suresi",
    deger: "3 Yil",
    degisim: "Aktif Uye",
    renk: "text-primary",
    ikon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    etiket: "Aidat Durumu",
    deger: "Guncel",
    degisim: "Sonraki: 15 Subat",
    renk: "text-green-600",
    ikon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
];

const sonIslemler = [
  { tarih: "2024-01-28", islem: "Aylik aidat odemesi", tutar: "150 TL", tip: "odeme" },
  { tarih: "2024-01-20", islem: "Egitim Bursu Fonu bagisi", tutar: "500 TL", tip: "bagis" },
  { tarih: "2024-01-15", islem: "Gonullu Bulusmasi kayit", tutar: "-", tip: "etkinlik" },
  { tarih: "2024-01-05", islem: "Ramazan Yardim bagisi", tutar: "250 TL", tip: "bagis" },
  { tarih: "2023-12-28", islem: "Aylik aidat odemesi", tutar: "150 TL", tip: "odeme" },
];

const yaklasanEtkinlikler = [
  {
    baslik: "Gonullu Bulusmasi 2024",
    tarih: "15 Mart 2024",
    saat: "14:00",
    yer: "Istanbul",
  },
  {
    baslik: "Dijital Okuryazarlik Semineri",
    tarih: "22 Mart 2024",
    saat: "10:00",
    yer: "Online",
  },
  {
    baslik: "Iftar Programi",
    tarih: "28 Mart 2024",
    saat: "18:30",
    yer: "Ankara",
  },
];

function getTipIkon(tip: string) {
  switch (tip) {
    case "bagis":
      return "text-green-500";
    case "odeme":
      return "text-blue-500";
    case "etkinlik":
      return "text-purple-500";
    default:
      return "text-muted";
  }
}

export default function HesabimPage() {
  return (
    <div>
      {/* Baslik */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-1">
          Hos Geldiniz, Ahmet!
        </h1>
        <p className="text-muted">Uyelik panelinize genel bakis.</p>
      </div>

      {/* Istatistik Kartlari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {istatistikler.map((stat) => (
          <div key={stat.etiket} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
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
                    d={stat.ikon}
                  />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold font-heading text-foreground">
              {stat.deger}
            </p>
            <p className="text-sm text-muted mt-0.5">{stat.etiket}</p>
            <p className={`text-xs mt-2 font-semibold ${stat.renk}`}>
              {stat.degisim}
            </p>
          </div>
        ))}
      </div>

      {/* Alt Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Son Islemler */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-heading text-foreground">
              Son Islemler
            </h2>
            <a
              href="/hesabim/bagislarim"
              className="text-sm text-primary font-semibold hover:underline"
            >
              Tumunu Gor
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Tarih
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Islem
                  </th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Tutar
                  </th>
                </tr>
              </thead>
              <tbody>
                {sonIslemler.map((islem, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-muted whitespace-nowrap">
                      {new Date(islem.tarih).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${getTipIkon(islem.tip)
                            .replace("text-", "bg-")}`}
                        />
                        <span className="text-sm text-foreground">{islem.islem}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-foreground text-right font-semibold">
                      {islem.tutar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yaklasan Etkinlikler */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-heading text-foreground">
              Yaklasan Etkinlikler
            </h2>
            <a
              href="/hesabim/etkinliklerim"
              className="text-sm text-primary font-semibold hover:underline"
            >
              Tumunu Gor
            </a>
          </div>
          <div className="space-y-4">
            {yaklasanEtkinlikler.map((etkinlik, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-[var(--border-radius)] bg-background-alt"
              >
                <div className="w-12 h-12 bg-primary text-white rounded-[var(--border-radius)] flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold leading-none">
                    {etkinlik.tarih.split(" ")[0]}
                  </span>
                  <span className="text-[10px] uppercase">
                    {etkinlik.tarih.split(" ")[1].slice(0, 3)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {etkinlik.baslik}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {etkinlik.saat} - {etkinlik.yer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hizli Islemler */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <a
          href="/bagis"
          className="card p-5 text-center hover:border-primary transition-colors group"
        >
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            Bagis Yap
          </h3>
          <p className="text-xs text-muted mt-1">Projelere destek ol</p>
        </a>
        <a
          href="/etkinlikler"
          className="card p-5 text-center hover:border-primary transition-colors group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            Etkinliklere Katil
          </h3>
          <p className="text-xs text-muted mt-1">Takvimi incele</p>
        </a>
        <a
          href="/hesabim/profil"
          className="card p-5 text-center hover:border-primary transition-colors group"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            Profili Duzenle
          </h3>
          <p className="text-xs text-muted mt-1">Bilgilerini guncelle</p>
        </a>
      </div>
    </div>
  );
}
