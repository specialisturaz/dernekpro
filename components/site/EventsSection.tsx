import Link from "next/link";

const demoEvents = [
  {
    id: "1",
    title: "İftar Programı 2026",
    slug: "iftar-programi-2026",
    date: "2026-03-15",
    time: "18:30",
    location: "İstanbul Konferans Merkezi",
    isFree: true,
  },
  {
    id: "2",
    title: "Gönüllü Eğitim Semineri",
    slug: "gonullu-egitim-semineri",
    date: "2026-03-22",
    time: "14:00",
    location: "Online (Zoom)",
    isFree: true,
  },
  {
    id: "3",
    title: "Yardım Koşusu 2026",
    slug: "yardim-kosusu-2026",
    date: "2026-04-05",
    time: "09:00",
    location: "Validebağ Korusu, Üsküdar",
    isFree: false,
  },
];

function getMonthName(dateStr: string) {
  return new Intl.DateTimeFormat("tr-TR", { month: "short" }).format(
    new Date(dateStr)
  );
}

function getDay(dateStr: string) {
  return new Date(dateStr).getDate();
}

export default function EventsSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Etkinlik Takvimi
            </span>
            <h2 className="mt-3">
              Yaklaşan <span className="text-primary">Etkinlikler</span>
            </h2>
          </div>
          <Link
            href="/etkinlikler"
            className="mt-4 md:mt-0 text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            Tüm Etkinlikler
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="space-y-4">
          {demoEvents.map((event) => (
            <Link
              key={event.id}
              href={`/etkinlikler/${event.slug}`}
              className="flex items-center gap-6 p-5 rounded-xl border border-border bg-background hover:shadow-md hover:border-primary/30 transition-all group"
            >
              {/* Date Badge */}
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary text-white flex flex-col items-center justify-center">
                <span className="text-2xl font-bold leading-none">
                  {getDay(event.date)}
                </span>
                <span className="text-xs uppercase mt-0.5">
                  {getMonthName(event.date)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold group-hover:text-primary transition-colors truncate">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Badge */}
              <div className="hidden sm:block flex-shrink-0">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    event.isFree
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {event.isFree ? "Ücretsiz" : "Ücretli"}
                </span>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
