import { Metadata } from "next";
import { Navbar } from "./components/landing/Navbar";
import { HeroSection } from "./components/landing/HeroSection";
import { TrustIndicators } from "./components/landing/TrustIndicators";
import { AboutSection } from "./components/landing/AboutSection";
import { ServicesSection } from "./components/landing/ServicesSection";
import { ContactSection } from "./components/landing/ContactSection";
import { Footer } from "./components/landing/Footer";

export const metadata: Metadata = {
  title:
    "PT. Graha Paramita Konsultan - Property Appraisal & Business Consulting",
  description:
    "Leading the way in business excellence through reliable property appraisal, feasibility studies, and consulting services. Driven by accuracy, Guided by integrity.",
};

export default function Home() {
  return (
    <div className="font-inter">
      <Navbar />
      <HeroSection />
      <TrustIndicators />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
