"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "İhtiyaç Sahiplerine Umut Olun",
    subtitle:
      "Her bağışınız, bir hayata dokunuyor. Birlikte daha güçlüyüz.",
    buttonText: "Bağış Yap",
    buttonLink: "/bagis",
    secondaryText: "Gönüllü Ol",
    secondaryLink: "/uye-ol",
    bgGradient: "from-primary-dark/90 to-primary/70",
  },
  {
    id: 2,
    title: "Güçlü Sivil Toplum, Güçlü Toplum",
    subtitle:
      "Eğitimden sağlığa, gıdadan barınmaya her alanda yanınızdayız.",
    buttonText: "Faaliyetlerimiz",
    buttonLink: "/faaliyetler",
    secondaryText: "Üye Ol",
    secondaryLink: "/uye-ol",
    bgGradient: "from-primary/80 to-primary-dark/90",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-all duration-1000`}
      />

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative container mx-auto px-4 text-white">
        <div className="max-w-3xl">
          <h1
            key={slide.id}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 animate-slide-up"
          >
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl animate-fade-in">
            {slide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={slide.buttonLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-white font-bold rounded-xl text-lg hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {slide.buttonText}
            </Link>
            <Link
              href={slide.secondaryLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-xl text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              {slide.secondaryText}
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-10 bg-white"
                  : "w-4 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
