import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "DernekPro yonetim paneli - genel bakis ve istatistikler.",
};

const ozet = [
  {
    etiket: "Toplam Uye",
    deger: "2.547",
    degisim: "+23 bu ay",
    trend: "up",
    ikon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    etiket: "Aylik Bagis",
    deger: "47.250 TL",
    degisim: "+12% gecen aya gore",
    trend: "up",
    ikon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    etiket: "Aktif Etkinlik",
    deger: "8",
    degisim: "3 bu hafta",
    trend: "neutral",
    ikon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    etiket: "Yeni Basvuru",
    deger: "15",
    degisim: "Onay bekliyor",
    trend: "warning",
    ikon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  },
];

const sonUyeler = [
  { ad: "Zeynep Arslan", tarih: "2024-01-28", il: "Istanbul", durum: "Onaylandi" },
  { ad: "Can Ozturk", tarih: "2024-01-27", il: "Ankara", durum: "Beklemede" },
  { ad: "Elif Sahin", tarih: "2024-01-26", il: "Izmir", durum: "Onaylandi" },
  { ad: "Burak Yildiz", tarih: "2024-01-25", il: "Bursa", durum: "Beklemede" },
  { ad: "Selin Kara", tarih: "2024-01-24", il: "Antalya", durum: "Onaylandi" },
];

const sonBagislar = [
  { ad: "Mehmet K.", tutar: "2.500 TL", kampanya: "Egitim Bursu Fonu", tarih: "2024-01-28" },
  { ad: "Anonim", tutar: "1.000 TL", kampanya: "Genel Bagis", tarih: "2024-01-28" },
  { ad: "Ayse D.", tutar: "500 TL", kampanya: "Cevre Koruma", tarih: "2024-01-27" },
  { ad: "Ali R.", tutar: "5.000 TL", kampanya: "Egitim Bursu Fonu", tarih: "2024-01-27" },
  { ad: "Fatma Y.", tutar: "250 TL", kampanya: "Saglik Taramasi", tarih: "2024-01-26" },
];

const sonMesajlar = [
  { gonderen: "Kemal Dogan", konu: "Uyelik hakkinda bilgi", tarih: "2 saat once", okundu: false },
  { gonderen: "Merve Celik", konu: "Etkinlik sponsorlugu", tarih: "5 saat once", okundu: false },
  { gonderen: "Hasan Yilmaz", konu: "Bagis makbuzu talebi", tarih: "1 gun once", okundu: true },
  { gonderen: "Deniz Kaya", konu: "Is birligi onerisi", tarih: "1 gun once", okundu: true },
];

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Baslik */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-1">
          Dashboard
        </h1>
        <p className="text-muted">Dernege genel bakis ve son aktiviteler.</p>
      </div>

      {/* Ozet Kartlari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {ozet.map((item) => (
          <div key={item.etiket} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.ikon}
                  />
                </svg>
              </div>
              {item.trend === "up" && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Artis
                </span>
              )}
              {item.trend === "warning" && (
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                  Islem Bekliyor
                </span>
              )}
            </div>
            <p className="text-3xl font-bold font-heading text-foreground mt-4">
              {item.deger}
            </p>
            <p className="text-sm text-muted">{item.etiket}</p>
            <p className="text-xs text-muted mt-1">{item.degisim}</p>
          </div>
        ))}
      </div>

      {/* Grafik Alanı (Placeholder) */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-lg font-bold font-heading text-foreground mb-4">
            Aylik Bagis Grafiği
          </h2>
          <div className="h-64 bg-background-alt rounded-[var(--border-radius)] border border-border flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-muted/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm text-muted">Grafik alani - Chart kutuphanesi entegre edilecek</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-bold font-heading text-foreground mb-4">
            Uye Buyumesi
          </h2>
          <div className="h-64 bg-background-alt rounded-[var(--border-radius)] border border-border flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-muted/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-sm text-muted">Grafik alani - Chart kutuphanesi entegre edilecek</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tablolar */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Son Uyeler */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading text-foreground">
              Son Uye Basvurulari
            </h2>
            <a href="/admin/uyeler" className="text-sm text-primary font-semibold hover:underline">
              Tumunu Gor
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Ad Soyad
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Il
                  </th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {sonUyeler.map((uye, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {uye.ad
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {uye.ad}
                          </p>
                          <p className="text-xs text-muted">
                            {new Date(uye.tarih).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-muted">{uye.il}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          uye.durum === "Onaylandi"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {uye.durum}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Son Bagislar */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading text-foreground">
              Son Bagislar
            </h2>
            <a href="/admin/bagislar" className="text-sm text-primary font-semibold hover:underline">
              Tumunu Gor
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Bagisci
                  </th>
                  <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Kampanya
                  </th>
                  <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider pb-3">
                    Tutar
                  </th>
                </tr>
              </thead>
              <tbody>
                {sonBagislar.map((bagis, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <p className="text-sm font-semibold text-foreground">
                        {bagis.ad}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(bagis.tarih).toLocaleDateString("tr-TR")}
                      </p>
                    </td>
                    <td className="py-3 text-sm text-muted">{bagis.kampanya}</td>
                    <td className="py-3 text-sm text-foreground text-right font-bold">
                      {bagis.tutar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mesajlar + Hizli Islemler */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Son Mesajlar */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading text-foreground">
              Son Mesajlar
            </h2>
            <a href="/admin/mesajlar" className="text-sm text-primary font-semibold hover:underline">
              Tumunu Gor
            </a>
          </div>
          <div className="space-y-3">
            {sonMesajlar.map((mesaj, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-[var(--border-radius)] ${
                  !mesaj.okundu ? "bg-accent" : "bg-background-alt"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {mesaj.gonderen
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {mesaj.gonderen}
                    </p>
                    <span className="text-xs text-muted">{mesaj.tarih}</span>
                  </div>
                  <p className="text-sm text-muted truncate">{mesaj.konu}</p>
                </div>
                {!mesaj.okundu && (
                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hizli Islemler */}
        <div className="card p-6">
          <h2 className="text-lg font-bold font-heading text-foreground mb-4">
            Hizli Islemler
          </h2>
          <div className="space-y-3">
            {[
              { etiket: "Yeni Haber Ekle", href: "/admin/haberler/yeni", renk: "bg-blue-50 text-blue-700" },
              { etiket: "Duyuru Yayinla", href: "/admin/duyurular/yeni", renk: "bg-orange-50 text-orange-700" },
              { etiket: "Etkinlik Olustur", href: "/admin/etkinlikler/yeni", renk: "bg-purple-50 text-purple-700" },
              { etiket: "Uye Basvurularini Incele", href: "/admin/uyeler?durum=beklemede", renk: "bg-yellow-50 text-yellow-700" },
              { etiket: "Bagis Raporu Olustur", href: "/admin/bagislar/rapor", renk: "bg-green-50 text-green-700" },
              { etiket: "Site Ayarlarini Duzenle", href: "/admin/ayarlar", renk: "bg-gray-50 text-gray-700" },
            ].map((islem) => (
              <a
                key={islem.etiket}
                href={islem.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-[var(--border-radius)] text-sm font-semibold transition-opacity hover:opacity-80 ${islem.renk}`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {islem.etiket}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
