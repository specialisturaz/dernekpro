import type { Metadata } from "next";
import Link from "next/link";
import EventsPageClient from "@/components/site/EventsPageClient";

export const metadata: Metadata = {
  title: "Etkinlikler",
  description: "Derneğimizin düzenlediği etkinlikler, seminerler, konferanslar ve sosyal buluşmaların takvimi.",
  openGraph: {
    title: "Etkinlikler",
    description: "Derneğimizin düzenlediği etkinlikler, seminerler, konferanslar ve sosyal buluşmaların takvimi.",
  },
  alternates: {
    canonical: "/etkinlikler",
  },
};

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
  status: string;
}

async function getEtkinlikler(): Promise<Event[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/events?limit=50`, { next: { revalidate: 60 } });
    const json = await res.json();
    if (json.success) return json.data;
  } catch { /* fallback */ }
  return [];
}

export default async function EtkinliklerPage() {
  const etkinlikler = await getEtkinlikler();

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-primary text-white pt-32 pb-10 md:pt-36 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <nav className="text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Etkinlikler</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Etkinlikler</h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl">
            Seminerlerden sosyal buluşmalara, spor turnuvalarından çevre etkinliklerine kadar geniş kapsamlı etkinlik takvimimizi keşfedin.
          </p>
        </div>
      </section>

      {/* Events Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <EventsPageClient events={etkinlikler} />
        </div>
      </section>
    </main>
  );
}
