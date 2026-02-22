"use client";

import { useInView } from "@/app/hooks/useInView";
import { useCountUp } from "@/app/hooks/useCountUp";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  isActive: boolean;
}

function StatItem({ value, suffix, label, isActive }: StatItemProps) {
  const count = useCountUp(value, 2000, isActive);
  return (
    <div className="text-center py-8 lg:py-0">
      <div className="text-4xl lg:text-5xl font-bold text-navy tracking-tight">
        {count}
        {suffix}
      </div>
      <p className="text-gray-500 mt-2 text-sm lg:text-base uppercase tracking-wider font-medium">
        {label}
      </p>
    </div>
  );
}

const STATS = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 2, suffix: "", label: "Gov & Private Sectors", displayText: "Gov & Private" },
  { value: 50, suffix: "+", label: "Certified Appraisers" },
];

export function TrustIndicators() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <section
      id="trust"
      ref={ref}
      className="bg-white py-12 lg:py-16 border-y border-gray-100 scroll-mt-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-gray-200">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} isActive={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
