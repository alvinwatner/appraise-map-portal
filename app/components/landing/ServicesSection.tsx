"use client";

import { Building2, FileCheck, Briefcase } from "lucide-react";
import { useInView } from "@/app/hooks/useInView";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ServiceCard {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const SERVICES: ServiceCard[] = [
  {
    icon: Building2,
    iconBg: "bg-secondary-blue/10",
    iconColor: "text-secondary-blue",
    title: "Appraisal",
    description:
      "Independent and professional property valuation services covering residential properties (houses, apartments, condominiums), commercial properties (shophouses, offices, malls), industrial & warehouse properties, vacant land & development sites, and special assets as required.",
  },
  {
    icon: FileCheck,
    iconBg: "bg-accent-orange/10",
    iconColor: "text-accent-orange",
    title: "Purpose of Appraisal",
    description:
      "Our appraisal services serve diverse needs including banking & financing requirements, government and state-owned enterprise (BUMN) interests, and private corporate purposes across various sectors.",
  },
  {
    icon: Briefcase,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-600",
    title: "Other Services",
    description:
      "Beyond property valuation, we offer comprehensive business feasibility studies (studi kelayakan bisnis) and construction physical development supervision (pengawasan pembangunan fisik proyek).",
  },
];

export function ServicesSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section
      id="services"
      ref={ref}
      className="bg-white py-16 lg:py-24 scroll-mt-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-[40px] font-bold text-navy mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 text-base lg:text-lg max-w-xl mx-auto">
            Professional property valuation and consulting services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className={cn(
                "bg-white border border-gray-100 rounded-xl p-8 lg:p-10",
                "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
                "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]",
                "border-l-[3px] border-l-transparent hover:border-l-accent-orange",
                "transition-all duration-300",
                "flex flex-col",
                "opacity-0",
                isInView && "animate-fade-up",
              )}
              style={{
                animationDelay: isInView ? `${i * 150}ms` : "0ms",
              }}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-lg flex items-center justify-center mb-6",
                  service.iconBg,
                )}
              >
                <service.icon className={cn("w-7 h-7", service.iconColor)} />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">
                {service.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                {service.description}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center text-secondary-blue font-medium text-sm mt-auto pt-6 hover:text-accent-orange transition-colors"
              >
                Learn more
                <span className="ml-1">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
