"use client";

import { useContext } from "react";
import { LanguageContext } from "@/app/lib/i18n/LanguageProvider";
import translations, { type Locale } from "@/app/lib/i18n/translations";

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslations<K extends keyof typeof translations>(
  section: K
) {
  const { locale } = useLanguage();
  return translations[section][locale] as (typeof translations)[K]["en"];
}
