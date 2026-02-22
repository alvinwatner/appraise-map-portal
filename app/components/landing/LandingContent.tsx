"use client";

import LanguageProvider from "@/app/lib/i18n/LanguageProvider";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { TrustIndicators } from "./TrustIndicators";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export function LandingContent() {
  return (
    <LanguageProvider>
      <Navbar />
      <HeroSection />
      <TrustIndicators />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </LanguageProvider>
  );
}
