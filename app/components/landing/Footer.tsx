"use client";

import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "@/app/hooks/useLanguage";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-charcoal text-white/60">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & tagline */}
          <div>
            <Image
              src="/logo2.png"
              alt="PT. Graha Paramita Konsultan & KJP Kevin Lie, Hartono dan Rekan"
              width={230}
              height={50}
              className="h-20  w-auto brightness-0 invert opacity-80"
            />
            <p className="mt-4 text-sm leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t.location}
            </h4>
            <div className="flex items-start gap-2.5 text-sm leading-relaxed">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent-orange" />
              <span>
                Ira Building, Jalan Cactus Raya,
                <br />
                Komp. Tasbih, Blok J No. 1
                <br />
                Medan, Sumatera Utara
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t.contact}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-accent-orange" />
                <a
                  href="mailto:admin@konsultankhr.com"
                  className="hover:text-accent-orange transition-colors"
                >
                  admin@konsultankhr.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-accent-orange" />
                <a
                  href="mailto:kevinblasiuslie@konsultankhr.com"
                  className="hover:text-accent-orange transition-colors"
                >
                  kevinblasiuslie@konsultankhr.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-accent-orange" />
                <a
                  href="tel:+62614240489"
                  className="hover:text-accent-orange transition-colors"
                >
                  (+62-61) 4240 4849
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <p className="text-center text-sm text-white/30">
          {t.copyright}
        </p>
      </div>
    </footer>
  );
}
