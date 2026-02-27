import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SponsorChildrenList from "@/components/site/SponsorChildrenList";
import { getDefaultTenant } from "@/lib/tenant";
import { isModuleActive } from "@/lib/modules/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cocuk Sponsorluk Programi",
  description:
    "Bir cocugun hayatina dokunun. Giydirme, egitim ve saglik programlarimizla cocuklarin gelecegine yatirim yapin.",
  openGraph: {
    title: "Cocuk Sponsorluk Programi",
    description: "Bir cocugun hayatina dokunun. Giydirme, egitim ve saglik programlarimizla cocuklarin gelecegine yatirim yapin.",
  },
  alternates: {
    canonical: "/cocuk-sponsorluk",
  },
};

interface SponsorChild {
  id: string;
  name: string;
  age: number;
  gender: string;
  country: string;
  city: string | null;
  story: string;
  photoUrl: string;
  goalAmount: number;
  collected: number;
  category: string;
  isFeatured: boolean;
}

async function getSponsorChildren(): Promise<SponsorChild[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/sponsor-children`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    if (json.success) return json.data;
  } catch {
    /* fallback to empty */
  }
  return [];
}

function formatTL(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function CocukSponsorlukPage() {
  const tenant = await getDefaultTenant();
  if (tenant) {
    const active = await isModuleActive(tenant.id, "child-sponsorship");
    if (!active) notFound();
  }

  const children = await getSponsorChildren();

  // Compute aggregate stats
  const totalChildren = children.length;
  const totalCollected = children.reduce((sum, c) => sum + c.collected, 0);
  const totalGoal = children.reduce((sum, c) => sum + c.goalAmount, 0);
  const sponsoredCount = children.filter(
    (c) => c.collected >= c.goalAmount && c.goalAmount > 0
  ).length;

  return (
    <main>
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-accent/30 to-background">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Large blurred circle — top-right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl hero-float-blob" />
          {/* Medium circle — bottom-left */}
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl hero-float-blob-reverse" />
          {/* Small accent dot */}
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-rose-100/30 rounded-full blur-2xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-28">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            <svg className="w-4 h-4 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-foreground font-medium">Cocuk Sponsorluk</span>
          </nav>

          {/* Heading block */}
          <div className="max-w-3xl">
            {/* Small decorative heart cluster */}
            <div className="flex items-center gap-2 mb-5">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 text-rose-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-sm font-semibold text-rose-600 tracking-wide uppercase">
                Cocuk Sponsorluk Programi
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-6 leading-tight">
              Bir Cocugun{" "}
              <span className="text-primary relative">
                Hayatina Dokunun
                {/* Underline decoration */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/20"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 8c30-6 70-6 100 0s70 6 100 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-2xl">
              Her cocuk sevgiyi, ilgiyi ve guvenli bir gelecegi hak eder. Giydirme, egitim ve saglik
              programlarimizla ihtiyac sahibi cocuklara umut olabilirsiniz. Sizin desteginiz,
              onlarin gelecegidir.
            </p>
          </div>

          {/* Stats row */}
          {totalChildren > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl">
              {/* Stat: Total children */}
              <div className="bg-background/70 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                  {totalChildren}
                </p>
                <p className="text-sm text-muted mt-1">Cocuga Ulasildi</p>
              </div>

              {/* Stat: Total collected */}
              <div className="bg-background/70 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                  {formatTL(totalCollected)}
                </p>
                <p className="text-sm text-muted mt-1">Toplanan Bagis</p>
              </div>

              {/* Stat: Sponsored */}
              <div className="bg-background/70 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                  {sponsoredCount}
                </p>
                <p className="text-sm text-muted mt-1">Sponsor Bulan Cocuk</p>
              </div>

              {/* Stat: Goal */}
              <div className="bg-background/70 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                  {formatTL(totalGoal)}
                </p>
                <p className="text-sm text-muted mt-1">Toplam Hedef</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS — Trust-building strip
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-background-alt border-y border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-3">
              Nasil Sponsor Olunur?
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Uc basit adimda bir cocugun hayatina dokunabilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  1
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                Cocuk Secin
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Asagidaki listeden sponsor olmak istediginiz cocugu inceleyin ve secin.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center group-hover:bg-rose-200/70 transition-colors duration-300">
                  <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  2
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                Bagis Yapin
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Guvenli odeme altyapimizla tek seferlik veya duzenli bagis yapabilirsiniz.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200/70 transition-colors duration-300">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  3
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                Takip Edin
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Sponsor oldugunuz cocugun gelisimini duzenli raporlarla takip edin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CHILDREN LIST — Client component with filtering
      ══════════════════════════════════════════════════════════════ */}
      {children.length > 0 ? (
        <SponsorChildrenList items={children} />
      ) : (
        /* ── Global Empty State ── */
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="w-28 h-28 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-14 h-14 text-primary/25"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-4">
                Henuz Aktif Sponsor Cocuk Bulunmuyor
              </h2>
              <p className="text-muted max-w-lg mx-auto mb-8 text-lg">
                Sponsor cocuk programimiz cok yakinda basliyor. Genel bagis yaparak
                destek olabilirsiniz.
              </p>
              <Link href="/bagis" className="btn-primary text-lg px-8 py-4">
                Genel Bagis Yap
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CTA — Emotional bottom banner
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-primary text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Bir Cocugun Hayatini Degistirebilirsiniz
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Yapacaginiz her bagis, bir cocugun giyinmesine, egitim almasina ve saglikli
              buyumesine vesile olur. Bugun harekete gecin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cocuk-sponsorluk"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Sponsor Ol
              </Link>
              <Link
                href="/bagis"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-lg"
              >
                Genel Bagis Yap
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
