"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/app/hooks/useLanguage";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("hero");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/background-building2.jpg)" }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(27,42,74,0.92) 0%, rgba(27,42,74,0.75) 35%, rgba(27,42,74,0.3) 65%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 container mx-auto px-4 lg:px-8 pt-20",
          "transition-all duration-1000 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight tracking-tight mb-6">
            {t.heading}
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
            {t.subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-accent-orange text-white font-semibold rounded-lg hover:brightness-110 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 text-base"
            >
              {t.ourServices}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 hover:scale-[1.02] transition-all duration-200 text-base"
            >
              {t.contactUs}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#trust"
          className="text-white/50 hover:text-white transition-colors animate-bounce-down inline-block"
        >
          <ChevronDown size={32} />
        </a>
      </div>
    </section>
  );
}
