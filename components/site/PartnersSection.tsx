export default function PartnersSection() {
  const partners = [
    "Partner 1",
    "Partner 2",
    "Partner 3",
    "Partner 4",
    "Partner 5",
    "Partner 6",
  ];

  return (
    <section className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted mb-8 uppercase tracking-wider font-semibold">
          İşbirliği Yaptığımız Kurumlar
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner, i) => (
            <div
              key={i}
              className="w-28 h-12 rounded-lg bg-background-alt flex items-center justify-center text-muted text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
