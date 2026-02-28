import Link from "next/link";
import { getEvents } from "@/lib/data";

function getMonthName(dateStr: string) {
  return new Intl.DateTimeFormat("tr-TR", { month: "short" }).format(
    new Date(dateStr)
  );
}

function getDay(dateStr: string) {
  return new Date(dateStr).getDate();
}

function getTime(dateStr: string) {
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(dateStr)
  );
}

function getDayName(dateStr: string) {
  return new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(
    new Date(dateStr)
  );
}

export default async function EventsSection() {
  const events = await getEvents(4);

  if (events.length === 0) return null;

  return (
    <section className="section-padding bg-background-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Etkinlik Takvimi
          </span>
          <h2 className="mt-2">
            Yaklaşan <span className="text-primary">Etkinlikler</span>
          </h2>
        </div>

        {/* Event Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/etkinlikler/${event.slug}`}
              className="card overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              {/* Date header strip */}
              <div className="bg-primary px-4 py-3 text-white text-center relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <span className="text-3xl font-bold leading-none block">
                  {getDay(event.startAt)}
                </span>
                <span className="text-xs uppercase tracking-wide text-white/80 mt-0.5 block">
                  {getMonthName(event.startAt)} - {getDayName(event.startAt)}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                  {event.title}
                </h3>

                <div className="space-y-1.5 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getTime(event.startAt)}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      event.isFree
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {event.isFree ? "Ücretsiz" : "Ücretli"}
                  </span>
                  <span className="text-primary text-xs font-semibold inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                    Detay
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link href="/etkinlikler" className="btn-outline text-sm">
            Tüm Etkinlikleri Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
