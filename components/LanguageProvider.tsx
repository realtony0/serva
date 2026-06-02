"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type Locale,
  LOCALE_STORAGE_KEY,
  localeForCountry,
  translate,
} from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    // 1. Honor a previously saved manual choice.
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      saved = null;
    }
    if (saved === "fr" || saved === "en") {
      setLocaleState(saved);
      return;
    }

    // 2. Otherwise auto-detect via ipapi.co (same provider used in Pricing.tsx).
    //    SN & CA → FR, US & everything else → EN.
    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : undefined;
    let cancelled = false;

    fetch("https://ipapi.co/json/", { signal: controller?.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setLocaleState(localeForCountry(data.country_code ?? data.country));
      })
      .catch(() => {
        /* network failure → keep default FR */
      });

    return () => {
      cancelled = true;
      controller?.abort();
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/** Compact FR/EN pill toggle, light theme to match the marketing site. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  return (
    <div
      className={`inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 ${className}`}
    >
      {(["fr", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
            locale === l
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
