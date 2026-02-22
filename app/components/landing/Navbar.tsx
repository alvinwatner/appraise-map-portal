"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLanguage, useTranslations } from "@/app/hooks/useLanguage";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const t = useTranslations("navbar");

  const navLinks = [
    { label: t.services, href: "#services" },
    { label: t.about, href: "#about" },
    { label: t.contact, href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const languageToggle = (
    <div className="flex items-center text-sm border border-white/20 rounded overflow-hidden">
      <button
        onClick={() => setLocale("id")}
        className={cn(
          "px-3 py-1 transition-colors",
          locale === "id"
            ? "text-white font-medium bg-white/10"
            : "text-white/50 hover:text-white/70"
        )}
      >
        ID
      </button>
      <span className="text-white/30">|</span>
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "px-3 py-1 transition-colors",
          locale === "en"
            ? "text-white font-medium bg-white/10"
            : "text-white/50 hover:text-white/70"
        )}
      >
        EN
      </button>
    </div>
  );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-navy transition-shadow duration-300",
        scrolled && "shadow-[0_2px_20px_rgba(0,0,0,0.15)]",
      )}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <div className="flex items-center gap-3 lg:gap-5">
          <div>
            <Image
              src="/logo2.png"
              alt="PT. Graha Paramita Konsultan & KJP Kevin Lie, Hartono dan Rekan"
              width={230}
              height={50}
              className="h-14  w-auto brightness-0 invert opacity-80"
            />
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-white/80 hover:text-white uppercase text-sm font-medium tracking-wide transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent-orange after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          {languageToggle}
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="text-white p-2" aria-label="Open menu">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-navy border-navy-light w-[280px]"
            >
              <SheetTitle className="text-white sr-only">
                {t.navigationMenu}
              </SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-white/80 hover:text-white text-lg font-medium uppercase tracking-wide transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {languageToggle}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
