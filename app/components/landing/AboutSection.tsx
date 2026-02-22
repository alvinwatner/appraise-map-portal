"use client";

import Image from "next/image";
import { useInView } from "@/app/hooks/useInView";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/app/hooks/useLanguage";

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const t = useTranslations("about");

  return (
    <section
      id="about"
      ref={ref}
      className="bg-off-white py-16 lg:py-24 scroll-mt-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className={cn("opacity-0", isInView && "animate-slide-in-left")}>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/review-document.jpg"
                alt="Professional team reviewing documents"
                width={600}
                height={420}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className={cn("opacity-0", isInView && "animate-slide-in-right")}>
            <div className="w-12 h-1 bg-accent-orange mb-6" />
            <h2 className="text-3xl lg:text-[40px] font-bold text-navy leading-tight mb-6">
              {t.heading}
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4">
              {t.paragraph1}
            </p>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-8">
              {t.paragraph2}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3.5 bg-navy text-white font-semibold rounded-lg hover:bg-navy/90 hover:scale-[1.02] transition-all duration-200"
            >
              {t.learnMore}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
