import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateEventJsonLd, generateBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";

export const dynamic = "force-dynamic";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  startAt: string;
  endAt: string;
  location: string | null;
  eventType: string;
  capacity: number | null;
  isFree: boolean;
  price: number | null;
  requiresRegistration: boolean;
  status: string;
}

async function getEtkinlik(slug: string): Promise<Event | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/events/${slug}`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) return json.data;
  } catch { /* fallback */ }
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEtkinlik(params.slug);
  if (!event) return { title: "Etkinlik Bulunamadı" };
  return {
    title: event.title,
    description: event.description?.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description?.substring(0, 160),
      type: "article",
      ...(event.coverImage && { images: [{ url: event.coverImage, width: 1200, height: 630, alt: event.title }] }),
    },
    alternates: {
      canonical: `${SITE_URL}/etkinlikler/${params.slug}`,
    },
  };
}

export default async function EtkinlikDetayPage({ params }: { params: { slug: string } }) {
  const event = await getEtkinlik(params.slug);
  if (!event) notFound();

  const startDate = new Date(event.startAt);
  const endDate = new Date(event.endAt);
  const dateStr = startDate.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
  const startTime = startDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const endTime = endDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const eventJsonLd = generateEventJsonLd({
    name: event.title,
    description: event.description?.substring(0, 300) || "",
    startDate: event.startAt,
    endDate: event.endAt,
    location: event.location || undefined,
    url: `${SITE_URL}/etkinlikler/${event.slug}`,
    image: event.coverImage || undefined,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Ana Sayfa", href: "/" },
    { name: "Etkinlikler", href: "/etkinlikler" },
    { name: event.title, href: `/etkinlikler/${event.slug}` },
  ]);

  return (
    <main>
      <JsonLd data={eventJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <section className="bg-primary text-white pt-28 pb-8 md:pt-32 md:pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/etkinlikler" className="hover:text-white">Etkinlikler</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{event.title}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">{event.title}</h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2">
              {event.coverImage && (
                <div className="aspect-video rounded-[var(--border-radius)] mb-8 overflow-hidden border border-border">
                  <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="prose prose-lg max-w-none text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />
            </article>

            <aside className="space-y-6">
              <div className="card p-6 space-y-4">
                <h3 className="text-lg font-bold font-heading text-foreground">Etkinlik Bilgileri</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-foreground">{dateStr}</p>
                      <p className="text-muted">{startTime} - {endTime}</p>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-foreground">{event.location}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-foreground">{event.eventType === "ONLINE" ? "Online" : event.eventType === "HYBRID" ? "Hibrit" : "Yüz Yüze"}</p>
                      <p className="text-muted">{event.isFree ? "Ücretsiz" : `${event.price?.toLocaleString("tr-TR")} TL`}</p>
                    </div>
                  </div>
                  {event.capacity && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-foreground">Kontenjan: {event.capacity}</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
