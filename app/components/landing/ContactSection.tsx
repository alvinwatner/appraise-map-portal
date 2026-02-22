"use client";

import { useState } from "react";
import { useInView } from "@/app/hooks/useInView";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Inquiry from ${form.firstName} ${form.lastName}`
    );
    const body = encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:admin@konsultankhr.com?subject=${subject}&body=${body}`;
  };

  const inputClasses =
    "w-full bg-navy/80 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-orange transition-colors text-sm";

  return (
    <section
      id="contact"
      ref={ref}
      className="bg-navy py-16 lg:py-24 scroll-mt-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start",
            "opacity-0",
            isInView && "animate-fade-up"
          )}
        >
          {/* Left: heading */}
          <div className="lg:pt-8">
            <h2 className="text-3xl lg:text-[40px] font-bold text-white leading-tight mb-4">
              Contact Us
            </h2>
            <p className="text-white/60 text-base lg:text-lg leading-relaxed">
              Interested in working together? Fill out some info and we will be
              in touch shortly. We can&apos;t wait to hear from you!
            </p>
          </div>

          {/* Right: form */}
          <div className="bg-navy-light rounded-xl p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">
                    First Name <span className="text-white/40">(required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">
                    Last Name <span className="text-white/40">(required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Email <span className="text-white/40">(required)</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClasses}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">
                  Message <span className="text-white/40">(required)</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={cn(inputClasses, "resize-none")}
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent-orange text-white font-semibold py-3.5 rounded-lg hover:brightness-110 transition-all duration-200 uppercase tracking-wide text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
