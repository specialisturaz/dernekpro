import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Hakkımızda
            </span>
            <h2 className="mt-3 mb-6">
              Güçlü Sivil Toplum,{" "}
              <span className="text-primary">Güçlü Toplum</span>
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              İhtiyaç sahiplerine ulaşmak ve sürdürülebilir yardım projeleri
              geliştirmek amacıyla kurulmuş derneğimiz, eğitimden sağlığa,
              gıdadan barınmaya kadar pek çok alanda faaliyet göstermektedir.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-accent">
                <h4 className="text-lg font-bold text-primary mb-2">
                  Misyonumuz
                </h4>
                <p className="text-sm text-muted">
                  İhtiyaç sahiplerine ulaşmak, sürdürülebilir yardım projeleri
                  geliştirmek ve toplumsal dayanışmayı güçlendirmek.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-accent">
                <h4 className="text-lg font-bold text-primary mb-2">
                  Vizyonumuz
                </h4>
                <p className="text-sm text-muted">
                  Güçlü sivil toplum ile daha adil, eşit ve müreffeh bir dünya
                  inşa etmek.
                </p>
              </div>
            </div>
            <Link href="/hakkimizda" className="btn-primary">
              Daha Fazla Bilgi
            </Link>
          </div>

          {/* Right - Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-primary font-heading font-bold text-2xl">
                  15+ Yıllık Deneyim
                </p>
                <p className="text-muted text-sm mt-2">
                  Kurulduğumuz günden bu yana binlerce kişiye ulaştık
                </p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-secondary text-white rounded-xl p-4 shadow-lg">
              <span className="text-2xl font-bold">50K+</span>
              <p className="text-xs text-white/80">Ulaşılan Kişi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
