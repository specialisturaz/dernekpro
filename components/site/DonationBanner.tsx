import Link from "next/link";

export default function DonationBanner() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Bir Hayata Dokunmak İster Misiniz?
        </h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
          Bağışlarınız ihtiyaç sahiplerine umut oluyor. Hızlı ve güvenli bağış
          yapabilirsiniz.
        </p>

        {/* Quick Donation Amounts */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[50, 100, 250, 500].map((amount) => (
            <Link
              key={amount}
              href={`/bagis?amount=${amount}`}
              className="px-6 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-lg font-bold hover:bg-white/20 transition-colors"
            >
              {amount} ₺
            </Link>
          ))}
          <Link
            href="/bagis"
            className="px-6 py-3 bg-white text-secondary rounded-xl text-lg font-bold hover:bg-white/90 transition-colors"
          >
            Özel Tutar
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-white/60">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            256-bit SSL Güvenli Ödeme
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            iyzico Güvencesi
          </span>
        </div>
      </div>
    </section>
  );
}
