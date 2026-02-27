import Link from "next/link";
import { getDefaultTenant } from "@/lib/tenant";
import { isModuleActive } from "@/lib/modules/utils";

export default async function DonationBanner() {
  const tenant = await getDefaultTenant();
  const campaignsActive = tenant ? await isModuleActive(tenant.id, "donations") : true;

  return (
    <section className="py-6 bg-primary-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Text */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="hidden md:flex w-10 h-10 rounded-full bg-white/15 items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-heading font-bold text-white">
                Bir Hayata Dokunmak İster Misiniz?
              </h3>
              <p className="text-white/70 text-xs mt-0.5">
                {campaignsActive
                  ? "Bağışlarınız ihtiyaç sahiplerine umut oluyor."
                  : "Banka havalesi ile destek olabilirsiniz."}
              </p>
            </div>
          </div>

          {/* Right: Action */}
          {campaignsActive ? (
            <div className="flex items-center gap-2 flex-wrap justify-center flex-shrink-0">
              {[50, 100, 250].map((amount) => (
                <Link
                  key={amount}
                  href={`/bagis?amount=${amount}`}
                  className="px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  {amount} ₺
                </Link>
              ))}
              <Link
                href="/bagis"
                className="px-5 py-1.5 bg-white text-primary-dark rounded-lg text-sm font-bold hover:bg-white/90 transition-colors"
              >
                Bağış Yap
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/hesaplar"
                className="px-5 py-1.5 bg-white text-primary-dark rounded-lg text-sm font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Hesap Numaraları
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
